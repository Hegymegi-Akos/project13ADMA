<?php
/**
 * Rendelések API - Kosár, rendelés leadása
 */

require_once '../config/database.php';
require_once '../config/cors.php';
require_once '../config/jwt.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];
$request_uri = $_SERVER['REQUEST_URI'];

// Endpoint routing
if ($method === 'POST' && strpos($request_uri, '/create') !== false) {
    createOrder($db);
} elseif ($method === 'GET' && strpos($request_uri, '/my-orders') !== false) {
    getMyOrders($db);
} elseif ($method === 'GET' && preg_match('/\/orders(?:\.php)?\/(\d+)/', $request_uri, $matches)) {
    getOrderById($db, $matches[1]);
} else {
    http_response_code(404);
    echo json_encode(['message' => 'Endpoint nem található']);
}

/**
 * Új rendelés leadása
 */
function createOrder($db) {
    $user = requireAuth();
    $data = json_decode(file_get_contents("php://input"));

    if (empty($data->tetelek) || !is_array($data->tetelek)) {
        http_response_code(400);
        echo json_encode(['message' => 'Rendelési tételek hiányoznak']);
        return;
    }

    if (empty($data->szallitasi_nev) || empty($data->szallitasi_cim) || empty($data->szallitasi_varos)) {
        http_response_code(400);
        echo json_encode(['message' => 'Szállítási adatok hiányoznak']);
        return;
    }

    try {
        $db->beginTransaction();

        // Rendelésszám generálása
        $rendeles_szam = 'ORD-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -6));

        // Összeg kiszámítása - termék árak lekérése adatbázisból
        $osszeg = 0;
        $tetel_adatok = [];
        foreach ($data->tetelek as $tetel) {
            $termek_id = (int)($tetel->termek_id ?? $tetel->id ?? 0);
            $mennyiseg = (int)($tetel->mennyiseg ?? 1);
            $q = "SELECT id, nev, ar, akcios_ar FROM termekek WHERE id = :id AND aktiv = 1";
            $s = $db->prepare($q);
            $s->bindValue(':id', $termek_id);
            $s->execute();
            $termek = $s->fetch();
            if (!$termek) {
                $db->rollBack();
                http_response_code(400);
                echo json_encode(['message' => 'Termék nem található: ID ' . $termek_id]);
                return;
            }
            $ar = $termek['akcios_ar'] ?: $termek['ar'];
            $osszeg += $ar * $mennyiseg;
            $tetel_adatok[] = ['termek_id' => $termek['id'], 'termek_nev' => $termek['nev'], 'ar' => $ar, 'mennyiseg' => $mennyiseg];
        }

        // Rendelés fej beszúrása
        $query = "INSERT INTO rendelesek (felhasznalo_id, rendeles_szam, statusz, osszeg, szallitasi_mod, fizetesi_mod, megjegyzes, szallitasi_nev, szallitasi_cim, szallitasi_varos, szallitasi_irsz)
              VALUES (:felhasznalo_id, :rendeles_szam, 'uj', :osszeg, :szallitasi_mod, :fizetesi_mod, :megjegyzes, :szallitasi_nev, :szallitasi_cim, :szallitasi_varos, :szallitasi_irsz)";
        
        $stmt = $db->prepare($query);
        $stmt->bindValue(':felhasznalo_id', (int)$user['user_id']);
        $stmt->bindValue(':rendeles_szam', $rendeles_szam);
        $stmt->bindValue(':osszeg', $osszeg);
        $stmt->bindValue(':szallitasi_mod', $data->szallitasi_mod ?? null);
        $stmt->bindValue(':fizetesi_mod', $data->fizetesi_mod ?? null);
        $stmt->bindValue(':megjegyzes', $data->megjegyzes ?? null);
        $stmt->bindValue(':szallitasi_nev', $data->szallitasi_nev);
        $stmt->bindValue(':szallitasi_cim', $data->szallitasi_cim);
        $stmt->bindValue(':szallitasi_varos', $data->szallitasi_varos);
        $stmt->bindValue(':szallitasi_irsz', $data->szallitasi_irsz ?? null);
        $stmt->execute();

        $rendeles_id = $db->lastInsertId();

        // Rendelés tételek beszúrása
        $tetel_query = "INSERT INTO rendeles_tetelek (rendeles_id, termek_id, termek_nev, ar, mennyiseg)
                        VALUES (:rendeles_id, :termek_id, :termek_nev, :ar, :mennyiseg)";
        
        $tetel_stmt = $db->prepare($tetel_query);

        foreach ($tetel_adatok as $tetel) {
            $tetel_stmt->bindValue(':rendeles_id', (int)$rendeles_id);
            $tetel_stmt->bindValue(':termek_id', (int)$tetel['termek_id']);
            $tetel_stmt->bindValue(':termek_nev', $tetel['termek_nev']);
            $tetel_stmt->bindValue(':ar', $tetel['ar']);
            $tetel_stmt->bindValue(':mennyiseg', (int)$tetel['mennyiseg']);
            $tetel_stmt->execute();

            // Készlet csökkentése
            $update_query = "UPDATE termekek SET keszlet = keszlet - :mennyiseg WHERE id = :id AND keszlet >= :mennyiseg";
            $update_stmt = $db->prepare($update_query);
            $update_stmt->bindValue(':mennyiseg', (int)$tetel['mennyiseg']);
            $update_stmt->bindValue(':id', (int)$tetel['termek_id']);
            $update_stmt->execute();

            if ($update_stmt->rowCount() === 0) {
                $db->rollBack();
                http_response_code(400);
                echo json_encode(['message' => 'Nincs elegendő készlet: ' . $tetel['termek_nev']]);
                return;
            }
        }

        // Kosár kiürítése
        $clear_cart = "DELETE FROM kosar WHERE felhasznalo_id = :felhasznalo_id";
        $clear_stmt = $db->prepare($clear_cart);
        $clear_stmt->bindValue(':felhasznalo_id', (int)$user['user_id']);
        $clear_stmt->execute();

        $db->commit();

        http_response_code(201);
        echo json_encode([
            'message' => 'Rendelés sikeresen leadva',
            'rendeles_id' => $rendeles_id,
            'rendeles_szam' => $rendeles_szam
        ]);

    } catch (Exception $e) {
        $db->rollBack();
        http_response_code(500);
        echo json_encode(['message' => 'Rendelés leadása sikertelen: ' . $e->getMessage()]);
    }
}

