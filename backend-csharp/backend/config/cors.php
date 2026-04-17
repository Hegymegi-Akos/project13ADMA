<?php
/**
 * CORS beállítások - Apache .htaccess kezeli a CORS headereket
 * Ez a fájl csak a Content-Type-ot és preflight kezelést biztosítja
 */

header("Content-Type: application/json; charset=UTF-8");

// Preflight request kezelése
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
