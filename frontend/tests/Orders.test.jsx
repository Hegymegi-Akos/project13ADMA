/**
 * Rendelesek komponens tesztek
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

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
  it('megjeleníti a rendelesek cimet', async () => {
    renderRendelesek();
    await waitFor(() => {
      const szoveg = document.body.textContent;
      expect(szoveg.toLowerCase()).toContain('rendel');
    });
  });

  it('betoltes utan megjeleníti a rendeleseket', async () => {
    renderRendelesek();
    await waitFor(() => {
      expect(screen.getByText(/ORD-001/)).toBeTruthy();
    });
  });
});
