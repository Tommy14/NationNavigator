import axios from 'axios';

// Track if we're currently refreshing
let isRefreshing = false;
let refreshSubscribers = [];

const api = axios.create({
  baseURL: 'https://nationnavigator.onrender.com' || 'http://localhost:9000',
  withCredentials: true
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Critical fix: Prevent refresh loops
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Don't try to refresh if:
    // 1. It's not a 401 error
    // 2. We're already retrying this request
    // 3. We're already refreshing the token
    // 4. This is the refresh token endpoint itself
    if (
      error.response?.status !== 401 ||
      originalRequest._retry || 
      isRefreshing ||
      originalRequest.url === '/api/auth/refresh-token'
    ) {
      return Promise.reject(error);
    }
    
    // Mark as retrying to prevent multiple retries
    originalRequest._retry = true;
    isRefreshing = true;
    
    try {
      // Attempt to refresh token
      const { data } = await axios.get('/api/auth/refresh-token', {
        baseURL:'https://nationnavigator.onrender.com'||'http://localhost:9000',
        withCredentials: true
      });
      //'https://nationnavigator.onrender.com' ||
      localStorage.setItem('accessToken', data.accessToken);
      
      // Retry original request with new token
      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      // Clear token and return to login page
      localStorage.removeItem('accessToken');
      
      // Only redirect if not already on auth pages
      if (!window.location.pathname.includes('/login') && 
          !window.location.pathname.includes('/signup')) {
        window.location.href = '/login';
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;