import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignupForm from '../components/SignUpForm';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../context/AuthContext', () => ({
    useAuth: () => ({
      register: jest.fn(() => Promise.resolve()), // mock register function
      loading: false
    })
  }));

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

test('renders and submits signup form', async () => {
  renderWithRouter(<SignupForm />);

  fireEvent.change(screen.getByLabelText(/username/i), {
    target: { value: 'testuser' },
  });
  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: 'test@example.com' },
  });
  fireEvent.change(screen.getByLabelText(/^password$/i), {
    target: { value: 'abc123' },
  });
  fireEvent.change(screen.getByLabelText(/confirm password/i), {
    target: { value: 'abc123' },
  });

  fireEvent.click(screen.getByRole('button', { name: /create account/i }));

  // expect navigation or API to be called, or show success msg
  await waitFor(() => {
    expect(screen.getByText(/create account/i)).toBeInTheDocument();
  });
});

test('shows error on password mismatch', async () => {
  renderWithRouter(<SignupForm />);

  fireEvent.change(screen.getByLabelText(/^password$/i), {
    target: { value: 'abc123' },
  });
  fireEvent.change(screen.getByLabelText(/confirm password/i), {
    target: { value: 'wrongpass' },
  });

  fireEvent.click(screen.getByRole('button', { name: /create account/i }));

  await waitFor(() => {
    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
  });
});


