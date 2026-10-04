import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';

import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    () =>
      localStorage.getItem(
        'medisetu_access_token'
      ) || null
  );

  const [user, setUser] = useState(null);

  const [role, setRole] = useState(
    () =>
      localStorage.getItem(
        'medisetu_role'
      ) || 'patient'
  );

  const [isLoading, setIsLoading] =
    useState(true);

  // --------------------------------------------------
  // Logout
  // --------------------------------------------------

  const logout = () => {
    localStorage.removeItem(
      'medisetu_access_token'
    );

    localStorage.removeItem(
      'medisetu_refresh_token'
    );

    localStorage.removeItem(
      'medisetu_role'
    );

    setToken(null);
    setUser(null);
    setRole('patient');
  };

  // --------------------------------------------------
  // Login
  // --------------------------------------------------

  const login = (
    newToken,
    userData,
    userRole = 'patient'
  ) => {
    localStorage.setItem(
      'medisetu_access_token',
      newToken
    );

    localStorage.setItem(
      'medisetu_role',
      userRole
    );

    setToken(newToken);
    setUser(userData);
    setRole(userRole);
  };

  // --------------------------------------------------
  // Restore session
  // --------------------------------------------------

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      if (token) {
        try {
          const userData =
            await authService.getCurrentUser();

          if (isMounted) {
            setUser(userData);

            if (userData?.role) {
              const backendRole =
                userData.role.toUpperCase();

              setRole(backendRole);

              localStorage.setItem(
                'medisetu_role',
                backendRole
              );
            }
          }
        } catch (err) {
          console.warn(
            'Session expired or invalid token:',
            err.message
          );

          if (isMounted) {
            logout();
          }
        }
      }

      if (isMounted) {
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        role,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
        setRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within an AuthProvider'
    );
  }

  return context;
};