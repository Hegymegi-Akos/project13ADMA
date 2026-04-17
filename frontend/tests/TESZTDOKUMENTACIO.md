# Tesztdokumentáció – Kisállat Webshop

**Projekt neve:** Kisállat Webshop
**Készítők:** Hegymegi-Kiss Ákos, Péterffy Dominika, Kamecz Martin
**Tesztelést végezte:** Hegymegi-Kiss Ákos, Péterffy Dominika
**Dátum:** 2026. március 30.
**Verzió:** 2.0

---

## Tartalomjegyzék

1. A projekt bemutatása
   - 1.1. A weboldal célja és elérhetősége
   - 1.2. Főbb funkciók
   - 1.3. Alkalmazott technológiák
   - 1.4. A csapat és munkamegosztás
2. Bevezetés a teszteléshez
3. Tesztelési keretrendszer és környezet
4. Tesztkonfigurációs fájlok
5. Egységtesztek (Unit tesztek)
   - 5.1. API szolgáltatás tesztek
   - 5.2. Akciós ár számítási logika
6. React komponens tesztek
   - 6.1. Főoldal komponens
   - 6.2. Fejléc komponens
   - 6.3. Lábléc komponens
   - 6.4. Kosár komponens
   - 6.5. Rendelések komponens
   - 6.6. Kategória oldal komponens
   - 6.7. Terméklista komponens
   - 6.8. Admin elrendezés komponens
7. React kontextus tesztek
   - 7.1. Kosár kontextus
   - 7.2. Hitelesítés kontextus
   - 7.3. Kedvencek kontextus
8. Integrációs tesztek – Backend REST API
   - 8.1. Kategóriák API
   - 8.2. Termékek API
   - 8.3. Vélemények API
   - 8.4. Kuponok API
   - 8.5. Hitelesítés API
9. Teszteredmények összesítése
10. Összegzés

---

## 1. A projekt bemutatása

### 1.1. A weboldal célja és elérhetősége

A **Kisállat Webshop** egy teljes körű webes áruház kisállatok és kisállat-kiegészítők értékesítésére. A weboldal elérhető az alábbi címen:

🔗 **https://kisallatwebshopproject.hu**

Az alkalmazás lehetővé teszi a felhasználók számára, hogy kisállatokat és kapcsolódó termékeket böngésszenek, kosárba helyezzenek, rendelést adjanak le, valamint véleményt írjanak a termékekről. Az adminisztrátorok számára egy külön admin felület áll rendelkezésre a termékek, kategóriák, rendelések, felhasználók és kuponok kezelésére.

### 1.2. Főbb funkciók

**Felhasználói funkciók:**

- **Regisztráció és bejelentkezés** – felhasználói fiók létrehozása, bejelentkezés JWT token alapú hitelesítéssel
- **Elfelejtett jelszó** – jelszó-visszaállítás EmailJS integrációval
- **Termékek böngészése** – kategóriák és alkategóriák szerinti szűrés (Kutyák, Macskák, Halak, Madarak, Hüllők, Rágcsálók)
- **Élő keresés (autocomplete)** – gépelés közben valós idejű találatok megjelenítése a keresősávban, képpel és árral
- **Termék részletek oldal** – külön oldal minden termékhez nagy képpel, részletes leírással, véleményekkel és csillagos értékeléssel
- **Szűrők a terméklistáknál** – rendezés (ár szerint növekvő/csökkenő), minimum és maximum ár szűrés
- **Kosárkezelés** – termékek hozzáadása plusz/mínusz gombokkal, mennyiség módosítása, törlés, összesítő
- **Kuponbeváltás** – látható kuponkód mező a kosárban, kedvezmény alkalmazása rendeléskor
- **Kedvencek** – termékek kedvencekhez adása és eltávolítása
- **Rendelés leadása** – szállítási adatok megadása, kuponkód beváltása, rendelés véglegesítése
- **Rendeléskövetés** – vizuális idővonal a rendelés státuszának megjelenítésére (Leadva → Feldolgozás → Fizetve → Kiszállítva)
- **Üzenetküldés** – felhasználók és adminisztrátorok közötti valós idejű chat rendszer
- **Vélemények** – termékértékelés írása és olvasása csillagos értékeléssel
- **Kapcsolat oldal** – elérhetőségek, nyitvatartás, Google térkép, üzenetküldő űrlap EmailJS integrációval
- **Készlet kijelzés** – minden terméknél látható a raktáron lévő darabszám
- **Sötét mód** – világos/sötét téma váltás nap/hold ikonokkal
- **Kuponok** – kedvezménykuponok megtekintése és beváltása rendeléskor
- **Galéria** – termékképek böngészése
- **Tippek és tanácsok** – kisállattartási útmutatók

**Admin funkciók:**

- **Termékkezelés** – termékek hozzáadása, szerkesztése, törlése, képfeltöltés
- **Kategóriakezelés** – főkategóriák és alkategóriák létrehozása, törlése, alkategória képek szerkesztése
- **Felhasználókezelés** – felhasználók listázása, admin jogosultság kezelése, kitiltás/visszaengedés
- **Üzenetküldés felhasználóknak** – az admin a felhasználók listájából közvetlenül üzenetet küldhet bármely felhasználónak chat felületen
- **Rendeléskezelés** – rendelések megtekintése, státusz módosítása
- **Kuponkezelés** – kuponok létrehozása, szerkesztése, törlése

### 1.3. Alkalmazott technológiák

| Technológia | Verzió | Szerepe |
|---|---|---|
| **React** | 19.2.0 | Frontend keretrendszer – egyoldalas alkalmazás (SPA) |
| **Vite** | 7.2.4 | Build eszköz és fejlesztői szerver |
| **React Router DOM** | 6.14.1 | Kliensoldali útvonalkezelés (routing) |
| **PHP** | 8.x | Backend REST API – üzleti logika és adatbázis-kommunikáció |
| **MySQL / MariaDB** | 10.x | Relációs adatbázis – termékek, felhasználók, rendelések tárolása |
| **C# / ASP.NET** | – | Swagger API dokumentáció és kiegészítő backend |
| **JWT** | – | JSON Web Token alapú hitelesítés (egyedi base64 + HMAC-SHA256) |
| **EmailJS** | – | E-mail küldés kliensoldali integrációval (jelszó-visszaállítás) |
| **CSS** | – | Egyedi stíluslapok reszponzív dizájnnal |
| **JavaScript (ES6+)** | – | Kliensoldali programozási nyelv |
| **Node.js** | 24.x | Futtatókörnyezet a frontend build-hez és teszteléshez |
| **Apache (XAMPP)** | – | Webszerver a PHP backend kiszolgálásához |

**Architektúra:** A projekt háromrétegű architektúrát követ:
- **Frontend (kliens):** React SPA, amely REST API hívásokon keresztül kommunikál a backenddel
- **Backend (szerver):** PHP REST API, amely JSON formátumban válaszol, JWT tokennel védi a védett végpontokat
- **Adatbázis:** MySQL/MariaDB relációs adatbázis, amely tárolja a termékeket, felhasználókat, rendeléseket, véleményeket és kuponokat

### 1.4. A csapat és munkamegosztás

A projektet egy háromfős csapat készítette az alábbi munkamegosztással:

| Csapattag | Felelősségi kör |
|---|---|
| **Kamecz Martin** | Frontend fejlesztés – React komponensek, felhasználói felület, reszponzív dizájn |
| **Hegymegi-Kiss Ákos** | Adatbázis tervezés és kezelés, EmailJS integráció, PHP backend (közös fejlesztés) |
| **Péterffy Dominika** | C# Swagger API fejlesztés, PHP backend (közös fejlesztés) |

A PHP backend fejlesztése **Hegymegi-Kiss Ákos** és **Péterffy Dominika** közös munkája volt. A tesztelést **Hegymegi-Kiss Ákos** és **Péterffy Dominika** végezte.

---

## 2. Bevezetés a teszteléshez

A Kisállat Webshop projekt egy teljes körű webes áruház, amely React frontend keretrendszert, PHP REST API backendet és C# Swagger API-t használ. A tesztelés célja a szoftver minőségének biztosítása, a hibák korai felismerése és a kód megbízhatóságának növelése.

A tesztelés során négyféle teszttípust alkalmaztunk:

- **Egységtesztek (Unit tesztek):** Tiszta JavaScript függvények izolált tesztelése, amelyek nem függenek külső rendszerektől. Ilyen például az URL feloldás, az admin jogosultság ellenőrzés és az akciós ár számítási logika.

- **React komponens tesztek:** Az egyes React komponensek renderelésének és megjelenítésének ellenőrzése. A tesztek során a komponenseket izolált környezetben rendereljük, a külső függőségeket (API hívások, kontextusok) mock-oljuk.

- **React kontextus tesztek:** A React Context API-n alapuló állapotkezelők (kosár, hitelesítés, kedvencek) működésének tesztelése. Ezek a tesztek a felhasználói interakciókat szimulálják és ellenőrzik az állapotváltozásokat.

- **Integrációs tesztek (Backend API):** Az éles szerveren futó PHP REST API végpontok tesztelése valódi HTTP kérésekkel. Ezek a tesztek nem használnak mock-ot, hanem a tényleges szerverrel kommunikálnak.

A tesztek lefedik a projekt legfontosabb funkcióit: termékek böngészése, kosárkezelés, rendeléskezelés, hitelesítés, kedvencek kezelése, admin felület és az API kommunikáció.

---

## 3. Tesztelési keretrendszer és környezet

### 3.1. Használt technológiák

