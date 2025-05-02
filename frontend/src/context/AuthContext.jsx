import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { loginUser, registerUser, logoutUser, refreshAccessToken, getCurrentUser } from '../services/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const authInitializedRef = useRef(false); // Use ref instead of state to avoid re-renders

  useEffect(() => {
    // Check if user is already logged in - only run once
    const initAuth = async () => {
      if (authInitializedRef.current) return;
      authInitializedRef.current = true;
      
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setLoading(false);
        return; // No token, no need to make API calls
      }
      
      try {
        setLoading(true);
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (err) {
        console.error('Auth initialization failed:', err);
        
        // Don't attempt refresh if we're getting network errors
        if (!err.message?.includes('Network Error')) {
          try {
            await refreshAccessToken();
            const userData = await getCurrentUser();
            setUser(userData);
          } catch (refreshErr) {
            console.error('Refresh token failed:', refreshErr);
            setUser(null);
            localStorage.removeItem('accessToken');
          }
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const data = await loginUser(credentials);
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await registerUser(userData);
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await logoutUser();
      setUser(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
      await refreshAccessToken();
    } catch (err) {
      setUser(null);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        refreshToken,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);