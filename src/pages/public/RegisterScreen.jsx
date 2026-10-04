import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  User,
  Phone,
  Mail,
  Calendar,
  Stethoscope,
  Building2,
  MapPin,
  Briefcase,
  IdCard,
  AtSign,
} from 'lucide-react';

import AuthLayout from '../../layouts/AuthLayout';
import MediSetuLogo from '../../components/common/MediSetuLogo';
import SegmentedTabs from '../../components/common/SegmentedTabs';
import InputField from '../../components/common/InputField';
import PasswordInput from '../../components/common/PasswordInput';
import SelectDropdown from '../../components/common/SelectDropdown';
import Checkbox from '../../components/common/Checkbox';
import PrimaryButton from '../../components/common/PrimaryButton';
import BackButton from '../../components/navigation/BackButton';
import DoctorHeroIllustration from '../../assets/illustrations/DoctorHeroIllustration';
import ErrorAlert from '../../components/feedback/ErrorAlert';

import { authService } from '../../services/authService';

/**
 * RegisterScreen
 *
 * Handles registration for:
 * - Patient
 * - Doctor
 * - Admin
 *
 * Backend:
 * POST /api/auth/register/
 *
 * Backend roles:
 * PATIENT
 * DOCTOR
 * ADMIN
 */
export const RegisterScreen = ({ initialRole = 'patient' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // --------------------------------------------------
  // Determine initial role
  // --------------------------------------------------

  const getInitialRole = () => {
    const params = new URLSearchParams(location.search);

    if (
      params.get('role') === 'admin' ||
      location.pathname.includes('/admin-form')
    ) {
      return 'admin';
    }

    if (
      location.pathname.includes('/doctor') ||
      params.get('role') === 'doctor'
    ) {
      return 'doctor';
    }

    return initialRole;
  };

  const [activeRole, setActiveRole] = useState(getInitialRole);

  // --------------------------------------------------
  // Keep role synced with URL
  // --------------------------------------------------

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    if (
      params.get('role') === 'admin' ||
      location.pathname.includes('/admin-form')
    ) {
      setActiveRole('admin');
    } else if (
      location.pathname.includes('/doctor') ||
      params.get('role') === 'doctor'
    ) {
      setActiveRole('doctor');
    } else if (
      location.pathname === '/register' &&
      !params.get('role')
    ) {
      setActiveRole('patient');
    }
  }, [location.pathname, location.search]);

  // --------------------------------------------------
  // Form State
  // --------------------------------------------------

  const [formData, setFormData] = useState({
    // Backend-required common field
    username: '',

    // Common
    fullName: '',
    mobileNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,

    // Patient
    dateOfBirth: '',
    gender: '',

    // Doctor
    registrationNumber: '',
    specialization: '',
    hospitalName: '',
    clinicAddress: '',

    // Admin
    designation: '',
    organizationName: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedNotice, setSubmittedNotice] = useState(null);
  const [apiError, setApiError] = useState(null);

  // --------------------------------------------------
  // Role Change
  // --------------------------------------------------

  const handleRoleChange = (role) => {
    setActiveRole(role);
    setErrors({});
    setSubmittedNotice(null);
    setApiError(null);

    if (role === 'doctor') {
      navigate('/register/doctor');
    } else if (role === 'admin') {
      navigate('/register?role=admin');
    } else {
      navigate('/register');
    }
  };

  // --------------------------------------------------
  // Input Change
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

    if (submittedNotice) {
      setSubmittedNotice(null);
    }
  };

  // --------------------------------------------------
  // Split full name
  // --------------------------------------------------

  const getNameParts = () => {
    const cleanedName = formData.fullName.trim();

    if (!cleanedName) {
      return {
        first_name: '',
        last_name: '',
      };
    }

    const nameParts = cleanedName.split(/\s+/);

    const first_name = nameParts[0];

    const last_name =
      nameParts.length > 1
        ? nameParts.slice(1).join(' ')
        : '';

    return {
      first_name,
      last_name,
    };
  };

  // --------------------------------------------------
  // Frontend Validation
  // --------------------------------------------------

  const validateForm = () => {
    const newErrors = {};

    // Username
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (
      !/^[a-zA-Z0-9_.-]{3,30}$/.test(formData.username.trim())
    ) {
      newErrors.username =
        'Username must be 3-30 characters and use only letters, numbers, _, . or -';
    }

    // Full Name
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    }

    // Mobile
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile Number is required';
    } else if (
      !/^[0-9+ -]{8,15}$/.test(formData.mobileNumber.trim())
    ) {
      newErrors.mobileNumber = 'Enter a valid mobile number';
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = 'Email Address is required';
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      newErrors.email = 'Enter a valid email address';
    }

    // Password
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password =
        'Password must be at least 6 characters';
    }

    // Confirm Password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword =
        'Confirm your password';
    } else if (
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword =
        'Passwords do not match';
    }

    // Terms
    if (!formData.agreeTerms) {
      newErrors.agreeTerms =
        'You must agree to the Terms & Privacy Policy';
    }

    // --------------------------------------------------
    // Patient validation
    // --------------------------------------------------

    if (activeRole === 'patient') {
      if (!formData.dateOfBirth) {
        newErrors.dateOfBirth =
          'Date of birth is required';
      }

      if (!formData.gender) {
        newErrors.gender =
          'Please select a gender';
      }
    }

    // --------------------------------------------------
    // Doctor validation
    // --------------------------------------------------

    if (activeRole === 'doctor') {
      if (!formData.registrationNumber.trim()) {
        newErrors.registrationNumber =
          'Registration Number (MCI/NMC) is required';
      }

      if (!formData.specialization) {
        newErrors.specialization =
          'Please select specialization';
      }

      if (!formData.hospitalName.trim()) {
        newErrors.hospitalName =
          'Hospital / Clinic name is required';
      }

      if (!formData.clinicAddress.trim()) {
        newErrors.clinicAddress =
          'Clinic address is required';
      }
    }

    // --------------------------------------------------
    // Admin validation
    // --------------------------------------------------

    if (activeRole === 'admin') {
      if (!formData.designation) {
        newErrors.designation =
          'Please select your designation';
      }

      if (!formData.organizationName.trim()) {
        newErrors.organizationName =
          'Organization / Hospital name is required';
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // --------------------------------------------------
  // Build Backend Payload
  // --------------------------------------------------

  const buildRegistrationPayload = () => {
    const { first_name, last_name } = getNameParts();

    const payload = {
      username: formData.username.trim(),
      email: formData.email.trim(),
      password: formData.password,
      role: activeRole.toUpperCase(),

      first_name,
      last_name,
    };

    // --------------------------------------------------
    // Patient
    // --------------------------------------------------

    if (activeRole === 'patient') {
      if (formData.dateOfBirth) {
        payload.date_of_birth = formData.dateOfBirth;
      }
    }

    // --------------------------------------------------
    // Doctor
    // --------------------------------------------------

    if (activeRole === 'doctor') {
      if (formData.specialization) {
        payload.specialization =
          formData.specialization;
      }

      if (formData.mobileNumber.trim()) {
        payload.phone =
          formData.mobileNumber.trim();
      }
    }

    // --------------------------------------------------
    // IMPORTANT:
    //
    // We intentionally DO NOT send:
    //
    // Patient:
    // - gender
    // - mobileNumber
    //
    // Doctor:
    // - registrationNumber
    // - hospitalName
    // - clinicAddress
    //
    // Admin:
    // - designation
    // - organizationName
    //
    // because these fields are not part of the
    // confirmed backend registration contract.
    // --------------------------------------------------

    return payload;
  };

  // --------------------------------------------------
  // Extract backend error
  // --------------------------------------------------

  const getBackendErrorMessage = (error) => {
    const responseData = error?.response?.data;

    if (!responseData) {
      return (
        error?.message ||
        'Unable to connect to the server. Please try again.'
      );
    }

    if (typeof responseData === 'string') {
      return responseData;
    }

    if (responseData.detail) {
      return responseData.detail;
    }

    if (responseData.message) {
      return responseData.message;
    }

    // Django-style field errors
    if (typeof responseData === 'object') {
      const messages = [];

      Object.entries(responseData).forEach(
        ([field, value]) => {
          if (Array.isArray(value)) {
            messages.push(
              `${field}: ${value.join(', ')}`
            );
          } else if (typeof value === 'string') {
            messages.push(`${field}: ${value}`);
          }
        }
      );

      if (messages.length > 0) {
        return messages.join(' | ');
      }
    }

    return 'Registration failed. Please check your details and try again.';
  };

  // --------------------------------------------------
  // Submit
  // --------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setApiError(null);
    setSubmittedNotice(null);

    try {
      const payload = buildRegistrationPayload();

      console.log(
        'MediSetu registration payload:',
        payload
      );

      // REAL BACKEND CALL
      const response =
        await authService.register(payload);

      console.log(
        'Registration successful:',
        response
      );

      setSubmittedNotice({
        type: 'success',
        message:
          'Account created successfully. Redirecting to login...',
      });

      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (error) {
      console.error(
        'Registration failed:',
        error
      );

      setApiError(
        getBackendErrorMessage(error)
      );
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
          Better Health <br />
          Starts Here
        </h2>

        <p className="text-sm lg:text-base text-medisetu-muted mt-2 max-w-sm leading-relaxed">
          Join MediSetu and take control of your health journey.
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
    <AuthLayout
      leftContent={
        activeRole === 'patient'
          ? leftHeroContent
          : null
      }
    >
      <div className="space-y-5">

        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          <BackButton
            onClick={() => navigate(-1)}
          />

          <Link
            to="/login"
            className="text-xs font-semibold text-medisetu-primary hover:underline"
          >
            Already have an account?{' '}
            <span className="font-bold">
              Login
            </span>
          </Link>
        </div>

        {/* Heading */}
        <div>
          <h1 className="text-2xl font-bold text-medisetu-navy">
            {activeRole === 'doctor'
              ? 'Create Doctor Account'
              : activeRole === 'admin'
              ? 'Create Admin Account'
              : 'Create your account'}
          </h1>

          <p className="text-xs sm:text-sm text-medisetu-muted mt-1">
            {activeRole === 'doctor'
              ? "Join MediSetu and start making a difference in people's lives."
              : activeRole === 'admin'
              ? 'Fill in the details below to create your administrator account.'
              : 'Join MediSetu and take control of your health journey.'}
          </p>
        </div>

        {/* Role Tabs */}
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
          onChange={handleRoleChange}
        />

        {/* Success Message */}
        {submittedNotice?.type === 'success' && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs">
            <span className="font-bold">
              Registration Successful:
            </span>{' '}
            {submittedNotice.message}
          </div>
        )}

        {/* API Error */}
        {apiError && (
          <ErrorAlert
            title="Registration Failed"
            message={apiError}
            onDismiss={() =>
              setApiError(null)
            }
          />
        )}

        {/* Admin Info */}
        {activeRole === 'admin' && (
          <div className="p-3 bg-blue-50/70 border border-blue-200/70 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-medisetu-slate">
            <span>
              Learn about our enterprise platform & features:
            </span>

            <Link
              to="/register/admin"
              className="text-medisetu-primary font-bold hover:underline flex-shrink-0"
            >
              View Admin Landing Page →
            </Link>
          </div>
        )}

        {/* Registration Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-3.5"
          noValidate
        >

          {/* Username */}
          <InputField
            id="username"
            name="username"
            placeholder="Username"
            icon={AtSign}
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
            required
          />

          {/* Full Name */}
          <InputField
            id="fullName"
            name="fullName"
            placeholder="Full Name"
            icon={User}
            value={formData.fullName}
            onChange={handleChange}
            error={errors.fullName}
            required
          />

          {/* Mobile */}
          <InputField
            id="mobileNumber"
            name="mobileNumber"
            type="tel"
            placeholder="Mobile Number"
            icon={Phone}
            value={formData.mobileNumber}
            onChange={handleChange}
            error={errors.mobileNumber}
            required
          />

          {/* Email */}
          <InputField
            id="email"
            name="email"
            type="email"
            placeholder="Email Address"
            icon={Mail}
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />

          {/* Patient Fields */}
          {activeRole === 'patient' && (
            <>
              <InputField
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                placeholder="Date of Birth"
                icon={Calendar}
                value={formData.dateOfBirth}
                onChange={handleChange}
                error={errors.dateOfBirth}
                required
              />

              <SelectDropdown
                id="gender"
                name="gender"
                placeholder="Gender"
                icon={User}
                options={[
                  'Male',
                  'Female',
                  'Other',
                ]}
                value={formData.gender}
                onChange={handleChange}
                error={errors.gender}
                required
              />
            </>
          )}

          {/* Doctor Fields */}
          {activeRole === 'doctor' && (
            <>
              <InputField
                id="registrationNumber"
                name="registrationNumber"
                placeholder="Medical Registration Number (e.g. MCI/NMC)"
                icon={IdCard}
                value={formData.registrationNumber}
                onChange={handleChange}
                error={errors.registrationNumber}
                required
              />

              <SelectDropdown
                id="specialization"
                name="specialization"
                placeholder="Specialization / Department"
                icon={Stethoscope}
                options={[
                  'Cardiology',
                  'Neurology',
                  'Dermatology',
                  'General Medicine',
                  'Pediatrics',
                  'Orthopedics',
                ]}
                value={formData.specialization}
                onChange={handleChange}
                error={errors.specialization}
                required
              />

              <InputField
                id="hospitalName"
                name="hospitalName"
                placeholder="Hospital / Clinic Name"
                icon={Building2}
                value={formData.hospitalName}
                onChange={handleChange}
                error={errors.hospitalName}
                required
              />

              <InputField
                id="clinicAddress"
                name="clinicAddress"
                placeholder="Clinic Address"
                icon={MapPin}
                value={formData.clinicAddress}
                onChange={handleChange}
                error={errors.clinicAddress}
                required
              />
            </>
          )}

          {/* Admin Fields */}
          {activeRole === 'admin' && (
            <>
              <SelectDropdown
                id="designation"
                name="designation"
                placeholder="Designation / Department"
                icon={Briefcase}
                options={[
                  'Hospital Administrator',
                  'Medical Superintendent',
                  'Operations Head',
                  'Billing Manager',
                  'Staff Supervisor',
                ]}
                value={formData.designation}
                onChange={handleChange}
                error={errors.designation}
                required
              />

              <InputField
                id="organizationName"
                name="organizationName"
                placeholder="Organization / Hospital Name"
                icon={Building2}
                value={formData.organizationName}
                onChange={handleChange}
                error={errors.organizationName}
                required
              />
            </>
          )}

          {/* Password */}
          <PasswordInput
            id="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
          />

          {/* Confirm Password */}
          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            required
          />

          {/* Terms */}
          <div className="pt-1">
            <Checkbox
              id="agreeTerms"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              error={errors.agreeTerms}
            >
              I agree to the{' '}
              <a
                href="#terms"
                className="text-medisetu-primary font-semibold hover:underline"
              >
                Terms & Conditions
              </a>{' '}
              and{' '}
              <a
                href="#privacy"
                className="text-medisetu-primary font-semibold hover:underline"
              >
                Privacy Policy
              </a>
            </Checkbox>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <PrimaryButton
              fullWidth
              type="submit"
              loading={isSubmitting}
              size="lg"
            >
              {activeRole === 'doctor'
                ? 'Create Doctor Account →'
                : activeRole === 'admin'
                ? 'Create Admin Account →'
                : 'Create Account'}
            </PrimaryButton>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center pt-2">
          <span className="text-xs text-medisetu-muted">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-medisetu-primary font-bold hover:underline"
            >
              Login
            </Link>
          </span>
        </div>
      </div>
    </AuthLayout>
  );
};

export default RegisterScreen;