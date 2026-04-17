import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

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
  it('megjelenik a fejlec', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    expect(document.querySelector('header')).toBeTruthy();
  });

  it('kereso mezo megjelenik', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    const kereses = document.querySelector('.search-input');
    expect(kereses).toBeTruthy();
  });

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