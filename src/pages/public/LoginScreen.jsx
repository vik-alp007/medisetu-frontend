import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, User, Stethoscope, Building2 } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';
import MediSetuLogo from '../../components/common/MediSetuLogo';
import SegmentedTabs from '../../components/common/SegmentedTabs';
import InputField from '../../components/common/InputField';
import PasswordInput from '../../components/common/PasswordInput';
import Checkbox from '../../components/common/Checkbox';
import PrimaryButton from '../../components/common/PrimaryButton';
import BackButton from '../../components/navigation/BackButton';
import DoctorHeroIllustration from '../../assets/illustrations/DoctorHeroIllustration';

/**
 * LoginScreen
 * Uses the established MediSetu authentication visual language.
 */
export const LoginScreen = () => {
  const navigate = useNavigate();
  const [activeRole, setActiveRole] = useState('patient');
  const [formData, setFormData] = useState({
    identifier: '', // Email or Phone
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedNotice, setSubmittedNotice] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.identifier.trim()) {
      newErrors.identifier = 'Email address or Mobile number is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmittedNotice(null);

    // Frontend validation only — awaiting backend login payload schema
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedNotice({
        role: activeRole,
        message: `Validated ${activeRole.toUpperCase()} login. Awaiting backend POST /api/auth/login/ schema confirmation.`,
      });
    }, 600);
  };

  const leftHeroContent = (
    <div className="space-y-6">
      <Link to="/" className="inline-block hover:opacity-95 transition-opacity">
        <MediSetuLogo size="md" />
      </Link>

      <div>
        <h2 className="text-3xl lg:text-4xl font-extrabold text-medisetu-navy tracking-tight leading-tight">
          Welcome Back <br />
          to MediSetu
        </h2>
        <p className="text-sm lg:text-base text-medisetu-muted mt-2 max-w-sm leading-relaxed">
          Access your appointments, medical records, and healthcare portal in one place.
        </p>
      </div>

      <div className="pt-4 flex items-center justify-center lg:justify-start">
        <DoctorHeroIllustration />
      </div>
    </div>
  );

  return (
    <AuthLayout leftContent={leftHeroContent}>
      <div className="space-y-5">
        {/* Top Back Navigation & Header */}
        <div className="flex items-center justify-between">
          <BackButton onClick={() => navigate(-1)} />
          <Link
            to="/register"
            className="text-xs font-semibold text-medisetu-primary hover:underline"
          >
            Don't have an account? <span className="font-bold">Register</span>
          </Link>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-medisetu-navy">
            Sign In to Your Account
          </h1>
          <p className="text-xs sm:text-sm text-medisetu-muted mt-1">
            Choose your portal role to continue.
          </p>
        </div>

        {/* Role Switcher Tabs */}
        <SegmentedTabs
          tabs={[
            { id: 'patient', label: 'Patient', icon: User },
            { id: 'doctor', label: 'Doctor', icon: Stethoscope },
            { id: 'admin', label: 'Admin', icon: Building2 },
          ]}
          activeTab={activeRole}
          onChange={setActiveRole}
        />

        {submittedNotice && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs">
            <span className="font-bold">Frontend Validated:</span> {submittedNotice.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <InputField
            id="identifier"
            name="identifier"
            label="Email or Mobile Number"
            placeholder="Enter your email or phone"
            icon={Mail}
            value={formData.identifier}
            onChange={handleChange}
            error={errors.identifier}
            required
          />

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

          <div className="pt-2">
            <PrimaryButton fullWidth type="submit" loading={isSubmitting} size="lg">
              Sign In to {activeRole.charAt(0).toUpperCase() + activeRole.slice(1)} Portal
            </PrimaryButton>
          </div>
        </form>

        <div className="text-center pt-2">
          <span className="text-xs text-medisetu-muted">
            New to MediSetu?{' '}
            <Link
              to={activeRole === 'doctor' ? '/register/doctor' : activeRole === 'admin' ? '/register/admin' : '/register'}
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
