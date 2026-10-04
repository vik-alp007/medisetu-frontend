import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import BareLayout from './layouts/BareLayout';

// Public & Auth Pages (Phase 3)
import SplashScreen from './pages/public/SplashScreen';
import OnboardingScreen from './pages/public/OnboardingScreen';
import RegisterScreen from './pages/public/RegisterScreen';
import AdminLandingScreen from './pages/public/AdminLandingScreen';
import LoginScreen from './pages/public/LoginScreen';
import ComponentPreviewScreen from './pages/public/ComponentPreviewScreen';

// Placeholders for Doctor & Admin Dashboards
import DoctorDashboardPlaceholder from './pages/placeholders/DoctorDashboardPlaceholder';
import AdminDashboardPlaceholder from './pages/placeholders/AdminDashboardPlaceholder';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Splash Screen (Screen 1) */}
          <Route element={<BareLayout />}>
            <Route path="/" element={<SplashScreen />} />
          </Route>

          {/* Onboarding Flow: 3 Slides in 1 Screen (Screens 2, 3, 4) */}
          <Route path="/onboarding" element={<OnboardingScreen />} />

          {/* Registration Flows */}
          {/* Patient Registration (Screen 5) */}
          <Route path="/register" element={<RegisterScreen initialRole="patient" />} />
          {/* Doctor Registration (Screen 7 Left) */}
          <Route path="/register/doctor" element={<RegisterScreen initialRole="doctor" />} />
          {/* Admin Registration Landing (Screen 6) */}
          <Route path="/register/admin" element={<AdminLandingScreen />} />
          {/* Admin Registration Form (Screen 7 Right) */}
          <Route path="/register/admin-form" element={<RegisterScreen initialRole="admin" />} />

          {/* Login Screen */}
          <Route path="/login" element={<LoginScreen />} />

          {/* Component Showcase Gallery */}
          <Route path="/components" element={<ComponentPreviewScreen />} />

          {/* Backend Placeholder Dashboards */}
          <Route path="/dashboard/doctor" element={<DoctorDashboardPlaceholder />} />
          <Route path="/dashboard/admin" element={<AdminDashboardPlaceholder />} />

          {/* Catch-all Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
