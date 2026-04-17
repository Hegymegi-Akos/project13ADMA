<?php
/**
 * Admin API - Rendeléskezelés
 */

require_once '../../config/database.php';
require_once '../../config/cors.php';
require_once '../../config/jwt.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];
$request_uri = $_SERVER['REQUEST_URI'];
$path = parse_url($request_uri, PHP_URL_PATH);
$path_info = $_SERVER['PATH_INFO'] ?? '';

// CORS preflight
if ($method === 'OPTIONS') {
    http_response_code(204);
    exit();
}

// Admin jogosultság ellenőrzése
$admin_user = requireAdmin();

// ID + invoice flag kinyerése a path-ból (Apache alatt tipikusan: /api/admin/orders.php/3 vagy /api/admin/orders.php/3/invoice)
$orderId = null;
$isInvoice = false;

if ($path) {
    if (preg_match('#/admin/orders\.php/(\d+)/invoice$#', $path, $m) || preg_match('#/admin/orders/(\d+)/invoice$#', $path, $m)) {
        $orderId = (int)$m[1];
        $isInvoice = true;
    } elseif (preg_match('#/admin/orders\.php/(\d+)$#', $path, $m) || preg_match('#/admin/orders/(\d+)$#', $path, $m)) {
        $orderId = (int)$m[1];
    }
}

if (!$orderId && $path_info) {
    if (preg_match('#/(\d+)/invoice$#', $path_info, $m)) {
        $orderId = (int)$m[1];
        $isInvoice = true;
    } elseif (preg_match('#/(\d+)$#', $path_info, $m)) {
        $orderId = (int)$m[1];
    }
}

if (!$orderId && isset($_GET['id'])) {
    $orderId = (int)$_GET['id'];
}

// Endpoint routing
if ($method === 'GET') {
    if ($orderId !== null && $isInvoice) {
        generateInvoice($db, $orderId);
    } elseif ($orderId !== null) {
        getOrderDetails($db, $orderId);
    } else {
        getAllOrders($db);
    }
} elseif ($method === 'PUT') {
    if ($orderId !== null) {
        updateOrderStatus($db, $orderId);
    } else {
        http_response_code(400);
        echo json_encode(['message' => 'Hiányzik a rendelés ID']);
    }
} elseif ($method === 'DELETE') {
    if ($orderId !== null) {
        deleteOrder($db, $orderId);
    } else {
        http_response_code(400);
        echo json_encode(['message' => 'Hiányzik a rendelés ID']);
    }
} else {
    http_response_code(405);
    echo json_encode(['message' => 'Metódus nem engedélyezett']);
}

/**
 * Összes rendelés listázása
 */
function getAllOrders($db) {
    $query = "SELECT r.*, r.rendeles_szam,
                     f.felhasznalonev, f.email, f.telefon,
                     COUNT(rt.id) as tetelek_szama
              FROM rendelesek r
              LEFT JOIN felhasznalok f ON r.felhasznalo_id = f.id
              LEFT JOIN rendeles_tetelek rt ON r.id = rt.rendeles_id
              GROUP BY r.id
              ORDER BY r.letrehozva DESC";
    
    $stmt = $db->prepare($query);
    $stmt->execute();

    echo json_encode($stmt->fetchAll());
}

/**
 * Rendelés részleteinek lekérése
 */
function getOrderDetails($db, $id) {
    // Rendelés fej
    $query = "SELECT r.*, r.rendeles_szam,
                     f.felhasznalonev, f.email, f.telefon, f.keresztnev, f.vezeteknev
              FROM rendelesek r
              LEFT JOIN felhasznalok f ON r.felhasznalo_id = f.id
              WHERE r.id = :id";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->execute();

    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['message' => 'Rendelés nem található']);
        return;
    }

    $order = $stmt->fetch();

    // Rendelés tételek
    $items_query = "SELECT rt.*, t.fo_kep, t.slug
                    FROM rendeles_tetelek rt
                    LEFT JOIN termekek t ON rt.termek_id = t.id
                    WHERE rt.rendeles_id = :id";
    
    $items_stmt = $db->prepare($items_query);
    $items_stmt->bindParam(':id', $id);
    $items_stmt->execute();

    $order['tetelek'] = $items_stmt->fetchAll();

    echo json_encode($order);
}

/**
 * Rendelés státuszának frissítése (jóváhagyás)
 */
