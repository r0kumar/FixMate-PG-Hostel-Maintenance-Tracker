import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to determine destination route based on real user role
  const getRoleDashboard = (role) => {
    switch (role) {
      case 'admin':
        return '/dashboard/admin';
      case 'staff':
        return '/dashboard/staff';
      case 'resident':
      default:
        return '/dashboard/resident';
    }
  };

  // Check and restore real user session on mount
  useEffect(() => {
    const verifySession = async () => {
      const storedUser = localStorage.getItem('fixmate_real_user');

      if (!storedUser) {
        setLoading(false);
        return;
      }

      try {
        const parsed = JSON.parse(storedUser);
        if (parsed?.token) {
          // Verify token validity against backend /api/auth/me
          const { data } = await api.get('/auth/me');
          const updatedUser = {
            ...data,
            token: parsed.token,
          };
          setUser(updatedUser);
          localStorage.setItem('fixmate_real_user', JSON.stringify(updatedUser));
        } else {
          localStorage.removeItem('fixmate_real_user');
          setUser(null);
        }
      } catch (err) {
        console.warn('Real user session verification failed:', err.message);
        localStorage.removeItem('fixmate_real_user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, []);

  // Real Login handler
  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', {
      email: email.trim().toLowerCase(),
      password,
    });

    setUser(data);
    localStorage.setItem('fixmate_real_user', JSON.stringify(data));
    return data;
  };

  // Real Resident registration handler
  const register = async (userData) => {
    const { data } = await api.post('/auth/register', userData);

    setUser(data);
    localStorage.setItem('fixmate_real_user', JSON.stringify(data));
    return data;
  };

  // Real Logout handler (Clears only real session)
  const logout = () => {
    setUser(null);
    localStorage.removeItem('fixmate_real_user');
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