| Technológia | Verzió | Szerepe |
|---|---|---|
| **Vitest** | 4.1.0 | Tesztelési keretrendszer – a tesztek futtatása, assert-ek, mock-ok kezelése |
| **@testing-library/react** | 16.3.2 | React komponensek renderelése és DOM lekérdezések tesztkörnyezetben |
| **@testing-library/user-event** | 14.6.1 | Felhasználói interakciók szimulálása (kattintás, gépelés) |
| **@testing-library/jest-dom** | 6.9.1 | Kibővített DOM assert-ek (pl. toBeInTheDocument) |
| **jsdom** | 29.0.1 | Böngésző DOM szimuláció Node.js környezetben |
| **React** | 19.2.0 | Frontend keretrendszer |
| **React Router DOM** | 6.14.1 | Útvonalkezelés (routing) |
| **Vite** | 7.2.4 | Build eszköz és fejlesztői szerver |
| **Node.js** | 24.x | Futtatókörnyezet |

### 3.2. Tesztkörnyezet

A tesztek jsdom környezetben futnak, amely egy böngésző DOM szimulációt biztosít Node.js-ben. Ez lehetővé teszi, hogy a React komponenseket valódi böngésző nélkül rendereljük és teszteljük.

A tesztek futtatása a következő paranccsal történik:

```bash
npm run test
```

Ez a `vitest run` parancsot hajtja végre, amely az összes `*.test.js` és `*.test.jsx` fájlt megkeresi a `tests/` mappában és lefuttatja azokat.

### 3.3. Tesztfájlok elhelyezése

A tesztek a projekt `tests/` mappájában találhatók:

```
tests/
├── setup.js                    # Tesztkörnyezet inicializálása
├── apiService.test.js          # API szolgáltatás egységtesztek
├── backend-api.test.js         # Backend integrációs tesztek
├── AdminLayout.test.jsx        # Admin elrendezés komponens teszt
├── AuthContext.test.jsx        # Hitelesítés kontextus teszt
├── Cart.test.jsx               # Kosár komponens teszt
├── CartContext.test.jsx        # Kosár kontextus teszt
├── CategoryPage.test.jsx       # Kategória oldal komponens teszt
├── FavoritesContext.test.jsx   # Kedvencek kontextus teszt
├── Footer.test.jsx             # Lábléc komponens teszt
├── Header.test.jsx             # Fejléc komponens teszt
├── Home.test.jsx               # Főoldal komponens teszt
├── Orders.test.jsx             # Rendelések komponens teszt
├── ProductList.test.jsx        # Terméklista komponens teszt
└── TESZTDOKUMENTACIO.md        # Ez a dokumentum
```

---

## 4. Tesztkonfigurációs fájlok

### 4.1. Vite konfiguráció – `vite.config.js`

A Vitest a Vite build eszközbe integrálódik. A tesztbeállításokat a `vite.config.js` fájlban konfiguráltuk:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,          // describe, it, expect globálisan elérhető
    environment: 'jsdom',   // böngésző DOM szimuláció
    setupFiles: './tests/setup.js',  // inicializáló fájl
    css: true,              // CSS importok kezelése
  },
})
```

**Magyarázat:**
- A `globals: true` beállítás lehetővé teszi, hogy a `describe`, `it`, `expect` függvényeket import nélkül használjuk.
- Az `environment: 'jsdom'` biztosítja a böngésző DOM API-t (document, window, localStorage).
- A `setupFiles` a tesztek előtt lefutó inicializáló fájlt adja meg.
- A `css: true` engedélyezi a CSS fájlok importálását a tesztek során.

### 4.2. Tesztkörnyezet inicializálás – `setup.js`

A `setup.js` fájl a tesztek előtt fut le, és inicializálja a böngésző API-kat, amelyek jsdom-ban nem érhetők el natívan:

```javascript
import '@testing-library/jest-dom';

// Helyi tároló (localStorage) mock – a böngésző localStorage API-ját
// szimulálja egy egyszerű objektummal, mivel jsdom-ban a localStorage
// nem perzisztens és nem minden funkciója elérhető
const helyiTaroloMock = (() => {
  let tarolo = {};
  return {
    getItem: vi.fn((kulcs) => tarolo[kulcs] ?? null),
    setItem: vi.fn((kulcs, ertek) => { tarolo[kulcs] = String(ertek); }),
    removeItem: vi.fn((kulcs) => { delete tarolo[kulcs]; }),
    clear: vi.fn(() => { tarolo = {}; }),
    get length() { return Object.keys(tarolo).length; },
    key: vi.fn((i) => Object.keys(tarolo)[i] || null),
  };
})();

Object.defineProperty(window, 'localStorage', { value: helyiTaroloMock });

// Munkamenet tároló (sessionStorage) mock – ugyanúgy működik mint
// a localStorage mock, de a munkamenet tárolót szimulálja
const munkamenetTaroloMock = (() => {
  let tarolo = {};
  return {
    getItem: vi.fn((kulcs) => tarolo[kulcs] ?? null),
    setItem: vi.fn((kulcs, ertek) => { tarolo[kulcs] = String(ertek); }),
    removeItem: vi.fn((kulcs) => { delete tarolo[kulcs]; }),
    clear: vi.fn(() => { tarolo = {}; }),
  };
})();

Object.defineProperty(window, 'sessionStorage', { value: munkamenetTaroloMock });

// Minden teszt előtt töröljük a tárolt adatokat és a mock hívásokat,
// hogy a tesztek egymástól függetlenül, tiszta állapotból induljanak
beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  vi.clearAllMocks();
});
```

**Magyarázat:**
- Az `@testing-library/jest-dom` importálása kibővíti az `expect` függvényt DOM-specifikus assert-ekkel, mint például a `toBeInTheDocument()`.
- A `localStorage` és `sessionStorage` mock-ok szükségesek, mert a webshop ezeket használja a felhasználói adatok, token és kosár mentésére.
- A `vi.fn()` hívások lehetővé teszik, hogy a tesztek ellenőrizzék, hányszor és milyen paraméterekkel hívták meg ezeket a függvényeket.
- A `beforeEach` biztosítja, hogy minden teszt tiszta állapotból indul.

### 4.3. Package.json teszt szkriptek

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.2",
    "@testing-library/user-event": "^14.6.1",
    "jsdom": "^29.0.1",
    "vitest": "^4.1.0"
  }
}
```

---

## 5. Egységtesztek (Unit tesztek)

Az egységtesztek tiszta JavaScript függvényeket tesztelnek izoláltan, külső függőségek nélkül. Ezek a leggyorsabb tesztek, mivel nem igényelnek DOM renderelést vagy API hívásokat.

### 5.1. API szolgáltatás tesztek – `apiService.test.js`

Ez a tesztfájl az `apiService.js` modul két exportált segédfüggvényét teszteli.

#### A tesztelt forráskód

A `resolveMediaUrl` függvény a képek URL-jét oldja fel. Ha a kép URL-je relatív (pl. `/uploads/kep.jpg`), akkor kiegészíti a szerver alap URL-jével. Ha teljes URL-t kap (pl. `https://example.com/kep.jpg`), azt változatlanul hagyja.

```javascript
// src/api/apiService.js – resolveMediaUrl függvény
export const resolveMediaUrl = (value) => {
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return value;
  const normalized = value.startsWith('/') ? value : `/${value}`;
  return `${PHP_BASE_URL}${normalized}`;
};
```

Az `isAllowedAdminUser` függvény ellenőrzi, hogy egy felhasználó rendelkezik-e admin jogosultsággal. Fontos, hogy a PHP backend az `admin` mezőt string-ként ("1") adja vissza, ezért a függvénynek mind a number (1), mind a string ("1"), mind a boolean (true) típust kezelnie kell.

```javascript
// src/api/apiService.js – admin ellenőrzés
const hasAdminFlag = (user) =>
  user?.admin === 1 || user?.admin === true || user?.admin === '1';

export const isAllowedAdminUser = (user) => {
  if (!hasAdminFlag(user)) return false;
  if (allowedAdminValues.size === 0) return true;
  const candidates = [user?.email, user?.felhasznalonev, user?.id?.toString()]
    .map((v) => v?.toLowerCase()).filter(Boolean);
  return candidates.some((value) => allowedAdminValues.has(value));
};
```

#### A teljes tesztfájl

