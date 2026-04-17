<?php
/**
 * Jelszó visszaállítás API
 */

require_once '../config/database.php';
require_once '../config/cors.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];
$request_uri = $_SERVER['REQUEST_URI'];

// Endpoint routing
if ($method === 'POST' && strpos($request_uri, '/password-reset.php/request') !== false) {
    requestReset($db);
} elseif ($method === 'POST' && strpos($request_uri, '/password-reset.php/verify') !== false) {
    verifyCode($db);
} elseif ($method === 'POST' && strpos($request_uri, '/password-reset.php/reset') !== false) {
    resetPassword($db);
} else {
    http_response_code(404);
    echo json_encode(['message' => 'Endpoint nem található']);
}

/**
 * Jelszó visszaállítás kérése - generál egy 6 számjegyű kódot
 */
function requestReset($db) {
    $data = json_decode(file_get_contents("php://input"));
    
    if (empty($data->email)) {
        http_response_code(400);
        echo json_encode(['message' => 'Email cím megadása kötelező']);
        return;
    }
    
    $email = trim($data->email);
    
    // Felhasználó keresése
    $stmt = $db->prepare("SELECT id, felhasznalonev FROM felhasznalok WHERE email = :email");
    $stmt->bindParam(':email', $email);
    $stmt->execute();
    $user = $stmt->fetch();
    
    if (!$user) {
        // Biztonsági okokból nem árulunk el, hogy létezik-e a felhasználó
        echo json_encode([
            'success' => true,
            'message' => 'Ha az email cím regisztrálva van, hamarosan megkapod a kódot.'
        ]);
        return;
    }
    
    // Régi kódok törlése
    $stmt = $db->prepare("DELETE FROM jelszo_reset WHERE felhasznalo_id = :user_id");
    $stmt->bindParam(':user_id', $user['id']);
    $stmt->execute();
    
    // Új 6 számjegyű kód generálása
    $kod = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
    
    // Lejárati idő: 15 perc
    $lejar = date('Y-m-d H:i:s', strtotime('+15 minutes'));
    
    // Kód mentése
    $stmt = $db->prepare("INSERT INTO jelszo_reset (felhasznalo_id, kod, lejar) VALUES (:user_id, :kod, :lejar)");
    $stmt->bindParam(':user_id', $user['id']);
    $stmt->bindParam(':kod', $kod);
    $stmt->bindParam(':lejar', $lejar);
    $stmt->execute();
    
    // Visszaküldjük a kódot a frontendnek, hogy EmailJS-sel elküldhesse
    echo json_encode([
        'success' => true,
        'message' => 'Kód generálva',
        'kod' => $kod, // A frontend küldi el EmailJS-sel
        'lejar' => $lejar,
        'email' => $email
    ]);
}

/**
 * Kód ellenőrzése
 */
function verifyCode($db) {
    $data = json_decode(file_get_contents("php://input"));
    
    if (empty($data->email) || empty($data->kod)) {
        http_response_code(400);
        echo json_encode(['message' => 'Email és kód megadása kötelező']);
        return;
    }
    
    $email = trim($data->email);
    $kod = trim($data->kod);
    
    // Felhasználó és kód keresése
    $stmt = $db->prepare("
        SELECT jr.id, jr.kod, jr.lejar, jr.felhasznalva, f.id as user_id
        FROM jelszo_reset jr
        JOIN felhasznalok f ON jr.felhasznalo_id = f.id
        WHERE f.email = :email AND jr.kod = :kod
        ORDER BY jr.letrehozva DESC
        LIMIT 1
    ");
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':kod', $kod);
    $stmt->execute();
    $reset = $stmt->fetch();
    
    if (!$reset) {
        http_response_code(400);
        echo json_encode(['valid' => false, 'message' => 'Hibás kód']);
        return;
    }
    
    if ($reset['felhasznalva']) {
        http_response_code(400);
        echo json_encode(['valid' => false, 'message' => 'Ez a kód már fel lett használva']);
        return;
    }
    
    if (strtotime($reset['lejar']) < time()) {
        http_response_code(400);
        echo json_encode(['valid' => false, 'message' => 'A kód lejárt']);
        return;
    }
    
    echo json_encode([
        'valid' => true,
        'message' => 'Kód érvényes',
        'reset_id' => $reset['id']
    ]);
}

/**
 * Jelszó visszaállítása
 */
function resetPassword($db) {
    $data = json_decode(file_get_contents("php://input"));
    
    if (empty($data->email) || empty($data->kod) || empty($data->uj_jelszo)) {
        http_response_code(400);
        echo json_encode(['message' => 'Minden mező kitöltése kötelező']);
        return;
    }
    
    $email = trim($data->email);
    $kod = trim($data->kod);
    $ujJelszo = $data->uj_jelszo;
    
    if (strlen($ujJelszo) < 6) {
        http_response_code(400);
        echo json_encode(['message' => 'A jelszónak legalább 6 karakter hosszúnak kell lennie']);
        return;
    }
    
    // Kód ellenőrzése
    $stmt = $db->prepare("
        SELECT jr.id, jr.felhasznalo_id, jr.lejar, jr.felhasznalva
        FROM jelszo_reset jr
        JOIN felhasznalok f ON jr.felhasznalo_id = f.id
        WHERE f.email = :email AND jr.kod = :kod
        ORDER BY jr.letrehozva DESC
        LIMIT 1
    ");
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':kod', $kod);
    $stmt->execute();
    $reset = $stmt->fetch();
    
    if (!$reset || $reset['felhasznalva'] || strtotime($reset['lejar']) < time()) {
        http_response_code(400);
        echo json_encode(['message' => 'Érvénytelen vagy lejárt kód']);
        return;
    }
    
    // Jelszó frissítése
    $hashedPassword = password_hash($ujJelszo, PASSWORD_DEFAULT);
    $stmt = $db->prepare("UPDATE felhasznalok SET jelszo_hash = :jelszo WHERE id = :user_id");
    $stmt->bindParam(':jelszo', $hashedPassword);
    $stmt->bindParam(':user_id', $reset['felhasznalo_id']);
    $stmt->execute();
    
    // Kód felhasználtnak jelölése
    $stmt = $db->prepare("UPDATE jelszo_reset SET felhasznalva = 1 WHERE id = :id");
    $stmt->bindParam(':id', $reset['id']);
    $stmt->execute();
    
    echo json_encode([
        'success' => true,
        'message' => 'Jelszó sikeresen megváltoztatva!'
    ]);
}
