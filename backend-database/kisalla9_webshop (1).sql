<?php
/**
 * .htaccess URL rewriting támogatása
 * 
 * Ez a fájl átirányítja az összes kérést az index.php-ra,
 * így tiszta URL-eket használhatsz.
 */

header('Content-Type: application/json');

echo json_encode([
    'message' => 'Kisállat Webshop Backend API',
    'version' => '1.0.0',
    'endpoints' => [
        'auth' => '/api/auth.php',
        'products' => '/api/products.php',
        'categories' => '/api/categories.php',
        'orders' => '/api/orders.php',
        'reviews' => '/api/reviews.php',
        'admin' => [
            'products' => '/api/admin/products.php',
            'orders' => '/api/admin/orders.php'
        ]
    ],
    'documentation' => 'See README.md for full API documentation'
]);
