import api from './api';

// Register a new user
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/api/auth/register', userData);
    localStorage.setItem('accessToken', response.data.accessToken);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      'Registration failed. Please try again.'
    );
  }
};

// Login existing user
export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/api/auth/login', credentials);
    localStorage.setItem('accessToken', response.data.accessToken);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      'Login failed. Please check your credentials.'
    );
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    await api.post('/api/auth/logout');
    localStorage.removeItem('accessToken');
  } catch (error) {
    console.error('Logout error:', error);
    // Still remove token on client side even if server logout fails
    localStorage.removeItem('accessToken');
    throw error;
  }
};

// Get current user info
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/api/auth/me');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Refresh access token
export const refreshAccessToken = async () => {
  try {
    const response = await api.get('/api/auth/refresh-token');
    localStorage.setItem('accessToken', response.data.accessToken);
    return response.data;
  } catch (error) {
    localStorage.removeItem('accessToken');
    throw error;
  }
};