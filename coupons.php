<?php
/**
 * Admin API - Termékkezelés (CRUD)
 */

require_once '../../config/database.php';
require_once '../../config/cors.php';
require_once '../../config/jwt.php';

$database = new Database();
$db = $database->getConnection();


$method = $_SERVER['REQUEST_METHOD'];

// URI feldolgozás: vegyük a path-ot, és próbáljuk az ID-t kinyerni
$request_uri = $_SERVER['REQUEST_URI'];
$path = parse_url($request_uri, PHP_URL_PATH);
$path_info = $_SERVER['PATH_INFO'] ?? '';

// Nyers input egyszer olvasva (PUT/POST/DELETE esetén újrahasznosítjuk)
$rawInput = file_get_contents('php://input');

// PowerShell (főleg Windows PowerShell 5.1) gyakran UTF-16-tal küld JSON-t.
// PHP json_decode UTF-8-at vár, ezért tegyük robusztussá a dekódolást.
function decodeJsonBody($raw) {
    if ($raw === false || $raw === null) return null;
    $raw = (string)$raw;
    if ($raw === '') return null;

    // BOM kezelése
    if (strncmp($raw, "\xEF\xBB\xBF", 3) === 0) {
        $raw = substr($raw, 3);
    }

    $data = json_decode($raw);
    if ($data !== null || json_last_error() === JSON_ERROR_NONE) {
        return $data;
    }

    $rawForConvert = $raw;

    // UTF-16 BOM detektálás
    if (strncmp($rawForConvert, "\xFF\xFE", 2) === 0) {
        $rawForConvert = substr($rawForConvert, 2);
        $converted = function_exists('mb_convert_encoding')
            ? mb_convert_encoding($rawForConvert, 'UTF-8', 'UTF-16LE')
            : iconv('UTF-16LE', 'UTF-8//IGNORE', $rawForConvert);
        $data = $converted ? json_decode($converted) : null;
        if ($data !== null || json_last_error() === JSON_ERROR_NONE) return $data;
    }

    if (strncmp($rawForConvert, "\xFE\xFF", 2) === 0) {
        $rawForConvert = substr($rawForConvert, 2);
        $converted = function_exists('mb_convert_encoding')
            ? mb_convert_encoding($rawForConvert, 'UTF-8', 'UTF-16BE')
            : iconv('UTF-16BE', 'UTF-8//IGNORE', $rawForConvert);
        $data = $converted ? json_decode($converted) : null;
        if ($data !== null || json_last_error() === JSON_ERROR_NONE) return $data;
    }

    // Heurisztika: ha sok a null byte, próbáljuk meg UTF-16LE/BE-ként
    if (strpos($rawForConvert, "\x00") !== false) {
        foreach (['UTF-16LE', 'UTF-16BE'] as $enc) {
            $converted = function_exists('mb_convert_encoding')
                ? mb_convert_encoding($rawForConvert, 'UTF-8', $enc)
                : iconv($enc, 'UTF-8//IGNORE', $rawForConvert);
            $data = $converted ? json_decode($converted) : null;
            if ($data !== null || json_last_error() === JSON_ERROR_NONE) return $data;
        }
    }

    return null;
}

$jsonData = decodeJsonBody($rawInput);

// Segédfüggvény: alakítsd a tömböt stdClass-szé, hogy a további kód egységesen használhassa
function normalizeData($data) {
    if (is_array($data)) {
        return json_decode(json_encode($data));
    }
    return $data;
}

$productId = null;
if (preg_match('#/admin/products(?:\.php)?/(\d+)#', $path, $m)) {
    $productId = $m[1];
} elseif ($path_info && preg_match('#/(\d+)$#', $path_info, $m)) {
    // Bizonyos PHP/FastCGI beállításoknál az ID a PATH_INFO-ban érkezik
    $productId = $m[1];
} elseif (isset($_GET['id'])) {
    // Tartalék: ?id=123 formátum
    $productId = (int)$_GET['id'];
}

// CORS preflight
if ($method === 'OPTIONS') {
    http_response_code(204);
    exit();
}

// Admin jogosultság ellenőrzése minden kérésnél
$admin_user = requireAdmin();

