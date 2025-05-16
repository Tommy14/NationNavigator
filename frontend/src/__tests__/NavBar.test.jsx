import React from 'react';
import { render, screen } from '@testing-library/react';
import { AuthProvider } from '../context/AuthContext';
import NavBar from '../components/NavBar';

jest.mock('../services/api');
jest.mock('../services/auth');

test('renders NavBar with logo and menu toggle', () => {
  render(
    <AuthProvider>
      <NavBar onFilterChange={jest.fn()} />
    </AuthProvider>
  );

  const logo = screen.getByAltText(/NationNavigator Logo/i);
  const menuToggle = screen.getByLabelText(/Show All Countries/i);

  expect(logo).toBeInTheDocument();
  expect(menuToggle).toBeInTheDocument();
});