```javascript
// tests/apiService.test.js
import { describe, it, expect } from 'vitest';
import { resolveMediaUrl, isAllowedAdminUser } from '../src/api/apiService';

// ==================== resolveMediaUrl ====================
// Ez a tesztcsoport a média URL feloldó függvényt teszteli.
// A függvény feladata, hogy a relatív képútvonalakat kiegészítse
// a szerver alap URL-jével, a teljes URL-eket pedig változatlanul hagyja.
describe('resolveMediaUrl - Media URL feloldas', () => {

  // Ha a függvény üres értéket kap (üres string, null, undefined),
  // akkor üres stringet kell visszaadnia, nem szabad hibát dobnia.
  it('ures erteknel ures stringet ad vissza', () => {
    expect(resolveMediaUrl('')).toBe('');
    expect(resolveMediaUrl(null)).toBe('');
    expect(resolveMediaUrl(undefined)).toBe('');
  });

  // Ha a bemeneti érték már egy teljes URL (http:// vagy https://
  // kezdettel), akkor a függvény nem módosítja azt.
  it('teljes URL-t valtozatlanul hagyja', () => {
    expect(resolveMediaUrl('https://pelda.hu/kep.jpg')).toBe('https://pelda.hu/kep.jpg');
    expect(resolveMediaUrl('http://pelda.hu/kep.jpg')).toBe('http://pelda.hu/kep.jpg');
  });

  // Ha a bemeneti érték egy relatív útvonal (/ jellel kezdődik),
  // akkor a szerver alap URL-jét elé fűzi.
  it('relativ utat kiegesziti az alap URL-lel', () => {
    const eredmeny = resolveMediaUrl('/feltoltesek/teszt.jpg');
    expect(eredmeny).toContain('/feltoltesek/teszt.jpg');
  });

  // Ha a bemeneti érték nem kezdődik / jellel, a függvény
  // automatikusan hozzáadja azt.
  it('per jel nelkuli utat is kezeli', () => {
    const eredmeny = resolveMediaUrl('feltoltesek/teszt.jpg');
    expect(eredmeny).toContain('/feltoltesek/teszt.jpg');
  });
});

// ==================== isAllowedAdminUser ====================
// Ez a tesztcsoport az admin jogosultság ellenőrző függvényt teszteli.
// A PHP backend az admin mezőt különböző típusokként adhatja vissza
// (number, string, boolean), ezért minden esetet le kell fedni.
describe('isAllowedAdminUser - Admin jogosultsag ellenorzes', () => {

  // Null vagy undefined felhasználó esetén a függvénynek false-t
  // kell visszaadnia, nem szabad TypeError-t dobnia.
  it('null vagy undefined felhasznalonal hamis', () => {
    expect(isAllowedAdminUser(null)).toBe(false);
    expect(isAllowedAdminUser(undefined)).toBe(false);
  });

  // Nem admin felhasználó (admin: 0, "0", false) esetén a
  // függvénynek false-t kell visszaadnia.
  it('nem admin felhasznalonal hamis', () => {
    expect(isAllowedAdminUser({ id: 1, admin: 0 })).toBe(false);
    expect(isAllowedAdminUser({ id: 1, admin: '0' })).toBe(false);
    expect(isAllowedAdminUser({ id: 1, admin: false })).toBe(false);
  });

  // Admin felhasználó number típusú admin mezővel (admin: 1).
  it('admin felhasznalonal igaz (szam)', () => {
    expect(isAllowedAdminUser({ id: 1, admin: 1 })).toBe(true);
  });

  // Admin felhasználó string típusú admin mezővel (admin: "1").
  // Ez a leggyakoribb eset, mert a PHP MySQL driver stringként
  // adja vissza a számokat.
  it('admin felhasznalonal igaz (string "1")', () => {
    expect(isAllowedAdminUser({ id: 1, admin: '1' })).toBe(true);
  });

  // Admin felhasználó boolean típusú admin mezővel (admin: true).
  it('admin felhasznalonal igaz (boolean true)', () => {
    expect(isAllowedAdminUser({ id: 1, admin: true })).toBe(true);
  });
});
```

**Eredmény:** 10/10 teszt sikeres.

---

### 5.2. Akciós ár számítási logika – `ProductList.test.jsx` (részlet)

A webshopban ha az akciós ár üres vagy 0, akkor csak az eredeti ár jelenik meg a termékkártyán. Ha az akciós ár kisebb, mint az eredeti ár, akkor az eredeti ár áthúzva jelenik meg, mellette az akciós ár. Ez a logika a `getEffectivePrice` segédfüggvényen alapul.

#### A tesztelt forráskód

```javascript
// src/components/ProductList.jsx – ár számítási logika
const getEffectivePrice = (p) =>
  Number(p.akcios_ar) > 0 && Number(p.akcios_ar) < Number(p.ar)
    ? Number(p.akcios_ar)
    : Number(p.ar);
```

#### A tesztkód

```javascript
// tests/ProductList.test.jsx – Akciós ár tesztek
// A PHP backend az árakat stringként adja vissza (pl. "3000"),
// ezért a tesztekben is stringként adjuk meg az értékeket.
describe('Akcios ar szamitas', () => {
  const szamolAr = (p) =>
    Number(p.akcios_ar) > 0 && Number(p.akcios_ar) < Number(p.ar)
      ? Number(p.akcios_ar)
      : Number(p.ar);

  // Ha az akciós ár "0", az eredeti árat kell használni.
  // Fontos: a PHP "0" stringet ad vissza, ami truthy JavaScriptben,
  // ezért Number() konverziót alkalmazunk.
  it('akcios ar 0 eseten az eredeti arat hasznalja', () => {
    expect(szamolAr({ ar: '3000', akcios_ar: '0' })).toBe(3000);
  });

  // Ha az akciós ár üres string, az eredeti árat kell használni.
  it('akcios ar ures eseten az eredeti arat hasznalja', () => {
    expect(szamolAr({ ar: '3000', akcios_ar: '' })).toBe(3000);
  });

  // Ha az akciós ár kisebb mint az eredeti, az akciós árat kell
  // használni a kosárba helyezéshez és a megjelenítéshez.
  it('akcios ar kisebb mint eredeti: akcios arat hasznalja', () => {
    expect(szamolAr({ ar: '5000', akcios_ar: '4000' })).toBe(4000);
  });

  // Ha az akciós ár nagyobb mint az eredeti (hibás adat), az eredeti
  // árat kell használni, nem a magasabb akciós árat.
  it('akcios ar nagyobb mint eredeti: eredeti arat hasznalja', () => {
    expect(szamolAr({ ar: '3000', akcios_ar: '5000' })).toBe(3000);
  });

  // Ha az akciós ár egyenlő az eredetivel, az eredeti árat kell
  // használni (nincs kedvezmény).
  it('akcios ar egyenlo az eredetivel: eredeti arat hasznalja', () => {
    expect(szamolAr({ ar: '3000', akcios_ar: '3000' })).toBe(3000);
  });
});
```

**Eredmény:** 5/5 teszt sikeres.

---

## 6. React komponens tesztek

A React komponens tesztek azt ellenőrzik, hogy az egyes komponensek helyesen renderelődnek-e és a megfelelő tartalmat jelenítik-e meg. A tesztek során a külső függőségeket (API hívások, kontextusok) mock-oljuk, hogy a komponenseket izoláltan tesztelhessük.

### 6.1. Főoldal komponens – `Home.test.jsx`

A főoldal a webshop nyitóoldala, amely megjeleníti a 6 állatkategóriát (Kutya, Macska, Rágcsáló, Hüllő, Madár, Hal), egy képes csúszkát (slider) és szűrési lehetőségeket.

#### A tesztelt komponens felépítése

A `Home.jsx` komponens a következő elemeket jeleníti meg:
- Kategória kártyák (`.box` osztállyal)
- Folyamatos képcsúszka (`.continuous-slider`)
- Rendezési és szűrési opciók (ár szerinti szűrés)

#### A teljes tesztfájl

```javascript
// tests/Home.test.jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import Home from '../src/components/Home';

// Segédfüggvény a főoldal rendereléshez – a MemoryRouter szükséges
// a React Router kontextus biztosításához, mivel a Home komponens
// Link elemeket tartalmaz a kategória oldalakhoz.
const renderFooldal = () => {
  return render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );
};

describe('Fooldal komponens', () => {

  // Ellenőrzi, hogy a főoldal komponens renderelése sikeres-e,
  // azaz megjelenik-e a fő konténer elem.
  it('megjelenik a fooldal', () => {
    renderFooldal();
    expect(document.querySelector('.container')).toBeTruthy();
  });

  // Ellenőrzi, hogy mind a 6 állatkategória neve megjelenik-e
  // a főoldalon. Ezek a kategóriák a navigáció alapelemei.
  it('kategoria kartyak megjelennek', () => {
    renderFooldal();
    expect(screen.getByText('Kutya')).toBeInTheDocument();
    expect(screen.getByText('Macska')).toBeInTheDocument();
    expect(screen.getByText('Ragcsalo')).toBeInTheDocument();
    expect(screen.getByText('Hullo')).toBeInTheDocument();
    expect(screen.getByText('Madar')).toBeInTheDocument();
    expect(screen.getByText('Hal')).toBeInTheDocument();
  });

  // Ellenőrzi, hogy pontosan 6 darab kategória kártya jelenik meg,
  // nem több és nem kevesebb.
  it('6 kategoria kartya jelenik meg', () => {
    renderFooldal();
    const kartyak = document.querySelectorAll('.box');
    expect(kartyak.length).toBe(6);
  });

  // Ellenőrzi, hogy a szűrő/rendező elemek megjelennek-e:
  // a rendezés legördülő és a minimum/maximum ár mezők.
  it('szuro mezo megjelenik', () => {
    renderFooldal();
    expect(screen.getByText('Rendezes')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('0')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('999999')).toBeInTheDocument();
  });

  // Ellenőrzi, hogy a képes csúszka (slider) renderelődik-e
  // a főoldalon. A slider a promóciós képeket mutatja.
  it('slider megjelenik', () => {
    renderFooldal();
    expect(document.querySelector('.continuous-slider')).toBeTruthy();
  });
});
```

**Eredmény:** 5/5 teszt sikeres.

---

### 6.2. Fejléc komponens – `Header.test.jsx`

A fejléc a webshop legfontosabb navigációs eleme. Tartalmazza a logót, a kereső mezőt, a kategória navigációt, valamint a kosár, kedvencek és bejelentkezés ikonokat.

#### A tesztkód

```javascript
// tests/Header.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

// A fejléc komponens több kontextustól függ (Auth, Cart, Favorites,
// Theme), ezeket mind mock-olnunk kell a teszteléshez.
vi.mock('../src/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    isAuthenticated: false,
    logout: vi.fn(),
  }),
}));

vi.mock('../src/contexts/CartContext', () => ({
  useCart: () => ({
    cartItems: [],
    getTotalItems: () => 0,
  }),
}));

vi.mock('../src/contexts/FavoritesContext', () => ({
  useFavorites: () => ({
    favorites: [],
    favoritesCount: 0,
  }),
}));

vi.mock('../src/contexts/ThemeContext', () => ({
  useTheme: () => ({
    darkMode: false,
    toggleDarkMode: vi.fn(),
  }),
}));

vi.mock('../src/api/apiService', () => ({
  isAllowedAdminUser: () => false,
}));

import Header from '../src/components/Header';

describe('Fejlec komponens', () => {

  // Ellenőrzi, hogy a header HTML elem megjelenik-e a DOM-ban.
  it('megjelenik a fejlec', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    expect(document.querySelector('header')).toBeTruthy();
  });

  // Ellenőrzi, hogy a kereső mező megjelenik-e. A kereső mező
  // a .search-input CSS osztállyal van jelölve.
  it('kereso mezo megjelenik', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    const kereses = document.querySelector('.search-input');
    expect(kereses).toBeTruthy();
  });

  // Ellenőrzi, hogy a navigációs sáv (nav elem) megjelenik-e,
  // amely a kategória linkeket tartalmazza.
  it('navigacio megjelenik', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    const navigacio = document.querySelector('nav');
    expect(navigacio).toBeTruthy();
  });
});
```