/**
 * Saját rendelések lekérése
 */
function getMyOrders($db) {
    $user = requireAuth();

    $query = "SELECT r.*, r.rendeles_szam AS rendeles_szam, COUNT(rt.id) as tetelek_szama
              FROM rendelesek r
              LEFT JOIN rendeles_tetelek rt ON r.id = rt.rendeles_id
              WHERE r.felhasznalo_id = :felhasznalo_id
              GROUP BY r.id
              ORDER BY r.letrehozva DESC";
    
    $stmt = $db->prepare($query);
    $stmt->bindValue(':felhasznalo_id', (int)$user['user_id']);
    $stmt->execute();

    echo json_encode($stmt->fetchAll());
}

/**
 * Egy rendelés részleteinek lekérése
 */
function getOrderById($db, $id) {
    $user = requireAuth();

    // Rendelés fej
    $query = "SELECT *, rendeles_szam AS rendeles_szam FROM rendelesek WHERE id = :id AND felhasznalo_id = :felhasznalo_id";
    $stmt = $db->prepare($query);
    $stmt->bindValue(':id', (int)$id);
    $stmt->bindValue(':felhasznalo_id', (int)$user['user_id']);
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
    $items_stmt->bindValue(':id', (int)$id);
    $items_stmt->execute();

    $order['tetelek'] = $items_stmt->fetchAll();

    echo json_encode($order);
}
