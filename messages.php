<?php
/**
 * Admin API - Felhasználók kezelése
 */

require_once '../../config/database.php';
require_once '../../config/cors.php';
require_once '../../config/jwt.php';

$database = new Database();
$db = $database->getConnection();

ensureUserBanColumns($db);

$method = $_SERVER['REQUEST_METHOD'];

// CORS preflight
if ($method === 'OPTIONS') {
    http_response_code(204);
    exit();
}

// Admin jogosultság ellenőrzése
$admin_user = requireAdmin();

// Routing
$request_uri = $_SERVER['REQUEST_URI'];

if ($method === 'GET' && strpos($request_uri, '/users.php/stats') !== false) {
    getAdminStats($db);
} elseif ($method === 'GET' && preg_match('/\/users\.php\/search\?/', $request_uri)) {
    searchUsers($db);
} elseif ($method === 'GET' && preg_match('/\/users\.php\/(\d+)\/orders/', $request_uri, $matches)) {
    getUserOrders($db, (int)$matches[1]);
} elseif ($method === 'GET') {
    getAllUsers($db);
} elseif ($method === 'DELETE' && preg_match('/\/users\.php\/(\d+)/', $request_uri, $matches)) {
    deleteUser($db, $admin_user, (int)$matches[1]);
} elseif ($method === 'PUT' && preg_match('/\/users\.php\/(\d+)\/admin/', $request_uri, $matches)) {
    toggleAdmin($db, $admin_user, (int)$matches[1]);
} elseif ($method === 'POST') {
    handleUserUpdate($db, $admin_user);
} else {
    http_response_code(405);
    echo json_encode(['message' => 'Metódus nem engedélyezett']);
}

/**
 * Egyszerű migráció: tiltás mezők létrehozása, ha hiányoznak
 */
function ensureUserBanColumns($db) {
    $hasTiltva = false;
    $hasTiltasOka = false;

    $stmt = $db->query("SHOW COLUMNS FROM felhasznalok LIKE 'tiltva'");
    $hasTiltva = (bool)$stmt->fetch();

    $stmt = $db->query("SHOW COLUMNS FROM felhasznalok LIKE 'tiltas_oka'");
    $hasTiltasOka = (bool)$stmt->fetch();

    if (!$hasTiltva) {
        $db->exec("ALTER TABLE felhasznalok ADD COLUMN tiltva TINYINT(1) NOT NULL DEFAULT 0 AFTER admin");
    }

    if (!$hasTiltasOka) {
        $db->exec("ALTER TABLE felhasznalok ADD COLUMN tiltas_oka VARCHAR(255) NULL AFTER tiltva");
    }
}

function handleUserUpdate($db, $admin_user) {
    $data = json_decode(file_get_contents('php://input'));

    if (!$data || empty($data->id)) {
        http_response_code(400);
        echo json_encode(['message' => 'Hiányzó felhasználó ID']);
        return;
    }

    $methodOverride = strtoupper(trim((string)($data->_method ?? '')));
    if ($methodOverride !== 'PUT') {
        http_response_code(400);
        echo json_encode(['message' => 'Csak _method=PUT támogatott ennél a végpontnál']);
        return;
    }

    updateUserBanStatus($db, $admin_user, (int)$data->id, $data);
}

