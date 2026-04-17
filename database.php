<?php
/**
 * Vélemények/Kommentek API
 */

require_once '../config/database.php';
require_once '../config/cors.php';
require_once '../config/jwt.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];
$request_uri = $_SERVER['REQUEST_URI'];

// Endpoint routing - a reviews.php utáni rész számít
if ($method === 'GET' && preg_match('/\/reviews\.php\/product\/(\d+)/', $request_uri, $matches)) {
    getProductReviews($db, $matches[1]);
} elseif ($method === 'GET' && (strpos($request_uri, '/reviews.php/all') !== false || strpos($request_uri, '/reviews/all') !== false)) {
    getAllReviews($db);
} elseif ($method === 'GET' && (strpos($request_uri, '/reviews.php/wall') !== false || strpos($request_uri, '/reviews/wall') !== false)) {
    getWallPosts($db);
} elseif ($method === 'POST' && (strpos($request_uri, '/reviews.php/wall') !== false || strpos($request_uri, '/reviews/wall') !== false)) {
    createWallPost($db);
} elseif ($method === 'DELETE' && preg_match('/\/reviews(?:\.php)?\/wall\/(\d+)/', $request_uri, $matches)) {
    deleteWallPost($db, $matches[1]);
} elseif ($method === 'DELETE' && preg_match('/\/reviews(?:\.php)?\/review\/(\d+)/', $request_uri, $matches)) {
    deleteReview($db, $matches[1]);
} elseif ($method === 'GET' && (strpos($request_uri, '/reviews.php/banned-words') !== false || strpos($request_uri, '/reviews/banned-words') !== false)) {
    getBannedWords($db);
} elseif ($method === 'POST' && (strpos($request_uri, '/reviews.php/banned-words') !== false || strpos($request_uri, '/reviews/banned-words') !== false)) {
    addBannedWord($db);
} elseif ($method === 'DELETE' && preg_match('/\/reviews(?:\.php)?\/banned-words\/(\d+)/', $request_uri, $matches)) {
    deleteBannedWord($db, $matches[1]);
} elseif ($method === 'POST' && (strpos($request_uri, '/reviews.php') !== false || strpos($request_uri, '/reviews') !== false)) {
    createReview($db);
} elseif ($method === 'PUT' && preg_match('/\/reviews(?:\.php)?\/(\d+)\/helpful/', $request_uri, $matches)) {
    markHelpful($db, $matches[1]);
} else {
    http_response_code(404);
    echo json_encode(['message' => 'Endpoint nem található']);
}

/**
 * Termék véleményeinek lekérése
 */
function getProductReviews($db, $termek_id) {
    $query = "SELECT tv.*, f.felhasznalonev, f.keresztnev, f.vezeteknev
              FROM termek_velemenyek tv
              LEFT JOIN felhasznalok f ON tv.felhasznalo_id = f.id
              WHERE tv.termek_id = :termek_id AND tv.elfogadva = 1
              ORDER BY tv.datum DESC";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':termek_id', $termek_id);
    $stmt->execute();

    $reviews = $stmt->fetchAll();

    // Átlag értékelés és statisztika
    $stats_query = "SELECT 
                        COUNT(*) as osszes,
                        COALESCE(AVG(ertekeles), 0) as atlag,
                        SUM(CASE WHEN ertekeles = 5 THEN 1 ELSE 0 END) as otcsillag,
                        SUM(CASE WHEN ertekeles = 4 THEN 1 ELSE 0 END) as negycsillag,
                        SUM(CASE WHEN ertekeles = 3 THEN 1 ELSE 0 END) as haromcsillag,
                        SUM(CASE WHEN ertekeles = 2 THEN 1 ELSE 0 END) as kettocsillag,
                        SUM(CASE WHEN ertekeles = 1 THEN 1 ELSE 0 END) as egycsillag
                    FROM termek_velemenyek
                    WHERE termek_id = :termek_id AND elfogadva = 1";
    
    $stats_stmt = $db->prepare($stats_query);
    $stats_stmt->bindParam(':termek_id', $termek_id);
    $stats_stmt->execute();
    $stats = $stats_stmt->fetch();

    echo json_encode([
        'reviews' => $reviews,
        'stats' => $stats
    ]);
}

