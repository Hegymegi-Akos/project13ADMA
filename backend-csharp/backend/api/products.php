<?php
/**
 * Termékek API - Listázás, részletek, keresés
 */

require_once '../config/database.php';
require_once '../config/cors.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];
$request_uri = $_SERVER['REQUEST_URI'];
// Robusztus útvonal olvasás: PATH_INFO ha van, különben a kért útvonal path része
$request_path = $_SERVER['PATH_INFO'] ?? parse_url($request_uri, PHP_URL_PATH);

// Endpoint routing
if ($method === 'GET') {
    // Egyezzen mind a "/products/1" mind a "/products.php/1" minta
    if (preg_match('#/products(?:\.php)?/(\d+)#', $request_path, $matches)) {
        getProductById($db, $matches[1]);
    } elseif (isset($_GET['id']) && ctype_digit($_GET['id'])) {
        getProductById($db, (int) $_GET['id']);
    } elseif (strpos($request_path, '/search') !== false) {
        searchProducts($db);
    } elseif (strpos($request_path, '/category') !== false) {
        getProductsByCategory($db);
    } else {
        getAllProducts($db);
    }
} else {
    http_response_code(405);
    echo json_encode(['message' => 'Metódus nem engedélyezett']);
}

/**
 * Összes termék lekérése
 */
function getAllProducts($db) {
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 20;
    $offset = ($page - 1) * $limit;

    $query = "SELECT t.*, 
                     a.nev as alkategoria_nev, a.slug as alkategoria_slug,
                     k.nev as kategoria_nev, k.slug as kategoria_slug,
                     COALESCE(AVG(tv.ertekeles), 0) as atlag_ertekeles,
                     COUNT(tv.id) as ertekelesek_szama
              FROM termekek t
              LEFT JOIN alkategoriak a ON t.alkategoria_id = a.id
              LEFT JOIN kategoriak k ON a.kategoria_id = k.id
              LEFT JOIN termek_velemenyek tv ON t.id = tv.termek_id AND tv.elfogadva = 1
              WHERE t.aktiv = 1
              GROUP BY t.id
              ORDER BY t.id DESC
              LIMIT :limit OFFSET :offset";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();

    $products = $stmt->fetchAll();

    // JSON képek dekódolása
    foreach ($products as &$product) {
        $product['tobbi_kep'] = json_decode($product['tobbi_kep'], true) ?? [];
    }

    // Összes termék száma
    $count_query = "SELECT COUNT(*) as total FROM termekek WHERE aktiv = 1";
    $count_stmt = $db->prepare($count_query);
    $count_stmt->execute();
    $total = $count_stmt->fetch()['total'];

    echo json_encode([
        'products' => $products,
        'total' => $total,
        'page' => $page,
        'limit' => $limit,
        'pages' => ceil($total / $limit)
    ]);
}

/**
 * Egy termék lekérése ID alapján
 */
function getProductById($db, $id) {
    $query = "SELECT t.*, 
                     a.nev as alkategoria_nev, a.slug as alkategoria_slug,
                     k.nev as kategoria_nev, k.slug as kategoria_slug,
                     COALESCE(AVG(tv.ertekeles), 0) as atlag_ertekeles,
                     COUNT(tv.id) as ertekelesek_szama
              FROM termekek t
              LEFT JOIN alkategoriak a ON t.alkategoria_id = a.id
              LEFT JOIN kategoriak k ON a.kategoria_id = k.id
              LEFT JOIN termek_velemenyek tv ON t.id = tv.termek_id AND tv.elfogadva = 1
              WHERE t.id = :id AND t.aktiv = 1
              GROUP BY t.id";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->execute();

    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['message' => 'Termék nem található']);
        return;
    }

    $product = $stmt->fetch();
    $product['tobbi_kep'] = json_decode($product['tobbi_kep'], true) ?? [];

    echo json_encode($product);
}

/**
 * Termékek keresése
 */
function searchProducts($db) {
    $search = $_GET['q'] ?? '';
    
    if (empty($search)) {
        http_response_code(400);
        echo json_encode(['message' => 'Keresési kifejezés hiányzik']);
        return;
    }

    $query = "SELECT t.*, 
                     a.nev as alkategoria_nev, a.slug as alkategoria_slug,
                     k.nev as kategoria_nev, k.slug as kategoria_slug,
                     COALESCE(AVG(tv.ertekeles), 0) as atlag_ertekeles,
                     COUNT(tv.id) as ertekelesek_szama
              FROM termekek t
              LEFT JOIN alkategoriak a ON t.alkategoria_id = a.id
              LEFT JOIN kategoriak k ON a.kategoria_id = k.id
              LEFT JOIN termek_velemenyek tv ON t.id = tv.termek_id AND tv.elfogadva = 1
              WHERE t.aktiv = 1 AND (t.nev LIKE :search OR t.leiras LIKE :search OR t.rovid_leiras LIKE :search)
              GROUP BY t.id
              ORDER BY t.id DESC
              LIMIT 50";
    
    $stmt = $db->prepare($query);
    $search_param = "%$search%";
    $stmt->bindParam(':search', $search_param);
    $stmt->execute();

    $products = $stmt->fetchAll();

    foreach ($products as &$product) {
        $product['tobbi_kep'] = json_decode($product['tobbi_kep'], true) ?? [];
    }

    echo json_encode($products);
}

/**
 * Termékek lekérése kategória/alkategória alapján
 */
function getProductsByCategory($db) {
    $kategoria_slug = $_GET['kategoria'] ?? '';
    $alkategoria_slug = $_GET['alkategoria'] ?? '';

    if (empty($kategoria_slug)) {
        http_response_code(400);
        echo json_encode(['message' => 'Kategória slug hiányzik']);
        return;
    }

    $query = "SELECT t.*, 
                     a.nev as alkategoria_nev, a.slug as alkategoria_slug,
                     k.nev as kategoria_nev, k.slug as kategoria_slug,
                     COALESCE(AVG(tv.ertekeles), 0) as atlag_ertekeles,
                     COUNT(tv.id) as ertekelesek_szama
              FROM termekek t
              LEFT JOIN alkategoriak a ON t.alkategoria_id = a.id
              LEFT JOIN kategoriak k ON a.kategoria_id = k.id
              LEFT JOIN termek_velemenyek tv ON t.id = tv.termek_id AND tv.elfogadva = 1
              WHERE t.aktiv = 1 AND k.slug = :kategoria_slug";
    
    if (!empty($alkategoria_slug)) {
        $query .= " AND a.slug = :alkategoria_slug";
    }
    
    $query .= " GROUP BY t.id ORDER BY t.id DESC";

    $stmt = $db->prepare($query);
    $stmt->bindParam(':kategoria_slug', $kategoria_slug);
    
    if (!empty($alkategoria_slug)) {
        $stmt->bindParam(':alkategoria_slug', $alkategoria_slug);
    }
    
    $stmt->execute();

    $products = $stmt->fetchAll();

    foreach ($products as &$product) {
        $product['tobbi_kep'] = json_decode($product['tobbi_kep'], true) ?? [];
    }

    echo json_encode($products);
}
