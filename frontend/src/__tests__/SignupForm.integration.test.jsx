// src/__tests__/SignupForm.integration.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignupForm from '../components/SignUpForm';
import { useAuth as mockUseAuth } from '../context/AuthContext';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('SignupForm Integration', () => {
  test('✅ Successful registration flow', async () => {
    const mockRegister = jest.fn(() => Promise.resolve());
    mockUseAuth.mockReturnValue({ register: mockRegister, loading: false });

    renderWithRouter(<SignupForm />);

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() =>
      expect(mockRegister).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      })
    );
  });

  test('❌ Shows error for mismatched passwords', async () => {
    mockUseAuth.mockReturnValue({ register: jest.fn(), loading: false });

    renderWithRouter(<SignupForm />);

    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'differentPassword' },
    });

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
  });

  test('❌ Shows error from backend', async () => {
    const mockRegister = jest.fn(() =>
      Promise.reject(new Error('Email already exists'))
    );
    mockUseAuth.mockReturnValue({ register: mockRegister, loading: false });

    renderWithRouter(<SignupForm />);

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    expect(await screen.findByText(/email already exists/i)).toBeInTheDocument();
  });

  test('⏳ Shows loading state on submit', () => {
    mockUseAuth.mockReturnValue({ register: jest.fn(), loading: true });
  
    renderWithRouter(<SignupForm />);
    const button = screen.getByRole('button');
  
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent(/loading/i);
  });
});