/**
 * Új vélemény hozzáadása
 */
function createReview($db) {
    $data = json_decode(file_get_contents("php://input"));

    if (empty($data->termek_id) || empty($data->ertekeles) || empty($data->cim) || empty($data->velemeny)) {
        http_response_code(400);
        echo json_encode(['message' => 'Termék ID, értékelés, cím és vélemény kötelező']);
        return;
    }

    if ($data->ertekeles < 1 || $data->ertekeles > 5) {
        http_response_code(400);
        echo json_encode(['message' => 'Értékelés 1 és 5 között lehet']);
        return;
    }

    // Tiltott szavak ellenőrzése
    $textToCheck = $data->cim . ' ' . $data->velemeny;
    $bannedWord = checkBannedWords($db, $textToCheck);
    if ($bannedWord) {
        http_response_code(400);
        echo json_encode(['message' => "A vélemény tiltott szót tartalmaz: '$bannedWord'"]);
        return;
    }

    // Bejelentkezett felhasználó ellenőrzése
    $user = getCurrentUser();
    $felhasznalo_id = $user ? $user['user_id'] : null;
    $vendeg_nev = !$user && !empty($data->vendeg_nev) ? $data->vendeg_nev : 'Névtelen vásárló';

    // Duplikált vélemény ellenőrzése (ha be van jelentkezve)
    if ($felhasznalo_id) {
        $check_query = "SELECT id FROM termek_velemenyek 
                        WHERE termek_id = :termek_id AND felhasznalo_id = :felhasznalo_id";
        $check_stmt = $db->prepare($check_query);
        $check_stmt->bindParam(':termek_id', $data->termek_id);
        $check_stmt->bindParam(':felhasznalo_id', $felhasznalo_id);
        $check_stmt->execute();

        if ($check_stmt->rowCount() > 0) {
            http_response_code(409);
            echo json_encode(['message' => 'Már írtál véleményt erről a termékről']);
            return;
        }
    }

    $query = "INSERT INTO termek_velemenyek (termek_id, felhasznalo_id, vendeg_nev, ertekeles, cim, velemeny, elfogadva)
              VALUES (:termek_id, :felhasznalo_id, :vendeg_nev, :ertekeles, :cim, :velemeny, 1)";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':termek_id', $data->termek_id);
    $stmt->bindParam(':felhasznalo_id', $felhasznalo_id);
    $stmt->bindParam(':vendeg_nev', $vendeg_nev);
    $stmt->bindParam(':ertekeles', $data->ertekeles);
    $stmt->bindParam(':cim', $data->cim);
    $stmt->bindParam(':velemeny', $data->velemeny);

    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode([
            'message' => 'Vélemény sikeresen hozzáadva',
            'id' => $db->lastInsertId()
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Vélemény hozzáadása sikertelen']);
    }
}

/**
 * Vélemény hasznos jelölése
 */
function markHelpful($db, $review_id) {
    $data = json_decode(file_get_contents("php://input"));

    if (!isset($data->helpful) || !is_bool($data->helpful)) {
        http_response_code(400);
        echo json_encode(['message' => 'Helpful paraméter kötelező (true/false)']);
        return;
    }

    $column = $data->helpful ? 'segitett_igen' : 'segitett_nem';
    $query = "UPDATE termek_velemenyek SET $column = $column + 1 WHERE id = :id";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $review_id);

    if ($stmt->execute()) {
        echo json_encode(['message' => 'Köszönjük a visszajelzést']);
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Művelet sikertelen']);
    }
}

/**
 * Összes vélemény lekérése (legújabbak elöl)
 */