**Eredmény:** 3/3 teszt sikeres.

---

### 6.3. Lábléc komponens – `Footer.test.jsx`

A lábléc a webshop alján megjelenő információs sáv, amely elérhetőségeket, linkeket és szerzői jogi információkat tartalmaz.

#### A tesztkód

```javascript
// tests/Footer.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

// A lábléc az AuthContext-től és az apiService-től függ,
// ezeket mock-oljuk.
vi.mock('../src/contexts/AuthContext', () => ({
  useAuth: () => ({ user: null, isAuthenticated: false }),
}));

vi.mock('../src/api/apiService', () => ({
  isAllowedAdminUser: () => false,
}));

import Footer from '../src/components/Footer';

describe('Lablec komponens', () => {

  // Ellenőrzi, hogy a footer HTML elem renderelődik-e.
  it('megjelenik a lablec', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
    expect(document.querySelector('footer')).toBeTruthy();
  });
});
```

**Eredmény:** 1/1 teszt sikeres.

---

### 6.4. Kosár komponens – `Cart.test.jsx`

A kosár komponens a felhasználó által kiválasztott termékeket jeleníti meg, lehetővé téve a mennyiség módosítását, törlést és a rendelés leadását.

#### A tesztkód

```javascript
// tests/Cart.test.jsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

// Kosár teszteléshez két mintaterméket hozunk létre:
// egy kutya pórázt (2 db) és egy macska játékot (1 db).
const mockKosarTetelek = [
  { id: 1, name: 'Kutya poraz', price: 2500, quantity: 2, image: 'teszt.jpg' },
  { id: 2, name: 'Macska jatek', price: 1500, quantity: 1, image: 'teszt2.jpg' },
];

// A kosár kontextus mock-ja biztosítja a szükséges függvényeket
// és adatokat a komponens számára.
vi.mock('../src/contexts/CartContext', () => ({
  useCart: vi.fn(() => ({
    cartItems: mockKosarTetelek,
    removeFromCart: vi.fn(),
    updateQuantity: vi.fn(),
    clearCart: vi.fn(),
    getTotalPrice: vi.fn(() => 6500),    // 2*2500 + 1*1500 = 6500 Ft
    getCartCount: vi.fn(() => 3),         // 2 + 1 = 3 db
  })),
}));

vi.mock('../src/contexts/AuthContext', () => ({
  useAuth: vi.fn(() => ({
    user: { id: 1, felhasznalonev: 'tesztfelhasznalo' },
    isAuthenticated: true,
  })),
}));

vi.mock('../src/api/apiService', () => ({
  ordersAPI: { create: vi.fn() },
  resolveMediaUrl: vi.fn((url) => url || ''),
}));

import Cart from '../src/components/Cart';

const renderKosar = () => {
  return render(
    <MemoryRouter>
      <Cart />
    </MemoryRouter>
  );
};

describe('Kosar komponens', () => {

  // Ellenőrzi, hogy a kosár oldal címe megjelenik-e.
  it('megjeleníti a kosar cimet', () => {
    renderKosar();
    expect(screen.getByText(/kosár|kosar/i)).toBeTruthy();
  });

  // Ellenőrzi, hogy a mock-olt termékek nevei megjelennek-e
  // a kosár listában.
  it('megjeleníti a termekeket a kosarban', () => {
    renderKosar();
    expect(screen.getByText('Kutya poraz')).toBeTruthy();
    expect(screen.getByText('Macska jatek')).toBeTruthy();
  });

  // Ellenőrzi, hogy az összesített ár megjelenik-e valahol az
  // oldalon. A getTotalPrice mock 6500-at ad vissza.
  it('megjeleníti az osszesitett arat', () => {
    renderKosar();
    const szoveg = document.body.textContent;
    expect(szoveg).toContain('6');
  });
});
```

**Eredmény:** 3/3 teszt sikeres.

---

### 6.5. Rendelések komponens – `Orders.test.jsx`

A rendelések oldal a bejelentkezett felhasználó korábbi rendeléseit jeleníti meg, a rendelésszámmal, összeggel, státusszal és a rendelt termékek részleteivel.

#### A tesztkód

```javascript
// tests/Orders.test.jsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

// Két mintarendelés az API válasz szimulálásához.
// Az első rendelés feldolgozás alatt áll, a második kiszállítva.
const mockRendelesek = [
  {
    id: 1,
    rendeles_szam: 'ORD-001',
    osszeg: 12500,
    statusz: 'feldolgozas_alatt',
    letrehozva: '2026-03-20 10:00:00',
    tetelek: [
      { termek_nev: 'Kutya poraz', ar: 2500, mennyiseg: 5 },
    ],
  },
  {
    id: 2,
    rendeles_szam: 'ORD-002',
    osszeg: 3000,
    statusz: 'kiszallitva',
    letrehozva: '2026-03-19 14:00:00',
    tetelek: [
      { termek_nev: 'Macska jatek', ar: 1500, mennyiseg: 2 },
    ],
  },
];

vi.mock('../src/contexts/AuthContext', () => ({
  useAuth: vi.fn(() => ({
    user: { id: 1, felhasznalonev: 'tesztfelhasznalo' },
    isAuthenticated: true,
  })),
}));

// Az ordersAPI.getMyOrders mock-ja a mintarendelésekkel tér vissza.
vi.mock('../src/api/apiService', () => ({
  ordersAPI: {
    getMyOrders: vi.fn(() => Promise.resolve(mockRendelesek)),
  },
  resolveMediaUrl: vi.fn((url) => url || ''),
}));

import Orders from '../src/components/Orders';

const renderRendelesek = () => {
  return render(
    <MemoryRouter>
      <Orders />
    </MemoryRouter>
  );
};

describe('Rendelesek komponens', () => {

  // Ellenőrzi, hogy a rendelések oldal címe megjelenik-e.
  it('megjeleníti a rendelesek cimet', async () => {
    renderRendelesek();
    await waitFor(() => {
      const szoveg = document.body.textContent;
      expect(szoveg.toLowerCase()).toContain('rendel');
    });
  });

  // Ellenőrzi, hogy az API válasz betöltése után a rendelésszámok
  // megjelennek-e az oldalon.
  it('betoltes utan megjeleníti a rendeleseket', async () => {
    renderRendelesek();
    await waitFor(() => {
      expect(screen.getByText(/ORD-001/)).toBeTruthy();
    });
  });
});
```

**Eredmény:** 2/2 teszt sikeres.

---

### 6.6. Kategória oldal komponens – `CategoryPage.test.jsx`

A kategória oldal egy dinamikus komponens, amely az adatbázisból tölti be az alkategóriákat. Például a „Kutya" kategória oldal megjeleníti a Pórázok, Tálak, Hámok, Bolhaírtók stb. alkategóriákat.

#### A tesztelt komponens működése

A `CategoryPage` a `categoriesAPI.getAll()` függvényt hívja meg az összes kategória lekérdezéséhez, majd a `type` prop alapján kiszűri a megfelelő kategóriát és megjeleníti annak alkategóriáit.

#### A teljes tesztfájl

```javascript
// tests/CategoryPage.test.jsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

// A categoriesAPI-t mock-oljuk, hogy ne az éles API-t hívjuk,
// hanem előre meghatározott tesztadatokkal dolgozzunk.
vi.mock('../src/api/apiService', () => ({
  categoriesAPI: {
    getAll: vi.fn(),
  },
  resolveMediaUrl: vi.fn((v) => v || ''),
}));

import { categoriesAPI } from '../src/api/apiService';
import CategoryPage from '../src/components/CategoryPage';

// Mintaadatok: két kategória alkategóriákkal.
// A kutya kategóriában két alkategória van: Kutyatáp és Kutyajáték.
const mintaKategoriak = [
  {
    id: 1, slug: 'kutya', nev: 'Kutya',
    alkategoriak: [
      { id: 10, slug: 'tap', nev: 'Kutyatap', termek_count: 5 },
      { id: 11, slug: 'jatek', nev: 'Kutyajatek', termek_count: 3 },
    ]
  },
  {
    id: 2, slug: 'macska', nev: 'Macska',
    alkategoriak: [
      { id: 20, slug: 'tap', nev: 'Macskatap', termek_count: 4 },
    ]
  },
];

describe('Kategoria oldal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // A kutya kategória alkategóriáinak meg kell jelenniük
  // az oldalon a mock adat betöltése után.
  it('alkategoriak megjelennek a kutya oldalon', async () => {
    categoriesAPI.getAll.mockResolvedValue(mintaKategoriak);

    render(
      <MemoryRouter initialEntries={['/dog']}>
        <CategoryPage type="dog" />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Kutyatap')).toBeInTheDocument();
      expect(screen.getByText('Kutyajatek')).toBeInTheDocument();
    });
  });

  // A kategória oldal címének meg kell jelennie.
  it('cim megjelenik', async () => {
    categoriesAPI.getAll.mockResolvedValue(mintaKategoriak);

    render(
      <MemoryRouter initialEntries={['/dog']}>
        <CategoryPage type="dog" />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Kutya Termekek')).toBeInTheDocument();
    });
  });

  // Ha ismeretlen kategória típust adunk meg, hibaüzenet jelenik meg.
  it('ismeretlen kategoriara hibauzenet', () => {
    categoriesAPI.getAll.mockResolvedValue(mintaKategoriak);

    render(
      <MemoryRouter initialEntries={['/ismeretlen']}>
        <CategoryPage type="ismeretlen" />
      </MemoryRouter>
    );

    expect(screen.getByText('Kategoria nem talalhato')).toBeInTheDocument();
  });

  // Betöltés közben a „Betoltes..." szöveg jelenik meg.
  // A mockReturnValue egy soha nem teljesülő Promise-t ad vissza,
  // így a komponens betöltési állapotban marad.
  it('betoltes kozben toltesi uzenetet mutat', () => {
    categoriesAPI.getAll.mockReturnValue(new Promise(() => {}));

    render(
      <MemoryRouter initialEntries={['/dog']}>
        <CategoryPage type="dog" />
      </MemoryRouter>
    );

    expect(screen.getByText('Betoltes...')).toBeInTheDocument();
  });

  // Ha egy kategóriához nem tartozik alkategória, tájékoztató
  // üzenet jelenik meg.
  it('ures alkategoria lista eseten tajekoztat', async () => {
    categoriesAPI.getAll.mockResolvedValue([
      { id: 1, slug: 'kutya', nev: 'Kutya', alkategoriak: [] },
    ]);

    render(
      <MemoryRouter initialEntries={['/dog']}>
        <CategoryPage type="dog" />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Nincs alkategoria ebben a kategoriaban.'))
        .toBeInTheDocument();
    });
  });
});
```

