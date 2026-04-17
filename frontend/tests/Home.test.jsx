import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import Home from '../src/components/Home';

const renderFooldal = () => {
  return render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );
};

describe('Fooldal komponens', () => {
  it('megjelenik a fooldal', () => {
    renderFooldal();
    expect(document.querySelector('.container')).toBeTruthy();
  });

  it('kategoria kartyak megjelennek', () => {
    renderFooldal();
    expect(screen.getByText('Kutya')).toBeInTheDocument();
    expect(screen.getByText('Macska')).toBeInTheDocument();
    expect(screen.getByText('Ragcsalo')).toBeInTheDocument();
    expect(screen.getByText('Hullo')).toBeInTheDocument();
    expect(screen.getByText('Madar')).toBeInTheDocument();
    expect(screen.getByText('Hal')).toBeInTheDocument();
  });

  it('6 kategoria kartya jelenik meg', () => {
    renderFooldal();
    const kartyak = document.querySelectorAll('.box');
    expect(kartyak.length).toBe(6);
  });

  it('szuro mezo megjelenik', () => {
    renderFooldal();
    expect(screen.getByText('Rendezes')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('0')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('999999')).toBeInTheDocument();
  });

  it('slider megjelenik', () => {
    renderFooldal();
    expect(document.querySelector('.continuous-slider')).toBeTruthy();
  });
});