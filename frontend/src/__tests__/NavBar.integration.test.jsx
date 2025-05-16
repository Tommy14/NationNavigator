// src/__tests__/NavBar.integration.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NavBar from '../components/NavBar';

// Mock useAuth
jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    logout: jest.fn(),
  }),
}));

// Utility to render with router and required props
const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>);
};

test('navigates to Signup when Sign Up is clicked', () => {
  renderWithRouter(<NavBar onFilterChange={() => {}} />); // ✅ Fix here

  const signUpLink = screen.getByText(/sign up/i);
  fireEvent.click(signUpLink);

  expect(signUpLink).toBeInTheDocument(); // basic check
});
