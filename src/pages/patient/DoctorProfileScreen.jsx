import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Star,
  MapPin,
  Phone,
  Clock,
  Award,
  Users,
  ShieldCheck,
  HeartHandshake,
  Languages,
  GraduationCap,
} from 'lucide-react';

import PatientLayout from '../../layouts/PatientLayout';
import TopHeader from '../../components/navigation/TopHeader';
import PrimaryButton from '../../components/common/PrimaryButton';
import StatusBadge from '../../components/common/StatusBadge';
import TimeSlotGrid from '../../components/booking/TimeSlotGrid';
import LoadingSpinner from '../../components/feedback/LoadingSpinner';
import ErrorAlert from '../../components/feedback/ErrorAlert';

import { doctorService } from '../../services/doctorService';
import { DoctorClinicBanner } from '../../assets/illustrations/DoctorAvatars';
import { getDoctorAvatar } from '../../utils/doctorAvatar';

export const DoctorProfileScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorNotice, setErrorNotice] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const fetchDoctor = async () => {
    try {
      setLoading(true);
      setErrorNotice(null);
      setDoctor(null);
      setSelectedSlot(null);

      const data = await doctorService.getDoctorById(id);

      if (!data) {
        throw new Error('Doctor details were not returned by the server.');
      }

      setDoctor(data);

      if (
        Array.isArray(data.availableSlots) &&
        data.availableSlots.length > 0
      ) {
        setSelectedSlot(data.availableSlots[0]);
      }
    } catch (err) {
      console.error('Doctor profile API error:', err);

      setDoctor(null);

      setErrorNotice(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          err?.message ||
          'Unable to load doctor details. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      if (!isMounted) return;
      await fetchDoctor();
    };

    run();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <PatientLayout>
        <div className="py-24 flex flex-col items-center justify-center gap-3">
          <LoadingSpinner size="lg" />
          <span className="text-sm text-medisetu-muted">
            Loading doctor profile...
          </span>
        </div>
      </PatientLayout>
    );
  }

  if (errorNotice || !doctor) {
    return (
      <PatientLayout>
        <div className="py-16 max-w-xl mx-auto space-y-5">
          <TopHeader
            title="Doctor Profile"
            subtitle="Unable to load doctor details"
            showBack
            backTo="/doctors"
          />

          <ErrorAlert
            title="Unable to load doctor"
            message={
              errorNotice ||
              'Doctor details are currently unavailable.'
            }
            onRetry={fetchDoctor}
          />

          <div className="flex justify-center">
            <PrimaryButton onClick={() => navigate('/doctors')}>
              Back to Doctors Directory
            </PrimaryButton>
          </div>
        </div>
      </PatientLayout>
    );
  }

  const highlights = doctor.highlights || [
    {
      label:
        doctor.experience != null
          ? `${doctor.experience} Years Experience`
          : 'Experienced Specialist',
      subtext: 'In specialized healthcare',
    },
    {
      label: 'Patient Care',
      subtext: 'Focused on quality treatment',
    },
    {
      label: 'Modern Treatment',
      subtext: 'Advanced healthcare approach',
    },
    {
      label: 'Patient-Centric',
      subtext: 'Personalized care plans',
    },
  ];

  const highlightIcons = [
    Award,
    Users,
    ShieldCheck,
    HeartHandshake,
  ];

  const availableSlots = Array.isArray(doctor.availableSlots)
    ? doctor.availableSlots
    : [];

  const handleBookAppointment = () => {
    navigate(`/appointments/book/${doctor.id}`, {
      state: {
        doctor,
        selectedSlot,
      },
    });
  };

  return (
    <PatientLayout>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full space-y-6 pb-24"
      >
        <TopHeader
          title="Doctor Profile"
          subtitle={
            doctor.specialty ||
            doctor.specialization ||
            'Medical Specialist'
          }
          showBack
          backTo="/doctors"
          className="px-1"
        />

        {/* Clinic banner */}
        <div className="w-full rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-xs bg-white dark:bg-slate-900">
          <DoctorClinicBanner className="w-full h-44 sm:h-56" />
        </div>

        {/* Doctor info */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-blue-100 flex-shrink-0 border-4 border-white shadow-sm">
            {getDoctorAvatar(
              doctor.id,
              doctor.name,
              'w-full h-full'
            )}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1.5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-center sm:justify-start">
              <h1 className="text-xl sm:text-2xl font-bold text-medisetu-navy dark:text-white">
                {doctor.name || 'Doctor'}
              </h1>

              {doctor.isTopRated && (
                <StatusBadge
                  status="Top Rated"
                  variant="success"
                  size="sm"
                />
              )}
            </div>

            <p className="text-sm font-semibold text-medisetu-primary">
              {doctor.specialty ||
                doctor.specialization ||
                'Medical Specialist'}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-medisetu-muted pt-1">
              {doctor.rating != null && (
                <span className="flex items-center gap-1 font-semibold text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                  {doctor.rating}
                </span>
              )}

              {doctor.experience != null && (
                <span>
                  {doctor.experience} years experience
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Highlights */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {highlights.map((item, index) => {
            const Icon = highlightIcons[index] || ShieldCheck;

            return (
              <div
                key={`${item.label}-${index}`}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4"
              >
                <Icon className="w-5 h-5 text-medisetu-primary mb-3" />

                <p className="text-sm font-bold text-medisetu-navy dark:text-white">
                  {item.label}
                </p>

                <p className="text-xs text-medisetu-muted mt-1">
                  {item.subtext}
                </p>
              </div>
            );
          })}
        </section>

        {/* Professional information */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-medisetu-navy dark:text-white">
            Professional Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {doctor.qualification && (
              <div className="flex items-start gap-3">
                <GraduationCap className="w-5 h-5 text-medisetu-primary mt-0.5" />
                <div>
                  <p className="text-xs text-medisetu-muted">
                    Qualification
                  </p>
                  <p className="text-sm font-semibold text-medisetu-navy dark:text-white">
                    {doctor.qualification}
                  </p>
                </div>
              </div>
            )}

            {doctor.location && (
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-medisetu-primary mt-0.5" />
                <div>
                  <p className="text-xs text-medisetu-muted">
                    Location
                  </p>
                  <p className="text-sm font-semibold text-medisetu-navy dark:text-white">
                    {doctor.location}
                  </p>
                </div>
              </div>
            )}

            {doctor.phone && (
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-medisetu-primary mt-0.5" />
                <div>
                  <p className="text-xs text-medisetu-muted">
                    Contact
                  </p>
                  <p className="text-sm font-semibold text-medisetu-navy dark:text-white">
                    {doctor.phone}
                  </p>
                </div>
              </div>
            )}

            {doctor.languages && (
              <div className="flex items-start gap-3">
                <Languages className="w-5 h-5 text-medisetu-primary mt-0.5" />
                <div>
                  <p className="text-xs text-medisetu-muted">
                    Languages
                  </p>
                  <p className="text-sm font-semibold text-medisetu-navy dark:text-white">
                    {Array.isArray(doctor.languages)
                      ? doctor.languages.join(', ')
                      : doctor.languages}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Available slots */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 space-y-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-medisetu-navy dark:text-white">
              Available Time Slots
            </h2>
            <p className="text-xs text-medisetu-muted mt-1">
              Select a slot before booking your appointment.
            </p>
          </div>

          {availableSlots.length > 0 ? (
            <TimeSlotGrid
              slots={availableSlots}
              selectedSlot={selectedSlot}
              onSelectSlot={setSelectedSlot}
            />
          ) : (
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-4 text-sm text-medisetu-muted">
              No available time slots were returned by the
              backend.
            </div>
          )}

          <PrimaryButton
            fullWidth
            disabled={!selectedSlot}
            onClick={handleBookAppointment}
          >
            {selectedSlot
              ? 'Book Appointment'
              : 'No Slot Available'}
          </PrimaryButton>
        </section>

        {/* Working hours */}
        {(doctor.availableFrom || doctor.availableTo) && (
          <div className="flex items-center gap-3 text-sm text-medisetu-muted">
            <Clock className="w-4 h-4" />
            <span>
              Available from {doctor.availableFrom || '--'} to{' '}
              {doctor.availableTo || '--'}
            </span>
          </div>
        )}
      </motion.div>
    </PatientLayout>
  );
};

export default DoctorProfileScreen;