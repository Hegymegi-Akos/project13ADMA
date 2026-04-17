import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

vi.mock('../src/api/apiService', () => ({
  categoriesAPI: {
    getAll: vi.fn(),
  },
  resolveMediaUrl: vi.fn((v) => v || ''),
}));

import { categoriesAPI } from '../src/api/apiService';
import CategoryPage from '../src/components/CategoryPage';

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

  it('ismeretlen kategoriara hibauzenet', () => {
    categoriesAPI.getAll.mockResolvedValue(mintaKategoriak);

    render(
      <MemoryRouter initialEntries={['/ismeretlen']}>
        <CategoryPage type="ismeretlen" />
      </MemoryRouter>
    );

    expect(screen.getByText('Kategoria nem talalhato')).toBeInTheDocument();
  });

  it('betoltes kozben toltesi uzenetet mutat', () => {
    categoriesAPI.getAll.mockReturnValue(new Promise(() => {}));

    render(
      <MemoryRouter initialEntries={['/dog']}>
        <CategoryPage type="dog" />
      </MemoryRouter>
    );

    expect(screen.getByText('Betoltes...')).toBeInTheDocument();
  });

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
      expect(screen.getByText('Nincs alkategoria ebben a kategoriaban.')).toBeInTheDocument();
    });
  });
});