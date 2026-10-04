import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart,
  Brain,
  Sparkles,
  Stethoscope,
  Calendar,
  FileText,
  Pill,
  CreditCard,
  ShieldAlert,
  Search,
} from 'lucide-react';

import PatientLayout from '../../layouts/PatientLayout';
import TopHeader from '../../components/navigation/TopHeader';
import PastelActionCard from '../../components/cards/PastelActionCard';
import AppointmentCard from '../../components/cards/AppointmentCard';
import EmergencyCard from '../../components/cards/EmergencyCard';
import LinkButton from '../../components/common/LinkButton';
import LoadingSpinner from '../../components/feedback/LoadingSpinner';
import ErrorAlert from '../../components/feedback/ErrorAlert';

import { useAuth } from '../../context/AuthContext';
import { dashboardService } from '../../services/dashboardService';
import { doctorService } from '../../services/doctorService';
import { PatientAvatarIcon, getDoctorAvatar } from '../../utils/doctorAvatar';

const formatAppointmentDate = (date) => {
  if (!date) return 'Date not provided';

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return String(date);
  }

  return parsed.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const formatAppointmentTime = (time) => {
  if (!time) return 'Time not provided';

  const [hours, minutes] = String(time).split(':');

  if (hours === undefined || minutes === undefined) {
    return String(time);
  }

  const hourNumber = Number(hours);

  if (Number.isNaN(hourNumber)) {
    return String(time);
  }

  const suffix = hourNumber >= 12 ? 'PM' : 'AM';
  const displayHour = hourNumber % 12 || 12;

  return `${displayHour}:${minutes} ${suffix}`;
};

const getDoctorName = (doctor) => {
  const firstName = doctor?.user?.first_name || '';
  const lastName = doctor?.user?.last_name || '';

  const fullName = `${firstName} ${lastName}`.trim();

  return fullName || doctor?.user?.username || 'Doctor';
};

