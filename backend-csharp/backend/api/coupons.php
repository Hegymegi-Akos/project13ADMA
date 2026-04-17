<?php
/**
 * Kuponok API
 */

require_once '../config/database.php';
require_once '../config/cors.php';
require_once '../config/jwt.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];
$request_uri = $_SERVER['REQUEST_URI'];

// Endpoint routing
if ($method === 'GET' && preg_match('/\/coupons\.php\/validate\/([A-Za-z0-9]+)/', $request_uri, $matches)) {
    validateCoupon($db, $matches[1]);
} elseif ($method === 'POST' && strpos($request_uri, '/coupons.php/apply') !== false) {
    applyCoupon($db);
} elseif ($method === 'GET' && strpos($request_uri, '/coupons.php/loyalty') !== false) {
    getLoyaltyCoupon($db);
} elseif ($method === 'GET' && strpos($request_uri, '/coupons.php/my') !== false) {
    getMyCoupons($db);
} elseif ($method === 'GET' && strpos($request_uri, '/coupons.php') !== false) {
    getAllCoupons($db);
} elseif ($method === 'POST' && strpos($request_uri, '/coupons.php') !== false) {
    createCoupon($db);
} elseif ($method === 'PUT' && preg_match('/\/coupons\.php\/(\d+)/', $request_uri, $matches)) {
    updateCoupon($db, $matches[1]);
} elseif ($method === 'DELETE' && preg_match('/\/coupons\.php\/(\d+)/', $request_uri, $matches)) {
    deleteCoupon($db, $matches[1]);
} else {
    http_response_code(404);
    echo json_encode(['message' => 'Endpoint nem található']);
}

/**
 * Lokális hűségkupon lekérése (mindig 0.5%)
 */
function getLoyaltyCoupon($db) {
    $stmt = $db->prepare("SELECT * FROM kuponok WHERE kod = 'HUSEG05' AND aktiv = 1");
    $stmt->execute();
    $coupon = $stmt->fetch();
    
    if ($coupon) {
        echo json_encode([
            'kod' => $coupon['kod'],
            'tipus' => $coupon['tipus'],
            'ertek' => floatval($coupon['ertek']),
            'message' => 'Automatikus hűségkedvezmény: 0.5%'
        ]);
    } else {
        echo json_encode([
            'kod' => 'HUSEG05',
            'tipus' => 'szazalek',
            'ertek' => 0.5,
            'message' => 'Automatikus hűségkedvezmény: 0.5%'
        ]);
    }
}

/**
 * Kupon validálása
 */
function validateCoupon($db, $kod) {
    $user = getCurrentUser();
    
    $stmt = $db->prepare("SELECT * FROM kuponok WHERE kod = :kod AND aktiv = 1");
    $stmt->bindParam(':kod', $kod);
    $stmt->execute();
    $coupon = $stmt->fetch();
    
    if (!$coupon) {
        http_response_code(404);
        echo json_encode(['valid' => false, 'message' => 'Érvénytelen kuponkód']);
        return;
    }
    
    // Érvényesség ellenőrzése
    $now = new DateTime();
    if ($coupon['ervenyes_kezdet'] && new DateTime($coupon['ervenyes_kezdet']) > $now) {
        http_response_code(400);
        echo json_encode(['valid' => false, 'message' => 'A kupon még nem érvényes']);
        return;
    }
    if ($coupon['ervenyes_veg'] && new DateTime($coupon['ervenyes_veg']) < $now) {
        http_response_code(400);
        echo json_encode(['valid' => false, 'message' => 'A kupon lejárt']);
        return;
    }
    
    // Felhasználási limit ellenőrzése
    if ($coupon['felhasznalasi_limit'] !== null && $coupon['felhasznalva'] >= $coupon['felhasznalasi_limit']) {
        http_response_code(400);
        echo json_encode(['valid' => false, 'message' => 'A kupon elérte a felhasználási limitet']);
        return;
    }
    
    // Ha csak egy felhasználónak szól
    if ($coupon['felhasznalo_id'] !== null) {
        if (!$user || $user['user_id'] != $coupon['felhasznalo_id']) {
            http_response_code(403);
            echo json_encode(['valid' => false, 'message' => 'Ez a kupon nem neked szól']);
            return;
        }
    }
    
    // Ha be van jelentkezve, ellenőrizzük a személyes felhasználási limitet
    if ($user && $coupon['felhasznalasi_limit'] !== null) {
        $usageStmt = $db->prepare("SELECT COUNT(*) as cnt FROM kupon_hasznalatok WHERE kupon_id = :kupon_id AND felhasznalo_id = :felhasznalo_id");
        $usageStmt->bindParam(':kupon_id', $coupon['id']);
        $usageStmt->bindParam(':felhasznalo_id', $user['user_id']);
        $usageStmt->execute();
        $usage = $usageStmt->fetch();
        
        // Ha személyes kupon és már használta
        if ($coupon['felhasznalo_id'] !== null && $usage['cnt'] >= $coupon['felhasznalasi_limit']) {
            http_response_code(400);
            echo json_encode(['valid' => false, 'message' => 'Már felhasználtad ezt a kupont']);
            return;
        }
    }
    
    echo json_encode([
        'valid' => true,
        'kupon' => [
            'id' => intval($coupon['id']),
            'kod' => $coupon['kod'],
            'tipus' => $coupon['tipus'],
            'ertek' => floatval($coupon['ertek']),
            'min_osszeg' => floatval($coupon['min_osszeg'])
        ],
        'message' => 'Kupon érvényes!'
    ]);
}

