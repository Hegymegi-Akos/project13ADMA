import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

// Kontextus mock
vi.mock('../src/contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../src/api/apiService', () => ({
  isAllowedAdminUser: vi.fn(),
}));

import { useAuth } from '../src/contexts/AuthContext';
import { isAllowedAdminUser } from '../src/api/apiService';
import AdminLayout from '../src/components/AdminLayout';

describe('Admin elrendezes', () => {
  it('bejelentkezes nelkul bejelentkezesi oldalt mutat', () => {
    useAuth.mockReturnValue({ user: null, isAuthenticated: false, logout: vi.fn() });
    isAllowedAdminUser.mockReturnValue(false);

    render(
      <MemoryRouter>
        <AdminLayout><div>Admin tartalom</div></AdminLayout>
      </MemoryRouter>
    );
    expect(screen.getByText('Bejelentkezes szukseges')).toBeInTheDocument();
  });

  it('nem admin felhasznalonak hozzaferes megtagadva', () => {
    useAuth.mockReturnValue({ user: { id: 1, admin: 0 }, isAuthenticated: true, logout: vi.fn() });
    isAllowedAdminUser.mockReturnValue(false);

    render(
      <MemoryRouter>
        <AdminLayout><div>Admin tartalom</div></AdminLayout>
      </MemoryRouter>
    );
    expect(screen.getByText('Hozzaferes megtagadva')).toBeInTheDocument();
  });

  it('admin felhasznalonak megjelenik a panel', () => {
    useAuth.mockReturnValue({
      user: { id: 1, felhasznalonev: 'Admin', email: 'admin@teszt.hu', admin: 1 },
      isAuthenticated: true,
      logout: vi.fn(),
    });
    isAllowedAdminUser.mockReturnValue(true);

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <AdminLayout><div>Admin tartalom</div></AdminLayout>
      </MemoryRouter>
    );
    expect(screen.getByText('Admin tartalom')).toBeInTheDocument();
    expect(screen.getByText('Admin Panel')).toBeInTheDocument();
  });

  it('navigacios linkek megjelennek', () => {
    useAuth.mockReturnValue({
      user: { id: 1, felhasznalonev: 'Admin', email: 'admin@teszt.hu', admin: 1 },
      isAuthenticated: true,
      logout: vi.fn(),
    });
    isAllowedAdminUser.mockReturnValue(true);

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <AdminLayout><div>Teszt</div></AdminLayout>
      </MemoryRouter>
    );
    expect(screen.getByText('Termekek')).toBeInTheDocument();
    expect(screen.getByText('Felhasznalok')).toBeInTheDocument();
    expect(screen.getByText('Rendelesek')).toBeInTheDocument();
    expect(screen.getByText('Kuponok')).toBeInTheDocument();
    expect(screen.getByText('Kategoriak')).toBeInTheDocument();
  });
});