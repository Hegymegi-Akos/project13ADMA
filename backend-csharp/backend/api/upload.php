<?php
/**
 * Kép feltöltés API
 */

require_once '../config/database.php';
require_once '../config/cors.php';
require_once '../config/jwt.php';

$database = new Database();
$db = $database->getConnection();

// Admin jogosultság ellenőrzése
$admin_user = requireAdmin();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    uploadImage();
} else {
    http_response_code(405);
    echo json_encode(['message' => 'Csak POST metódus engedélyezett']);
}

/**
 * Kép feltöltése
 */
function uploadImage() {
    if (!isset($_FILES['image'])) {
        http_response_code(400);
        echo json_encode(['message' => 'Kép fájl hiányzik']);
        return;
    }

    $file = $_FILES['image'];
    
    // Validáció
    $allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!in_array($file['type'], $allowed_types)) {
        http_response_code(400);
        echo json_encode(['message' => 'Csak kép fájlok engedélyezettek (jpg, png, gif, webp)']);
        return;
    }

    // Max 5MB
    if ($file['size'] > 5 * 1024 * 1024) {
        http_response_code(400);
        echo json_encode(['message' => 'A kép mérete maximum 5MB lehet']);
        return;
    }

    // Uploads mappa létrehozása ha nem létezik
    $upload_dir = __DIR__ . '/../../uploads/';
    if (!file_exists($upload_dir)) {
        mkdir($upload_dir, 0755, true);
    }

    // Egyedi fájlnév generálása
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = uniqid('img_') . '_' . time() . '.' . $extension;
    $filepath = $upload_dir . $filename;

    // Fájl mozgatása
    if (move_uploaded_file($file['tmp_name'], $filepath)) {
        $relativeUrl = '/uploads/' . $filename;

        // Projekt gyökér útvonal becslése a script útvonalból
        $scriptName = str_replace('\\', '/', $_SERVER['SCRIPT_NAME'] ?? '');
        $projectPath = preg_replace('#/backend/api/upload\.php$#', '', $scriptName);
        if ($projectPath === null) {
            $projectPath = '';
        }

        $projectRelativeUrl = rtrim($projectPath, '/') . $relativeUrl;

        $isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
            || (isset($_SERVER['SERVER_PORT']) && (string)$_SERVER['SERVER_PORT'] === '443');
        $scheme = $isHttps ? 'https' : 'http';
        $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
        $absoluteUrl = $scheme . '://' . $host . $projectRelativeUrl;
        
        echo json_encode([
            'message' => 'Kép sikeresen feltöltve',
            'url' => $projectRelativeUrl,
            'absolute_url' => $absoluteUrl,
            'filename' => $filename
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Kép feltöltése sikertelen']);
    }
}
