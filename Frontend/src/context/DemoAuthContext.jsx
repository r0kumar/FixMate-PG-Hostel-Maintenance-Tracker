import React, { createContext, useContext, useState, useEffect } from 'react';
import demoApi from '../services/demoApi';

const DemoAuthContext = createContext(null);

export const DemoAuthProvider = ({ children }) => {
  const [demoUser, setDemoUser] = useState(null);
  const [demoLoading, setDemoLoading] = useState(true);

  // Helper to determine destination route in Demo mode
  const getDemoDashboard = (role) => {
    switch (role) {
      case 'admin':
        return '/demo/admin';
      case 'staff':
        return '/demo/staff';
      case 'resident':
      default:
        return '/demo/resident';
    }
  };

  // Check and restore demo session on mount
  useEffect(() => {
    const verifyDemoSession = async () => {
      const storedDemo = localStorage.getItem('fixmate_demo_session');

      if (!storedDemo) {
        setDemoLoading(false);
        return;
      }

      try {
        const parsed = JSON.parse(storedDemo);
        if (parsed?.token && parsed?.isDemo) {
          // Verify against dedicated backend /api/demo/auth/me
          const { data } = await demoApi.get('/auth/me');
          const updatedDemo = {
            ...data,
            token: parsed.token,
            isDemo: true,
          };
          setDemoUser(updatedDemo);
          localStorage.setItem('fixmate_demo_session', JSON.stringify(updatedDemo));
        } else {
          localStorage.removeItem('fixmate_demo_session');
          setDemoUser(null);
        }
      } catch (err) {
        console.warn('Demo session verification failed or expired:', err.message);
        localStorage.removeItem('fixmate_demo_session');
        setDemoUser(null);
      } finally {
        setDemoLoading(false);
      }
    };

    verifyDemoSession();
  }, []);

  // Demo Login handler (Calls POST /api/demo/auth/login)
  const loginDemo = async (role) => {
    const { data } = await demoApi.post('/auth/login', { role });
    const sessionData = {
      ...data,
      isDemo: true,
    };
    setDemoUser(sessionData);
    localStorage.setItem('fixmate_demo_session', JSON.stringify(sessionData));
    return sessionData;
  };

  // Safe Demo Data Reset handler (POST /api/demo/reset)
  const resetDemo = async () => {
    const { data } = await demoApi.post('/reset');
    return data;
  };

  // Demo Logout handler (Clears only demo session)
  const logoutDemo = () => {
    setDemoUser(null);
    localStorage.removeItem('fixmate_demo_session');
  };

  return (
    <DemoAuthContext.Provider
      value={{
        demoUser,
        demoLoading,
        isDemoAuthenticated: !!demoUser,
        loginDemo,
        resetDemo,
        logoutDemo,
        getDemoDashboard,
      }}
    >
      {children}
    </DemoAuthContext.Provider>
  );
};

export const useDemoAuth = () => {
  const context = useContext(DemoAuthContext);
  if (!context) {
    throw new Error('useDemoAuth must be used within a DemoAuthProvider');
  }
  return context;
};

