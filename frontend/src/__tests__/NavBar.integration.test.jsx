import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NavBar from '../components/NavBar';

jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    logout: jest.fn(),
  }),
}));

const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>);
};

test('navigates to Signup when Sign Up is clicked', () => {
  renderWithRouter(<NavBar onFilterChange={() => {}} />); 

  const signUpLink = screen.getByText(/sign up/i);
  fireEvent.click(signUpLink);

  expect(signUpLink).toBeInTheDocument();
});
