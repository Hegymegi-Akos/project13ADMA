import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';

// API szolgaltatas mock
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

const TesztKomponens = () => {
  const { user, isAuthenticated, loading, error, login, register, logout } = useAuth();

  return (
    <div>
      <span data-testid="bejelentkezve">{isAuthenticated ? 'igen' : 'nem'}</span>
      <span data-testid="toltes">{loading ? 'igen' : 'nem'}</span>
      <span data-testid="hiba">{error || 'nincs'}</span>
      <span data-testid="felhasznalonev">{user?.felhasznalonev || 'nincs'}</span>
      <button data-testid="belepes" onClick={() => login('teszt@teszt.hu', 'jelszo123')}>Belepes</button>
      <button data-testid="regisztracio" onClick={() => register({ felhasznalonev: 'teszt', email: 'teszt@teszt.hu', jelszo: 'jelszo123' })}>Regisztracio</button>
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

  it('bejelentkezes nelkul indul', () => {
    render(<AuthProvider><TesztKomponens /></AuthProvider>);
    expect(screen.getByTestId('bejelentkezve').textContent).toBe('nem');
    expect(screen.getByTestId('felhasznalonev').textContent).toBe('nincs');
  });

  it('bejelentkezes meghivja az authAPI.login fuggvenyt', async () => {
    authAPI.login.mockResolvedValue({ token: 'abc123', user: { id: 1, felhasznalonev: 'TesztUser', admin: 0 } });

    render(<AuthProvider><TesztKomponens /></AuthProvider>);
    await userEvent.click(screen.getByTestId('belepes'));

    expect(authAPI.login).toHaveBeenCalledWith('teszt@teszt.hu', 'jelszo123');
  });

  it('sikertelen bejelentkezes hibauzenettel', async () => {
    authAPI.login.mockResolvedValue({ message: 'Hibas jelszo' });

    render(<AuthProvider><TesztKomponens /></AuthProvider>);
    await userEvent.click(screen.getByTestId('belepes'));

    await waitFor(() => {
      expect(screen.getByTestId('hiba').textContent).toBe('Hibas jelszo');
    });
  });

  it('regisztracio meghivja az authAPI.register fuggvenyt', async () => {
    authAPI.register.mockResolvedValue({ token: 'xyz789', user: { id: 2, felhasznalonev: 'UjUser', admin: 0 } });

    render(<AuthProvider><TesztKomponens /></AuthProvider>);
    await userEvent.click(screen.getByTestId('regisztracio'));

    expect(authAPI.register).toHaveBeenCalledWith({ felhasznalonev: 'teszt', email: 'teszt@teszt.hu', jelszo: 'jelszo123' });
  });

  it('kilepes meghivja az authAPI.logout fuggvenyt', async () => {
    render(<AuthProvider><TesztKomponens /></AuthProvider>);
    await userEvent.click(screen.getByTestId('kilepes'));

    expect(authAPI.logout).toHaveBeenCalled();
  });
});