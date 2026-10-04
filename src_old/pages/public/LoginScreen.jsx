import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Stethoscope, Building2, AtSign } from 'lucide-react';

import AuthLayout from '../../layouts/AuthLayout';
import MediSetuLogo from '../../components/common/MediSetuLogo';
import SegmentedTabs from '../../components/common/SegmentedTabs';
import InputField from '../../components/common/InputField';
import PasswordInput from '../../components/common/PasswordInput';
import Checkbox from '../../components/common/Checkbox';
import PrimaryButton from '../../components/common/PrimaryButton';
import BackButton from '../../components/navigation/BackButton';
import DoctorHeroIllustration from '../../assets/illustrations/DoctorHeroIllustration';
import ErrorAlert from '../../components/feedback/ErrorAlert';

import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

/**
 * LoginScreen
 *
 * Backend:
 * POST /api/auth/login/
 *
 * Request:
 * {
 *   username: string,
 *   password: string
 * }
 *
 * Response:
 * {
 *   refresh: string,
 *   access: string,
 *   user: {
 *     id,
 *     username,
 *     email,
 *     first_name,
 *     last_name,
 *     role
 *   }
 * }
 */

export const LoginScreen = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [activeRole, setActiveRole] = useState('patient');

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  // --------------------------------------------------
  // Handle input change
  // --------------------------------------------------

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }

    if (apiError) {
      setApiError(null);
    }
  };

  // --------------------------------------------------
  // Validation
  // --------------------------------------------------

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password =
        'Password must be at least 6 characters';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // --------------------------------------------------
  // Portal redirect
  // --------------------------------------------------

  const handlePortalRedirect = (role) => {
    const normalizedRole = role?.toUpperCase();

    if (normalizedRole === 'DOCTOR') {
      navigate('/dashboard/doctor');
      return;
    }

    if (normalizedRole === 'ADMIN') {
      navigate('/dashboard/admin');
      return;
    }

    navigate('/dashboard');
  };

  // --------------------------------------------------
  // Login
  // --------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setApiError(null);

    try {
      // EXACT backend login contract
      const payload = {
        username: formData.username.trim(),
        password: formData.password,
      };

      console.log('MediSetu login request:', {
        username: payload.username,
      });

      const response = await authService.login(payload);

      console.log('MediSetu login successful');

      // Backend response:
      //
      // {
      //   refresh: "...",
      //   access: "...",
      //   user: {...}
      // }

      const accessToken = response?.access;
      const refreshToken = response?.refresh;
      const userData = response?.user;

      // Safety check
      if (!accessToken) {
        throw new Error(
          'Login successful but access token was not returned by the server.'
        );
      }

      if (!userData) {
        throw new Error(
          'Login successful but user information was not returned by the server.'
        );
      }

      // Store refresh token separately.
      // AuthContext already stores the access token.
      if (refreshToken) {
        localStorage.setItem(
          'medisetu_refresh_token',
          refreshToken
        );
      }

      // Backend is the source of truth for role.
      const backendRole =
        userData.role?.toUpperCase() || 'PATIENT';

      // Save authentication state.
      login(
        accessToken,
        userData,
        backendRole
      );

      // Redirect according to backend role.
      handlePortalRedirect(backendRole);
    } catch (error) {
      console.error(
        'MediSetu login failed:',
        error
      );

      const responseData = error?.response?.data;

      let message =
        'Login failed. Please check your username and password.';

      // 401:
      // {
      //   "detail": "No active account found..."
      // }
      if (responseData?.detail) {
        message = responseData.detail;
      }

      // 400:
      // {
      //   "username": ["This field is required."],
      //   "password": ["This field is required."]
      // }
      else if (
        responseData &&
        typeof responseData === 'object'
      ) {
        const messages = [];

        Object.entries(responseData).forEach(
          ([field, value]) => {
            if (Array.isArray(value)) {
              messages.push(
                `${field}: ${value.join(', ')}`
              );
            } else if (
              typeof value === 'string'
            ) {
              messages.push(
                `${field}: ${value}`
              );
            }
          }
        );

        if (messages.length > 0) {
          message = messages.join(' | ');
        }
      }

      // Network/server error
      else if (error?.message) {
        message = error.message;
      }

      setApiError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --------------------------------------------------
  // Left Hero
  // --------------------------------------------------

  const leftHeroContent = (
    <div className="space-y-6">
      <Link
        to="/"
        className="inline-block hover:opacity-95 transition-opacity"
      >
        <MediSetuLogo size="md" />
      </Link>

      <div>
        <h2 className="text-3xl lg:text-4xl font-extrabold text-medisetu-navy tracking-tight leading-tight">
          Welcome Back <br />
          to MediSetu
        </h2>

        <p className="text-sm lg:text-base text-medisetu-muted mt-2 max-w-sm leading-relaxed">
          Access your appointments, medical records,
          and healthcare portal in one place.
        </p>
      </div>

      <div className="pt-4 flex items-center justify-center lg:justify-start">
        <DoctorHeroIllustration />
      </div>
    </div>
  );

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <AuthLayout leftContent={leftHeroContent}>
      <div className="space-y-5">

        {/* Top navigation */}
        <div className="flex items-center justify-between">
          <BackButton
            onClick={() => navigate(-1)}
          />

          <Link
            to="/register"
            className="text-xs font-semibold text-medisetu-primary hover:underline"
          >
            Don't have an account?{' '}
            <span className="font-bold">
              Register
            </span>
          </Link>
        </div>

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-medisetu-navy">
            Sign In to Your Account
          </h1>

          <p className="text-xs sm:text-sm text-medisetu-muted mt-1">
            Choose your portal role to continue.
          </p>
        </div>

        {/* Role switcher */}
        <SegmentedTabs
          tabs={[
            {
              id: 'patient',
              label: 'Patient',
              icon: User,
            },
            {
              id: 'doctor',
              label: 'Doctor',
              icon: Stethoscope,
            },
            {
              id: 'admin',
              label: 'Admin',
              icon: Building2,
            },
          ]}
          activeTab={activeRole}
          onChange={setActiveRole}
        />

        {/* API error */}
        {apiError && (
          <ErrorAlert
            title="Sign In Failed"
            message={apiError}
            onDismiss={() =>
              setApiError(null)
            }
          />
        )}

        {/* Login form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          noValidate
        >

          {/* Username */}
          <InputField
            id="username"
            name="username"
            label="Username"
            placeholder="Enter your username"
            icon={AtSign}
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
            required
          />

          {/* Password */}
          <PasswordInput
            id="password"
            name="password"
            label="Password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
          />

          {/* Remember me */}
          <div className="flex items-center justify-between pt-1">
            <Checkbox
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
            >
              Remember me
            </Checkbox>

            <a
              href="#forgot-password"
              className="text-xs font-semibold text-medisetu-primary hover:underline"
            >
              Forgot password?
            </a>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <PrimaryButton
              fullWidth
              type="submit"
              loading={isSubmitting}
              size="lg"
            >
              Sign In to{' '}
              {activeRole.charAt(0).toUpperCase() +
                activeRole.slice(1)}{' '}
              Portal
            </PrimaryButton>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center pt-2">
          <span className="text-xs text-medisetu-muted">
            New to MediSetu?{' '}
            <Link
              to={
                activeRole === 'doctor'
                  ? '/register/doctor'
                  : activeRole === 'admin'
                  ? '/register/admin'
                  : '/register'
              }
              className="text-medisetu-primary font-bold hover:underline"
            >
              Create an account
            </Link>
          </span>
        </div>

      </div>
    </AuthLayout>
  );
};

export default LoginScreen;