// Endpoint routing
if ($method === 'GET') {
    if ($productId !== null) {
        getProductForEdit($db, $productId);
    } else {
        getAllProductsAdmin($db);
    }
} elseif ($method === 'POST') {
    // POST esetén engedjük a method-override-ot (_method = PUT/DELETE)
    $methodOverride = null;
    $idFromBody = null;

    // Ha nincs JSON data, adjunk értelmes hibaüzenetet
    if ($jsonData === null && $rawInput !== '') {
        http_response_code(400);
        echo json_encode(['message' => 'Hibás JSON formátum', 'debug_raw' => substr($rawInput, 0, 200)]);
        exit();
    }

    if ($jsonData) {
        if (is_object($jsonData)) {
            if (isset($jsonData->_method)) $methodOverride = $jsonData->_method;
            if (isset($jsonData->id)) $idFromBody = $jsonData->id;
        } elseif (is_array($jsonData)) {
            if (isset($jsonData['_method'])) $methodOverride = $jsonData['_method'];
            if (isset($jsonData['id'])) $idFromBody = $jsonData['id'];
        }
    }

    if ($methodOverride) {
        $override = strtoupper(trim((string)$methodOverride));
        if ($override === 'PUT' && $idFromBody !== null) {
            updateProduct($db, (int)$idFromBody, $jsonData);
            exit();
        }
        if ($override === 'DELETE' && $idFromBody !== null) {
            deleteProduct($db, (int)$idFromBody);
            exit();
        }
    }

    // Védelem: ha valaki POST-tal próbál frissíteni, de nincs override,
    // ne hozzunk létre duplikátumot véletlenül.
    if ($idFromBody !== null) {
        http_response_code(400);
        echo json_encode(['message' => 'POST csak létrehozásra használható. Frissítéshez PUT vagy POST _method=PUT szükséges.']);
        exit();
    }

    // Nincs override -> valódi create
    createProduct($db, $jsonData);
} elseif ($method === 'PUT') {
    // Ha PATH/GET nem hozta az ID-t, próbáljuk a body-ból kiolvasni
    if ($productId === null && $jsonData && isset($jsonData->id)) {
        $productId = (int)$jsonData->id;
    }

    if ($productId !== null) {
        updateProduct($db, $productId, $jsonData);
    } else {
        http_response_code(400);
        echo json_encode(['message' => 'Hiányzik a termék ID']);
    }
} elseif ($method === 'DELETE') {
    // Ha PATH/GET nem hozta az ID-t, próbáljuk a body-ból kiolvasni
    if ($productId === null && $jsonData && isset($jsonData->id)) {
        $productId = (int)$jsonData->id;
    }

    if ($productId !== null) {
        deleteProduct($db, $productId);
    } else {
        http_response_code(400);
        echo json_encode(['message' => 'Hiányzik a termék ID']);
    }
} else {
    http_response_code(405);
    echo json_encode(['message' => 'Metódus nem engedélyezett']);
}

/**
 * Összes termék listázása adminnak (inaktívakkal együtt)
 */
function getAllProductsAdmin($db) {
    $query = "SELECT t.*, 
                     a.nev as alkategoria_nev, a.slug as alkategoria_slug,
                     k.nev as kategoria_nev, k.slug as kategoria_slug,
                     COALESCE(AVG(tv.ertekeles), 0) as atlag_ertekeles,
                     COUNT(tv.id) as ertekelesek_szama
              FROM termekek t
              LEFT JOIN alkategoriak a ON t.alkategoria_id = a.id
              LEFT JOIN kategoriak k ON a.kategoria_id = k.id
              LEFT JOIN termek_velemenyek tv ON t.id = tv.termek_id
              GROUP BY t.id
              ORDER BY t.id DESC";
    
    $stmt = $db->prepare($query);
    $stmt->execute();

    $products = $stmt->fetchAll();

    foreach ($products as &$product) {
        $product['tobbi_kep'] = json_decode($product['tobbi_kep'], true) ?? [];
    }

    echo json_encode($products);
}

/**
 * Egy termék lekérése szerkesztéshez
 */
