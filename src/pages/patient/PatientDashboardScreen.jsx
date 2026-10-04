import React, { useState, useEffect } from 'react';
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
  Search
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
import { mockPatient, mockUpcomingAppointment, mockRecommendedSpecialists } from '../../data/mockData';
import { PatientAvatarIcon, getDoctorAvatar } from '../../utils/doctorAvatar';

export const PatientDashboardScreen = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      // If user has token, attempt backend fetch
      if (isAuthenticated) {
        try {
          setLoading(true);
          setApiError(null);
          // Backend endpoint: GET /api/dashboard/patient/
          const data = await dashboardService.getPatientDashboard();
          if (isMounted) {
            setDashboardData(data);
          }
        } catch (err) {
          if (isMounted) {
            console.warn('Backend patient dashboard API not reachable or returned error:', err.message);
            setApiError(
              err.response?.data?.detail || 
              err.response?.data?.message || 
              err.message || 
              'Unable to sync live patient dashboard with hospital server.'
            );
            setDashboardData(null);
          }
        } finally {
          if (isMounted) setLoading(false);
        }
      }
    };

    loadDashboard();
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  // Use real API data when available; mock data allowed ONLY for initial demo construction or explicit VITE_USE_MOCK_DATA
  const isMockMode = !isAuthenticated || import.meta.env.VITE_USE_MOCK_DATA === 'true';
  const patientName = user?.name || dashboardData?.patient?.name || (isMockMode ? mockPatient.greetingName : 'Patient');
  const upcomingApt = dashboardData?.upcoming_appointment || (isMockMode && !apiError ? mockUpcomingAppointment : null);

  const specialistIcons = {
    cardio: Heart,
    neuro: Brain,
    derma: Sparkles,
  };

  return (
    <PatientLayout>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full space-y-6 pb-6"
      >
        {/* Top Header with Greeting & Avatar */}
        <TopHeader
          greetingName={patientName}
          greetingTime="Good Morning,"
          subtitle="How are you feeling today?"
          showNotification={true}
          hasUnreadNotification={true}
          userAvatar={<PatientAvatarIcon className="w-full h-full" />}
          className="px-1"
        />

        {/* API Error Notification if Backend Failed */}
        {apiError && (
          <ErrorAlert
            title="Backend Sync Notice"
            message={apiError}
            onDismiss={() => setApiError(null)}
          />
        )}

        {/* Search Shortcut Bar */}
        <div 
          onClick={() => navigate('/doctors')}
          className="w-full bg-white rounded-2xl border border-slate-200/80 px-4 py-3 shadow-xs flex items-center justify-between cursor-pointer hover:border-blue-300 transition-colors"
        >
          <div className="flex items-center gap-3 text-medisetu-muted">
            <Search className="w-5 h-5 text-medisetu-primary" />
            <span className="text-sm">Search doctors, specialties, or clinics...</span>
          </div>
          <span className="text-xs bg-blue-50 text-medisetu-primary font-semibold px-2.5 py-1 rounded-lg">
            Find
          </span>
        </div>

        {/* Emergency Quick Assistance Banner (Screen 8) */}
        <EmergencyCard
          variant="banner"
          title="Emergency / Quick Help"
          subtitle="Get immediate hospital & ambulance assistance"
          icon={<ShieldAlert className="w-6 h-6" />}
          onAction={() => navigate('/emergency')}
        />

        {/* Recommended Specialists / Categories (Screen 8) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-base sm:text-lg font-bold text-medisetu-navy">
              Recommended Specialists
            </h2>
            <LinkButton to="/doctors" size="sm">
              View All
            </LinkButton>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {mockRecommendedSpecialists.map((spec) => {
              const IconComp = specialistIcons[spec.id] || Stethoscope;
              return (
                <PastelActionCard
                  key={spec.id}
                  title={spec.title}
                  subtitle={spec.subtitle}
                  color={spec.color}
                  icon={IconComp}
                  onClick={() => navigate(`/doctors?specialty=${encodeURIComponent(spec.title)}`)}
                />
              );
            })}
          </div>
        </section>

        {/* Upcoming Appointment Section (Screen 8) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-base sm:text-lg font-bold text-medisetu-navy">
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
          ) : upcomingApt ? (
            <AppointmentCard
              doctorName={upcomingApt.doctorName || upcomingApt.doctor_name || 'Dr. Rahul Sharma'}
              specialty={upcomingApt.specialty || 'Cardiologist'}
              timing={upcomingApt.timing || `${upcomingApt.date || 'Today'} - ${upcomingApt.time || '4:30 PM'}`}
              consultationType={upcomingApt.consultationType || 'In-person'}
              avatar={getDoctorAvatar('1', upcomingApt.doctorName || 'Dr. Rahul Sharma')}
              onClick={() => navigate('/doctors/1')}
            />
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 text-center text-sm text-medisetu-muted">
              No upcoming appointments scheduled.{' '}
              <LinkButton to="/doctors" className="inline font-semibold">
                Find a doctor
              </LinkButton>
            </div>
          )}
        </section>

        {/* Quick Health Actions Navigation Grid */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-medisetu-navy px-1">
            Quick Services
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              type="button"
              onClick={() => navigate('/doctors')}
              className="bg-white hover:bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col items-center text-center gap-2 shadow-xs transition-all active:scale-[0.98]"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-medisetu-primary flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-medisetu-navy">
                Book Doctor
              </span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/records')}
              className="bg-white hover:bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col items-center text-center gap-2 shadow-xs transition-all active:scale-[0.98]"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-medisetu-navy">
                Medical Records
              </span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/prescriptions')}
              className="bg-white hover:bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col items-center text-center gap-2 shadow-xs transition-all active:scale-[0.98]"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Pill className="w-5 h-5" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-medisetu-navy">
                Prescriptions
              </span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/bills')}
              className="bg-white hover:bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col items-center text-center gap-2 shadow-xs transition-all active:scale-[0.98]"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-medisetu-navy">
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
