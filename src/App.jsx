import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import BareLayout from './layouts/BareLayout';

// Public & Auth Pages
import SplashScreen from './pages/public/SplashScreen';
import OnboardingScreen from './pages/public/OnboardingScreen';
import RegisterScreen from './pages/public/RegisterScreen';
import AdminLandingScreen from './pages/public/AdminLandingScreen';
import LoginScreen from './pages/public/LoginScreen';
import ComponentPreviewScreen from './pages/public/ComponentPreviewScreen';

// Placeholder dashboards
import DoctorDashboardPlaceholder from './pages/placeholders/DoctorDashboardPlaceholder';
import AdminDashboardPlaceholder from './pages/placeholders/AdminDashboardPlaceholder';

// Patient Screens
import PatientDashboardScreen from './pages/patient/PatientDashboardScreen';
import FindDoctorsScreen from './pages/patient/FindDoctorsScreen';
import DoctorProfileScreen from './pages/patient/DoctorProfileScreen';
import BookAppointmentScreen from './pages/patient/BookAppointmentScreen';
import AppointmentConfirmationScreen from './pages/patient/AppointmentConfirmationScreen';
import MedicalRecordsScreen from './pages/patient/MedicalRecordsScreen';
import PrescriptionsScreen from './pages/patient/PrescriptionsScreen';
import EmergencyScreen from './pages/patient/EmergencyScreen';
import BillsScreen from './pages/patient/BillsScreen';
import PatientProfileScreen from './pages/patient/PatientProfileScreen';

/*
|--------------------------------------------------------------------------
| Protected Route
|--------------------------------------------------------------------------
*/

const ProtectedRoute = ({ children, allowedRoles }) => {
  const {
    isAuthenticated,
    isLoading,
    role,
  } = useAuth();

  // Wait until AuthContext finishes restoring the session.
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            Checking your session...
          </p>
        </div>
      </div>
    );
  }

  // No valid access token.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Role-based protection.
  if (
    allowedRoles &&
    allowedRoles.length > 0 &&
    !allowedRoles.includes(String(role).toUpperCase())
  ) {
    const normalizedRole = String(role).toUpperCase();

    if (normalizedRole === 'DOCTOR') {
      return <Navigate to="/dashboard/doctor" replace />;
    }

    if (normalizedRole === 'ADMIN') {
      return <Navigate to="/dashboard/admin" replace />;
    }

    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>

            {/* =========================================================
                PUBLIC ROUTES
            ========================================================= */}

            <Route element={<BareLayout />}>
              <Route path="/" element={<SplashScreen />} />
            </Route>

            <Route
              path="/onboarding"
              element={<OnboardingScreen />}
            />

            {/* Registration */}
            <Route
              path="/register"
              element={<RegisterScreen initialRole="patient" />}
            />

            <Route
              path="/register/doctor"
              element={<RegisterScreen initialRole="doctor" />}
            />

            <Route
              path="/register/admin"
              element={<AdminLandingScreen />}
            />

            <Route
              path="/register/admin-form"
              element={<RegisterScreen initialRole="admin" />}
            />

            {/* Login */}
            <Route
              path="/login"
              element={<LoginScreen />}
            />

            {/* Component preview */}
            <Route
              path="/components"
              element={<ComponentPreviewScreen />}
            />

            {/* =========================================================
                PATIENT PROTECTED ROUTES
            ========================================================= */}

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={['PATIENT']}>
                  <PatientDashboardScreen />
                </ProtectedRoute>
              }
            />

            <Route
              path="/doctors"
              element={
                <ProtectedRoute allowedRoles={['PATIENT']}>
                  <FindDoctorsScreen />
                </ProtectedRoute>
              }
            />

            <Route
              path="/doctors/:id"
              element={
                <ProtectedRoute allowedRoles={['PATIENT']}>
                  <DoctorProfileScreen />
                </ProtectedRoute>
              }
            />

            <Route
              path="/appointments/book/:doctorId"
              element={
                <ProtectedRoute allowedRoles={['PATIENT']}>
                  <BookAppointmentScreen />
                </ProtectedRoute>
              }
            />

            <Route
              path="/appointments/confirmation"
              element={
                <ProtectedRoute allowedRoles={['PATIENT']}>
                  <AppointmentConfirmationScreen />
                </ProtectedRoute>
              }
            />

            <Route
              path="/records"
              element={
                <ProtectedRoute allowedRoles={['PATIENT']}>
                  <MedicalRecordsScreen />
                </ProtectedRoute>
              }
            />

            <Route
              path="/prescriptions"
              element={
                <ProtectedRoute allowedRoles={['PATIENT']}>
                  <PrescriptionsScreen />
                </ProtectedRoute>
              }
            />

            {/* Emergency is intentionally public.
                A patient should not need login to reach emergency help. */}
            <Route
              path="/emergency"
              element={<EmergencyScreen />}
            />

            <Route
              path="/bills"
              element={
                <ProtectedRoute allowedRoles={['PATIENT']}>
                  <BillsScreen />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={['PATIENT']}>
                  <PatientProfileScreen />
                </ProtectedRoute>
              }
            />

            {/* =========================================================
                DOCTOR / ADMIN PLACEHOLDERS
            ========================================================= */}

            <Route
              path="/dashboard/doctor"
              element={
                <ProtectedRoute allowedRoles={['DOCTOR']}>
                  <DoctorDashboardPlaceholder />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/admin"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboardPlaceholder />
                </ProtectedRoute>
              }
            />

            {/* =========================================================
                FALLBACK
            ========================================================= */}

            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />

          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;