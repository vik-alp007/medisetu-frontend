import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {
  User,
  Phone,
  Mail,
  Building2,
  Briefcase,
  Settings,
  ShieldCheck,
  BarChart3,
} from 'lucide-react';
import PublicNavbar from '../../components/navigation/PublicNavbar';
import InputField from '../../components/common/InputField';
import PasswordInput from '../../components/common/PasswordInput';
import SelectDropdown from '../../components/common/SelectDropdown';
import Checkbox from '../../components/common/Checkbox';
import PrimaryButton from '../../components/common/PrimaryButton';
import AdminHeroIllustration from '../../assets/illustrations/AdminHeroIllustration';

/**
 * AdminLandingScreen: Screen 6
 * Exact match for Admin Registration with Public Navbar and Feature Highlights
 */
export const AdminLandingScreen = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    email: '',
    designation: '',
    organizationName: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
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
    if (!formData.designation) {
      newErrors.designation = 'Please select your designation';
    }
    if (!formData.organizationName.trim()) {
      newErrors.organizationName = 'Organization / Hospital name is required';
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmittedNotice('Opening the backend-connected admin registration form...');
    setTimeout(() => navigate('/register/admin-form'), 300);
  };

  const valueProps = [
    {
      title: 'Manage Users & Services',
      desc: 'Oversee patients, doctors and appointments',
      icon: Settings,
    },
    {
      title: 'Ensure Secure & Smooth Operations',
      desc: 'Maintain data security and reliability',
      icon: ShieldCheck,
    },
    {
      title: 'Be a Part of Better Healthcare',
      desc: 'Contribute to a healthier, smarter community',
      icon: BarChart3,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F4F9FF] flex flex-col relative overflow-x-hidden">
      {/* Public Navbar (Screen 6) */}
      <PublicNavbar />

      {/* Main Container */}
      <main className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 flex flex-col justify-center relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Admin Branding & Value Propositions */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 text-medisetu-primary text-xs font-bold tracking-wide">
              <Building2 className="w-3.5 h-3.5" />
              <span>ADMIN REGISTRATION</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-medisetu-navy tracking-tight leading-tight">
              Create <span className="text-medisetu-primary">Admin</span> Account
            </h1>

            <p className="text-sm sm:text-base text-medisetu-muted max-w-lg leading-relaxed">
              Join MediSetu as an administrator and help us build a healthier tomorrow.
            </p>

            {/* Feature Highlights */}
            <div className="space-y-4 pt-2">
              {valueProps.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-blue-100 text-medisetu-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-medisetu-navy">
                        {item.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-medisetu-muted">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Registration CTA for Mobile / Quick Scroll */}
            <div className="pt-2 flex items-center gap-4">
              <a
                href="#admin-form"
                className="lg:hidden inline-flex items-center justify-center bg-medisetu-primary hover:bg-medisetu-primary-hover text-white font-semibold rounded-2xl px-6 py-3 text-sm transition-all shadow-xs"
              >
                Go to Registration Form ↓
              </a>
              <Link
                to="/register?role=admin"
                className="text-xs font-semibold text-medisetu-primary hover:underline inline-flex items-center gap-1"
              >
                Open in Standard Role View →
              </Link>
            </div>

            {/* Illustration */}
            <div className="pt-4 flex justify-center lg:justify-start">
              <AdminHeroIllustration />
            </div>
          </div>

          {/* Right Column: Elevated Admin Form Card */}
          <div className="lg:col-span-6" id="admin-form">
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card p-6 sm:p-10 space-y-5 scroll-mt-6">
              <div>
                <h2 className="text-2xl font-bold text-medisetu-navy">
                  Create <span className="text-medisetu-primary">Admin</span> Account
                </h2>
                <p className="text-xs sm:text-sm text-medisetu-muted mt-1">
                  Fill in the details below to create your administrator account.
                </p>
              </div>

              {submittedNotice && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs">
                  <span className="font-bold">Success:</span> {submittedNotice}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
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

                <div className="pt-2">
                  <PrimaryButton fullWidth type="submit" loading={isSubmitting} size="lg">
                    Create Admin Account →
                  </PrimaryButton>
                </div>
              </form>

              <div className="text-center pt-2">
                <span className="text-xs text-medisetu-muted">
                  Already have an account?{' '}
                  <Link to="/login" className="text-medisetu-primary font-bold hover:underline">
                    Login
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLandingScreen;