export const PatientDashboardScreen = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setApiError(null);

        const [dashboardResponse, doctorsResponse] = await Promise.all([
          dashboardService.getPatientDashboard(),
          doctorService.getDoctors(),
        ]);

        if (!isMounted) return;

        setDashboardData(dashboardResponse);

        const normalizedDoctors = Array.isArray(doctorsResponse)
          ? doctorsResponse
          : Array.isArray(doctorsResponse?.results)
          ? doctorsResponse.results
          : [];

        setDoctors(normalizedDoctors);
      } catch (error) {
        if (!isMounted) return;

        console.error('Patient dashboard API error:', error);

        setApiError(
          error?.response?.data?.detail ||
            error?.response?.data?.message ||
            error?.message ||
            'Unable to load your dashboard from the hospital server.'
        );

        setDashboardData(null);
        setDoctors([]);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  const backendUserName = [user?.first_name, user?.last_name]
    .filter(Boolean)
    .join(' ')
    .trim();

  const patientName =
    backendUserName || user?.name || 'Patient';

  /*
   * The current dashboard API provides appointment COUNTS,
   * not the actual upcoming appointment object.
   *
   * Therefore we do not invent appointment information.
   */
  const upcomingAppointmentCount =
    Number(dashboardData?.upcoming_appointments) || 0;

  const recentPrescriptionCount = Array.isArray(
    dashboardData?.recent_prescriptions
  )
    ? dashboardData.recent_prescriptions.length
    : 0;

  const specialistCategories = useMemo(() => {
    const categories = [
      {
        id: 'cardio',
        title: 'Cardiology',
        subtitle: 'Heart & cardiovascular care',
        color: 'rose',
        icon: Heart,
      },
      {
        id: 'neuro',
        title: 'Neurology',
        subtitle: 'Brain & nervous system',
        color: 'purple',
        icon: Brain,
      },
      {
        id: 'derma',
        title: 'Dermatology',
        subtitle: 'Skin & hair care',
        color: 'amber',
        icon: Sparkles,
      },
    ];

    return categories;
  }, []);

  const hasDoctors = doctors.length > 0;

  return (
    <PatientLayout>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full space-y-6 pb-6"
      >
        {/* Header */}
        <TopHeader
          greetingName={patientName}
          greetingTime="Good Morning,"
          subtitle="How are you feeling today?"
          showNotification={true}
          hasUnreadNotification={false}
          userAvatar={<PatientAvatarIcon className="w-full h-full" />}
          className="px-1"
        />

        {/* API Error */}
        {apiError && (
          <ErrorAlert
            title="Backend Sync Notice"
            message={apiError}
            onDismiss={() => setApiError(null)}
          />
        )}

        {/* Search */}
        <div
          onClick={() => navigate('/doctors')}
          className="w-full bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-200/80 dark:border-slate-800 px-4 py-3 shadow-xs flex items-center justify-between cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
        >
          <div className="flex items-center gap-3 text-medisetu-muted dark:text-slate-400">
            <Search className="w-5 h-5 text-medisetu-primary dark:text-blue-400" />

            <span className="text-sm">
              Search doctors, specialties, or clinics...
            </span>
          </div>

          <span className="text-xs bg-blue-50 dark:bg-blue-950/60 text-medisetu-primary dark:text-blue-400 font-semibold px-2.5 py-1 rounded-lg">
            Find
          </span>
        </div>

        {/* Emergency */}
        <EmergencyCard
          variant="banner"
          title="Emergency / Quick Help"
          subtitle="Get immediate hospital & ambulance assistance"
          icon={<ShieldAlert className="w-6 h-6" />}
          onAction={() => navigate('/emergency')}
        />

        {/* Recommended Specialists */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-base sm:text-lg font-bold text-medisetu-navy dark:text-white">
              Recommended Specialists
            </h2>

            <LinkButton to="/doctors" size="sm">
              View All
            </LinkButton>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {specialistCategories.map((specialist) => {
              const IconComp = specialist.icon;

              return (
                <PastelActionCard
                  key={specialist.id}
                  title={specialist.title}
                  subtitle={specialist.subtitle}
                  color={specialist.color}
                  icon={IconComp}
                  onClick={() =>
                    navigate(
                      `/doctors?specialty=${encodeURIComponent(
                        specialist.title
                      )}`
                    )
                  }
                />
              );
            })}
          </div>
        </section>

        {/* Upcoming Appointment */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-base sm:text-lg font-bold text-medisetu-navy dark:text-white">
              Upcoming Appointment
            </h2>

            <LinkButton to="/doctors" size="sm">
              Book New
            </LinkButton>
          </div>

          {loading ? (
            <div className="py-8 flex justify-center">
              <LoadingSpinner size="md" />
            </div>
          ) : upcomingAppointmentCount > 0 ? (
            <div className="bg-white dark:bg-[#1E293B] rounded-3xl border border-blue-100 dark:border-slate-800 p-5">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-medisetu-primary dark:text-blue-400" />
                </div>

                <div className="flex-1">
                  <p className="text-sm font-bold text-medisetu-navy dark:text-white">
                    You have {upcomingAppointmentCount}{' '}
                    {upcomingAppointmentCount === 1
                      ? 'upcoming appointment'
                      : 'upcoming appointments'}
                  </p>

                  <p className="text-xs text-medisetu-muted dark:text-slate-400 mt-1">
                    Open your appointments to view the available appointment
                    details.
                  </p>

                  <button
                    type="button"
                    onClick={() => navigate('/doctors')}
                    className="mt-3 text-xs font-semibold text-medisetu-primary hover:underline"
                  >
                    Book another appointment →
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 text-center text-sm text-medisetu-muted dark:text-slate-400">
              No upcoming appointments scheduled.

              <LinkButton to="/doctors" className="inline font-semibold ml-1">
                Find a doctor
              </LinkButton>
            </div>
          )}
        </section>

        {/* Dashboard Summary */}
        {!loading && dashboardData && (
          <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4">
              <p className="text-xs text-medisetu-muted dark:text-slate-400">
                Appointments
              </p>

              <p className="text-xl font-bold text-medisetu-navy dark:text-white mt-1">
                {dashboardData?.appointment_history_count ?? 0}
              </p>

              <p className="text-[11px] text-medisetu-muted mt-1">
                History
              </p>
            </div>

            <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4">
              <p className="text-xs text-medisetu-muted dark:text-slate-400">
                Prescriptions
              </p>

              <p className="text-xl font-bold text-medisetu-navy dark:text-white mt-1">
                {recentPrescriptionCount}
              </p>

              <p className="text-[11px] text-medisetu-muted mt-1">
                Recent
              </p>
            </div>

            <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4">
              <p className="text-xs text-medisetu-muted dark:text-slate-400">
                Pending Bills
              </p>

              <p className="text-xl font-bold text-medisetu-navy dark:text-white mt-1">
                {dashboardData?.pending_bills ?? 0}
              </p>

              <p className="text-[11px] text-medisetu-muted mt-1">
                Unpaid
              </p>
            </div>

            <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4">
              <p className="text-xs text-medisetu-muted dark:text-slate-400">
                Total Bills
              </p>

              <p className="text-xl font-bold text-medisetu-navy dark:text-white mt-1">
                {dashboardData?.total_bills ?? 0}
              </p>

              <p className="text-[11px] text-medisetu-muted mt-1">
                Records
              </p>
            </div>
          </section>
        )}

        {/* Quick Services */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-medisetu-navy dark:text-white px-1">
            Quick Services
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              type="button"
              onClick={() => navigate('/doctors')}
              className="bg-white dark:bg-[#1E293B] hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 flex flex-col items-center text-center gap-2 shadow-xs transition-all active:scale-[0.98]"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-medisetu-primary dark:text-blue-400 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>

              <span className="text-xs sm:text-sm font-semibold text-medisetu-navy dark:text-white">
                Book Doctor
              </span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/records')}
              className="bg-white dark:bg-[#1E293B] hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 flex flex-col items-center text-center gap-2 shadow-xs transition-all active:scale-[0.98]"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>

              <span className="text-xs sm:text-sm font-semibold text-medisetu-navy dark:text-white">
                Medical Records
              </span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/prescriptions')}
              className="bg-white dark:bg-[#1E293B] hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 flex flex-col items-center text-center gap-2 shadow-xs transition-all active:scale-[0.98]"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Pill className="w-5 h-5" />
              </div>

              <span className="text-xs sm:text-sm font-semibold text-medisetu-navy dark:text-white">
                Prescriptions
              </span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/bills')}
              className="bg-white dark:bg-[#1E293B] hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 flex flex-col items-center text-center gap-2 shadow-xs transition-all active:scale-[0.98]"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>

              <span className="text-xs sm:text-sm font-semibold text-medisetu-navy dark:text-white">
                Bills & Payments
              </span>
            </button>
          </div>
        </section>
      </motion.div>
    </PatientLayout>
  );
};

export default PatientDashboardScreen;