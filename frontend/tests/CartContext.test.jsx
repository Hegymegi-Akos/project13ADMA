import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { CartProvider, useCart } from '../src/contexts/CartContext';

const TesztKomponens = () => {
  const kosar = useCart();

  return (
    <div>
      <span data-testid="osszes-darab">{kosar.getTotalItems()}</span>
      <span data-testid="osszes-ar">{kosar.getTotalPrice()}</span>
      <span data-testid="kosar-hossz">{kosar.cartItems.length}</span>
      <button data-testid="hozzaad" onClick={() => kosar.addToCart({ id: 1, name: 'Teszt', price: 100 }, 1)}>Hozzaad</button>
      <button data-testid="torol" onClick={() => kosar.removeFromCart(1)}>Torol</button>
      <button data-testid="frissit" onClick={() => kosar.updateQuantity(1, 5)}>Frissit</button>
      <button data-testid="urit" onClick={() => kosar.clearCart()}>Urit</button>
      <button data-testid="frissit-nulla" onClick={() => kosar.updateQuantity(1, 0)}>FrissitNulla</button>
    </div>
  );
};

describe('Kosar kontextus', () => {
  it('ures kosarral indul', () => {
    render(<CartProvider><TesztKomponens /></CartProvider>);
    expect(screen.getByTestId('osszes-darab').textContent).toBe('0');
    expect(screen.getByTestId('osszes-ar').textContent).toBe('0');
  });

  it('termek hozzaadasa a kosarhoz', async () => {
    const felhasznalo = userEvent.setup();
    render(<CartProvider><TesztKomponens /></CartProvider>);
    await felhasznalo.click(screen.getByTestId('hozzaad'));
    expect(screen.getByTestId('osszes-darab').textContent).toBe('1');
    expect(screen.getByTestId('osszes-ar').textContent).toBe('100');
  });

  it('ugyanaz a termek noveli a mennyiseget', async () => {
    const felhasznalo = userEvent.setup();
    render(<CartProvider><TesztKomponens /></CartProvider>);
    await felhasznalo.click(screen.getByTestId('hozzaad'));
    await felhasznalo.click(screen.getByTestId('hozzaad'));
    expect(screen.getByTestId('osszes-darab').textContent).toBe('2');
    expect(screen.getByTestId('kosar-hossz').textContent).toBe('1');
  });

  it('termek eltavolitasa a kosarbol', async () => {
    const felhasznalo = userEvent.setup();
    render(<CartProvider><TesztKomponens /></CartProvider>);
    await felhasznalo.click(screen.getByTestId('hozzaad'));
    await felhasznalo.click(screen.getByTestId('torol'));
    expect(screen.getByTestId('osszes-darab').textContent).toBe('0');
  });

  it('mennyiseg frissitese', async () => {
    const felhasznalo = userEvent.setup();
    render(<CartProvider><TesztKomponens /></CartProvider>);
    await felhasznalo.click(screen.getByTestId('hozzaad'));
    await felhasznalo.click(screen.getByTestId('frissit'));
    expect(screen.getByTestId('osszes-darab').textContent).toBe('5');
    expect(screen.getByTestId('osszes-ar').textContent).toBe('500');
  });

  it('mennyiseg nullara allitasa torli a termeket', async () => {
    const felhasznalo = userEvent.setup();
    render(<CartProvider><TesztKomponens /></CartProvider>);
    await felhasznalo.click(screen.getByTestId('hozzaad'));
    await felhasznalo.click(screen.getByTestId('frissit-nulla'));
    expect(screen.getByTestId('osszes-darab').textContent).toBe('0');
    expect(screen.getByTestId('kosar-hossz').textContent).toBe('0');
  });

  it('kosar uritese', async () => {
    const felhasznalo = userEvent.setup();
    render(<CartProvider><TesztKomponens /></CartProvider>);
    await felhasznalo.click(screen.getByTestId('hozzaad'));
    await felhasznalo.click(screen.getByTestId('urit'));
    expect(screen.getByTestId('osszes-darab').textContent).toBe('0');
    expect(screen.getByTestId('kosar-hossz').textContent).toBe('0');
  });
});