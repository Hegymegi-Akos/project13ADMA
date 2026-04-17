import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { FavoritesProvider, useFavorites } from '../src/contexts/FavoritesContext';

const TesztKomponens = () => {
  const { favorites, toggleFavorite, isFavorite, clearFavorites, favoritesCount } = useFavorites();

  return (
    <div>
      <span data-testid="darabszam">{favoritesCount}</span>
      <span data-testid="kedvenc-1">{isFavorite(1) ? 'igen' : 'nem'}</span>
      <span data-testid="kedvenc-2">{isFavorite(2) ? 'igen' : 'nem'}</span>
      <button data-testid="valt-1" onClick={() => toggleFavorite({ id: 1, nev: 'Termek 1' })}>Valt1</button>
      <button data-testid="valt-2" onClick={() => toggleFavorite({ id: 2, nev: 'Termek 2' })}>Valt2</button>
      <button data-testid="urit" onClick={clearFavorites}>Urit</button>
    </div>
  );
};

describe('Kedvencek kontextus', () => {
  it('ures kedvencekkel indul', () => {
    render(<FavoritesProvider><TesztKomponens /></FavoritesProvider>);
    expect(screen.getByTestId('darabszam').textContent).toBe('0');
  });

  it('kedvenc hozzaadasa', async () => {
    const felhasznalo = userEvent.setup();
    render(<FavoritesProvider><TesztKomponens /></FavoritesProvider>);
    await felhasznalo.click(screen.getByTestId('valt-1'));
    expect(screen.getByTestId('darabszam').textContent).toBe('1');
    expect(screen.getByTestId('kedvenc-1').textContent).toBe('igen');
  });

  it('kedvenc eltavolitasa ujra valtassal', async () => {
    const felhasznalo = userEvent.setup();
    render(<FavoritesProvider><TesztKomponens /></FavoritesProvider>);
    await felhasznalo.click(screen.getByTestId('valt-1'));
    await felhasznalo.click(screen.getByTestId('valt-1'));
    expect(screen.getByTestId('darabszam').textContent).toBe('0');
    expect(screen.getByTestId('kedvenc-1').textContent).toBe('nem');
  });

  it('tobb kedvenc kezelese', async () => {
    const felhasznalo = userEvent.setup();
    render(<FavoritesProvider><TesztKomponens /></FavoritesProvider>);
    await felhasznalo.click(screen.getByTestId('valt-1'));
    await felhasznalo.click(screen.getByTestId('valt-2'));
    expect(screen.getByTestId('darabszam').textContent).toBe('2');
    expect(screen.getByTestId('kedvenc-1').textContent).toBe('igen');
    expect(screen.getByTestId('kedvenc-2').textContent).toBe('igen');
  });

  it('kedvencek uritese', async () => {
    const felhasznalo = userEvent.setup();
    render(<FavoritesProvider><TesztKomponens /></FavoritesProvider>);
    await felhasznalo.click(screen.getByTestId('valt-1'));
    await felhasznalo.click(screen.getByTestId('valt-2'));
    await felhasznalo.click(screen.getByTestId('urit'));
    expect(screen.getByTestId('darabszam').textContent).toBe('0');
  });

  it('helyi taroloba menti a kedvenceket', async () => {
    const felhasznalo = userEvent.setup();
    render(<FavoritesProvider><TesztKomponens /></FavoritesProvider>);
    await felhasznalo.click(screen.getByTestId('valt-1'));
    expect(localStorage.setItem).toHaveBeenCalledWith('favorites', expect.any(String));
  });
});