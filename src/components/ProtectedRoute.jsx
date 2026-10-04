import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import LoadingSpinner from './feedback/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

const normalizeRole = (role) => String(role || '').toUpperCase();

export const homeForRole = (role) => {
  const r = normalizeRole(role);
  if (r === 'DOCTOR') return '/dashboard/doctor';
  if (r === 'ADMIN') return '/dashboard/admin';
  return '/dashboard';
};

/**
 * Single shared route guard (used by App.jsx).
 *  - waits for the session to be restored (/api/auth/me/)
 *  - unauthenticated -> /login (remembers where the user was going)
 *  - wrong role      -> that role's own dashboard
 * Works both as a wrapper (children) and as a layout route (Outlet).
 */
export const ProtectedRoute = ({ allowedRoles, children }) => {
  const { isAuthenticated, isLoading, role } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-[#F4F9FF] dark:bg-[#0B132B]">
        <LoadingSpinner size="lg" />
        <p className="text-sm text-medisetu-muted dark:text-slate-400">Checking your session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles?.length && !allowedRoles.map(normalizeRole).includes(normalizeRole(role))) {
    return <Navigate to={homeForRole(role)} replace />;
  }

  return children || <Outlet />;
};

export default ProtectedRoute;
