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
import LoadingSpinner from '../../components/feedback/LoadingSpinner';
import ErrorAlert from '../../components/feedback/ErrorAlert';

import { doctorService } from '../../services/doctorService';
import { appointmentService } from '../../services/appointmentService';
import { getDoctorAvatar } from '../../utils/doctorAvatar';

const formatAppointmentDate = (day, month, year) => {
  const monthMap = {
    January: '01',
    February: '02',
    March: '03',
    April: '04',
    May: '05',
    June: '06',
    July: '07',
    August: '08',
    September: '09',
    October: '10',
    November: '11',
    December: '12',
  };

  const monthNumber = monthMap[month];

  if (!monthNumber || !day || !year) {
    return null;
  }

  return `${year}-${monthNumber}-${String(day).padStart(2, '0')}`;
};

const formatAppointmentTime = (time) => {
  if (!time) return null;

  /*
   * Backend expects:
   * HH:MM:SS
   *
   * UI may provide:
   * 10:30 AM
   * 04:30 PM
   * 10:30
   */

  const normalizedTime = String(time).trim();

  if (/^\d{2}:\d{2}:\d{2}$/.test(normalizedTime)) {
    return normalizedTime;
  }

  const twelveHourMatch = normalizedTime.match(
    /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i
  );

  if (twelveHourMatch) {
    let hours = Number(twelveHourMatch[1]);
    const minutes = twelveHourMatch[2];
    const period = twelveHourMatch[3].toUpperCase();

    if (period === 'AM' && hours === 12) {
      hours = 0;
    }

    if (period === 'PM' && hours !== 12) {
      hours += 12;
    }

    return `${String(hours).padStart(2, '0')}:${minutes}:00`;
  }

  const twentyFourHourMatch = normalizedTime.match(
    /^(\d{1,2}):(\d{2})$/
  );

  if (twentyFourHourMatch) {
    return `${String(Number(twentyFourHourMatch[1])).padStart(
      2,
      '0'
    )}:${twentyFourHourMatch[2]}:00`;
  }

  return null;
};

const extractBackendError = (err) => {
  const data = err?.response?.data;

  if (!data) {
    return err?.message || 'Unable to create the appointment.';
  }

  if (typeof data === 'string') {
    return data;
  }

  if (data.detail) {
    return data.detail;
  }

  if (data.message) {
    return data.message;
  }

  if (typeof data === 'object') {
    const fieldErrors = Object.entries(data)
      .map(([field, errors]) => {
        const message = Array.isArray(errors)
          ? errors.join(', ')
          : String(errors);

        return `${field}: ${message}`;
      })
      .join(' | ');

    if (fieldErrors) {
      return fieldErrors;
    }
  }

  return 'Unable to create the appointment. Please try again.';
};

