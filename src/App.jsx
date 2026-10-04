import React, { Suspense, lazy } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { ThemeProvider } from './context/ThemeContext';

import BareLayout from './layouts/BareLayout';

// Public & Auth Pages
import SplashScreen from './pages/public/SplashScreen';
import OnboardingScreen from './pages/public/OnboardingScreen';
import RegisterScreen from './pages/public/RegisterScreen';
import AdminLandingScreen from './pages/public/AdminLandingScreen';
import LoginScreen from './pages/public/LoginScreen';
const ComponentPreviewScreen = lazy(() => import('./pages/public/ComponentPreviewScreen'));

// Staff dashboards
// Lazy-loaded so patients never download staff dashboard code.
const DoctorDashboardScreen = lazy(() => import('./pages/doctor/DoctorDashboardScreen'));
const AdminDashboardScreen = lazy(() => import('./pages/admin/AdminDashboardScreen'));

const RouteFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#F4F9FF] dark:bg-[#0B132B] text-sm text-slate-500">
    Loading...
  </div>
);

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
import PatientAppointmentsScreen from './pages/patient/PatientAppointmentsScreen';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<RouteFallback />}>
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

            {/* Appointments list - target of the bottom-nav "Appointments" tab */}
            <Route
              path="/appointments"
              element={
                <ProtectedRoute allowedRoles={['PATIENT']}>
                  <PatientAppointmentsScreen />
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
                DOCTOR / ADMIN DASHBOARDS
            ========================================================= */}

            <Route
              path="/dashboard/doctor"
              element={
                <ProtectedRoute allowedRoles={['DOCTOR']}>
                  <DoctorDashboardScreen />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/admin"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboardScreen />
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
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;