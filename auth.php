<?php
/**
 * Admin API - Kategóriák és alkategóriák kezelése
 */

require_once '../../config/database.php';
require_once '../../config/cors.php';
require_once '../../config/jwt.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];
$request_uri = $_SERVER['REQUEST_URI'];

if ($method === 'OPTIONS') {
    http_response_code(204);
    exit();
}

$admin_user = requireAdmin();

$data = json_decode(file_get_contents('php://input'));

// Routing
if ($method === 'GET') {
    getAll($db);
} elseif ($method === 'POST' && strpos($request_uri, '/subcategory') !== false) {
    createSubcategory($db, $data);
} elseif ($method === 'POST') {
    createCategory($db, $data);
} elseif ($method === 'PUT' && preg_match('/\/subcategory\/(\d+)/', $request_uri, $m)) {
    updateSubcategory($db, (int)$m[1], $data);
} elseif ($method === 'DELETE' && preg_match('/\/subcategory\/(\d+)/', $request_uri, $m)) {
    deleteSubcategory($db, (int)$m[1]);
} elseif ($method === 'DELETE' && preg_match('/\/categories\.php\/(\d+)/', $request_uri, $m)) {
    deleteCategory($db, (int)$m[1]);
} else {
    http_response_code(405);
    echo json_encode(['message' => 'Nem tamogatott metodus']);
}

function getAll($db) {
    $cats = $db->query("SELECT * FROM kategoriak ORDER BY sorrend, id")->fetchAll();
    foreach ($cats as &$c) {
        $stmt = $db->prepare("SELECT a.*, (SELECT COUNT(*) FROM termekek t WHERE t.alkategoria_id = a.id) as termek_count FROM alkategoriak a WHERE a.kategoria_id = :kid ORDER BY a.sorrend, a.id");
        $stmt->execute([':kid' => $c['id']]);
        $c['alkategoriak'] = $stmt->fetchAll();
    }
    echo json_encode($cats);
}

function createCategory($db, $data) {
    if (empty($data->nev)) {
        http_response_code(400);
        echo json_encode(['message' => 'Nev kotelezo']);
        return;
    }
    $slug = generateSlug($data->nev);
    $check = $db->prepare("SELECT id FROM kategoriak WHERE slug = :s");
    $check->execute([':s' => $slug]);
    if ($check->fetch()) {
        $slug .= '-' . time();
    }
    $sorrend = $db->query("SELECT COALESCE(MAX(sorrend),0)+1 FROM kategoriak")->fetchColumn();
    $stmt = $db->prepare("INSERT INTO kategoriak (slug, nev, kep, sorrend) VALUES (:slug, :nev, :kep, :sorrend)");
    $stmt->execute([
        ':slug' => $slug,
        ':nev' => $data->nev,
        ':kep' => $data->kep ?? null,
        ':sorrend' => $sorrend
    ]);
    echo json_encode(['message' => 'Kategoria letrehozva', 'id' => $db->lastInsertId()]);
}

function createSubcategory($db, $data) {
    if (empty($data->nev) || empty($data->kategoria_id)) {
        http_response_code(400);
        echo json_encode(['message' => 'Nev es kategoria_id kotelezo']);
        return;
    }
    $slug = generateSlug($data->nev);
    $check = $db->prepare("SELECT id FROM alkategoriak WHERE kategoria_id = :kid AND slug = :s");
    $check->execute([':kid' => $data->kategoria_id, ':s' => $slug]);
    if ($check->fetch()) {
        $slug .= '-' . time();
    }
    $sorrend = $db->prepare("SELECT COALESCE(MAX(sorrend),0)+1 FROM alkategoriak WHERE kategoria_id = :kid");
    $sorrend->execute([':kid' => $data->kategoria_id]);
    $nextOrder = $sorrend->fetchColumn();
    $stmt = $db->prepare("INSERT INTO alkategoriak (kategoria_id, slug, nev, kep, sorrend) VALUES (:kid, :slug, :nev, :kep, :sorrend)");
    $stmt->execute([
        ':kid' => $data->kategoria_id,
        ':slug' => $slug,
        ':nev' => $data->nev,
        ':kep' => $data->kep ?? null,
        ':sorrend' => $nextOrder
    ]);
    echo json_encode(['message' => 'Alkategoria letrehozva', 'id' => $db->lastInsertId()]);
}

function updateSubcategory($db, $id, $data) {
    $fields = [];
    $params = [':id' => $id];
    if (isset($data->nev)) { $fields[] = 'nev = :nev'; $params[':nev'] = $data->nev; }
    if (isset($data->kep)) { $fields[] = 'kep = :kep'; $params[':kep'] = $data->kep; }
    if (isset($data->slug)) { $fields[] = 'slug = :slug'; $params[':slug'] = $data->slug; }
    if (empty($fields)) {
        http_response_code(400);
        echo json_encode(['message' => 'Nincs modositando mezo']);
        return;
    }
    $stmt = $db->prepare("UPDATE alkategoriak SET " . implode(', ', $fields) . " WHERE id = :id");
    $stmt->execute($params);
    echo json_encode(['message' => 'Alkategoria frissitve']);
}

function deleteSubcategory($db, $id) {
    $check = $db->prepare("SELECT COUNT(*) FROM termekek WHERE alkategoria_id = :id");
    $check->execute([':id' => $id]);
    if ($check->fetchColumn() > 0) {
        http_response_code(409);
        echo json_encode(['message' => 'Nem torolheto, mert termekek tartoznak hozza. Elobb torold vagy mozgasd at a termekeket.']);
        return;
    }
    $db->prepare("DELETE FROM alkategoriak WHERE id = :id")->execute([':id' => $id]);
    echo json_encode(['message' => 'Alkategoria torolve']);
}

function deleteCategory($db, $id) {
    $check = $db->prepare("SELECT COUNT(*) FROM alkategoriak WHERE kategoria_id = :id");
    $check->execute([':id' => $id]);
    if ($check->fetchColumn() > 0) {
        http_response_code(409);
        echo json_encode(['message' => 'Nem torolheto, mert alkategoriak tartoznak hozza. Elobb torold az alkategoriakat.']);
        return;
    }
    $db->prepare("DELETE FROM kategoriak WHERE id = :id")->execute([':id' => $id]);
    echo json_encode(['message' => 'Kategoria torolve']);
}

function generateSlug($text) {
    $text = mb_strtolower($text, 'UTF-8');
    $replacements = [
        'á'=>'a','é'=>'e','í'=>'i','ó'=>'o','ö'=>'o','ő'=>'o','ú'=>'u','ü'=>'u','ű'=>'u'
    ];
    $text = strtr($text, $replacements);
    $text = preg_replace('/[^a-z0-9]+/', '-', $text);
    return trim($text, '-');
}