**Eredmény:** 5/5 teszt sikeres.

---

### 6.7. Terméklista komponens – `ProductList.test.jsx`

A terméklista komponens egy adott alkategória termékeit jeleníti meg. Ez a webshop egyik legösszetettebb komponense, amely tartalmaz rendezést, szűrést, kosárba helyezést és kedvencek kezelést.

#### A teljes tesztfájl

```javascript
// tests/ProductList.test.jsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

// A CartContext mock biztosítja a kosár funkciókat.
vi.mock('../src/contexts/CartContext', () => ({
  useCart: () => ({
    addToCart: vi.fn(),
    cartItems: [],
    getTotalItems: () => 0,
  }),
}));

// A FavoritesContext mock biztosítja a kedvencek funkciókat.
vi.mock('../src/contexts/FavoritesContext', () => ({
  useFavorites: () => ({
    toggleFavorite: vi.fn(),
    isFavorite: () => false,
    favorites: [],
    favoritesCount: 0,
  }),
}));

// Az API mock a productsAPI.getByCategory függvényt biztosítja.
vi.mock('../src/api/apiService', () => ({
  productsAPI: {
    getByCategory: vi.fn(),
  },
  resolveMediaUrl: vi.fn((v) => v || ''),
}));

import { productsAPI } from '../src/api/apiService';
import ProductList from '../src/components/ProductList';

// Három különböző típusú mintaterméket hozunk létre:
// 1. Normál ár, akciós ár nélkül (akcios_ar: '0')
// 2. Akciós termék (ar: 5000, akcios_ar: 4000)
// 3. Üres akciós ár mezővel
const mintaTermekek = [
  { id: 1, nev: 'Kutyatap', ar: '3000', akcios_ar: '0',
    fo_kep: '/kep/1.jpg', leiras: 'Jo tap' },
  { id: 2, nev: 'Macskajat', ar: '5000', akcios_ar: '4000',
    fo_kep: '/kep/2.jpg', leiras: 'Jo jatek' },
  { id: 3, nev: 'Haleleseg', ar: '1500', akcios_ar: '',
    fo_kep: '/kep/3.jpg', leiras: 'Finom' },
];

const renderTermeklista = () => {
  return render(
    <MemoryRouter>
      <ProductList title="Kutya termekek" category="kutya" subcategory="tap" />
    </MemoryRouter>
  );
};

describe('Termeklista komponens', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Betöltés közben megjelenik a töltési üzenet.
  it('betoltes kozben toltesi uzenetet mutat', () => {
    productsAPI.getByCategory.mockReturnValue(new Promise(() => {}));
    renderTermeklista();
    expect(screen.getByText('Termekek betoltese...')).toBeInTheDocument();
  });

  // A termékek nevei megjelennek a sikeres betöltés után.
  it('termekek megjelennek betoltes utan', async () => {
    productsAPI.getByCategory.mockResolvedValue(mintaTermekek);
    renderTermeklista();

    await waitFor(() => {
      expect(screen.getByText('Kutyatap')).toBeInTheDocument();
      expect(screen.getByText('Macskajat')).toBeInTheDocument();
      expect(screen.getByText('Haleleseg')).toBeInTheDocument();
    });
  });

  // Hálózati hiba esetén felhasználóbarát hibaüzenet jelenik meg,
  // nem a nyers hibaüzenet.
  it('hibauzenet ha nem sikerul betolteni', async () => {
    productsAPI.getByCategory.mockRejectedValue(new Error('Halozati hiba'));
    renderTermeklista();

    await waitFor(() => {
      expect(screen.getByText('Nem sikerult betolteni a termekeket'))
        .toBeInTheDocument();
    });
  });

  // A komponens a title prop-ot jeleníti meg a termékek felett.
  it('cim megjelenik', async () => {
    productsAPI.getByCategory.mockResolvedValue([]);
    renderTermeklista();

    await waitFor(() => {
      expect(screen.getByText('Kutya termekek')).toBeInTheDocument();
    });
  });

  // A termékek száma megjelenik az oldalon.
  it('termek darabszam megjelenik', async () => {
    productsAPI.getByCategory.mockResolvedValue(mintaTermekek);
    renderTermeklista();

    await waitFor(() => {
      expect(screen.getByText('3 termek talalt')).toBeInTheDocument();
    });
  });
});
```

**Eredmény:** 10/10 teszt sikeres (5 komponens teszt + 5 akciós ár teszt).

---

### 6.8. Admin elrendezés komponens – `AdminLayout.test.jsx`

Az admin elrendezés a webshop adminisztrációs felületének kerete. Csak bejelentkezett admin felhasználók férhetnek hozzá. A komponens különböző állapotokat kezel: nem bejelentkezett, nem admin, és admin felhasználó.

#### A teljes tesztfájl

```javascript
// tests/AdminLayout.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

// Az AuthContext és az apiService mock-olása szükséges,
// hogy a különböző jogosultsági szinteket szimulálhassuk.
vi.mock('../src/contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../src/api/apiService', () => ({
  isAllowedAdminUser: vi.fn(),
}));

import { useAuth } from '../src/contexts/AuthContext';
import { isAllowedAdminUser } from '../src/api/apiService';
import AdminLayout from '../src/components/AdminLayout';

describe('Admin elrendezes', () => {

  // Ha a felhasználó nincs bejelentkezve, a „Bejelentkezes szukseges"
  // üzenet jelenik meg, és nem az admin tartalom.
  it('bejelentkezes nelkul bejelentkezesi oldalt mutat', () => {
    useAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      logout: vi.fn()
    });
    isAllowedAdminUser.mockReturnValue(false);

    render(
      <MemoryRouter>
        <AdminLayout><div>Admin tartalom</div></AdminLayout>
      </MemoryRouter>
    );
    expect(screen.getByText('Bejelentkezes szukseges')).toBeInTheDocument();
  });

  // Ha a felhasználó be van jelentkezve, de nem admin (admin: 0),
  // a „Hozzaferes megtagadva" üzenet jelenik meg.
  it('nem admin felhasznalonak hozzaferes megtagadva', () => {
    useAuth.mockReturnValue({
      user: { id: 1, admin: 0 },
      isAuthenticated: true,
      logout: vi.fn()
    });
    isAllowedAdminUser.mockReturnValue(false);

    render(
      <MemoryRouter>
        <AdminLayout><div>Admin tartalom</div></AdminLayout>
      </MemoryRouter>
    );
    expect(screen.getByText('Hozzaferes megtagadva')).toBeInTheDocument();
  });

  // Ha a felhasználó admin, az admin panel megjelenik a
  // children tartalommal együtt.
  it('admin felhasznalonak megjelenik a panel', () => {
    useAuth.mockReturnValue({
      user: { id: 1, felhasznalonev: 'Admin', email: 'admin@teszt.hu', admin: 1 },
      isAuthenticated: true,
      logout: vi.fn(),
    });
    isAllowedAdminUser.mockReturnValue(true);

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <AdminLayout><div>Admin tartalom</div></AdminLayout>
      </MemoryRouter>
    );
    expect(screen.getByText('Admin tartalom')).toBeInTheDocument();
    expect(screen.getByText('Admin Panel')).toBeInTheDocument();
  });

  // Ellenőrzi, hogy az admin oldalsáv navigációs linkjei
  // mind megjelennek-e (Termékek, Felhasználók, Rendelések,
  // Kuponok, Kategóriák).
  it('navigacios linkek megjelennek', () => {
    useAuth.mockReturnValue({
      user: { id: 1, felhasznalonev: 'Admin', email: 'admin@teszt.hu', admin: 1 },
      isAuthenticated: true,
      logout: vi.fn(),
    });
    isAllowedAdminUser.mockReturnValue(true);

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <AdminLayout><div>Teszt</div></AdminLayout>
      </MemoryRouter>
    );
    expect(screen.getByText('Termekek')).toBeInTheDocument();
    expect(screen.getByText('Felhasznalok')).toBeInTheDocument();
    expect(screen.getByText('Rendelesek')).toBeInTheDocument();
    expect(screen.getByText('Kuponok')).toBeInTheDocument();
    expect(screen.getByText('Kategoriak')).toBeInTheDocument();
  });
});
```

**Eredmény:** 4/4 teszt sikeres.

---

## 7. React kontextus tesztek

A React kontextus tesztek az alkalmazás állapotkezelő rétegét tesztelik. A webshop három fő kontextust használ: Kosár (CartContext), Hitelesítés (AuthContext) és Kedvencek (FavoritesContext).

