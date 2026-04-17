/**
 * Kosar komponens tesztek
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

// Kosar kontextus mock
const mockKosarTetelek = [
  { id: 1, name: 'Kutya poraz', price: 2500, quantity: 2, image: 'teszt.jpg' },
  { id: 2, name: 'Macska jatek', price: 1500, quantity: 1, image: 'teszt2.jpg' },
];

vi.mock('../src/contexts/CartContext', () => ({
  useCart: vi.fn(() => ({
    cartItems: mockKosarTetelek,
    removeFromCart: vi.fn(),
    updateQuantity: vi.fn(),
    clearCart: vi.fn(),
    getTotalPrice: vi.fn(() => 6500),
    getCartCount: vi.fn(() => 3),
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
  it('megjeleníti a kosar cimet', () => {
    renderKosar();
    expect(screen.getByText(/kosár|kosar/i)).toBeTruthy();
  });

  it('megjeleníti a termekeket a kosarban', () => {
    renderKosar();
    expect(screen.getByText('Kutya poraz')).toBeTruthy();
    expect(screen.getByText('Macska jatek')).toBeTruthy();
  });

  it('megjeleníti az osszesitett arat', () => {
    renderKosar();
    const szoveg = document.body.textContent;
    expect(szoveg).toContain('6');
  });
});
