import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

import { useAuth } from '../context/AuthContext';

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('LoginForm', () => {
  test('renders and submits login form', async () => {
    useAuth.mockReturnValue({
      login: jest.fn(() => Promise.resolve()),
      loading: false,
    });

    renderWithRouter(<LoginForm />);
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'test123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

  });

  test('shows error on empty fields', async () => {
    useAuth.mockReturnValue({
      login: jest.fn(),
      loading: false,
    });

    renderWithRouter(<LoginForm />);
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));


    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  test('shows error on failed login', async () => {
    useAuth.mockReturnValue({
      login: jest.fn(() => Promise.reject(new Error('Invalid credentials'))),
      loading: false,
    });

    renderWithRouter(<LoginForm />);
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpass' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });
});