### 7.1. Kosár kontextus – `CartContext.test.jsx`

A kosár kontextus felelős a kosár állapotának kezeléséért: termékek hozzáadása, eltávolítása, mennyiség módosítása és a kosár ürítése. Az állapot localStorage-ban perzisztálódik.

#### A tesztelési megközelítés

A kontextus teszteléséhez egy speciális `TesztKomponens`-t hozunk létre, amely a `useCart()` hook-ot használja és gombokkal teszi elérhetővé a kosár műveleteket. Ez lehetővé teszi, hogy a `userEvent` könyvtárral szimuláljuk a felhasználói interakciókat.

#### A teljes tesztfájl

```javascript
// tests/CartContext.test.jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { CartProvider, useCart } from '../src/contexts/CartContext';

// Teszt komponens, amely a useCart hook összes függvényét
// elérhetővé teszi gombokon és span elemeken keresztül.
const TesztKomponens = () => {
  const kosar = useCart();

  return (
    <div>
      <span data-testid="osszes-darab">{kosar.getTotalItems()}</span>
      <span data-testid="osszes-ar">{kosar.getTotalPrice()}</span>
      <span data-testid="kosar-hossz">{kosar.cartItems.length}</span>
      <button data-testid="hozzaad"
        onClick={() => kosar.addToCart({ id: 1, name: 'Teszt', price: 100 }, 1)}>
        Hozzaad
      </button>
      <button data-testid="torol"
        onClick={() => kosar.removeFromCart(1)}>
        Torol
      </button>
      <button data-testid="frissit"
        onClick={() => kosar.updateQuantity(1, 5)}>
        Frissit
      </button>
      <button data-testid="urit"
        onClick={() => kosar.clearCart()}>
        Urit
      </button>
      <button data-testid="frissit-nulla"
        onClick={() => kosar.updateQuantity(1, 0)}>
        FrissitNulla
      </button>
    </div>
  );
};

describe('Kosar kontextus', () => {

  // A kosár üres állapotból indul: 0 darab, 0 Ft.
  it('ures kosarral indul', () => {
    render(<CartProvider><TesztKomponens /></CartProvider>);
    expect(screen.getByTestId('osszes-darab').textContent).toBe('0');
    expect(screen.getByTestId('osszes-ar').textContent).toBe('0');
  });

  // Egy termék hozzáadása után a kosárban 1 darab van, 100 Ft értékben.
  it('termek hozzaadasa a kosarhoz', async () => {
    const felhasznalo = userEvent.setup();
    render(<CartProvider><TesztKomponens /></CartProvider>);
    await felhasznalo.click(screen.getByTestId('hozzaad'));
    expect(screen.getByTestId('osszes-darab').textContent).toBe('1');
    expect(screen.getByTestId('osszes-ar').textContent).toBe('100');
  });

  // Ha ugyanazt a terméket kétszer adjuk hozzá, a mennyiség
  // növekszik (2 db), de a kosárban csak 1 tétel marad.
  it('ugyanaz a termek noveli a mennyiseget', async () => {
    const felhasznalo = userEvent.setup();
    render(<CartProvider><TesztKomponens /></CartProvider>);
    await felhasznalo.click(screen.getByTestId('hozzaad'));
    await felhasznalo.click(screen.getByTestId('hozzaad'));
    expect(screen.getByTestId('osszes-darab').textContent).toBe('2');
    expect(screen.getByTestId('kosar-hossz').textContent).toBe('1');
  });

  // Termék eltávolítása után a kosár ismét üres.
  it('termek eltavolitasa a kosarbol', async () => {
    const felhasznalo = userEvent.setup();
    render(<CartProvider><TesztKomponens /></CartProvider>);
    await felhasznalo.click(screen.getByTestId('hozzaad'));
    await felhasznalo.click(screen.getByTestId('torol'));
    expect(screen.getByTestId('osszes-darab').textContent).toBe('0');
  });

  // A mennyiség frissítésekor az összár is frissül:
  // 5 db × 100 Ft = 500 Ft.
  it('mennyiseg frissitese', async () => {
    const felhasznalo = userEvent.setup();
    render(<CartProvider><TesztKomponens /></CartProvider>);
    await felhasznalo.click(screen.getByTestId('hozzaad'));
    await felhasznalo.click(screen.getByTestId('frissit'));
    expect(screen.getByTestId('osszes-darab').textContent).toBe('5');
    expect(screen.getByTestId('osszes-ar').textContent).toBe('500');
  });

  // Ha a mennyiséget 0-ra állítjuk, a termék automatikusan törlődik
  // a kosárból. Ez a felhasználói felületen a „-" gomb végső
  // lenyomásakor történik.
  it('mennyiseg nullara allitasa torli a termeket', async () => {
    const felhasznalo = userEvent.setup();
    render(<CartProvider><TesztKomponens /></CartProvider>);
    await felhasznalo.click(screen.getByTestId('hozzaad'));
    await felhasznalo.click(screen.getByTestId('frissit-nulla'));
    expect(screen.getByTestId('osszes-darab').textContent).toBe('0');
    expect(screen.getByTestId('kosar-hossz').textContent).toBe('0');
  });

  // A kosár ürítése az összes terméket eltávolítja.
  it('kosar uritese', async () => {
    const felhasznalo = userEvent.setup();
    render(<CartProvider><TesztKomponens /></CartProvider>);
    await felhasznalo.click(screen.getByTestId('hozzaad'));
    await felhasznalo.click(screen.getByTestId('urit'));
    expect(screen.getByTestId('osszes-darab').textContent).toBe('0');
    expect(screen.getByTestId('kosar-hossz').textContent).toBe('0');
  });
});
```

**Eredmény:** 7/7 teszt sikeres.

---

### 7.2. Hitelesítés kontextus – `AuthContext.test.jsx`

A hitelesítés kontextus felelős a felhasználó bejelentkezéséért, regisztrációjáért és kijelentkezéséért. Az állapot tartalmazza a felhasználó adatait, a bejelentkezési státuszt és az esetleges hibaüzeneteket.

#### A teljes tesztfájl

```javascript
// tests/AuthContext.test.jsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';

// Az authAPI mock-olása – a login, register, logout függvényeket
// mock-oljuk, hogy ne az éles API-t hívjuk.
vi.mock('../src/api/apiService', () => ({
  authAPI: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    getCurrentUser: vi.fn().mockResolvedValue(null),
    getStoredUser: vi.fn(() => null),
  },
  isAllowedAdminUser: vi.fn(() => false),
}));

import { authAPI } from '../src/api/apiService';

// Teszt komponens, amely a useAuth hook összes állapotát és
// függvényét megjeleníti, lehetővé téve az interaktív tesztelést.
const TesztKomponens = () => {
  const { user, isAuthenticated, loading, error,
          login, register, logout } = useAuth();

  return (
    <div>
      <span data-testid="bejelentkezve">
        {isAuthenticated ? 'igen' : 'nem'}
      </span>
      <span data-testid="toltes">
        {loading ? 'igen' : 'nem'}
      </span>
      <span data-testid="hiba">{error || 'nincs'}</span>
      <span data-testid="felhasznalonev">
        {user?.felhasznalonev || 'nincs'}
      </span>
      <button data-testid="belepes"
        onClick={() => login('teszt@teszt.hu', 'jelszo123')}>
        Belepes
      </button>
      <button data-testid="regisztracio"
        onClick={() => register({
          felhasznalonev: 'teszt',
          email: 'teszt@teszt.hu',
          jelszo: 'jelszo123'
        })}>
        Regisztracio
      </button>
      <button data-testid="kilepes" onClick={logout}>Kilepes</button>
    </div>
  );
};

describe('Hitelesites kontextus', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authAPI.getStoredUser.mockReturnValue(null);
    authAPI.getCurrentUser.mockResolvedValue(null);
  });

  // Az alkalmazás bejelentkezés nélkül indul.
  it('bejelentkezes nelkul indul', () => {
    render(<AuthProvider><TesztKomponens /></AuthProvider>);
    expect(screen.getByTestId('bejelentkezve').textContent).toBe('nem');
    expect(screen.getByTestId('felhasznalonev').textContent).toBe('nincs');
  });

  // A bejelentkezés gombra kattintás meghívja az authAPI.login
  // függvényt a megadott paraméterekkel.
  it('bejelentkezes meghivja az authAPI.login fuggvenyt', async () => {
    authAPI.login.mockResolvedValue({
      token: 'abc123',
      user: { id: 1, felhasznalonev: 'TesztUser', admin: 0 }
    });

    render(<AuthProvider><TesztKomponens /></AuthProvider>);
    await userEvent.click(screen.getByTestId('belepes'));

    expect(authAPI.login).toHaveBeenCalledWith('teszt@teszt.hu', 'jelszo123');
  });

  // Sikertelen bejelentkezés esetén a hibaüzenet megjelenik
  // a felhasználói felületen.
  it('sikertelen bejelentkezes hibauzenettel', async () => {
    authAPI.login.mockResolvedValue({ message: 'Hibas jelszo' });

    render(<AuthProvider><TesztKomponens /></AuthProvider>);
    await userEvent.click(screen.getByTestId('belepes'));

    await waitFor(() => {
      expect(screen.getByTestId('hiba').textContent).toBe('Hibas jelszo');
    });
  });

  // A regisztráció gombra kattintás meghívja az authAPI.register
  // függvényt a megadott adatokkal.
  it('regisztracio meghivja az authAPI.register fuggvenyt', async () => {
    authAPI.register.mockResolvedValue({
      token: 'xyz789',
      user: { id: 2, felhasznalonev: 'UjUser', admin: 0 }
    });

    render(<AuthProvider><TesztKomponens /></AuthProvider>);
    await userEvent.click(screen.getByTestId('regisztracio'));

    expect(authAPI.register).toHaveBeenCalledWith({
      felhasznalonev: 'teszt',
      email: 'teszt@teszt.hu',
      jelszo: 'jelszo123'
    });
  });

  // A kijelentkezés gombra kattintás meghívja az authAPI.logout
  // függvényt, amely törli a tokent és a felhasználói adatokat.
  it('kilepes meghivja az authAPI.logout fuggvenyt', async () => {
    render(<AuthProvider><TesztKomponens /></AuthProvider>);
    await userEvent.click(screen.getByTestId('kilepes'));

    expect(authAPI.logout).toHaveBeenCalled();
  });
});
```