function getProductForEdit($db, $id) {
    $query = "SELECT t.*, a.kategoria_id
              FROM termekek t
              LEFT JOIN alkategoriak a ON t.alkategoria_id = a.id
              WHERE t.id = :id";
    
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
 * Új termék létrehozása
 */
function createProduct($db, $data = null) {
    if ($data === null) {
        $data = decodeJsonBody(file_get_contents('php://input'));
    }

    $data = normalizeData($data);

    // Validáció
    if (empty($data->nev) || empty($data->alkategoria_id) || empty($data->ar) || empty($data->fo_kep)) {
        http_response_code(400);
        echo json_encode(['message' => 'Név, alkategória, ár és főkép kötelező']);
        return;
    }

    // Slug generálása
    $slug = generateSlug($data->nev);
    
    // Ellenőrzés: slug egyediség
    $check_query = "SELECT id FROM termekek WHERE slug = :slug";
    $check_stmt = $db->prepare($check_query);
    $check_stmt->bindParam(':slug', $slug);
    $check_stmt->execute();
    
    if ($check_stmt->rowCount() > 0) {
        $slug = $slug . '-' . time();
    }

    // További képek JSON-né alakítása
    $tobbi_kep = json_encode($data->tobbi_kep ?? []);

    $query = "INSERT INTO termekek (alkategoria_id, nev, slug, leiras, rovid_leiras, ar, akcios_ar, keszlet, fo_kep, tobbi_kep, aktiv) 
              VALUES (:alkategoria_id, :nev, :slug, :leiras, :rovid_leiras, :ar, :akcios_ar, :keszlet, :fo_kep, :tobbi_kep, :aktiv)";
    
    // bindParam by reference problémát okozott az optional mezőknél -> bindValue fix
    $stmt = $db->prepare($query);
    $stmt->bindValue(':alkategoria_id', (int)$data->alkategoria_id, PDO::PARAM_INT);
    $stmt->bindValue(':nev', $data->nev);
    $stmt->bindValue(':slug', $slug);
    $leiras = ($data->leiras ?? null);
    $rovid = ($data->rovid_leiras ?? null);
    $stmt->bindValue(':leiras', $leiras, $leiras === null ? PDO::PARAM_NULL : PDO::PARAM_STR);
    $stmt->bindValue(':rovid_leiras', $rovid, $rovid === null ? PDO::PARAM_NULL : PDO::PARAM_STR);
    $stmt->bindValue(':ar', (int)$data->ar, PDO::PARAM_INT);
    $akcios = ($data->akcios_ar ?? null);
    $stmt->bindValue(':akcios_ar', $akcios, $akcios === null ? PDO::PARAM_NULL : PDO::PARAM_INT);
    $stmt->bindValue(':keszlet', $data->keszlet ?? 999, PDO::PARAM_INT);
    $stmt->bindValue(':fo_kep', $data->fo_kep);
    $stmt->bindValue(':tobbi_kep', $tobbi_kep);
    $aktiv = $data->aktiv ?? 1;
    $stmt->bindValue(':aktiv', (int)$aktiv, PDO::PARAM_INT);

    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode([
            'message' => 'Termék sikeresen létrehozva',
            'id' => $db->lastInsertId()
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Termék létrehozása sikertelen']);
    }
}

/**
 * Termék frissítése
 */
function updateProduct($db, $id, $data = null) {
    if ($data === null) {
        $data = decodeJsonBody(file_get_contents('php://input'));
    }

    $data = normalizeData($data);

    // Létezés ellenőrzése (FK-k + hibák miatt legyen egyértelmű a 404)
    $existsStmt = $db->prepare('SELECT id FROM termekek WHERE id = :id');
    $existsStmt->bindValue(':id', (int)$id, PDO::PARAM_INT);
    $existsStmt->execute();
    if ($existsStmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['message' => 'Termék nem található']);
        return;
    }

    // Validáció
    if (empty($data->nev) || empty($data->alkategoria_id) || empty($data->ar) || empty($data->fo_kep)) {
        http_response_code(400);
        echo json_encode(['message' => 'Név, alkategória, ár és főkép kötelező']);
        return;
    }

    // További képek JSON-né alakítása
    $tobbi_kep = json_encode($data->tobbi_kep ?? []);

    $query = "UPDATE termekek 
              SET alkategoria_id = :alkategoria_id,
                  nev = :nev,
                  leiras = :leiras,
                  rovid_leiras = :rovid_leiras,
                  ar = :ar,
                  akcios_ar = :akcios_ar,
                  keszlet = :keszlet,
                  fo_kep = :fo_kep,
                  tobbi_kep = :tobbi_kep,
                  aktiv = :aktiv
              WHERE id = :id";
    
    $stmt = $db->prepare($query);
    $stmt->bindValue(':id', (int)$id, PDO::PARAM_INT);
    $stmt->bindValue(':alkategoria_id', (int)$data->alkategoria_id, PDO::PARAM_INT);
    $stmt->bindValue(':nev', $data->nev);
    $leiras = ($data->leiras ?? null);
    $rovid = ($data->rovid_leiras ?? null);
    $stmt->bindValue(':leiras', $leiras, $leiras === null ? PDO::PARAM_NULL : PDO::PARAM_STR);
    $stmt->bindValue(':rovid_leiras', $rovid, $rovid === null ? PDO::PARAM_NULL : PDO::PARAM_STR);
    $stmt->bindValue(':ar', (int)$data->ar, PDO::PARAM_INT);
    $akcios = ($data->akcios_ar ?? null);
    $stmt->bindValue(':akcios_ar', $akcios, $akcios === null ? PDO::PARAM_NULL : PDO::PARAM_INT);
    $stmt->bindValue(':keszlet', $data->keszlet ?? 999, PDO::PARAM_INT);
    $stmt->bindValue(':fo_kep', $data->fo_kep);
    $stmt->bindValue(':tobbi_kep', $tobbi_kep);
    $aktiv = $data->aktiv ?? 1;
    $stmt->bindValue(':aktiv', (int)$aktiv, PDO::PARAM_INT);

    if ($stmt->execute()) {
        $rowCount = $stmt->rowCount();
        http_response_code(200);
        echo json_encode([
            'message' => 'Termék sikeresen frissítve',
            'id' => $id,
            'success' => true,
            'rowsAffected' => $rowCount
        ]);
    } else {
        $errorInfo = $stmt->errorInfo();
        http_response_code(500);
        echo json_encode([
            'message' => 'Termék frissítése sikertelen',
            'error' => $errorInfo[2] ?? 'Ismeretlen hiba'
        ]);
    }
}

/**
 * Termék törlése
 */
function deleteProduct($db, $id) {
    // Létezés ellenőrzése
    $existsStmt = $db->prepare('SELECT id FROM termekek WHERE id = :id');
    $existsStmt->bindValue(':id', (int)$id, PDO::PARAM_INT);
    $existsStmt->execute();
    if ($existsStmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['message' => 'Termék nem található']);
        return;
    }

    try {
        $db->beginTransaction();
        // Rendeles tetelek torlese (FK nincs CASCADE)
        $db->prepare("DELETE FROM rendeles_tetelek WHERE termek_id = :id")->execute([':id' => (int)$id]);
        // Kosar es velemenyek CASCADE-del toroldnek, de biztonsagbol:
        $db->prepare("DELETE FROM kosar WHERE termek_id = :id")->execute([':id' => (int)$id]);
        $db->prepare("DELETE FROM termek_velemenyek WHERE termek_id = :id")->execute([':id' => (int)$id]);
        // Termek torlese
        $db->prepare("DELETE FROM termekek WHERE id = :id")->execute([':id' => (int)$id]);
        $db->commit();
        echo json_encode(['message' => 'Termék sikeresen törölve']);
    } catch (PDOException $e) {
        $db->rollBack();
        http_response_code(500);
        echo json_encode(['message' => 'Termék törlése sikertelen: ' . $e->getMessage()]);
    }
}

/**
 * Slug generálása magyar karakterekkel
 */
function generateSlug($text) {
    $text = mb_strtolower($text, 'UTF-8');
    
    // Magyar karakterek cseréje
    $replacements = [
        'á' => 'a', 'é' => 'e', 'í' => 'i', 'ó' => 'o', 'ö' => 'o', 'ő' => 'o', 'ú' => 'u', 'ü' => 'u', 'ű' => 'u',
        'Á' => 'a', 'É' => 'e', 'Í' => 'i', 'Ó' => 'o', 'Ö' => 'o', 'Ő' => 'o', 'Ú' => 'u', 'Ü' => 'u', 'Ű' => 'u'
    ];
    
    $text = strtr($text, $replacements);
    $text = preg_replace('/[^a-z0-9]+/', '-', $text);
    $text = trim($text, '-');
    
    return $text;
}
