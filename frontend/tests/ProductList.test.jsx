import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

// Kontextus mockok
vi.mock('../src/contexts/CartContext', () => ({
  useCart: () => ({
    addToCart: vi.fn(),
    cartItems: [],
    getTotalItems: () => 0,
  }),
}));

vi.mock('../src/contexts/FavoritesContext', () => ({
  useFavorites: () => ({
    toggleFavorite: vi.fn(),
    isFavorite: () => false,
    favorites: [],
    favoritesCount: 0,
  }),
}));

vi.mock('../src/api/apiService', () => ({
  productsAPI: {
    getByCategory: vi.fn(),
  },
  resolveMediaUrl: vi.fn((v) => v || ''),
}));

import { productsAPI } from '../src/api/apiService';
import ProductList from '../src/components/ProductList';

const mintaTermekek = [
  { id: 1, nev: 'Kutyatap', ar: '3000', akcios_ar: '0', fo_kep: '/kep/1.jpg', leiras: 'Jo tap' },
  { id: 2, nev: 'Macskajat', ar: '5000', akcios_ar: '4000', fo_kep: '/kep/2.jpg', leiras: 'Jo jatek' },
  { id: 3, nev: 'Haleleseg', ar: '1500', akcios_ar: '', fo_kep: '/kep/3.jpg', leiras: 'Finom' },
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

  it('betoltes kozben toltesi uzenetet mutat', () => {
    productsAPI.getByCategory.mockReturnValue(new Promise(() => {}));
    renderTermeklista();
    expect(screen.getByText('Termekek betoltese...')).toBeInTheDocument();
  });

  it('termekek megjelennek betoltes utan', async () => {
    productsAPI.getByCategory.mockResolvedValue(mintaTermekek);
    renderTermeklista();

    await waitFor(() => {
      expect(screen.getByText('Kutyatap')).toBeInTheDocument();
      expect(screen.getByText('Macskajat')).toBeInTheDocument();
      expect(screen.getByText('Haleleseg')).toBeInTheDocument();
    });
  });

  it('hibauzenet ha nem sikerul betolteni', async () => {
    productsAPI.getByCategory.mockRejectedValue(new Error('Halozati hiba'));
    renderTermeklista();

    await waitFor(() => {
      expect(screen.getByText('Nem sikerult betolteni a termekeket')).toBeInTheDocument();
    });
  });

  it('cim megjelenik', async () => {
    productsAPI.getByCategory.mockResolvedValue([]);
    renderTermeklista();

    await waitFor(() => {
      expect(screen.getByText('Kutya termekek')).toBeInTheDocument();
    });
  });

  it('termek darabszam megjelenik', async () => {
    productsAPI.getByCategory.mockResolvedValue(mintaTermekek);
    renderTermeklista();

    await waitFor(() => {
      expect(screen.getByText('3 termek talalt')).toBeInTheDocument();
    });
  });
});

// ==================== Akcios ar logika ====================
describe('Akcios ar szamitas', () => {
  const szamolAr = (p) => Number(p.akcios_ar) > 0 && Number(p.akcios_ar) < Number(p.ar) ? Number(p.akcios_ar) : Number(p.ar);

  it('akcios ar 0 eseten az eredeti arat hasznalja', () => {
    expect(szamolAr({ ar: '3000', akcios_ar: '0' })).toBe(3000);
  });

  it('akcios ar ures eseten az eredeti arat hasznalja', () => {
    expect(szamolAr({ ar: '3000', akcios_ar: '' })).toBe(3000);
  });

  it('akcios ar kisebb mint eredeti: akcios arat hasznalja', () => {
    expect(szamolAr({ ar: '5000', akcios_ar: '4000' })).toBe(4000);
  });

  it('akcios ar nagyobb mint eredeti: eredeti arat hasznalja', () => {
    expect(szamolAr({ ar: '3000', akcios_ar: '5000' })).toBe(3000);
  });

  it('akcios ar egyenlo az eredetivel: eredeti arat hasznalja', () => {
    expect(szamolAr({ ar: '3000', akcios_ar: '3000' })).toBe(3000);
  });
});