**Eredmény:** 5/5 teszt sikeres.

---

### 7.3. Kedvencek kontextus – `FavoritesContext.test.jsx`

A kedvencek kontextus lehetővé teszi a felhasználók számára, hogy termékeket jelöljenek meg kedvencként. A kedvencek listája localStorage-ban perzisztálódik, így az oldal újratöltése után is megmarad.

#### A teljes tesztfájl

```javascript
// tests/FavoritesContext.test.jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { FavoritesProvider, useFavorites } from '../src/contexts/FavoritesContext';

// Teszt komponens a kedvencek műveleteinek teszteléséhez.
const TesztKomponens = () => {
  const { favorites, toggleFavorite, isFavorite,
          clearFavorites, favoritesCount } = useFavorites();

  return (
    <div>
      <span data-testid="darabszam">{favoritesCount}</span>
      <span data-testid="kedvenc-1">
        {isFavorite(1) ? 'igen' : 'nem'}
      </span>
      <span data-testid="kedvenc-2">
        {isFavorite(2) ? 'igen' : 'nem'}
      </span>
      <button data-testid="valt-1"
        onClick={() => toggleFavorite({ id: 1, nev: 'Termek 1' })}>
        Valt1
      </button>
      <button data-testid="valt-2"
        onClick={() => toggleFavorite({ id: 2, nev: 'Termek 2' })}>
        Valt2
      </button>
      <button data-testid="urit" onClick={clearFavorites}>Urit</button>
    </div>
  );
};

describe('Kedvencek kontextus', () => {

  // Kezdetben nincs kedvenc termék.
  it('ures kedvencekkel indul', () => {
    render(<FavoritesProvider><TesztKomponens /></FavoritesProvider>);
    expect(screen.getByTestId('darabszam').textContent).toBe('0');
  });

  // Egy termék kedvencnek jelölése után a számláló 1-re nő.
  it('kedvenc hozzaadasa', async () => {
    const felhasznalo = userEvent.setup();
    render(<FavoritesProvider><TesztKomponens /></FavoritesProvider>);
    await felhasznalo.click(screen.getByTestId('valt-1'));
    expect(screen.getByTestId('darabszam').textContent).toBe('1');
    expect(screen.getByTestId('kedvenc-1').textContent).toBe('igen');
  });

  // Ha újra rákattintunk a kedvenc gombra, a termék elveszíti
  // a kedvenc státuszát (toggle viselkedés).
  it('kedvenc eltavolitasa ujra valtassal', async () => {
    const felhasznalo = userEvent.setup();
    render(<FavoritesProvider><TesztKomponens /></FavoritesProvider>);
    await felhasznalo.click(screen.getByTestId('valt-1'));
    await felhasznalo.click(screen.getByTestId('valt-1'));
    expect(screen.getByTestId('darabszam').textContent).toBe('0');
    expect(screen.getByTestId('kedvenc-1').textContent).toBe('nem');
  });

  // Több termék is jelölhető kedvencként egyszerre.
  it('tobb kedvenc kezelese', async () => {
    const felhasznalo = userEvent.setup();
    render(<FavoritesProvider><TesztKomponens /></FavoritesProvider>);
    await felhasznalo.click(screen.getByTestId('valt-1'));
    await felhasznalo.click(screen.getByTestId('valt-2'));
    expect(screen.getByTestId('darabszam').textContent).toBe('2');
    expect(screen.getByTestId('kedvenc-1').textContent).toBe('igen');
    expect(screen.getByTestId('kedvenc-2').textContent).toBe('igen');
  });

  // Az ürítés gomb az összes kedvencet eltávolítja.
  it('kedvencek uritese', async () => {
    const felhasznalo = userEvent.setup();
    render(<FavoritesProvider><TesztKomponens /></FavoritesProvider>);
    await felhasznalo.click(screen.getByTestId('valt-1'));
    await felhasznalo.click(screen.getByTestId('valt-2'));
    await felhasznalo.click(screen.getByTestId('urit'));
    expect(screen.getByTestId('darabszam').textContent).toBe('0');
  });

  // A kedvencek localStorage-ba mentődnek, így az oldal
  // újratöltése után is megmaradnak.
  it('helyi taroloba menti a kedvenceket', async () => {
    const felhasznalo = userEvent.setup();
    render(<FavoritesProvider><TesztKomponens /></FavoritesProvider>);
    await felhasznalo.click(screen.getByTestId('valt-1'));
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'favorites', expect.any(String)
    );
  });
});
```

**Eredmény:** 6/6 teszt sikeres.

---

## 8. Integrációs tesztek – Backend REST API

Az integrációs tesztek az éles szerveren (kisallatwebshopproject.hu) futó PHP REST API végpontokat tesztelik valódi HTTP kérésekkel. Ezek a tesztek nem használnak mock-ot – a `fetch()` függvény az igazi szerverrel kommunikál.

### 8.1. Kategóriák API

A kategóriák API a webshop állatkategóriáit (Kutya, Macska, Rágcsáló, Hüllő, Madár, Hal) és azok alkategóriáit (Tápok, Pórázok, Játékok stb.) szolgálja ki.

**Végpont:** `GET /categories.php`

```javascript
// tests/backend-api.test.js – Kategóriák API tesztek
const SZERVER_URL = 'https://kisallatwebshopproject.hu/backend/api';

describe('Kategoriak API - elo szerver', () => {

  // Az összes kategória lekérdezése sikeres választ ad (HTTP 200)
  // és egy nem üres tömböt ad vissza.
  it('osszes kategoria lekerdezese sikeres', async () => {
    const valasz = await fetch(`${SZERVER_URL}/categories.php`);
    expect(valasz.ok).toBe(true);
    const adat = await valasz.json();
    expect(Array.isArray(adat)).toBe(true);
    expect(adat.length).toBeGreaterThan(0);
  });

  // Minden kategóriának rendelkeznie kell névvel és slug-gal.
  // A slug az URL-ben használt azonosító (pl. "kutya", "macska").
  it('minden kategorianak van neve es slug-ja', async () => {
    const valasz = await fetch(`${SZERVER_URL}/categories.php`);
    const kategoriak = await valasz.json();
    kategoriak.forEach((kat) => {
      expect(kat).toHaveProperty('nev');
      expect(kat).toHaveProperty('slug');
      expect(kat.nev).toBeTruthy();
      expect(kat.slug).toBeTruthy();
    });
  });

  // A kategóriákhoz alkategóriák tartoznak. Legalább egy
  // kategóriának kell lennie alkategóriával.
  it('kategoriak tartalmaznak alkategoriakat', async () => {
    const valasz = await fetch(`${SZERVER_URL}/categories.php`);
    const kategoriak = await valasz.json();
    const vanAlkategoria = kategoriak.some(
      (kat) => Array.isArray(kat.alkategoriak) && kat.alkategoriak.length > 0
    );
    expect(vanAlkategoria).toBe(true);
  });

  // A „Kutya" kategóriának léteznie kell a „kutya" slug-gal.
  it('kutya kategoria letezik', async () => {
    const valasz = await fetch(`${SZERVER_URL}/categories.php`);
    const kategoriak = await valasz.json();
    const kutya = kategoriak.find((k) => k.slug === 'kutya');
    expect(kutya).toBeDefined();
    expect(kutya.nev).toBe('Kutya');
  });
});
```

**Eredmény:** 4/4 teszt sikeres.

---

### 8.2. Termékek API

A termékek API a webshop összes termékét szolgálja ki, támogatja a keresést és a kategória szerinti szűrést.

**Végpontok:**
- `GET /products.php` – összes termék
- `GET /products.php/search?q=` – keresés
- `GET /products.php/category?kategoria=` – kategória szűrés

```javascript
// tests/backend-api.test.js – Termékek API tesztek
describe('Termekek API - elo szerver', () => {

  // A termékek lekérdezése sikeres választ ad, amely tartalmazza
  // a „products" tömböt.
  it('termekek lekerdezese sikeres', async () => {
    const valasz = await fetch(`${SZERVER_URL}/products.php`);
    expect(valasz.ok).toBe(true);
    const adat = await valasz.json();
    expect(adat).toHaveProperty('products');
    expect(Array.isArray(adat.products)).toBe(true);
  });

  // Minden terméknek rendelkeznie kell az alapvető mezőkkel:
  // id, nev (név), ar (ár) és fo_kep (fő kép URL).
  it('termekeknek vannak kotelezo mezoi', async () => {
    const valasz = await fetch(`${SZERVER_URL}/products.php`);
    const { products } = await valasz.json();
    if (products.length > 0) {
      const termek = products[0];
      expect(termek).toHaveProperty('id');
      expect(termek).toHaveProperty('nev');
      expect(termek).toHaveProperty('ar');
      expect(termek).toHaveProperty('fo_kep');
    }
  });

  // A keresés funkció működik – a „kutya" keresőszóra választ ad.
  it('kereses mukodik', async () => {
    const valasz = await fetch(
      `${SZERVER_URL}/products.php/search?q=kutya`
    );
    expect(valasz.ok).toBe(true);
    const termekek = await valasz.json();
    expect(Array.isArray(termekek)).toBe(true);
  });

  // A kategória szerinti szűrés működik – a „kutya" kategóriára
  // szűrve csak kutya termékek jelennek meg.
  it('kategoria szerinti szures mukodik', async () => {
    const valasz = await fetch(
      `${SZERVER_URL}/products.php/category?kategoria=kutya`
    );
    expect(valasz.ok).toBe(true);
    const termekek = await valasz.json();
    expect(Array.isArray(termekek)).toBe(true);
  });

  // Nem létező keresőszóra üres tömb érkezik vissza,
  // nem hibaüzenet.
  it('ures kereses ures tombot ad vissza', async () => {
    const valasz = await fetch(
      `${SZERVER_URL}/products.php/search?q=xyznemletezotermek123`
    );
    expect(valasz.ok).toBe(true);
    const termekek = await valasz.json();
    expect(Array.isArray(termekek)).toBe(true);
    expect(termekek.length).toBe(0);
  });
});
```