/**
 * Kupon alkalmazása rendeléshez
 */
function applyCoupon($db) {
    $user = getCurrentUser();
    if (!$user) {
        http_response_code(401);
        echo json_encode(['message' => 'Bejelentkezés szükséges']);
        return;
    }
    
    $data = json_decode(file_get_contents("php://input"));
    
    if (empty($data->kupon_kod) || empty($data->osszeg)) {
        http_response_code(400);
        echo json_encode(['message' => 'Kupon kód és összeg megadása kötelező']);
        return;
    }
    
    $stmt = $db->prepare("SELECT * FROM kuponok WHERE kod = :kod AND aktiv = 1");
    $stmt->bindParam(':kod', $data->kupon_kod);
    $stmt->execute();
    $coupon = $stmt->fetch();
    
    if (!$coupon) {
        http_response_code(404);
        echo json_encode(['message' => 'Érvénytelen kuponkód']);
        return;
    }
    
    // Minimum összeg ellenőrzése
    if ($data->osszeg < $coupon['min_osszeg']) {
        http_response_code(400);
        echo json_encode(['message' => "Minimum rendelési összeg: " . number_format($coupon['min_osszeg'], 0, ',', ' ') . " Ft"]);
        return;
    }
    
    // Kedvezmény számítása
    if ($coupon['tipus'] === 'szazalek') {
        $kedvezmeny = $data->osszeg * ($coupon['ertek'] / 100);
    } else {
        $kedvezmeny = $coupon['ertek'];
    }
    
    $vegosszeg = max(0, $data->osszeg - $kedvezmeny);
    
    echo json_encode([
        'success' => true,
        'eredeti_osszeg' => floatval($data->osszeg),
        'kedvezmeny' => round($kedvezmeny, 2),
        'vegosszeg' => round($vegosszeg, 2),
        'kupon' => [
            'kod' => $coupon['kod'],
            'tipus' => $coupon['tipus'],
            'ertek' => floatval($coupon['ertek'])
        ]
    ]);
}

/**
 * Saját kuponjaim lekérése
 */