function updateUserBanStatus($db, $admin_user, $userId, $data) {
    if (!isset($data->tiltva)) {
        http_response_code(400);
        echo json_encode(['message' => 'Hiányzik a tiltva mező']);
        return;
    }

    $tiltva = (int)((bool)$data->tiltva);
    $tiltasOka = isset($data->tiltas_oka) ? trim((string)$data->tiltas_oka) : null;
    if ($tiltasOka === '') {
        $tiltasOka = null;
    }

    if ((int)$admin_user['user_id'] === $userId && $tiltva === 1) {
        http_response_code(400);
        echo json_encode(['message' => 'Saját magadat nem tilthatod ki']);
        return;
    }

    $exists = $db->prepare('SELECT id FROM felhasznalok WHERE id = :id');
    $exists->bindValue(':id', $userId, PDO::PARAM_INT);
    $exists->execute();
    if ($exists->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['message' => 'Felhasználó nem található']);
        return;
    }

    $query = "UPDATE felhasznalok
              SET tiltva = :tiltva,
                  tiltas_oka = :tiltas_oka
              WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindValue(':tiltva', $tiltva, PDO::PARAM_INT);
    $stmt->bindValue(':tiltas_oka', $tiltasOka, $tiltasOka === null ? PDO::PARAM_NULL : PDO::PARAM_STR);
    $stmt->bindValue(':id', $userId, PDO::PARAM_INT);

    if ($stmt->execute()) {
        echo json_encode([
            'message' => $tiltva ? 'Felhasználó sikeresen kitiltva' : 'Felhasználó sikeresen visszaállítva',
            'id' => $userId,
            'tiltva' => $tiltva,
            'tiltas_oka' => $tiltasOka
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Felhasználó frissítése sikertelen']);
    }
}

/**
 * Összes felhasználó listázása
 */
function getAllUsers($db) {
    $query = "SELECT
                id,
                felhasznalonev,
                email,
                keresztnev,
                vezeteknev,
                telefon,
                iranyitoszam,
                varos,
                cim,
                admin,
                tiltva,
                tiltas_oka,
                email_megerositve,
                regisztralt,
                frissitve
              FROM felhasznalok
              ORDER BY id DESC";

    $stmt = $db->prepare($query);
    $stmt->execute();

    $users = $stmt->fetchAll();

    echo json_encode($users);
}

/**
 * Felhasználó törlése (admin)
 */
function deleteUser($db, $admin_user, $userId) {
    if ((int)$admin_user['user_id'] === $userId) {
        http_response_code(400);
        echo json_encode(['message' => 'Saját magadat nem törölheted']);
        return;
    }

    $exists = $db->prepare('SELECT id, admin FROM felhasznalok WHERE id = :id');
    $exists->bindValue(':id', $userId, PDO::PARAM_INT);
    $exists->execute();
    $target = $exists->fetch();

    if (!$target) {
        http_response_code(404);
        echo json_encode(['message' => 'Felhasználó nem található']);
        return;
    }

    try {
        $db->beginTransaction();
        $db->prepare("DELETE FROM fal_bejegyzesek WHERE felhasznalo_id = :id")->execute([':id' => $userId]);
        $db->prepare("DELETE FROM termek_velemenyek WHERE felhasznalo_id = :id")->execute([':id' => $userId]);
        $db->prepare("DELETE FROM kosar WHERE felhasznalo_id = :id")->execute([':id' => $userId]);
        $db->prepare("DELETE FROM kupon_hasznalatok WHERE felhasznalo_id = :id")->execute([':id' => $userId]);
        $db->prepare("DELETE FROM jelszo_reset WHERE felhasznalo_id = :id")->execute([':id' => $userId]);
        // Rendeles tetelek torlese a rendelesekhez
        $db->prepare("DELETE rt FROM rendeles_tetelek rt INNER JOIN rendelesek r ON rt.rendeles_id = r.id WHERE r.felhasznalo_id = :id")->execute([':id' => $userId]);
        $db->prepare("DELETE FROM rendelesek WHERE felhasznalo_id = :id")->execute([':id' => $userId]);
        $db->prepare("DELETE FROM felhasznalok WHERE id = :id")->execute([':id' => $userId]);
        $db->commit();
        echo json_encode(['message' => 'Felhasználó sikeresen törölve', 'id' => $userId]);
    } catch (PDOException $e) {
        $db->rollBack();
        http_response_code(500);
        echo json_encode(['message' => 'Törlés sikertelen: ' . $e->getMessage()]);
    }
}

/**
 * Admin jogosultság váltása
 */
function toggleAdmin($db, $admin_user, $userId) {
    if ((int)$admin_user['user_id'] === $userId) {
        http_response_code(400);
        echo json_encode(['message' => 'Saját admin jogod nem módosíthatod']);
        return;
    }

    $data = json_decode(file_get_contents('php://input'));
    $newAdmin = isset($data->admin) ? (int)((bool)$data->admin) : 0;

    $exists = $db->prepare('SELECT id FROM felhasznalok WHERE id = :id');
    $exists->bindValue(':id', $userId, PDO::PARAM_INT);
    $exists->execute();
    if (!$exists->fetch()) {
        http_response_code(404);
        echo json_encode(['message' => 'Felhasználó nem található']);
        return;
    }

    $stmt = $db->prepare("UPDATE felhasznalok SET admin = :admin WHERE id = :id");
    $stmt->bindValue(':admin', $newAdmin, PDO::PARAM_INT);
    $stmt->bindValue(':id', $userId, PDO::PARAM_INT);

    if ($stmt->execute()) {
        echo json_encode(['message' => $newAdmin ? 'Admin jog megadva' : 'Admin jog elvéve', 'id' => $userId, 'admin' => $newAdmin]);
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Művelet sikertelen']);
    }
}

/**
 * Felhasználó keresése email vagy ID alapján
 */
function searchUsers($db) {
    $q = isset($_GET['q']) ? trim($_GET['q']) : '';
    if (strlen($q) < 1) {
        echo json_encode([]);
        return;
    }

    $stmt = $db->prepare("SELECT id, felhasznalonev, email, keresztnev, vezeteknev
                           FROM felhasznalok
                           WHERE email LIKE :q OR felhasznalonev LIKE :q2 OR id = :id
                           ORDER BY id DESC LIMIT 10");
    $like = "%{$q}%";
    $idVal = is_numeric($q) ? (int)$q : 0;
    $stmt->bindParam(':q', $like);
    $stmt->bindParam(':q2', $like);
    $stmt->bindParam(':id', $idVal, PDO::PARAM_INT);
    $stmt->execute();

    echo json_encode($stmt->fetchAll());
}

/**
 * Admin statisztikák lekérése
 */
function getAdminStats($db) {
    $stats = [];

    // Felhasználók
    $stmt = $db->query("SELECT COUNT(*) as total, SUM(CASE WHEN tiltva = 1 THEN 1 ELSE 0 END) as banned FROM felhasznalok");
    $stats['users'] = $stmt->fetch();

    // Termékek
    $stmt = $db->query("SELECT COUNT(*) as total, SUM(CASE WHEN aktiv = 1 THEN 1 ELSE 0 END) as active, SUM(CASE WHEN keszlet = 0 THEN 1 ELSE 0 END) as out_of_stock, SUM(CASE WHEN keszlet BETWEEN 1 AND 5 THEN 1 ELSE 0 END) as low_stock FROM termekek");
    $stats['products'] = $stmt->fetch();

    // Rendelések
    $stmt = $db->query("SELECT COUNT(*) as total, SUM(osszeg) as revenue,
                         SUM(CASE WHEN statusz = 'uj' THEN 1 ELSE 0 END) as new_orders,
                         SUM(CASE WHEN statusz = 'feldolgozas' THEN 1 ELSE 0 END) as processing,
                         SUM(CASE WHEN statusz = 'kesz' THEN 1 ELSE 0 END) as completed,
                         SUM(CASE WHEN statusz = 'storno' THEN 1 ELSE 0 END) as cancelled
                         FROM rendelesek");
    $stats['orders'] = $stmt->fetch();

    // Kuponok
    $stmt = $db->query("SELECT COUNT(*) as total, SUM(CASE WHEN aktiv = 1 THEN 1 ELSE 0 END) as active FROM kuponok");
    $stats['coupons'] = $stmt->fetch();

    // Vélemények
    $stmt = $db->query("SELECT COUNT(*) as total, COALESCE(AVG(ertekeles), 0) as avg_rating FROM termek_velemenyek WHERE elfogadva = 1");
    $stats['reviews'] = $stmt->fetch();

    // Legutóbbi 5 rendelés
    try {
        $stmt = $db->query("SELECT r.id, r.rendeles_szam, r.osszeg as vegosszeg, r.statusz, r.letrehozva as rendeles_datum, f.felhasznalonev
                             FROM rendelesek r LEFT JOIN felhasznalok f ON r.felhasznalo_id = f.id
                             ORDER BY r.letrehozva DESC LIMIT 5");
        $stats['recent_orders'] = $stmt->fetchAll();
    } catch (PDOException $e) {
        $stats['recent_orders'] = [];
    }

    // Top 5 termék (legtöbb rendelés)
    try {
        $stmt = $db->query("SELECT t.nev, SUM(rt.mennyiseg) as total_sold, SUM(rt.mennyiseg * rt.ar) as total_revenue
                             FROM rendeles_tetelek rt
                             JOIN termekek t ON rt.termek_id = t.id
                             GROUP BY rt.termek_id, t.nev
                             ORDER BY total_sold DESC LIMIT 5");
        $stats['top_products'] = $stmt->fetchAll();
    } catch (PDOException $e) {
        $stats['top_products'] = [];
    }

    echo json_encode($stats);
}

/**
 * Felhasználó rendelései (vásárlási előzmények)
 */
function getUserOrders($db, $userId) {
    // Rendelések lekérése
    $stmt = $db->prepare("SELECT id, rendeles_szam, osszeg, statusz, szallitasi_mod, fizetesi_mod, megjegyzes,
                                  szallitasi_nev, szallitasi_cim, szallitasi_varos, szallitasi_irsz, letrehozva
                           FROM rendelesek
                           WHERE felhasznalo_id = :uid
                           ORDER BY letrehozva DESC");
    $stmt->bindValue(':uid', $userId, PDO::PARAM_INT);
    $stmt->execute();
    $orders = $stmt->fetchAll();

    // Minden rendeléshez a tételek
    foreach ($orders as &$order) {
        $stmtItems = $db->prepare("SELECT termek_nev, ar, mennyiseg FROM rendeles_tetelek WHERE rendeles_id = :oid");
        $stmtItems->bindValue(':oid', $order['id'], PDO::PARAM_INT);
        $stmtItems->execute();
        $order['tetelek'] = $stmtItems->fetchAll();
    }

    echo json_encode($orders);
}
