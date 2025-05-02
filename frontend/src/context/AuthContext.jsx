import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { loginUser, registerUser, logoutUser, refreshAccessToken, getCurrentUser } from '../services/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const authInitializedRef = useRef(false); // Use ref instead of state to avoid re-renders
  const [sessionExpiry, setSessionExpiry] = useState(null);

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
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        } else {
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        }
      } catch (err) {
        console.error('Auth initialization failed:', err);
        
        // Don't attempt refresh if we're getting network errors
        if (!err.message?.includes('Network Error')) {
          try {
            await refreshAccessToken();
            const userData = await getCurrentUser();
            const savedUser = localStorage.getItem("user");
            if (savedUser) {
              setUser(JSON.parse(savedUser));
            } else {
              setUser(userData);
              localStorage.setItem("user", JSON.stringify(userData));
            }
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
      setUser({
        userId: data.user._id,
        username: data.user.username,
        email: data.user.email
      });
      localStorage.setItem("user", JSON.stringify({ userId: data.user._id, username: data.user.username, email: data.user.email }));
  
      // Assuming the token expires in 1 hour — customize as needed
      const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour
      setSessionExpiry(expiresAt);
      localStorage.setItem("sessionExpiry", expiresAt);
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
      setUser({
        userId: data.user._id,
        username: data.user.username,
        email: data.user.email
      });
      localStorage.setItem("user", JSON.stringify({ userId: data.user._id, username: data.user.username, email: data.user.email }));
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
      await logoutUser(); // optional, backend logout
    } catch (err) {
      setError(err.message);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("sessionExpiry");
      localStorage.removeItem("user");
      setUser(null);
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

  useEffect(() => {
    const storedExpiry = localStorage.getItem("sessionExpiry");
    if (storedExpiry) {
      setSessionExpiry(parseInt(storedExpiry));
    }
  }, []);

  useEffect(() => {
    if (!sessionExpiry) return;
  
    const now = Date.now();
    const remainingTime = sessionExpiry - now;
  
    if (remainingTime <= 0) {
      logout();
      return;
    }
  
    const timeout = setTimeout(() => {
      logout();
    }, remainingTime);
  
    return () => clearTimeout(timeout);
  }, [sessionExpiry]);

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