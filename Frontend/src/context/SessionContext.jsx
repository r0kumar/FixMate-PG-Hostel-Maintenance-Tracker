import React, { createContext, useContext } from 'react';
import defaultApi from '../services/api';

const SessionContext = createContext(null);

export const SessionProvider = ({
  children,
  user,
  logout,
  api = defaultApi,
  isDemo = false,
  baseRoute = '/dashboard',
}) => {
  return (
    <SessionContext.Provider
      value={{
        user,
        logout,
        api,
        isDemo,
        baseRoute,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    // Graceful fallback for components used outside SessionProvider
    return {
      user: null,
      logout: () => {},
      api: defaultApi,
      isDemo: false,
      baseRoute: '/dashboard',
    };
  }
  return context;
};

