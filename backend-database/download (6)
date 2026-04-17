<?php
/**
 * Adatbázis kapcsolat konfiguráció
 */

class Database {
    private $host = "localhost";
    private $db_name = "kisalla9_webshop";
    private $username = "root";
    private $password = "";
    private $charset = "utf8mb4";
    public $conn;

    /**
     * Adatbázis kapcsolat létrehozása
     */
    public function getConnection() {
        $this->conn = null;

        try {
            $dsn = "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=" . $this->charset;
            $this->conn = new PDO($dsn, $this->username, $this->password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch(PDOException $exception) {
            echo "Adatbázis kapcsolódási hiba: " . $exception->getMessage();
        }

        return $this->conn;
    }
}
