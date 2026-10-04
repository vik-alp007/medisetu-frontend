import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Calendar,
  Languages,
  GraduationCap
} from 'lucide-react';

import PatientLayout from '../../layouts/PatientLayout';
import TopHeader from '../../components/navigation/TopHeader';
import PrimaryButton from '../../components/common/PrimaryButton';
import StatusBadge from '../../components/common/StatusBadge';
import InfoCard from '../../components/cards/InfoCard';
import TimeSlotGrid from '../../components/booking/TimeSlotGrid';
import LoadingSpinner from '../../components/feedback/LoadingSpinner';
import ErrorAlert from '../../components/feedback/ErrorAlert';

import { doctorService } from '../../services/doctorService';
import { mockDoctors } from '../../data/mockData';
import { DoctorClinicBanner } from '../../assets/illustrations/DoctorAvatars';
import { getDoctorAvatar } from '../../utils/doctorAvatar';

export const DoctorProfileScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorNotice, setErrorNotice] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchDoctor = async () => {
      try {
        setLoading(true);
        setErrorNotice(null);
        // Backend endpoint: GET /api/doctors/:id/
        const data = await doctorService.getDoctorById(id);
        if (isMounted && data) {
          setDoctor(data);
          if (data.availableSlots && data.availableSlots.length > 0) {
            setSelectedSlot(data.availableSlots[0]);
          }
        }
      } catch (err) {
        if (isMounted) {
          console.warn('Backend doctor details API error:', err.message);
          // Fallback to local mock data
          const found = mockDoctors.find((d) => String(d.id) === String(id)) || mockDoctors[0];
          setDoctor(found);
          if (found?.availableSlots?.length > 0) {
            setSelectedSlot(found.availableSlots[0]);
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDoctor();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <PatientLayout>
        <div className="py-24 flex flex-col items-center justify-center gap-3">
          <LoadingSpinner size="lg" />
          <span className="text-sm text-medisetu-muted">Loading doctor profile...</span>
        </div>
      </PatientLayout>
    );
  }

  if (!doctor) {
    return (
      <PatientLayout>
        <div className="py-16 text-center space-y-4">
          <h2 className="text-xl font-bold text-medisetu-navy">Doctor Not Found</h2>
          <PrimaryButton onClick={() => navigate('/doctors')}>
            Back to Doctors Directory
          </PrimaryButton>
        </div>
      </PatientLayout>
    );
  }

  const highlights = doctor.highlights || [
    { label: doctor.experience || '10+ Years Experience', subtext: 'In specialized healthcare' },
    { label: '5000+ Happy Patients', subtext: 'Treated with high satisfaction' },
    { label: 'Modern Treatment Methods', subtext: 'Advanced diagnostic equipment' },
    { label: 'Patient-Centric Approach', subtext: 'Personalized care plans' },
  ];

  const highlightIcons = [Award, Users, ShieldCheck, HeartHandshake];

  return (
    <PatientLayout>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full space-y-6 pb-24"
      >
        {/* Header */}
        <TopHeader
          title="Doctor Profile"
          subtitle={doctor.specialty}
          showBack={true}
          backTo="/doctors"
          className="px-1"
        />

        {errorNotice && (
          <ErrorAlert
            title="Notice"
            message={errorNotice}
            onDismiss={() => setErrorNotice(null)}
          />
        )}

        {/* Doctor Clinic Office Banner (Figma Screen 10) */}
        <div className="w-full rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs bg-white">
          <DoctorClinicBanner className="w-full h-44 sm:h-56" />
        </div>

        {/* Doctor Info Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-blue-100 flex-shrink-0 border-4 border-white shadow-sm">
            {getDoctorAvatar(doctor.id, doctor.name, 'w-full h-full')}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1.5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-center sm:justify-start">
              <h1 className="text-xl sm:text-2xl font-bold text-medisetu-navy">
                {doctor.name}
              </h1>
              {doctor.isTopRated && (
                <StatusBadge status="Top Rated" variant="success" size="sm" />
              )}
            </div>

            <p className="text-sm font-semibold text-medisetu-primary">
              {doctor.specialty}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-medisetu-muted pt-1">
              <span className="flex items-center gap-1 font-semibold text-amber-500">
                <Star className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                <span>{doctor.rating || '4.8'}</span>
                {doctor.reviewsCount && (
                  <span className="text-medisetu-muted font-normal">
                    ({doctor.reviewsCount} reviews)
                  </span>
                )}
              </span>

              {doctor.experience && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-medisetu-slate" />
                  {doctor.experience}
                </span>
              )}

              {doctor.languages && (
                <span className="flex items-center gap-1">
                  <Languages className="w-3.5 h-3.5 text-medisetu-slate" />
                  {doctor.languages}
                </span>
              )}
            </div>

            {doctor.education && (
              <p className="text-xs text-medisetu-slate flex items-center justify-center sm:justify-start gap-1 pt-1">
                <GraduationCap className="w-3.5 h-3.5 text-medisetu-primary" />
                {doctor.education}
              </p>
            )}
          </div>
        </div>

        {/* About Doctor Section */}
        <section className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-medisetu-navy">
            About Doctor
          </h2>
          <p className="text-sm text-medisetu-slate leading-relaxed">
            {doctor.about ||
              `${doctor.name} is a certified specialist in ${doctor.specialty} with ${doctor.experience || 'extensive experience'} in diagnosing and treating patients. Committed to clinical excellence and compassionate healthcare.`}
          </p>
        </section>

        {/* Highlights / Credentials (Screen 10) */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-medisetu-navy px-1">
            Doctor Highlights
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {highlights.map((hl, idx) => {
              const Icon = highlightIcons[idx % highlightIcons.length];
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200/80 p-4 flex items-center gap-3.5 shadow-xs"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-medisetu-primary flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-medisetu-navy">
                      {hl.label}
                    </span>
                    <span className="text-xs text-medisetu-muted">{hl.subtext}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Available Slots Preview */}
        <section className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-medisetu-navy">
              Available Consultation Slots
            </h2>
            <span className="text-xs font-semibold text-medisetu-primary">
              Today / Next Day
            </span>
          </div>

          <TimeSlotGrid
            slots={doctor.availableSlots || ['10:00 AM', '11:00 AM', '02:00 PM', '04:30 PM']}
            selectedSlot={selectedSlot}
            onSelectSlot={(s) => setSelectedSlot(s)}
          />
        </section>

        {/* Hospital & Contact Info */}
        <section className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-medisetu-navy">
            Clinic & Hospital Location
          </h2>
          <div className="space-y-2.5 text-sm">
            <div className="flex items-center gap-3 text-medisetu-slate">
              <MapPin className="w-4 h-4 text-medisetu-primary flex-shrink-0" />
              <span>{doctor.contact?.hospital || 'Apollo Hospitals, New Delhi'}</span>
            </div>
            <div className="flex items-center gap-3 text-medisetu-slate">
              <Phone className="w-4 h-4 text-medisetu-primary flex-shrink-0" />
              <span>{doctor.contact?.phone || '+91 98765 43210'}</span>
            </div>
          </div>
        </section>

        {/* Floating / Sticky Bottom Bar (Screen 10) */}
        <div className="fixed bottom-20 left-0 right-0 z-40 px-4 sm:px-8 max-w-[1280px] mx-auto pointer-events-none">
          <div className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-3xl p-4 shadow-dock flex items-center justify-between gap-4 pointer-events-auto">
            <div>
              <span className="text-xs text-medisetu-muted block">Consultation Fee</span>
              <span className="text-xl sm:text-2xl font-extrabold text-medisetu-navy">
                ₹{doctor.consultationFee || 800}
              </span>
            </div>

            <PrimaryButton
              size="lg"
              onClick={() => navigate(`/appointments/book/${doctor.id}?slot=${encodeURIComponent(selectedSlot || '')}`)}
              className="flex-1 sm:flex-initial sm:px-8"
            >
              Book Appointment
            </PrimaryButton>
          </div>
        </div>
      </motion.div>
    </PatientLayout>
  );
};

export default DoctorProfileScreen;