function updateOrderStatus($db, $id) {
    $data = json_decode(file_get_contents("php://input"));

    if (empty($data->statusz)) {
        http_response_code(400);
        echo json_encode(['message' => 'Státusz kötelező']);
        return;
    }

    $normalizedStatus = $data->statusz;
    $valid_statuses = ['uj', 'feldolgozas', 'fizetve', 'kesz', 'storno'];
    if (!in_array($normalizedStatus, $valid_statuses, true)) {
        http_response_code(400);
        echo json_encode(['message' => 'Érvénytelen státusz']);
        return;
    }

    $query = "UPDATE rendelesek SET statusz = :statusz WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':statusz', $normalizedStatus);
    $stmt->bindParam(':id', $id);

    if ($stmt->execute()) {
        echo json_encode(['message' => 'Rendelés státusza frissítve']);
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Státusz frissítése sikertelen']);
    }
}

/**
 * Rendelés törlése
 */
function deleteOrder($db, $id) {
    $query = "DELETE FROM rendelesek WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);

    if ($stmt->execute()) {
        echo json_encode(['message' => 'Rendelés sikeresen törölve']);
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Rendelés törlése sikertelen']);
    }
}

/**
 * Számla generálása (PDF letöltés)
 */
function generateInvoice($db, $id) {
    // Rendelés adatok
    $query = "SELECT r.*, r.rendeles_szam,
                     f.felhasznalonev, f.email, f.telefon, f.keresztnev, f.vezeteknev
              FROM rendelesek r
              LEFT JOIN felhasznalok f ON r.felhasznalo_id = f.id
              WHERE r.id = :id";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->execute();

    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['message' => 'Rendelés nem található']);
        return;
    }

    $order = $stmt->fetch();

    // Rendelés tételek
    $items_query = "SELECT * FROM rendeles_tetelek WHERE rendeles_id = :id";
    $items_stmt = $db->prepare($items_query);
    $items_stmt->bindParam(':id', $id);
    $items_stmt->execute();
    $items = $items_stmt->fetchAll();

    // Egyszerű HTML számla
    header('Content-Type: text/html; charset=utf-8');
    header('Content-Disposition: inline; filename="szamla_' . $order['rendeles_szam'] . '.html"');
    
    echo '<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <title>Számla - ' . $order['rendeles_szam'] . '</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1 { color: #333; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f4f4f4; }
        .total { font-weight: bold; font-size: 1.2em; }
        .info { margin: 10px 0; }
    </style>
</head>
<body>
    <h1>SZÁMLA</h1>
    <div class="info">
        <p><strong>Rendelésszám:</strong> ' . $order['rendeles_szam'] . '</p>
        <p><strong>Dátum:</strong> ' . $order['letrehozva'] . '</p>
        <p><strong>Státusz:</strong> ' . $order['statusz'] . '</p>
    </div>
    
    <h2>Vásárló adatai</h2>
    <div class="info">
        <p><strong>Név:</strong> ' . ($order['keresztnev'] ?? '') . ' ' . ($order['vezeteknev'] ?? '') . '</p>
        <p><strong>Email:</strong> ' . $order['email'] . '</p>
        <p><strong>Telefon:</strong> ' . ($order['telefon'] ?? 'Nincs megadva') . '</p>
    </div>
    
    <h2>Szállítási cím</h2>
    <div class="info">
        <p><strong>Név:</strong> ' . $order['szallitasi_nev'] . '</p>
        <p><strong>Város:</strong> ' . $order['szallitasi_varos'] . ' (' . $order['szallitasi_irsz'] . ')</p>
        <p><strong>Cím:</strong> ' . $order['szallitasi_cim'] . '</p>
    </div>
    
    <h2>Tételek</h2>
    <table>
        <thead>
            <tr>
                <th>Termék</th>
                <th>Mennyiség</th>
                <th>Egységár</th>
                <th>Összesen</th>
            </tr>
        </thead>
        <tbody>';
    
    foreach ($items as $item) {
        echo '<tr>
                <td>' . $item['termek_nev'] . '</td>
                <td>' . $item['mennyiseg'] . '</td>
                <td>' . number_format($item['ar'], 0, ',', ' ') . ' Ft</td>
                <td>' . number_format($item['ar'] * $item['mennyiseg'], 0, ',', ' ') . ' Ft</td>
              </tr>';
    }
    
    echo '</tbody>
    </table>
    
    <p class="total">Végösszeg: ' . number_format($order['osszeg'], 0, ',', ' ') . ' Ft</p>
    
    <div class="info">
        <p><strong>Szállítási mód:</strong> ' . ($order['szallitasi_mod'] ?? 'Nincs megadva') . '</p>
        <p><strong>Fizetési mód:</strong> ' . ($order['fizetesi_mod'] ?? 'Nincs megadva') . '</p>
        <p><strong>Megjegyzés:</strong> ' . ($order['megjegyzes'] ?? 'Nincs') . '</p>
    </div>
</body>
</html>';
}