export const BookAppointmentScreen = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const preselectedSlot = searchParams.get('slot') || '';

  const [doctor, setDoctor] = useState(null);
  const [loadingDoctor, setLoadingDoctor] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const [consultationType, setConsultationType] =
    useState('in-person');

  const [selectedDay, setSelectedDay] = useState(15);
  const [selectedMonth, setSelectedMonth] =
    useState('October');
  const [selectedYear, setSelectedYear] = useState(2026);

  const [selectedSlot, setSelectedSlot] =
    useState(preselectedSlot);

  const [reason, setReason] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchDoctor = async () => {
      try {
        setLoadingDoctor(true);
        setErrorMessage(null);

        const data = await doctorService.getDoctorById(
          doctorId
        );

        if (!isMounted) return;

        setDoctor(data);

        const backendSlots = Array.isArray(
          data?.availableSlots
        )
          ? data.availableSlots
          : [];

        if (
          preselectedSlot &&
          backendSlots.includes(preselectedSlot)
        ) {
          setSelectedSlot(preselectedSlot);
        } else if (backendSlots.length > 0) {
          setSelectedSlot(backendSlots[0]);
        } else {
          setSelectedSlot('');
        }
      } catch (err) {
        if (!isMounted) return;

        console.error(
          'Backend doctor fetch error:',
          err
        );

        setDoctor(null);
        setErrorMessage(extractBackendError(err));
      } finally {
        if (isMounted) {
          setLoadingDoctor(false);
        }
      }
    };

    if (doctorId) {
      fetchDoctor();
    } else {
      setLoadingDoctor(false);
      setErrorMessage('Doctor information is missing.');
    }

    return () => {
      isMounted = false;
    };
  }, [doctorId, preselectedSlot]);

  const availableSlots = Array.isArray(
    doctor?.availableSlots
  )
    ? doctor.availableSlots
    : [];

  const handleConfirmBooking = async (event) => {
    event.preventDefault();

    setErrorMessage(null);

    if (!doctorId) {
      setErrorMessage('Doctor information is missing.');
      return;
    }

    if (!selectedSlot) {
      setErrorMessage(
        'Please select an available time slot.'
      );
      return;
    }

    if (!reason.trim()) {
      setErrorMessage(
        'Please enter the reason for your appointment.'
      );
      return;
    }

    const appointmentDate = formatAppointmentDate(
      selectedDay,
      selectedMonth,
      selectedYear
    );

    const appointmentTime =
      formatAppointmentTime(selectedSlot);

    if (!appointmentDate) {
      setErrorMessage('Please select a valid appointment date.');
      return;
    }

    if (!appointmentTime) {
      setErrorMessage('Please select a valid appointment time.');
      return;
    }

    /*
     * EXACT BACKEND CONTRACT
     *
     * POST /api/appointments/
     *
     * Patient booking:
     * {
     *   doctor_id,
     *   appointment_date,
     *   appointment_time,
     *   reason
     * }
     */
    const bookingPayload = {
      doctor_id: Number(doctorId),
      appointment_date: appointmentDate,
      appointment_time: appointmentTime,
      reason: reason.trim(),
    };

    try {
      setSubmitting(true);

      const response =
        await appointmentService.createAppointment(
          bookingPayload
        );

      /*
       * Navigate ONLY after backend successfully
       * creates the appointment.
       *
       * No fake appointment ID is generated.
       */
      navigate('/appointments/confirmation', {
        state: {
          appointment: response,
        },
      });
    } catch (err) {
      console.error(
        'Backend appointment creation failed:',
        err
      );

      setErrorMessage(extractBackendError(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingDoctor) {
    return (
      <PatientLayout>
        <div className="flex flex-col items-center justify-center gap-3 py-24">
          <LoadingSpinner size="lg" />

          <span className="text-sm text-medisetu-muted">
            Preparing booking schedule...
          </span>
        </div>
      </PatientLayout>
    );
  }

  if (!doctor) {
    return (
      <PatientLayout>
        <div className="mx-auto max-w-3xl px-4 py-12">
          <TopHeader
            title="Book Appointment"
            subtitle="Appointment scheduling"
            showBack
            backTo="/doctors"
          />

          <ErrorAlert
            title="Unable to load doctor"
            message={
              errorMessage ||
              'Doctor information could not be loaded.'
            }
          />
        </div>
      </PatientLayout>
    );
  }

  return (
    <PatientLayout>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8"
      >
        <TopHeader
          title="Book Appointment"
          subtitle="Schedule your consultation"
          showBack
          backTo={`/doctors/${doctorId}`}
        />

        <BookingStepper currentStep={2} />

        {errorMessage && (
          <div className="mb-5">
            <ErrorAlert
              title="Booking Error"
              message={errorMessage}
            />
          </div>
        )}

        {/* Doctor summary */}
        <div className="mb-6 rounded-2xl border border-medisetu-border bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-5">
          <div className="flex items-center gap-4">
            <img
              src={getDoctorAvatar(doctor)}
              alt={doctor.name || 'Doctor'}
              className="h-16 w-16 rounded-full object-cover"
            />

            <div className="min-w-0 flex-1">
              <h2 className="truncate text-base font-bold text-medisetu-text dark:text-white">
                {doctor.name}
              </h2>

              <p className="text-sm text-medisetu-muted">
                {doctor.specialty ||
                  doctor.specialization ||
                  'Medical Specialist'}
              </p>

              {doctor.consultationFee !== undefined &&
                doctor.consultationFee !== null && (
                  <p className="mt-1 text-sm font-semibold text-medisetu-primary">
                    ₹{doctor.consultationFee}
                  </p>
                )}
            </div>
          </div>
        </div>

        <form
          onSubmit={handleConfirmBooking}
          className="space-y-6"
        >
          {/* Consultation type - UI only.
              Backend appointment contract currently does
              not accept consultation_type. */}
          <div className="rounded-2xl border border-medisetu-border bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <h3 className="mb-4 text-base font-bold text-medisetu-text dark:text-white">
              Consultation Type
            </h3>

            <ConsultationTypeRadio
              value={consultationType}
              onChange={setConsultationType}
            />

            <p className="mt-3 text-xs text-medisetu-muted">
              Consultation type is currently used for the
              frontend selection only. It is not sent to the
              appointment API because it is not part of the
              confirmed backend contract.
            </p>
          </div>

          {/* Date */}
          <div className="rounded-2xl border border-medisetu-border bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <h3 className="mb-4 text-base font-bold text-medisetu-text dark:text-white">
              Select Date
            </h3>

            <CalendarWidget
              selectedDay={selectedDay}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              onDateChange={({
                day,
                month,
                year,
              }) => {
                setSelectedDay(day);
                setSelectedMonth(month);
                setSelectedYear(year);
              }}
            />
          </div>

          {/* Time slots */}
          <div className="rounded-2xl border border-medisetu-border bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <h3 className="mb-4 text-base font-bold text-medisetu-text dark:text-white">
              Available Time
            </h3>

            {availableSlots.length > 0 ? (
              <TimeSlotGrid
                slots={availableSlots}
                selectedSlot={selectedSlot}
                onSelect={setSelectedSlot}
              />
            ) : (
              <div className="rounded-xl border border-dashed border-medisetu-border p-6 text-center dark:border-slate-700">
                <p className="text-sm font-medium text-medisetu-text dark:text-white">
                  No time slots available
                </p>

                <p className="mt-1 text-xs text-medisetu-muted">
                  Please choose another doctor or date.
                </p>
              </div>
            )}
          </div>

          {/* Reason */}
          <div className="rounded-2xl border border-medisetu-border bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <h3 className="mb-4 text-base font-bold text-medisetu-text dark:text-white">
              Reason for Visit
            </h3>

            <textarea
              value={reason}
              onChange={(event) =>
                setReason(event.target.value)
              }
              rows={4}
              required
              placeholder="Describe your symptoms or reason for consultation..."
              className="w-full rounded-xl border border-medisetu-border bg-white px-4 py-3 text-sm text-medisetu-text outline-none transition focus:border-medisetu-primary focus:ring-2 focus:ring-medisetu-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* Summary */}
          <div className="rounded-2xl border border-medisetu-primary/20 bg-medisetu-primary/5 p-5">
            <div className="flex items-start gap-3">
              <ShieldCheck
                size={22}
                className="mt-0.5 shrink-0 text-medisetu-primary"
              />

              <div className="flex-1">
                <h3 className="text-sm font-bold text-medisetu-text dark:text-white">
                  Appointment Summary
                </h3>

                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-medisetu-muted">
                      Doctor
                    </span>

                    <span className="text-right font-medium text-medisetu-text dark:text-white">
                      {doctor.name}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-medisetu-muted">
                      Date
                    </span>

                    <span className="font-medium text-medisetu-text dark:text-white">
                      {selectedDay} {selectedMonth}{' '}
                      {selectedYear}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-medisetu-muted">
                      Time
                    </span>

                    <span className="font-medium text-medisetu-text dark:text-white">
                      {selectedSlot || 'Not selected'}
                    </span>
                  </div>

                  {doctor.consultationFee !== undefined &&
                    doctor.consultationFee !== null && (
                      <div className="flex justify-between gap-4 border-t border-medisetu-primary/10 pt-2">
                        <span className="text-medisetu-muted">
                          Consultation Fee
                        </span>

                        <span className="font-bold text-medisetu-primary">
                          ₹{doctor.consultationFee}
                        </span>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>

          <PrimaryButton
            type="submit"
            size="lg"
            fullWidth
            isLoading={submitting}
            disabled={
              submitting ||
              !selectedSlot ||
              availableSlots.length === 0 ||
              !reason.trim()
            }
          >
            Confirm & Schedule Appointment
          </PrimaryButton>
        </form>
      </motion.div>
    </PatientLayout>
  );
};

export default BookAppointmentScreen;