function getMyCoupons($db) {
    $user = getCurrentUser();
    if (!$user) {
        http_response_code(401);
        echo json_encode(['message' => 'Bejelentkezés szükséges']);
        return;
    }
    
    // Személyes kuponok + globális kuponok
    $stmt = $db->prepare("
        SELECT k.*, 
               (SELECT COUNT(*) FROM kupon_hasznalatok kh WHERE kh.kupon_id = k.id AND kh.felhasznalo_id = :user_id) as en_hasznalataim
        FROM kuponok k 
        WHERE k.aktiv = 1 
          AND (k.felhasznalo_id IS NULL OR k.felhasznalo_id = :user_id2)
          AND (k.ervenyes_veg IS NULL OR k.ervenyes_veg > NOW())
          AND (k.ervenyes_kezdet IS NULL OR k.ervenyes_kezdet <= NOW())
        ORDER BY k.felhasznalo_id DESC, k.letrehozva DESC
    ");
    $stmt->bindParam(':user_id', $user['user_id']);
    $stmt->bindParam(':user_id2', $user['user_id']);
    $stmt->execute();
    
    $coupons = $stmt->fetchAll();
    
    // Szűrjük ki azokat amik már ki vannak merítve
    $availableCoupons = array_filter($coupons, function($c) {
        if ($c['felhasznalasi_limit'] === null) return true;
        if ($c['felhasznalo_id'] !== null) {
            // Személyes kupon - a saját használataim számítanak
            return $c['en_hasznalataim'] < $c['felhasznalasi_limit'];
        }
        // Globális kupon - összes használat számít
        return $c['felhasznalva'] < $c['felhasznalasi_limit'];
    });
    
    echo json_encode(array_values($availableCoupons));
}

/**
 * Összes kupon lekérése (admin)
 */
function getAllCoupons($db) {
    $user = getCurrentUser();
    $adminSecret = $_SERVER['HTTP_X_ADMIN_SECRET'] ?? '';
    
    if (!$user || $adminSecret === '' || !hash_equals(ADMIN_SHARED_SECRET, $adminSecret)) {
        http_response_code(403);
        echo json_encode(['message' => 'Admin jogosultság szükséges']);
        return;
    }
    
    $stmt = $db->prepare("
        SELECT k.*, f.felhasznalonev as felhasznalo_nev
        FROM kuponok k
        LEFT JOIN felhasznalok f ON k.felhasznalo_id = f.id
        ORDER BY k.letrehozva DESC
    ");
    $stmt->execute();
    
    echo json_encode($stmt->fetchAll());
}

/**
 * Új kupon létrehozása (admin)
 */
function createCoupon($db) {
    $user = getCurrentUser();
    $adminSecret = $_SERVER['HTTP_X_ADMIN_SECRET'] ?? '';
    
    if (!$user || $adminSecret === '' || !hash_equals(ADMIN_SHARED_SECRET, $adminSecret)) {
        http_response_code(403);
        echo json_encode(['message' => 'Admin jogosultság szükséges']);
        return;
    }
    
    $data = json_decode(file_get_contents("php://input"));
    
    if (empty($data->kod) || !isset($data->ertek)) {
        http_response_code(400);
        echo json_encode(['message' => 'Kupon kód és érték megadása kötelező']);
        return;
    }
    
    // Kupon kód egyediség ellenőrzése
    $checkStmt = $db->prepare("SELECT id FROM kuponok WHERE kod = :kod");
    $checkStmt->bindParam(':kod', $data->kod);
    $checkStmt->execute();
    if ($checkStmt->fetch()) {
        http_response_code(400);
        echo json_encode(['message' => 'Ez a kuponkód már létezik']);
        return;
    }
    
    $stmt = $db->prepare("
        INSERT INTO kuponok (kod, tipus, ertek, min_osszeg, felhasznalasi_limit, felhasznalo_id, ervenyes_kezdet, ervenyes_veg, aktiv)
        VALUES (:kod, :tipus, :ertek, :min_osszeg, :felhasznalasi_limit, :felhasznalo_id, :ervenyes_kezdet, :ervenyes_veg, :aktiv)
    ");
    
    $tipus = $data->tipus ?? 'szazalek';
    $ertek = floatval($data->ertek);
    $min_osszeg = $data->min_osszeg ?? 0;
    $felhasznalasi_limit = isset($data->felhasznalasi_limit) && $data->felhasznalasi_limit !== '' ? intval($data->felhasznalasi_limit) : null;
    $felhasznalo_id = isset($data->felhasznalo_id) && $data->felhasznalo_id !== '' ? intval($data->felhasznalo_id) : null;
    $ervenyes_kezdet = $data->ervenyes_kezdet ?? date('Y-m-d H:i:s');
    $ervenyes_veg = isset($data->ervenyes_veg) && $data->ervenyes_veg !== '' ? $data->ervenyes_veg : null;
    $aktiv = $data->aktiv ?? 1;
    
    $stmt->bindParam(':kod', $data->kod);
    $stmt->bindParam(':tipus', $tipus);
    $stmt->bindParam(':ertek', $ertek);
    $stmt->bindParam(':min_osszeg', $min_osszeg);
    $stmt->bindParam(':felhasznalasi_limit', $felhasznalasi_limit);
    $stmt->bindParam(':felhasznalo_id', $felhasznalo_id);
    $stmt->bindParam(':ervenyes_kezdet', $ervenyes_kezdet);
    $stmt->bindParam(':ervenyes_veg', $ervenyes_veg);
    $stmt->bindParam(':aktiv', $aktiv);
    
    if ($stmt->execute()) {
        echo json_encode([
            'message' => 'Kupon létrehozva',
            'id' => $db->lastInsertId()
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Hiba a kupon létrehozásakor']);
    }
}

/**
 * Kupon frissítése (admin)
 */
function updateCoupon($db, $id) {
    $user = getCurrentUser();
    $adminSecret = $_SERVER['HTTP_X_ADMIN_SECRET'] ?? '';
    
    if (!$user || $adminSecret === '' || !hash_equals(ADMIN_SHARED_SECRET, $adminSecret)) {
        http_response_code(403);
        echo json_encode(['message' => 'Admin jogosultság szükséges']);
        return;
    }
    
    $data = json_decode(file_get_contents("php://input"));
    
    $stmt = $db->prepare("
        UPDATE kuponok SET
            kod = COALESCE(:kod, kod),
            tipus = COALESCE(:tipus, tipus),
            ertek = COALESCE(:ertek, ertek),
            min_osszeg = COALESCE(:min_osszeg, min_osszeg),
            felhasznalasi_limit = :felhasznalasi_limit,
            felhasznalo_id = :felhasznalo_id,
            ervenyes_kezdet = COALESCE(:ervenyes_kezdet, ervenyes_kezdet),
            ervenyes_veg = :ervenyes_veg,
            aktiv = COALESCE(:aktiv, aktiv)
        WHERE id = :id
    ");
    
    $felhasznalasi_limit = isset($data->felhasznalasi_limit) && $data->felhasznalasi_limit !== '' ? intval($data->felhasznalasi_limit) : null;
    $felhasznalo_id = isset($data->felhasznalo_id) && $data->felhasznalo_id !== '' ? intval($data->felhasznalo_id) : null;
    $ervenyes_veg = isset($data->ervenyes_veg) && $data->ervenyes_veg !== '' ? $data->ervenyes_veg : null;
    
    $stmt->bindParam(':id', $id);
    $stmt->bindParam(':kod', $data->kod);
    $stmt->bindParam(':tipus', $data->tipus);
    $stmt->bindParam(':ertek', $data->ertek);
    $stmt->bindParam(':min_osszeg', $data->min_osszeg);
    $stmt->bindParam(':felhasznalasi_limit', $felhasznalasi_limit);
    $stmt->bindParam(':felhasznalo_id', $felhasznalo_id);
    $stmt->bindParam(':ervenyes_kezdet', $data->ervenyes_kezdet);
    $stmt->bindParam(':ervenyes_veg', $ervenyes_veg);
    $stmt->bindParam(':aktiv', $data->aktiv);
    
    if ($stmt->execute()) {
        echo json_encode(['message' => 'Kupon frissítve']);
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Hiba a frissítéskor']);
    }
}

/**
 * Kupon törlése (admin)
 */
function deleteCoupon($db, $id) {
    $user = getCurrentUser();
    $adminSecret = $_SERVER['HTTP_X_ADMIN_SECRET'] ?? '';
    
    if (!$user || $adminSecret === '' || !hash_equals(ADMIN_SHARED_SECRET, $adminSecret)) {
        http_response_code(403);
        echo json_encode(['message' => 'Admin jogosultság szükséges']);
        return;
    }
    
    // Ne engedjük törölni a hűségkupont
    $checkStmt = $db->prepare("SELECT kod FROM kuponok WHERE id = :id");
    $checkStmt->bindParam(':id', $id);
    $checkStmt->execute();
    $coupon = $checkStmt->fetch();
    
    if ($coupon && $coupon['kod'] === 'HUSEG05') {
        http_response_code(400);
        echo json_encode(['message' => 'A hűségkupon nem törölhető']);
        return;
    }
    
    $stmt = $db->prepare("DELETE FROM kuponok WHERE id = :id");
    $stmt->bindParam(':id', $id);
    
    if ($stmt->execute()) {
        echo json_encode(['message' => 'Kupon törölve']);
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Hiba a törléskor']);
    }
}
