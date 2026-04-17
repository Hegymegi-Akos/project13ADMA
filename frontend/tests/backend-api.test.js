/**
 * Backend API integrációs tesztek
 * Elo szerver ellen futnak (kisallatwebshopproject.hu)
 */
import { describe, it, expect } from 'vitest';

const SZERVER_URL = 'https://kisallatwebshopproject.hu/backend/api';

// ==================== KATEGORIAK API ====================
describe('Kategoriak API - elo szerver', () => {
  it('osszes kategoria lekerdezese sikeres', async () => {
    const valasz = await fetch(`${SZERVER_URL}/categories.php`);
    expect(valasz.ok).toBe(true);
    const adat = await valasz.json();
    expect(Array.isArray(adat)).toBe(true);
    expect(adat.length).toBeGreaterThan(0);
  });

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

  it('kategoriak tartalmaznak alkategoriakat', async () => {
    const valasz = await fetch(`${SZERVER_URL}/categories.php`);
    const kategoriak = await valasz.json();
    const vanAlkategoria = kategoriak.some(
      (kat) => Array.isArray(kat.alkategoriak) && kat.alkategoriak.length > 0
    );
    expect(vanAlkategoria).toBe(true);
  });

  it('kutya kategoria letezik', async () => {
    const valasz = await fetch(`${SZERVER_URL}/categories.php`);
    const kategoriak = await valasz.json();
    const kutya = kategoriak.find((k) => k.slug === 'kutya');
    expect(kutya).toBeDefined();
    expect(kutya.nev).toBe('Kutya');
  });
});

// ==================== TERMEKEK API ====================
describe('Termekek API - elo szerver', () => {
  it('termekek lekerdezese sikeres', async () => {
    const valasz = await fetch(`${SZERVER_URL}/products.php`);
    expect(valasz.ok).toBe(true);
    const adat = await valasz.json();
    expect(adat).toHaveProperty('products');
    expect(Array.isArray(adat.products)).toBe(true);
  });

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

  it('kereses mukodik', async () => {
    const valasz = await fetch(`${SZERVER_URL}/products.php/search?q=kutya`);
    expect(valasz.ok).toBe(true);
    const termekek = await valasz.json();
    expect(Array.isArray(termekek)).toBe(true);
  });

  it('kategoria szerinti szures mukodik', async () => {
    const valasz = await fetch(`${SZERVER_URL}/products.php/category?kategoria=kutya`);
    expect(valasz.ok).toBe(true);
    const termekek = await valasz.json();
    expect(Array.isArray(termekek)).toBe(true);
  });

  it('ures kereses ures tombot ad vissza', async () => {
    const valasz = await fetch(`${SZERVER_URL}/products.php/search?q=xyznemletezotermek123`);
    expect(valasz.ok).toBe(true);
    const termekek = await valasz.json();
    expect(Array.isArray(termekek)).toBe(true);
    expect(termekek.length).toBe(0);
  });
});

// ==================== VELEMENYEK API ====================
describe('Velemenyek API - elo szerver', () => {
  it('osszes velemeny lekerdezese sikeres', async () => {
    const valasz = await fetch(`${SZERVER_URL}/reviews.php/all`);
    expect(valasz.ok).toBe(true);
    const velemenyek = await valasz.json();
    expect(Array.isArray(velemenyek)).toBe(true);
  });

  it('fal bejegyzesek lekerdezese sikeres', async () => {
    const valasz = await fetch(`${SZERVER_URL}/reviews.php/wall`);
    expect(valasz.ok).toBe(true);
    const bejegyzesek = await valasz.json();
    expect(Array.isArray(bejegyzesek)).toBe(true);
  });

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

// ==================== KUPONOK API ====================
describe('Kuponok API - elo szerver', () => {
  it('huseg kupon lekerdezese sikeres', async () => {
    const valasz = await fetch(`${SZERVER_URL}/coupons.php/loyalty`);
    expect(valasz.ok).toBe(true);
    const kupon = await valasz.json();
    expect(kupon).toHaveProperty('kod');
    expect(kupon).toHaveProperty('ertek');
  });
});

// ==================== HITELESITES API ====================
describe('Hitelesites API - elo szerver', () => {
  it('hibas bejelentkezes hibauzenettel ter vissza', async () => {
    const valasz = await fetch(`${SZERVER_URL}/auth.php/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: 'nemletezik', password: 'rossz' }),
    });
    const adat = await valasz.json();
    expect(adat).toHaveProperty('message');
  });

  it('ures body-val nem omlik ossze', async () => {
    const valasz = await fetch(`${SZERVER_URL}/auth.php/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    expect(valasz.status).toBeGreaterThanOrEqual(400);
  });

  it('token nelkuli me lekeres elutasitva', async () => {
    const valasz = await fetch(`${SZERVER_URL}/auth.php/me`);
    expect(valasz.status).toBeGreaterThanOrEqual(400);
  });
});
