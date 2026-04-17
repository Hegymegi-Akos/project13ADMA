import { describe, it, expect } from 'vitest';
import { resolveMediaUrl, isAllowedAdminUser } from '../src/api/apiService';

// ==================== resolveMediaUrl ====================
describe('resolveMediaUrl - Media URL feloldas', () => {
  it('ures erteknel ures stringet ad vissza', () => {
    expect(resolveMediaUrl('')).toBe('');
    expect(resolveMediaUrl(null)).toBe('');
    expect(resolveMediaUrl(undefined)).toBe('');
  });

  it('teljes URL-t valtozatlanul hagyja', () => {
    expect(resolveMediaUrl('https://pelda.hu/kep.jpg')).toBe('https://pelda.hu/kep.jpg');
    expect(resolveMediaUrl('http://pelda.hu/kep.jpg')).toBe('http://pelda.hu/kep.jpg');
  });

  it('relativ utat kiegesziti az alap URL-lel', () => {
    const eredmeny = resolveMediaUrl('/feltoltesek/teszt.jpg');
    expect(eredmeny).toContain('/feltoltesek/teszt.jpg');
  });

  it('per jel nelkuli utat is kezeli', () => {
    const eredmeny = resolveMediaUrl('feltoltesek/teszt.jpg');
    expect(eredmeny).toContain('/feltoltesek/teszt.jpg');
  });
});

// ==================== isAllowedAdminUser ====================
describe('isAllowedAdminUser - Admin jogosultsag ellenorzes', () => {
  it('null vagy undefined felhasznalonal hamis', () => {
    expect(isAllowedAdminUser(null)).toBe(false);
    expect(isAllowedAdminUser(undefined)).toBe(false);
  });

  it('nem admin felhasznalonal hamis', () => {
    expect(isAllowedAdminUser({ id: 1, admin: 0 })).toBe(false);
    expect(isAllowedAdminUser({ id: 1, admin: '0' })).toBe(false);
    expect(isAllowedAdminUser({ id: 1, admin: false })).toBe(false);
  });

  it('admin felhasznalonal igaz (szam)', () => {
    expect(isAllowedAdminUser({ id: 1, admin: 1 })).toBe(true);
  });

  it('admin felhasznalonal igaz (string "1")', () => {
    expect(isAllowedAdminUser({ id: 1, admin: '1' })).toBe(true);
  });

  it('admin felhasznalonal igaz (boolean true)', () => {
    expect(isAllowedAdminUser({ id: 1, admin: true })).toBe(true);
  });
});