function getAllReviews($db) {
    $query = "SELECT tv.*, f.felhasznalonev, f.keresztnev, f.vezeteknev, t.nev as termek_nev
              FROM termek_velemenyek tv
              LEFT JOIN felhasznalok f ON tv.felhasznalo_id = f.id
              LEFT JOIN termekek t ON tv.termek_id = t.id
              WHERE tv.elfogadva = 1
              ORDER BY tv.datum DESC
              LIMIT 50";
    
    $stmt = $db->prepare($query);
    $stmt->execute();
    $reviews = $stmt->fetchAll();
    
    echo json_encode($reviews);
}

/**
 * Fal bejegyzések lekérése
 */
function getWallPosts($db) {
    // Ellenőrizzük, hogy létezik-e a fal_bejegyzesek tábla
    try {
        $query = "SELECT fb.*, f.felhasznalonev, f.keresztnev, f.vezeteknev
                  FROM fal_bejegyzesek fb
                  LEFT JOIN felhasznalok f ON fb.felhasznalo_id = f.id
                  ORDER BY fb.letrehozva DESC
                  LIMIT 100";
        
        $stmt = $db->prepare($query);
        $stmt->execute();
        $posts = $stmt->fetchAll();
        
        echo json_encode($posts);
    } catch (PDOException $e) {
        // Ha nincs ilyen tábla, hozzuk létre (foreign key nélkül a kompatibilitás miatt)
        $createTable = "CREATE TABLE IF NOT EXISTS fal_bejegyzesek (
            id INT AUTO_INCREMENT PRIMARY KEY,
            felhasznalo_id INT NOT NULL,
            szoveg TEXT NOT NULL,
            letrehozva DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";
        $db->exec($createTable);
        echo json_encode([]);
    }
}

/**
 * Új fal bejegyzés létrehozása
 */
function createWallPost($db) {
    $user = getCurrentUser();
    if (!$user) {
        http_response_code(401);
        echo json_encode(['message' => 'Bejelentkezés szükséges']);
        return;
    }

    $data = json_decode(file_get_contents("php://input"));

    if (empty($data->szoveg)) {
        http_response_code(400);
        echo json_encode(['message' => 'Szöveg megadása kötelező']);
        return;
    }

    $szoveg = trim($data->szoveg);
    if (strlen($szoveg) < 3 || strlen($szoveg) > 1000) {
        http_response_code(400);
        echo json_encode(['message' => 'A bejegyzés 3-1000 karakter között lehet']);
        return;
    }

    // Tiltott szavak ellenőrzése
    $bannedWord = checkBannedWords($db, $szoveg);
    if ($bannedWord) {
        http_response_code(400);
        echo json_encode(['message' => "A bejegyzés tiltott szót tartalmaz: '$bannedWord'"]);
        return;
    }

    // Tábla létrehozása ha nem létezik (foreign key nélkül)
    $createTable = "CREATE TABLE IF NOT EXISTS fal_bejegyzesek (
        id INT AUTO_INCREMENT PRIMARY KEY,
        felhasznalo_id INT NOT NULL,
        szoveg TEXT NOT NULL,
        letrehozva DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";
    $db->exec($createTable);

    $query = "INSERT INTO fal_bejegyzesek (felhasznalo_id, szoveg) VALUES (:felhasznalo_id, :szoveg)";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':felhasznalo_id', $user['user_id']);
    $stmt->bindParam(':szoveg', $szoveg);

    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode([
            'message' => 'Bejegyzés sikeresen hozzáadva',
            'id' => $db->lastInsertId()
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Bejegyzés hozzáadása sikertelen']);
    }
}

/**
 * Fal bejegyzés törlése (csak saját vagy admin)
 */