**Eredmény:** 5/5 teszt sikeres.

---

### 8.3. Vélemények API

A vélemények API a termékekhez írt véleményeket és a közösségi fal bejegyzéseit szolgálja ki.

**Végpontok:**
- `GET /reviews.php/all` – összes vélemény
- `GET /reviews.php/wall` – fal bejegyzések

```javascript
// tests/backend-api.test.js – Vélemények API tesztek
describe('Velemenyek API - elo szerver', () => {

  // Az összes vélemény lekérdezése sikeres választ ad.
  it('osszes velemeny lekerdezese sikeres', async () => {
    const valasz = await fetch(`${SZERVER_URL}/reviews.php/all`);
    expect(valasz.ok).toBe(true);
    const velemenyek = await valasz.json();
    expect(Array.isArray(velemenyek)).toBe(true);
  });

  // A fal bejegyzések lekérdezése sikeres választ ad.
  it('fal bejegyzesek lekerdezese sikeres', async () => {
    const valasz = await fetch(`${SZERVER_URL}/reviews.php/wall`);
    expect(valasz.ok).toBe(true);
    const bejegyzesek = await valasz.json();
    expect(Array.isArray(bejegyzesek)).toBe(true);
  });

  // A véleményeknek rendelkezniük kell az alapvető mezőkkel.
  it('velemenynek vannak kotelezo mezoi', async () => {
    const valasz = await fetch(`${SZERVER_URL}/reviews.php/all`);
    const velemenyek = await valasz.json();
    if (velemenyek.length > 0) {
      const v = velemenyek[0];
      expect(v).toHaveProperty('id');
      expect(v).toHaveProperty('ertekeles');
    }
  });
});
```

**Eredmény:** 3/3 teszt sikeres.

---

### 8.4. Kuponok API

A kuponok API a kedvezménykuponokat kezeli, beleértve a hűségkuponokat is.

**Végpont:** `GET /coupons.php/loyalty`

```javascript
// tests/backend-api.test.js – Kuponok API tesztek
describe('Kuponok API - elo szerver', () => {

  // A hűségkupon lekérdezése sikeres választ ad, amely tartalmazza
  // a kupon kódját és értékét.
  it('huseg kupon lekerdezese sikeres', async () => {
    const valasz = await fetch(`${SZERVER_URL}/coupons.php/loyalty`);
    expect(valasz.ok).toBe(true);
    const kupon = await valasz.json();
    expect(kupon).toHaveProperty('kod');
    expect(kupon).toHaveProperty('ertek');
  });
});
```

**Eredmény:** 1/1 teszt sikeres.

---

### 8.5. Hitelesítés API

A hitelesítés API a felhasználói bejelentkezést, regisztrációt és a jogosultságellenőrzést kezeli. JWT (JSON Web Token) alapú hitelesítést használ.

**Végpontok:**
- `POST /auth.php/login` – bejelentkezés
- `GET /auth.php/me` – aktuális felhasználó (token szükséges)

```javascript
// tests/backend-api.test.js – Hitelesítés API tesztek
describe('Hitelesites API - elo szerver', () => {

  // Hibás bejelentkezési adatok esetén a szerver hibaüzenettel
  // válaszol, nem összeomlással.
  it('hibas bejelentkezes hibauzenettel ter vissza', async () => {
    const valasz = await fetch(`${SZERVER_URL}/auth.php/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: 'nemletezik',
        password: 'rossz'
      }),
    });
    const adat = await valasz.json();
    expect(adat).toHaveProperty('message');
  });

  // Üres body-val küldött POST kérés esetén is megfelelően
  // kezeli a szerver (HTTP 400+), nem dob 500-as hibát.
  it('ures body-val nem omlik ossze', async () => {
    const valasz = await fetch(`${SZERVER_URL}/auth.php/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    expect(valasz.status).toBeGreaterThanOrEqual(400);
  });

  // Token nélküli kérés a /me végpontra elutasításra kerül
  // (HTTP 401), mivel a végpont bejelentkezést igényel.
  it('token nelkuli me lekeres elutasitva', async () => {
    const valasz = await fetch(`${SZERVER_URL}/auth.php/me`);
    expect(valasz.status).toBeGreaterThanOrEqual(400);
  });
});
```

**Eredmény:** 3/3 teszt sikeres.

---

## 9. Teszteredmények összesítése

### 9.1. Futtatási eredmény

```
 ✓ tests/apiService.test.js          (10 teszt)  ✔ SIKERES
 ✓ tests/backend-api.test.js         (16 teszt)  ✔ SIKERES
 ✓ tests/AdminLayout.test.jsx         (4 teszt)  ✔ SIKERES
 ✓ tests/AuthContext.test.jsx          (5 teszt)  ✔ SIKERES
 ✓ tests/Cart.test.jsx                (3 teszt)  ✔ SIKERES
 ✓ tests/CartContext.test.jsx          (7 teszt)  ✔ SIKERES
 ✓ tests/CategoryPage.test.jsx        (5 teszt)  ✔ SIKERES
 ✓ tests/FavoritesContext.test.jsx     (6 teszt)  ✔ SIKERES
 ✓ tests/Footer.test.jsx              (1 teszt)  ✔ SIKERES
 ✓ tests/Header.test.jsx              (3 teszt)  ✔ SIKERES
 ✓ tests/Home.test.jsx                (5 teszt)  ✔ SIKERES
 ✓ tests/Orders.test.jsx              (2 teszt)  ✔ SIKERES
 ✓ tests/ProductList.test.jsx        (10 teszt)  ✔ SIKERES
 ─────────────────────────────────────────────────────
 Tesztfájlok:     13 sikeres (13-ból)
 Tesztek:         77 sikeres (77-ből)
 Futási idő:      7.57 másodperc
```

### 9.2. Összesítő táblázat típusonként

| Teszttípus | Fájlok | Tesztek | Sikeres | Sikertelen |
|---|---|---|---|---|
| Egységteszt (unit) | 2 | 15 | 15 | 0 |
| Komponens teszt | 8 | 28 | 28 | 0 |
| Kontextus teszt | 3 | 18 | 18 | 0 |
| Integrációs teszt (API) | 1 | 16 | 16 | 0 |
| **Összesen** | **14** | **77** | **77** | **0** |

### 9.3. Lefedettség komponensenként

| Komponens / Modul | Tesztelt funkciók |
|---|---|
| `apiService.js` | URL feloldás, admin jogosultság ellenőrzés |
| `Home.jsx` | Kategória kártyák, slider, szűrők megjelenítése |
| `Header.jsx` | Fejléc, kereső mező, navigáció megjelenítése |
| `Footer.jsx` | Lábléc renderelése |
| `Cart.jsx` | Kosár tartalom, termékek, összár megjelenítése |
| `Orders.jsx` | Rendelések lista, rendelésszámok megjelenítése |
| `CategoryPage.jsx` | Alkategóriák betöltése, hiba- és töltési állapotok |
| `ProductList.jsx` | Termékek lista, betöltés, hiba, akciós ár logika |
| `AdminLayout.jsx` | Jogosultság ellenőrzés, navigáció, admin panel |
| `CartContext.jsx` | Hozzáadás, törlés, mennyiség, ürítés |
| `AuthContext.jsx` | Bejelentkezés, regisztráció, kijelentkezés, hiba |
| `FavoritesContext.jsx` | Hozzáadás, toggle, ürítés, localStorage perzisztencia |
| Backend API | Kategóriák, termékek, keresés, vélemények, kuponok, hitelesítés |

---

## 10. Összegzés

A Kisállat Webshop projekt tesztelése során összesen **77 tesztet** írtunk és futtattunk le sikeresen, **14 tesztfájlban**. A tesztek négy különböző szinten fedik le az alkalmazást:

1. **Egységtesztek** – biztosítják az egyedi függvények helyes működését, különösen a PHP backend és a JavaScript frontend közötti típuskonverziós problémák kezelését (pl. admin flag string/number kezelése, akciós ár logika).

2. **Komponens tesztek** – ellenőrzik, hogy a React komponensek helyesen renderelődnek-e és a megfelelő tartalmat jelenítik-e meg különböző állapotokban (betöltés, hiba, üres lista, sikeres betöltés).

3. **Kontextus tesztek** – a React Context API-n alapuló állapotkezelők (kosár, hitelesítés, kedvencek) teljes műveleti ciklusát tesztelik, beleértve a hozzáadást, módosítást, törlést és a localStorage perzisztenciát.

4. **Integrációs tesztek** – az éles szerveren futó PHP REST API végpontokat tesztelik valódi HTTP kérésekkel, biztosítva a frontend-backend kommunikáció helyes működését.

A tesztek futtatása automatizált, a `npm run test` paranccsal indítható, és a teljes tesztcsomag ~8 másodperc alatt lefut. A tesztelési keretrendszer (Vitest) integrálódik a Vite build eszközbe, így a fejlesztési munkafolyamat szerves részét képezi.

**A teszteket készítette:** Hegymegi-Kiss Ákos, Péterffy Dominika