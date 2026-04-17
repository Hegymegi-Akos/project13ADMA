<?php
/**
 * JWT konfiguráció
 */

// JWT titkos kulcs - CSERÉLD KI ÉLES KÖRNYEZETBEN!
define('JWT_SECRET_KEY', 'kisallat_webshop_secret_key_2025_CHANGE_THIS');
define('JWT_ALGORITHM', 'HS256');
define('JWT_EXPIRATION_TIME', 86400); // 24 óra másodpercben

// Admin megosztott jelszó (header: X-Admin-Secret) - állítsd be env-ben: ADMIN_SECRET
// Trim, hogy véletlen szóköz se okozzon hibát. Fejlesztésre default: Admin123
define('ADMIN_SHARED_SECRET', trim(getenv('ADMIN_SECRET') ?: 'Admin123'));

/**
 * JWT token generálása
 */
function generateJWT($user_id, $felhasznalonev, $admin = 0) {
    $issued_at = time();
    $expiration_time = $issued_at + JWT_EXPIRATION_TIME;
    
    $payload = [
        'iat' => $issued_at,
        'exp' => $expiration_time,
        'user_id' => $user_id,
        'felhasznalonev' => $felhasznalonev,
        'admin' => $admin
    ];

    return base64_encode(json_encode($payload)) . '.' . 
           hash_hmac('sha256', base64_encode(json_encode($payload)), JWT_SECRET_KEY);
}

/**
 * JWT token validálása és dekódolása
 */
function validateJWT($token) {
    if (!$token) {
        return false;
    }

    $parts = explode('.', $token);
    if (count($parts) !== 2) {
        return false;
    }

    list($payload_encoded, $signature) = $parts;
    
    // Signature ellenőrzése
    $expected_signature = hash_hmac('sha256', $payload_encoded, JWT_SECRET_KEY);
    if ($signature !== $expected_signature) {
        return false;
    }

    $payload = json_decode(base64_decode($payload_encoded), true);
    
    // Lejárat ellenőrzése
    if (!isset($payload['exp']) || $payload['exp'] < time()) {
        return false;
    }

    return $payload;
}

/**
 * Authorization header-ből JWT kinyerése
 */
function getJWTFromHeader() {
    // Apache és más szerverek támogatása
    if (function_exists('getallheaders')) {
        $headers = getallheaders();
    } else {
        // Fallback ha getallheaders() nem elérhető
        $headers = [];
        foreach ($_SERVER as $name => $value) {
            if (substr($name, 0, 5) == 'HTTP_') {
                $headers[str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($name, 5)))))] = $value;
            }
        }
    }
    
    if (isset($headers['Authorization'])) {
        $auth = $headers['Authorization'];
        if (preg_match('/Bearer\s+(.*)$/i', $auth, $matches)) {
            return $matches[1];
        }
    }
    
    // Apache mod_rewrite fallback
    if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        if (preg_match('/Bearer\s+(.*)$/i', $_SERVER['HTTP_AUTHORIZATION'], $matches)) {
            return $matches[1];
        }
    }

    // Query parameter fallback (for invoice downloads etc.)
    if (isset($_GET['token']) && !empty($_GET['token'])) {
        return $_GET['token'];
    }

    return null;
}

/**
 * Admin shared secret kinyerése headerből (X-Admin-Secret)
 */
function getAdminSecretFromHeader() {
    if (function_exists('getallheaders')) {
        $headers = getallheaders();
    } else {
        $headers = [];
        foreach ($_SERVER as $name => $value) {
            if (substr($name, 0, 5) == 'HTTP_') {
                $headers[str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($name, 5)))))] = $value;
            }
        }
    }

    if (isset($headers['X-Admin-Secret'])) {
        return trim($headers['X-Admin-Secret']);
    }

    if (isset($_SERVER['HTTP_X_ADMIN_SECRET'])) {
        return trim($_SERVER['HTTP_X_ADMIN_SECRET']);
    }

    // Query parameter fallback (for invoice downloads etc.)
    if (isset($_GET['secret']) && !empty($_GET['secret'])) {
        return trim($_GET['secret']);
    }

    return '';
}

/**
 * Felhasználó adatok lekérése JWT-ből
 */
function getCurrentUser() {
    $token = getJWTFromHeader();
    if (!$token) {
        return false;
    }
    
    return validateJWT($token);
}

/**
 * Admin jogosultság ellenőrzése
 */
function requireAdmin() {
    $user = getCurrentUser();

    // Token hiányzik vagy érvénytelen
    if (!$user) {
        http_response_code(401);
        echo json_encode(['message' => 'Hiányzó vagy érvénytelen token (Authorization: Bearer ...)']);
        exit();
    }

    // Nem admin flag
    if (empty($user['admin'])) {
        http_response_code(403);
        echo json_encode(['message' => 'Nincs admin jogosultság (admin flag hiányzik)']);
        exit();
    }

    // Admin megosztott jelszó ellenőrzés
    $secret = getAdminSecretFromHeader();
    if (ADMIN_SHARED_SECRET) {
        if ($secret === '') {
            http_response_code(403);
            echo json_encode(['message' => 'Hiányzik az X-Admin-Secret header']);
            exit();
        }
        if ($secret !== ADMIN_SHARED_SECRET) {
            http_response_code(403);
            echo json_encode(['message' => 'Érvénytelen admin jelszó']);
            exit();
        }
    }

    return $user;
}

/**
 * Bejelentkezés ellenőrzése
 */
function requireAuth() {
    $user = getCurrentUser();
    
    if (!$user) {
        http_response_code(401);
        echo json_encode(['message' => 'Bejelentkezés szükséges']);
        exit();
    }
    
    return $user;
}
