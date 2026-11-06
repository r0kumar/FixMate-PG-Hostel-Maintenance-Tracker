import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to determine destination route based on role
  const getRoleDashboard = (role) => {
    switch (role) {
      case 'admin':
        return '/admin/dashboard';
      case 'staff':
        return '/staff/dashboard';
      case 'resident':
      default:
        return '/resident/dashboard';
    }
  };

  // Check and restore user session on mount
  useEffect(() => {
    const verifySession = async () => {
      const storedUser = localStorage.getItem('fixmate_user');

      if (!storedUser) {
        setLoading(false);
        return;
      }

      try {
        const parsed = JSON.parse(storedUser);
        if (parsed?.token) {
          // Verify token validity against backend /api/auth/me
          const { data } = await api.get('/auth/me');
          const updatedUser = { ...data, token: parsed.token };
          setUser(updatedUser);
          localStorage.setItem('fixmate_user', JSON.stringify(updatedUser));
        } else {
          localStorage.removeItem('fixmate_user');
          setUser(null);
        }
      } catch (err) {
        console.warn('Session verification failed or token expired:', err.message);
        localStorage.removeItem('fixmate_user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, []);

  // Login handler
  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', {
      email: email.trim().toLowerCase(),
      password,
    });

    setUser(data);
    localStorage.setItem('fixmate_user', JSON.stringify(data));
    return data;
  };

  // Resident registration handler
  const register = async (userData) => {
    const { data } = await api.post('/auth/register', userData);

    setUser(data);
    localStorage.setItem('fixmate_user', JSON.stringify(data));
    return data;
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    localStorage.removeItem('fixmate_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        getRoleDashboard,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