function deleteWallPost($db, $post_id) {
    $user = getCurrentUser();
    if (!$user) {
        http_response_code(401);
        echo json_encode(['message' => 'Bejelentkezés szükséges']);
        return;
    }

    // Ellenőrizzük, hogy a felhasználóé-e a bejegyzés vagy admin
    $check = $db->prepare("SELECT felhasznalo_id FROM fal_bejegyzesek WHERE id = :id");
    $check->bindParam(':id', $post_id);
    $check->execute();
    $post = $check->fetch();

    if (!$post) {
        http_response_code(404);
        echo json_encode(['message' => 'Bejegyzés nem található']);
        return;
    }

    // Admin ellenőrzés
    $isAdmin = false;
    $adminSecret = $_SERVER['HTTP_X_ADMIN_SECRET'] ?? '';
    if ($adminSecret !== '' && hash_equals(ADMIN_SHARED_SECRET, $adminSecret)) {
        $userCheck = $db->prepare("SELECT admin FROM felhasznalok WHERE id = :id");
        $userCheck->bindParam(':id', $user['user_id']);
        $userCheck->execute();
        $userData = $userCheck->fetch();
        $isAdmin = $userData && $userData['admin'] == 1;
    }

    if ($post['felhasznalo_id'] != $user['user_id'] && !$isAdmin) {
        http_response_code(403);
        echo json_encode(['message' => 'Nincs jogosultságod törölni ezt a bejegyzést']);
        return;
    }

    $stmt = $db->prepare("DELETE FROM fal_bejegyzesek WHERE id = :id");
    $stmt->bindParam(':id', $post_id);

    if ($stmt->execute()) {
        echo json_encode(['message' => 'Bejegyzés törölve']);
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Törlés sikertelen']);
    }
}

/**
 * Vélemény törlése (csak admin)
 */
function deleteReview($db, $review_id) {
    $user = getCurrentUser();
    if (!$user) {
        http_response_code(401);
        echo json_encode(['message' => 'Bejelentkezés szükséges']);
        return;
    }

    // Admin ellenőrzés
    $adminSecret = $_SERVER['HTTP_X_ADMIN_SECRET'] ?? '';
    if ($adminSecret === '' || !hash_equals(ADMIN_SHARED_SECRET, $adminSecret)) {
        http_response_code(403);
        echo json_encode(['message' => 'Admin jogosultság szükséges']);
        return;
    }

    $userCheck = $db->prepare("SELECT admin FROM felhasznalok WHERE id = :id");
    $userCheck->bindParam(':id', $user['user_id']);
    $userCheck->execute();
    $userData = $userCheck->fetch();
    
    if (!$userData || $userData['admin'] != 1) {
        http_response_code(403);
        echo json_encode(['message' => 'Nincs admin jogosultságod']);
        return;
    }

    $stmt = $db->prepare("DELETE FROM termek_velemenyek WHERE id = :id");
    $stmt->bindParam(':id', $review_id);

    if ($stmt->execute()) {
        echo json_encode(['message' => 'Vélemény törölve']);
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Törlés sikertelen']);
    }
}

/**
 * Tiltott szavak lekérése
 */
function getBannedWords($db) {
    // Tábla létrehozása ha nem létezik
    $createTable = "CREATE TABLE IF NOT EXISTS tiltott_szavak (
        id INT AUTO_INCREMENT PRIMARY KEY,
        szo VARCHAR(100) NOT NULL UNIQUE,
        hozzaadva DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";
    $db->exec($createTable);

    $stmt = $db->prepare("SELECT * FROM tiltott_szavak ORDER BY szo ASC");
    $stmt->execute();
    echo json_encode($stmt->fetchAll());
}

/**
 * Tiltott szó hozzáadása (csak admin)
 */
