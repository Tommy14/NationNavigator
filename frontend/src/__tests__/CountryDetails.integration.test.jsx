import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CountryDetails from '../components/CountryDetails';

jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id', username: 'TestUser' }, // simulate logged-in user
    loading: false,
  }),
}));

// ✅ Helper to render with router
const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>);
};

describe('CountryDetails Integration', () => {
  test('renders country details and opens quiz modal on button click', async () => {
    const mockCountry = {
      name: { common: 'France' },
      capital: ['Paris'],
      flags: { png: 'mock-url' },
      region: 'Europe',
      subregion: 'Western Europe',
      population: 67000000,
      languages: { fra: 'French' },
      currencies: { EUR: { name: 'Euro', symbol: '€' } },
    };

    renderWithRouter(<CountryDetails country={mockCountry} />);

    // Check basic details
    expect(screen.getByText(/France/i)).toBeInTheDocument();
    expect(screen.getByText(/Paris/i)).toBeInTheDocument();
    expect(screen.getByText(/French/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Euro/i).length).toBeGreaterThan(0);

    // Click "Start Quiz"
    fireEvent.click(screen.getByRole('button', { name: /start quiz/i }));

    // Wait for quiz modal content
    await waitFor(() => {
      expect(screen.queryByText((text) =>
        text.toLowerCase().includes('capital')
      )).toBeInTheDocument();
    });
  });
});
