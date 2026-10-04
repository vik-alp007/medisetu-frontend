import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import LoadingSpinner from './feedback/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

const normalizeRole = (role) => role?.toUpperCase();

export const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, isLoading, role } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#F4F9FF] dark:bg-[#0B132B]"><LoadingSpinner size="lg" /></div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles?.length && !allowedRoles.map(normalizeRole).includes(normalizeRole(role))) {
    const normalized = normalizeRole(role);
    if (normalized === 'DOCTOR') return <Navigate to="/dashboard/doctor" replace />;
    if (normalized === 'ADMIN') return <Navigate to="/dashboard/admin" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