function addBannedWord($db) {
    $user = getCurrentUser();
    if (!$user) {
        http_response_code(401);
        echo json_encode(['message' => 'Bejelentkezés szükséges']);
        return;
    }

    // Admin ellenőrzés
    $adminSecret = $_SERVER['HTTP_X_ADMIN_SECRET'] ?? '';
    if ($adminSecret === '' || !hash_equals(ADMIN_SHARED_SECRET, $adminSecret)) {
        http_response_code(403);
        echo json_encode(['message' => 'Admin jogosultság szükséges']);
        return;
    }

    $userCheck = $db->prepare("SELECT admin FROM felhasznalok WHERE id = :id");
    $userCheck->bindParam(':id', $user['user_id']);
    $userCheck->execute();
    $userData = $userCheck->fetch();
    
    if (!$userData || $userData['admin'] != 1) {
        http_response_code(403);
        echo json_encode(['message' => 'Nincs admin jogosultságod']);
        return;
    }

    $data = json_decode(file_get_contents("php://input"));
    if (empty($data->szo)) {
        http_response_code(400);
        echo json_encode(['message' => 'Szó megadása kötelező']);
        return;
    }

    $szo = trim(strtolower($data->szo));
    if (strlen($szo) < 2) {
        http_response_code(400);
        echo json_encode(['message' => 'A szó legalább 2 karakter legyen']);
        return;
    }

    // Tábla létrehozása ha nem létezik
    $createTable = "CREATE TABLE IF NOT EXISTS tiltott_szavak (
        id INT AUTO_INCREMENT PRIMARY KEY,
        szo VARCHAR(100) NOT NULL UNIQUE,
        hozzaadva DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";
    $db->exec($createTable);

    try {
        $stmt = $db->prepare("INSERT INTO tiltott_szavak (szo) VALUES (:szo)");
        $stmt->bindParam(':szo', $szo);
        $stmt->execute();
        
        http_response_code(201);
        echo json_encode([
            'message' => 'Tiltott szó hozzáadva',
            'id' => $db->lastInsertId()
        ]);
    } catch (PDOException $e) {
        if ($e->getCode() == 23000) {
            http_response_code(409);
            echo json_encode(['message' => 'Ez a szó már tiltva van']);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Hiba történt']);
        }
    }
}

/**
 * Tiltott szó törlése (csak admin)
 */
function deleteBannedWord($db, $word_id) {
    $user = getCurrentUser();
    if (!$user) {
        http_response_code(401);
        echo json_encode(['message' => 'Bejelentkezés szükséges']);
        return;
    }

    // Admin ellenőrzés
    $adminSecret = $_SERVER['HTTP_X_ADMIN_SECRET'] ?? '';
    if ($adminSecret === '' || !hash_equals(ADMIN_SHARED_SECRET, $adminSecret)) {
        http_response_code(403);
        echo json_encode(['message' => 'Admin jogosultság szükséges']);
        return;
    }

    $userCheck = $db->prepare("SELECT admin FROM felhasznalok WHERE id = :id");
    $userCheck->bindParam(':id', $user['user_id']);
    $userCheck->execute();
    $userData = $userCheck->fetch();
    
    if (!$userData || $userData['admin'] != 1) {
        http_response_code(403);
        echo json_encode(['message' => 'Nincs admin jogosultságod']);
        return;
    }

    $stmt = $db->prepare("DELETE FROM tiltott_szavak WHERE id = :id");
    $stmt->bindParam(':id', $word_id);

    if ($stmt->execute()) {
        echo json_encode(['message' => 'Tiltott szó törölve']);
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Törlés sikertelen']);
    }
}

/**
 * Tiltott szavak ellenőrzése szövegben
 */
function checkBannedWords($db, $text) {
    try {
        $stmt = $db->prepare("SELECT szo FROM tiltott_szavak");
        $stmt->execute();
        $words = $stmt->fetchAll(PDO::FETCH_COLUMN);
        
        $textLower = strtolower($text);
        foreach ($words as $word) {
            if (strpos($textLower, $word) !== false) {
                return $word;
            }
        }
    } catch (PDOException $e) {
        // Ha nincs tábla, nincs tiltott szó
    }
    return null;
}
