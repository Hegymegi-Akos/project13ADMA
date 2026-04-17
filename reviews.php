<?php
/**
 * Üzenetek API - Admin <-> Felhasználó üzenetküldés
 */

require_once '../config/database.php';
require_once '../config/cors.php';
require_once '../config/jwt.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];
$request_uri = $_SERVER['REQUEST_URI'];

if ($method === 'OPTIONS') {
    http_response_code(204);
    exit();
}

// Tabla letrehozasa ha nem letezik
$db->exec("CREATE TABLE IF NOT EXISTS uzenetek (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kuldo_id INT NOT NULL,
    fogado_id INT NOT NULL,
    uzenet TEXT NOT NULL,
    olvasott TINYINT(1) DEFAULT 0,
    letrehozva DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (kuldo_id) REFERENCES felhasznalok(id) ON DELETE CASCADE,
    FOREIGN KEY (fogado_id) REFERENCES felhasznalok(id) ON DELETE CASCADE
)");

$user = verifyToken();
if (!$user) {
    http_response_code(401);
    echo json_encode(['message' => 'Bejelentkezes szukseges']);
    exit();
}

$data = json_decode(file_get_contents('php://input'));
$user_id = $user['id'];

// GET /messages.php - sajat uzenetek (beszelgetesek listaja)
if ($method === 'GET' && strpos($request_uri, '/conversation/') !== false) {
    // GET /messages.php/conversation/:id - beszelgetes egy adott felhasznaloval
    preg_match('/\/conversation\/(\d+)/', $request_uri, $m);
    $other_id = (int)$m[1];

    // Jelold olvasottra amit kaptam
    $stmt = $db->prepare("UPDATE uzenetek SET olvasott = 1 WHERE kuldo_id = :other AND fogado_id = :me AND olvasott = 0");
    $stmt->execute([':other' => $other_id, ':me' => $user_id]);

    $stmt = $db->prepare("SELECT u.*, f.felhasznalonev as kuldo_nev FROM uzenetek u JOIN felhasznalok f ON f.id = u.kuldo_id WHERE (u.kuldo_id = :me1 AND u.fogado_id = :other1) OR (u.kuldo_id = :other2 AND u.fogado_id = :me2) ORDER BY u.letrehozva ASC");
    $stmt->execute([':me1' => $user_id, ':other1' => $other_id, ':other2' => $other_id, ':me2' => $user_id]);
    echo json_encode($stmt->fetchAll());
} elseif ($method === 'GET' && strpos($request_uri, '/unread') !== false) {
    // GET /messages.php/unread - olvasatlan uzenetek szama
    $stmt = $db->prepare("SELECT COUNT(*) as count FROM uzenetek WHERE fogado_id = :me AND olvasott = 0");
    $stmt->execute([':me' => $user_id]);
    echo json_encode($stmt->fetch());
} elseif ($method === 'GET') {
    // GET /messages.php - beszelgetesek listaja
    $stmt = $db->prepare("
        SELECT f.id, f.felhasznalonev, f.email,
            (SELECT uzenet FROM uzenetek WHERE (kuldo_id = f.id AND fogado_id = :me1) OR (kuldo_id = :me2 AND fogado_id = f.id) ORDER BY letrehozva DESC LIMIT 1) as utolso_uzenet,
            (SELECT letrehozva FROM uzenetek WHERE (kuldo_id = f.id AND fogado_id = :me3) OR (kuldo_id = :me4 AND fogado_id = f.id) ORDER BY letrehozva DESC LIMIT 1) as utolso_ido,
            (SELECT COUNT(*) FROM uzenetek WHERE kuldo_id = f.id AND fogado_id = :me5 AND olvasott = 0) as olvasatlan
        FROM felhasznalok f
        WHERE f.id != :me6
        AND f.id IN (
            SELECT CASE WHEN kuldo_id = :me7 THEN fogado_id ELSE kuldo_id END
            FROM uzenetek WHERE kuldo_id = :me8 OR fogado_id = :me9
        )
        ORDER BY utolso_ido DESC
    ");
    $stmt->execute([
        ':me1' => $user_id, ':me2' => $user_id, ':me3' => $user_id,
        ':me4' => $user_id, ':me5' => $user_id, ':me6' => $user_id,
        ':me7' => $user_id, ':me8' => $user_id, ':me9' => $user_id,
    ]);
    echo json_encode($stmt->fetchAll());
} elseif ($method === 'POST') {
    // POST /messages.php - uzenet kuldese
    if (empty($data->fogado_id) || empty($data->uzenet)) {
        http_response_code(400);
        echo json_encode(['message' => 'fogado_id es uzenet kotelezo']);
        exit();
    }
    $stmt = $db->prepare("INSERT INTO uzenetek (kuldo_id, fogado_id, uzenet) VALUES (:kuldo, :fogado, :uzenet)");
    $stmt->execute([
        ':kuldo' => $user_id,
        ':fogado' => (int)$data->fogado_id,
        ':uzenet' => $data->uzenet,
    ]);
    echo json_encode(['message' => 'Uzenet elkuldve', 'id' => $db->lastInsertId()]);
} else {
    http_response_code(405);
    echo json_encode(['message' => 'Nem tamogatott metodus']);
}