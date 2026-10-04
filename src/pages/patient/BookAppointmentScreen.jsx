import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

import PatientLayout from '../../layouts/PatientLayout';
import TopHeader from '../../components/navigation/TopHeader';
import BookingStepper from '../../components/booking/BookingStepper';
import CalendarWidget from '../../components/booking/CalendarWidget';
import TimeSlotGrid from '../../components/booking/TimeSlotGrid';
import ConsultationTypeRadio from '../../components/booking/ConsultationTypeRadio';
import PrimaryButton from '../../components/common/PrimaryButton';
import InputField from '../../components/common/InputField';
import LoadingSpinner from '../../components/feedback/LoadingSpinner';
import ErrorAlert from '../../components/feedback/ErrorAlert';

import { doctorService } from '../../services/doctorService';
import { appointmentService } from '../../services/appointmentService';
import { useAuth } from '../../context/AuthContext';
import { getDoctorAvatar } from '../../utils/doctorAvatar';

export const BookAppointmentScreen = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const preselectedSlot = searchParams.get('slot') || '11:00 AM';

  const [doctor, setDoctor] = useState(null);
  const [loadingDoctor, setLoadingDoctor] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Booking Form State
  const [consultationType, setConsultationType] = useState('in-person');
  const [selectedDay, setSelectedDay] = useState(28);
  const [selectedMonth, setSelectedMonth] = useState('September');
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedSlot, setSelectedSlot] = useState(preselectedSlot);
  const [patientName, setPatientName] = useState([user?.first_name, user?.last_name].filter(Boolean).join(' ') || user?.name || '');
  const [patientPhone, setPatientPhone] = useState(user?.phone || user?.mobile || '');
  const [symptoms, setSymptoms] = useState('');

  // Fetch Doctor details
  useEffect(() => {
    let isMounted = true;

    const fetchDoctor = async () => {
      try {
        setLoadingDoctor(true);
        // Backend endpoint: GET /api/doctors/:id/
        const data = await doctorService.getDoctorById(doctorId);
        if (isMounted && data) {
          setDoctor(data);
          if (data.availableSlots && !data.availableSlots.includes(selectedSlot)) {
            setSelectedSlot(data.availableSlots[0]);
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error('Backend doctor fetch error:', err);
          setDoctor(null);
          setErrorMessage(err?.response?.data?.detail || err?.response?.data?.message || err?.message || 'Unable to load doctor availability.');
        }
      } finally {
        if (isMounted) setLoadingDoctor(false);
      }
    };

    fetchDoctor();
    return () => {
      isMounted = false;
    };
  }, [doctorId]);

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSubmitting(true);

    const bookingPayload = {
      doctor_id: doctorId,
      doctor_name: doctor?.name || 'Dr. Rahul Sharma',
      specialty: doctor?.specialty || 'Cardiologist',
      consultation_type: consultationType === 'in-person' ? 'In-person' : 'Video Consultation',
      date: `${selectedDay} ${selectedMonth} ${selectedYear}`,
      time_slot: selectedSlot,
      patient_name: patientName,
      patient_phone: patientPhone,
      symptoms: symptoms || 'General Consultation',
      fee: doctor?.consultationFee || 800,
    };

    try {
      // Backend endpoint: POST /api/appointments/
      // Payload: { doctor_id, date, time_slot, consultation_type, ... }
      const res = await appointmentService.createAppointment(bookingPayload);
      
      navigate('/appointments/confirmation', {
        state: {
          appointment: {
            id: res?.id || `APT-${Date.now().toString().slice(-5)}`,
            ...bookingPayload,
          },
        },
      });
    } catch (err) {
      console.error('Backend appointment creation failed:', err);
      setErrorMessage(err?.response?.data?.detail || err?.response?.data?.message || err?.message || 'Unable to create the appointment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingDoctor) {
    return (
      <PatientLayout>
        <div className="py-24 flex flex-col items-center justify-center gap-3">
          <LoadingSpinner size="lg" />
          <span className="text-sm text-medisetu-muted">Preparing booking schedule...</span>
        </div>
      </PatientLayout>
    );
  }

  const availableSlots = doctor?.availableSlots || [
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM',
    '04:30 PM',
    '05:00 PM',
  ];

  return (
    <PatientLayout>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full space-y-6 pb-12"
      >
        {/* Header */}
        <TopHeader
          title="Book Appointment"
          subtitle="Choose consultation type, date & slot"
          showBack={true}
          backTo={`/doctors/${doctorId}`}
          className="px-1"
        />

        {/* Stepper (Screen 11) */}
        <BookingStepper currentStep={2} />

        {errorMessage && (
          <ErrorAlert
            title="Booking Notice"
            message={errorMessage}
            onDismiss={() => setErrorMessage(null)}
          />
        )}

        {/* Selected Doctor Summary Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-5 shadow-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-full overflow-hidden bg-blue-100 flex-shrink-0 border-2 border-white shadow-xs">
              {getDoctorAvatar(doctor?.id, doctor?.name, 'w-full h-full')}
            </div>

            <div className="flex flex-col">
              <h2 className="text-base sm:text-lg font-bold text-medisetu-navy leading-tight">
                {doctor?.name}
              </h2>
              <span className="text-xs sm:text-sm text-medisetu-primary font-semibold">
                {doctor?.specialty}
              </span>
              <span className="text-xs text-medisetu-muted mt-0.5">
                {doctor?.experience || '12 years experience'}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-medisetu-muted block">Fee</span>
            <span className="text-base sm:text-lg font-bold text-medisetu-navy">
              ₹{doctor?.consultationFee || 800}
            </span>
          </div>
        </div>

        <form onSubmit={handleConfirmBooking} className="space-y-6">
          {/* 1. Consultation Type Radio (Screen 11) */}
          <section className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-3">
            <label className="text-sm sm:text-base font-bold text-medisetu-navy block">
              1. Select Consultation Type
            </label>
            <ConsultationTypeRadio
              selectedValue={consultationType}
              onChange={(val) => setConsultationType(val)}
            />
          </section>

          {/* 2. Select Date Calendar (Screen 11) */}
          <section className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-3">
            <label className="text-sm sm:text-base font-bold text-medisetu-navy block">
              2. Select Date
            </label>
            <CalendarWidget
              selectedDate={selectedDay}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              onSelectDate={(day, month, year) => {
                setSelectedDay(day);
                if (month) setSelectedMonth(month);
                if (year) setSelectedYear(year);
              }}
            />
          </section>

          {/* 3. Select Time Slot (Screen 11) */}
          <section className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm sm:text-base font-bold text-medisetu-navy block">
                3. Available Time Slots
              </label>
              <span className="text-xs text-medisetu-muted">
                {selectedDay} {selectedMonth} {selectedYear}
              </span>
            </div>

            <TimeSlotGrid
              slots={availableSlots}
              selectedSlot={selectedSlot}
              onSelectSlot={(slot) => setSelectedSlot(slot)}
            />
          </section>

          {/* 4. Patient Information */}
          <section className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
            <label className="text-sm sm:text-base font-bold text-medisetu-navy block">
              4. Patient Information
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Patient Full Name"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="Full Name"
                required
              />

              <InputField
                label="Contact Number"
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
                placeholder="+91 98765 43210"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-medisetu-navy">
                Reason for Visit / Symptoms (Optional)
              </label>
              <textarea
                rows={2}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Briefly describe your symptoms (e.g., chest pain, routine review)..."
                className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-2xl text-sm text-medisetu-navy placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-medisetu-primary transition-all resize-none"
              />
            </div>
          </section>

          {/* 5. Summary & Price Breakdown */}
          <div className="bg-blue-50/60 border border-blue-100 rounded-3xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs sm:text-sm text-medisetu-slate">
              <span>Consultation Type</span>
              <span className="font-semibold text-medisetu-navy capitalize">
                {consultationType} ({consultationType === 'in-person' ? 'At Hospital' : 'Video'})
              </span>
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm text-medisetu-slate">
              <span>Appointment Slot</span>
              <span className="font-semibold text-medisetu-navy">
                {selectedDay} {selectedMonth} {selectedYear} at {selectedSlot}
              </span>
            </div>

            <div className="border-t border-blue-200/60 pt-3 flex items-center justify-between">
              <div>
                <span className="text-xs text-medisetu-muted block">Total Payable</span>
                <span className="text-xl font-extrabold text-medisetu-navy">
                  ₹{doctor?.consultationFee || 800}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                <ShieldCheck className="w-4 h-4" /> Pay at Hospital / Online
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <PrimaryButton
            type="submit"
            size="lg"
            fullWidth
            isLoading={submitting}
          >
            Confirm & Schedule Appointment
          </PrimaryButton>
        </form>
      </motion.div>
    </PatientLayout>
  );
};

export default BookAppointmentScreen;
