import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  User,
  Phone,
  Mail,
  Calendar,
  Lock,
  Stethoscope,
  Building2,
  MapPin,
  Briefcase,
  IdCard,
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

/**
 * RegisterScreen: Screens 5 & 7 (Patient, Doctor, and Admin Forms)
 * Provides interactive role switching, client validation, and exact Figma styling.
 */
export const RegisterScreen = ({ initialRole = 'patient' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine current active role from route, query param, or prop
  const getInitialRole = () => {
    const params = new URLSearchParams(location.search);
    if (params.get('role') === 'admin' || location.pathname.includes('/admin-form')) return 'admin';
    if (location.pathname.includes('/doctor') || params.get('role') === 'doctor') return 'doctor';
    return initialRole;
  };

  const [activeRole, setActiveRole] = useState(getInitialRole);

  // Sync state if route or search param changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('role') === 'admin' || location.pathname.includes('/admin-form')) {
      setActiveRole('admin');
    } else if (location.pathname.includes('/doctor') || params.get('role') === 'doctor') {
      setActiveRole('doctor');
    } else if (location.pathname === '/register' && !params.get('role')) {
      setActiveRole('patient');
    }
  }, [location.pathname, location.search]);

  // Form State
  const [formData, setFormData] = useState({
    // Common
    fullName: '',
    mobileNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,

    // Patient Specific
    dateOfBirth: '',
    gender: '',

    // Doctor Specific
    registrationNumber: '',
    specialization: '',
    hospitalName: '',
    clinicAddress: '',

    // Admin Specific
    designation: '',
    organizationName: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedNotice, setSubmittedNotice] = useState(null);

  const handleRoleChange = (role) => {
    setActiveRole(role);
    setErrors({});
    setSubmittedNotice(null);
    if (role === 'doctor') {
      navigate('/register/doctor');
    } else if (role === 'admin') {
      navigate('/register?role=admin');
    } else {
      navigate('/register');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error for field on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Frontend Validation
  const validateForm = () => {
    const newErrors = {};

    // Common validations
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile Number is required';
    } else if (!/^[0-9+ -]{8,15}$/.test(formData.mobileNumber.trim())) {
      newErrors.mobileNumber = 'Enter a valid mobile number';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email Address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the Terms & Privacy Policy';
    }

    // Role-specific validations
    if (activeRole === 'patient') {
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      if (!formData.gender) newErrors.gender = 'Please select a gender';
    } else if (activeRole === 'doctor') {
      if (!formData.registrationNumber.trim()) {
        newErrors.registrationNumber = 'Registration Number (MCI/NMC) is required';
      }
      if (!formData.specialization) newErrors.specialization = 'Please select specialization';
      if (!formData.hospitalName.trim()) newErrors.hospitalName = 'Hospital / Clinic name is required';
      if (!formData.clinicAddress.trim()) newErrors.clinicAddress = 'Clinic address is required';
    } else if (activeRole === 'admin') {
      if (!formData.designation) newErrors.designation = 'Please select your designation';
      if (!formData.organizationName.trim()) newErrors.organizationName = 'Organization / Hospital name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmittedNotice(null);

    // In accordance with instructions:
    // DO NOT send invented API payloads.
    // Store in local component state and show feedback.
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedNotice({
        role: activeRole,
        message: `Validated ${activeRole.toUpperCase()} registration. Form data held in component state pending backend schema confirmation.`,
      });
    }, 600);
  };

  // Left Column Hero Content (Figma Screen 5)
  const leftHeroContent = (
    <div className="space-y-6">
      <Link to="/" className="inline-block hover:opacity-95 transition-opacity">
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

  return (
    <AuthLayout leftContent={activeRole === 'patient' ? leftHeroContent : null}>
      <div className="space-y-5">
        {/* Top Back Navigation & Header */}
        <div className="flex items-center justify-between">
          <BackButton onClick={() => navigate(-1)} />
          <Link
            to="/login"
            className="text-xs font-semibold text-medisetu-primary hover:underline"
          >
            Already have an account? <span className="font-bold">Login</span>
          </Link>
        </div>

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

        {/* Role Switcher Tabs (Screen 5 & 7) */}
        <SegmentedTabs
          tabs={[
            { id: 'patient', label: 'Patient', icon: User },
            { id: 'doctor', label: 'Doctor', icon: Stethoscope },
            { id: 'admin', label: 'Admin', icon: Building2 },
          ]}
          activeTab={activeRole}
          onChange={handleRoleChange}
        />

        {submittedNotice && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs">
            <span className="font-bold">Frontend Validated:</span> {submittedNotice.message}
          </div>
        )}

        {activeRole === 'admin' && (
          <div className="p-3 bg-blue-50/70 border border-blue-200/70 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-medisetu-slate">
            <span>Learn about our enterprise platform & features:</span>
            <Link
              to="/register/admin"
              className="text-medisetu-primary font-bold hover:underline flex-shrink-0"
            >
              View Admin Landing Page →
            </Link>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
          {/* Common Fields */}
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

          {/* Patient Specific Fields (Screen 5) */}
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
                options={['Male', 'Female', 'Other']}
                value={formData.gender}
                onChange={handleChange}
                error={errors.gender}
                required
              />
            </>
          )}

          {/* Doctor Specific Fields (Screen 7 Left) */}
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

          {/* Admin Specific Fields (Screen 7 Right) */}
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

          {/* Password Fields */}
          <PasswordInput
            id="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
          />

          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            required
          />

          {/* Terms Checkbox */}
          <div className="pt-1">
            <Checkbox
              id="agreeTerms"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              error={errors.agreeTerms}
            >
              I agree to the{' '}
              <a href="#terms" className="text-medisetu-primary font-semibold hover:underline">
                Terms & Conditions
              </a>{' '}
              and{' '}
              <a href="#privacy" className="text-medisetu-primary font-semibold hover:underline">
                Privacy Policy
              </a>
            </Checkbox>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <PrimaryButton fullWidth type="submit" loading={isSubmitting} size="lg">
              {activeRole === 'doctor'
                ? 'Create Doctor Account →'
                : activeRole === 'admin'
                ? 'Create Admin Account →'
                : 'Create Account'}
            </PrimaryButton>
          </div>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-2">
          <span className="text-xs text-medisetu-muted">
            Already have an account?{' '}
            <Link to="/login" className="text-medisetu-primary font-bold hover:underline">
              Login
            </Link>
          </span>
        </div>
      </div>
    </AuthLayout>
  );
};

export default RegisterScreen;
