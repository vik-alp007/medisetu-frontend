import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('medisetu_access_token') || null);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(() => localStorage.getItem('medisetu_role') || 'patient');
  const [isLoading, setIsLoading] = useState(true);

  // Sync token from localStorage and fetch current user if token exists
  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
          if (userData?.role) {
            setRole(userData.role);
            localStorage.setItem('medisetu_role', userData.role);
          }
        } catch (err) {
          console.warn('Session expired or invalid token:', err.message);
          logout();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, [token]);

  const login = (newToken, userData, userRole = 'patient') => {
    localStorage.setItem('medisetu_access_token', newToken);
    localStorage.setItem('medisetu_role', userRole);
    setToken(newToken);
    setUser(userData);
    setRole(userRole);
  };

  const logout = () => {
    localStorage.removeItem('medisetu_access_token');
    localStorage.removeItem('medisetu_role');
    setToken(null);
    setUser(null);
    setRole('patient');
  };

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
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
