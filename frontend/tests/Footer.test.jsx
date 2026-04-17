import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

vi.mock('../src/contexts/AuthContext', () => ({
  useAuth: () => ({ user: null, isAuthenticated: false }),
}));

vi.mock('../src/api/apiService', () => ({
  isAllowedAdminUser: () => false,
}));

import Footer from '../src/components/Footer';

describe('Lablec komponens', () => {
  it('megjelenik a lablec', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
    expect(document.querySelector('footer')).toBeTruthy();
  });
});