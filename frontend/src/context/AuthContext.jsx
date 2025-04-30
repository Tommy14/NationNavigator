// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import React from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 🧠 Load session from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedExpiry = localStorage.getItem('expiry');
  
    if (storedUser && storedExpiry) {
      const isExpired = Date.now() > Number(storedExpiry);
      if (isExpired) {
        logout();
      } else {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  useEffect(() => {
    const storedExpiry = localStorage.getItem('expiry');
    if (!storedExpiry) return;
  
    const remainingTime = Number(storedExpiry) - Date.now();
    if (remainingTime <= 0) return;
  
    const timer = setTimeout(() => {
      logout(); // ⏰ Auto logout
      alert('Session expired. You have been logged out.');
    }, remainingTime);
  
    return () => clearTimeout(timer);
  }, [user]);

  const login = (userData) => {
    const expiresIn = 60 * 60 * 1000; // 1 hour in ms
    const expiryTime = Date.now() + expiresIn;
  
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('expiry', expiryTime); // 🧪
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);