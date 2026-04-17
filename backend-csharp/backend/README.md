# Kisállat Webshop - Backend API Dokumentáció

## Telepítés és Indítás

### Követelmények
- PHP 7.4 vagy újabb
- MySQL 5.7 vagy újabb
- Apache/Nginx webszerver PHP támogatással

### Adatbázis beállítás
```bash
# MySQL-be importálás
mysql -u root -p < database.sql
```

Megjegyzes: az osszevont projekthez a gyokerben levo `database.sql` hasznalandó.

### Backend konfigurálás
1. Szerkeszd a `backend/config/database.php` fájlt:
   - `$host` - adatbázis host
   - `$username` - MySQL felhasználó
   - `$password` - MySQL jelszó

2. Szerkeszd a `backend/config/jwt.php` fájlt:
   - `JWT_SECRET_KEY` - cseréld le egyedi kulcsra éles környezetben!
  - `ADMIN_SECRET` - add meg webszerver env valtozokent (ha nincs, fejlesztesben `Admin123`)

### Futtatás
```bash
# PHP beépített szervere (fejlesztéshez)
cd backend
php -S localhost:8000

# Vagy Apache/Nginx-el a backend mappát tedd elérhetővé
```

## API Végpontok

### Autentikáció

#### POST `/api/auth.php/register`
Új felhasználó regisztrációja
```json
{
  "felhasznalonev": "pelda_user",
  "email": "pelda@email.com",
  "jelszo": "jelszo123",
  "keresztnev": "Példa",
  "vezeteknev": "Felhasználó",
  "telefon": "+36301234567",
  "iranyitoszam": "1234",
  "varos": "Budapest",
  "cim": "Példa utca 1."
}
```

#### POST `/api/auth.php/login`
Bejelentkezés
```json
{
  "felhasznalonev": "pelda_user",
  "jelszo": "jelszo123"
}
```

#### GET `/api/auth.php/me`
Aktuális felhasználó adatai (JWT token szükséges)
```
Authorization: Bearer {token}
```

#### GET `/api/auth.php/check-auth`
Autentikáció ellenőrzése

---

### Termékek

#### GET `/api/products.php`
Összes termék listázása
- Query paraméterek: `page`, `limit`

#### GET `/api/products.php/{id}`
Egy termék részletei

#### GET `/api/products.php/search?q={keresés}`
Termékek keresése

#### GET `/api/products.php/category?kategoria={slug}&alkategoria={slug}`
Termékek kategória szerint

---

### Kategóriák

#### GET `/api/categories.php`
Összes kategória alkategóriákkal

#### GET `/api/categories.php/subcategories?kategoria_id={id}`
Alkategóriák lekérése

---

### Rendelések (Bejelentkezett felhasználóknak)

#### POST `/api/orders.php/create`
Új rendelés leadása (JWT token szükséges)
```json
{
  "tetelek": [
    {
      "id": 1,
      "name": "Termék neve",
      "ar": 10000,
      "mennyiseg": 2
    }
  ],
  "szallitasi_nev": "Teszt Elek",
  "szallitasi_cim": "Példa utca 1.",
  "szallitasi_varos": "Budapest",
  "szallitasi_irsz": "1234",
  "szallitasi_mod": "Házhozszállítás",
  "fizetesi_mod": "Utánvét",
  "megjegyzes": "Délután szállítás kérem"
}
```

#### GET `/api/orders.php/my-orders`
Saját rendelések (JWT token szükséges)

#### GET `/api/orders.php/{id}`
Egy rendelés részletei (JWT token szükséges)

---

### Vélemények/Kommentek

#### GET `/api/reviews.php/product/{termek_id}`
Termék véleményeinek lekérése

#### POST `/api/reviews.php`
Új vélemény hozzáadása
```json
{
  "termek_id": 1,
  "ertekeles": 5,
  "cim": "Kiváló termék!",
  "velemeny": "Nagyon elégedett vagyok...",
  "vendeg_nev": "Kovács János"
}
```
- Ha be van jelentkezve, a `vendeg_nev` nem kötelező

#### PUT `/api/reviews.php/{review_id}/helpful`
Vélemény hasznos jelölése
```json
{
  "helpful": true
}
```

---

### ADMIN Végpontok (Admin jogosultság szükséges!)

#### Termékkezelés

##### GET `/api/admin/products.php`
Összes termék (inaktívakkal együtt)

##### GET `/api/admin/products.php/{id}`
Egy termék szerkesztéshez

##### POST `/api/admin/products.php`
Új termék létrehozása
```json
{
  "alkategoria_id": 1,
  "nev": "Új termék",
  "leiras": "Részletes leírás...",
  "rovid_leiras": "Rövid leírás",
  "ar": 15000,
  "akcios_ar": 12000,
  "keszlet": 100,
  "fo_kep": "/uploads/kep.jpg",
  "tobbi_kep": ["/uploads/kep2.jpg", "/uploads/kep3.jpg"],
  "aktiv": 1
}
```

##### PUT `/api/admin/products.php/{id}`
Termék frissítése (ugyanaz a body mint a POST)

##### DELETE `/api/admin/products.php/{id}`
Termék törlése

---

#### Rendeléskezelés

##### GET `/api/admin/orders.php`
Összes rendelés

##### GET `/api/admin/orders.php/{id}`
Rendelés részletei

##### PUT `/api/admin/orders.php/{id}`
Rendelés státuszának frissítése (jóváhagyás)
```json
{
  "statusz": "feldolgozás"
}
```
Lehetséges státuszok: `új`, `feldolgozás`, `fizetve`, `kész`, `stornó`

##### DELETE `/api/admin/orders.php/{id}`
Rendelés törlése

##### GET `/api/admin/orders.php/{id}/invoice`
Számla letöltése HTML formátumban

---

#### Kép feltöltés

##### POST `/api/upload.php`
Kép feltöltése (multipart/form-data)
```
Content-Type: multipart/form-data
Authorization: Bearer {admin_token}

image: [file]
```

Válasz:
```json
{
  "message": "Kép sikeresen feltöltve",
  "url": "/uploads/img_abc123.jpg",
  "filename": "img_abc123.jpg"
}
```

---

## JWT Autentikáció

Minden védett végponthoz JWT tokent kell küldeni:
```
Authorization: Bearer {token}
```

A token a bejelentkezéskor és regisztrációkor érkezik vissza:
```json
{
  "token": "eyJhbGc...",
  "user": { ... }
}
```

Token élettartam: 24 óra

---

## Hibakezelés

HTTP státusz kódok:
- `200` - Sikeres kérés
- `201` - Sikeres létrehozás
- `400` - Hibás kérés (validációs hiba)
- `401` - Nincs autentikáció
- `403` - Nincs jogosultság
- `404` - Nem található
- `409` - Konfliktus (pl. duplikált adat)
- `500` - Szerver hiba

Hibaüzenetek formátuma:
```json
{
  "message": "Hibaüzenet szövege"
}
```

---

## CORS beállítások

A backend engedélyezi a következő origineket:
- `http://localhost:5173` (Vite dev szerver)
- `http://localhost:3000`
- `http://127.0.0.1:5173`

További originek hozzáadása: `backend/config/cors.php`
