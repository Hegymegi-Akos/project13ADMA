<?php
/**
 * Kategóriák és alkategóriák API
 */

require_once '../config/database.php';
require_once '../config/cors.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];
$request_uri = $_SERVER['REQUEST_URI'];

if ($method === 'GET') {
    if (strpos($request_uri, '/subcategories') !== false) {
        getSubcategories($db);
    } else {
        getCategories($db);
    }
} else {
    http_response_code(405);
    echo json_encode(['message' => 'Metódus nem engedélyezett']);
}

/**
 * Összes kategória lekérése alkategóriákkal
 */
function getCategories($db) {
    $query = "SELECT * FROM kategoriak ORDER BY sorrend, id";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $categories = $stmt->fetchAll();

    foreach ($categories as &$category) {
        $sub_query = "SELECT * FROM alkategoriak WHERE kategoria_id = :kategoria_id ORDER BY sorrend, id";
        $sub_stmt = $db->prepare($sub_query);
        $sub_stmt->bindParam(':kategoria_id', $category['id']);
        $sub_stmt->execute();
        $category['alkategoriak'] = $sub_stmt->fetchAll();
    }

    echo json_encode($categories);
}

/**
 * Alkategóriák lekérése kategória alapján
 */
function getSubcategories($db) {
    $kategoria_id = $_GET['kategoria_id'] ?? null;

    if (!$kategoria_id) {
        http_response_code(400);
        echo json_encode(['message' => 'Kategória ID hiányzik']);
        return;
    }

    $query = "SELECT * FROM alkategoriak WHERE kategoria_id = :kategoria_id ORDER BY sorrend, id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':kategoria_id', $kategoria_id);
    $stmt->execute();

    echo json_encode($stmt->fetchAll());
}
