import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import BareLayout from './layouts/BareLayout';
import ProtectedRoute from './components/ProtectedRoute';

import SplashScreen from './pages/public/SplashScreen';
import OnboardingScreen from './pages/public/OnboardingScreen';
import RegisterScreen from './pages/public/RegisterScreen';
import AdminLandingScreen from './pages/public/AdminLandingScreen';
import LoginScreen from './pages/public/LoginScreen';
import ComponentPreviewScreen from './pages/public/ComponentPreviewScreen';

import DoctorDashboardPlaceholder from './pages/placeholders/DoctorDashboardPlaceholder';
import AdminDashboardPlaceholder from './pages/placeholders/AdminDashboardPlaceholder';

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

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<BareLayout />}>
              <Route path="/" element={<SplashScreen />} />
            </Route>

            <Route path="/onboarding" element={<OnboardingScreen />} />
            <Route path="/register" element={<RegisterScreen initialRole="patient" />} />
            <Route path="/register/doctor" element={<RegisterScreen initialRole="doctor" />} />
            <Route path="/register/admin" element={<AdminLandingScreen />} />
            <Route path="/register/admin-form" element={<RegisterScreen initialRole="admin" />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/components" element={<ComponentPreviewScreen />} />

            {/* Emergency is intentionally public. */}
            <Route path="/emergency" element={<EmergencyScreen />} />

            <Route element={<ProtectedRoute allowedRoles={['PATIENT']} />}>
              <Route path="/dashboard" element={<PatientDashboardScreen />} />
              <Route path="/doctors" element={<FindDoctorsScreen />} />
              <Route path="/doctors/:id" element={<DoctorProfileScreen />} />
              <Route path="/appointments/book/:doctorId" element={<BookAppointmentScreen />} />
              <Route path="/appointments/confirmation" element={<AppointmentConfirmationScreen />} />
              <Route path="/records" element={<MedicalRecordsScreen />} />
              <Route path="/prescriptions" element={<PrescriptionsScreen />} />
              <Route path="/bills" element={<BillsScreen />} />
              <Route path="/profile" element={<PatientProfileScreen />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['DOCTOR']} />}>
              <Route path="/dashboard/doctor" element={<DoctorDashboardPlaceholder />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route path="/dashboard/admin" element={<AdminDashboardPlaceholder />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
