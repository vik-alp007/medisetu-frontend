import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  Building2,
  FileText,
} from 'lucide-react';

import PatientLayout from '../../layouts/PatientLayout';
import SuccessCheckmark from '../../components/feedback/SuccessCheckmark';
import PrimaryButton from '../../components/common/PrimaryButton';
import OutlineButton from '../../components/common/OutlineButton';
import StatusBadge from '../../components/common/StatusBadge';

import { getDoctorAvatar } from '../../utils/doctorAvatar';

const formatDate = (dateString) => {
  if (!dateString) return 'Not available';

  const date = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const formatTime = (timeString) => {
  if (!timeString) return 'Not available';

  const [hours, minutes] = timeString.split(':');

  if (hours === undefined || minutes === undefined) {
    return timeString;
  }

  const date = new Date();
  date.setHours(Number(hours), Number(minutes), 0, 0);

  return date.toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

const getDoctorName = (doctorDetail) => {
  const firstName = doctorDetail?.user?.first_name || '';
  const lastName = doctorDetail?.user?.last_name || '';

  const fullName = `${firstName} ${lastName}`.trim();

  if (fullName) {
    return `Dr. ${fullName}`;
  }

  return 'Doctor';
};

const getStatusLabel = (status) => {
  if (!status) return 'Confirmed';

  return String(status)
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export const AppointmentConfirmationScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const appointment = location.state?.appointment;

  if (!appointment) {
    return (
      <PatientLayout>
        <div className="mx-auto max-w-xl space-y-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-medisetu-navy">
            No Appointment Confirmation Found
          </h1>

          <p className="text-sm text-medisetu-muted">
            Please create an appointment first.
          </p>

          <PrimaryButton onClick={() => navigate('/doctors')}>
            Find a Doctor
          </PrimaryButton>
        </div>
      </PatientLayout>
    );
  }

  const doctor = appointment.doctor_detail;

  const doctorName = getDoctorName(doctor);

  const specialization =
    doctor?.specialization || 'Medical Specialist';

  const appointmentDate = formatDate(
    appointment.appointment_date
  );

  const appointmentTime = formatTime(
    appointment.appointment_time
  );

  const statusLabel = getStatusLabel(
    appointment.status
  );

  return (
    <PatientLayout>
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="mx-auto w-full max-w-xl space-y-6 py-6 sm:py-10"
      >
        {/* Success Header */}
        <div className="flex flex-col items-center space-y-3 text-center">
          <SuccessCheckmark size="lg" />

          <h1 className="text-2xl font-extrabold text-medisetu-navy sm:text-3xl">
            Appointment Confirmed!
          </h1>

          <p className="max-w-sm text-sm text-medisetu-muted">
            Your appointment has been successfully scheduled.
          </p>
        </div>

        {/* Appointment Receipt */}
        <div className="space-y-5 rounded-3xl border border-slate-200/90 bg-white p-5 shadow-card sm:p-6">
          {/* Booking Reference */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="block text-xs text-medisetu-muted">
                Booking Reference
              </span>

              <span className="text-sm font-extrabold tracking-wide text-medisetu-navy sm:text-base">
                #{appointment.id}
              </span>
            </div>

            <StatusBadge
              status={statusLabel}
              variant="success"
              size="md"
            />
          </div>

          {/* Doctor */}
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-full border-2 border-white bg-blue-100 shadow-xs">
              {getDoctorAvatar(
                doctor?.id || appointment.doctor,
                doctorName,
                'h-full w-full'
              )}
            </div>

            <div className="flex min-w-0 flex-col">
              <h2 className="text-base font-bold leading-tight text-medisetu-navy sm:text-lg">
                {doctorName}
              </h2>

              <span className="text-xs font-semibold text-medisetu-primary sm:text-sm">
                {specialization}
              </span>

              {doctor?.qualification && (
                <span className="mt-0.5 text-xs text-medisetu-muted">
                  {doctor.qualification}
                </span>
              )}
            </div>
          </div>

          {/* Appointment Details */}
          <div className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 text-xs sm:grid-cols-2 sm:text-sm">
            {/* Date */}
            <div className="flex items-center gap-2.5 text-medisetu-slate">
              <Calendar className="h-4 w-4 flex-shrink-0 text-medisetu-primary" />

              <div>
                <span className="block text-[11px] text-medisetu-muted">
                  Date
                </span>

                <span className="font-semibold text-medisetu-navy">
                  {appointmentDate}
                </span>
              </div>
            </div>

            {/* Time */}
            <div className="flex items-center gap-2.5 text-medisetu-slate">
              <Clock className="h-4 w-4 flex-shrink-0 text-medisetu-primary" />

              <div>
                <span className="block text-[11px] text-medisetu-muted">
                  Time
                </span>

                <span className="font-semibold text-medisetu-navy">
                  {appointmentTime}
                </span>
              </div>
            </div>

            {/* Doctor / Consultation */}
            <div className="flex items-center gap-2.5 text-medisetu-slate">
              <Building2 className="h-4 w-4 flex-shrink-0 text-medisetu-primary" />

              <div>
                <span className="block text-[11px] text-medisetu-muted">
                  Specialist
                </span>

                <span className="font-semibold text-medisetu-navy">
                  {specialization}
                </span>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2.5 text-medisetu-slate">
              <MapPin className="h-4 w-4 flex-shrink-0 text-rose-500" />

              <div>
                <span className="block text-[11px] text-medisetu-muted">
                  Status
                </span>

                <span className="font-semibold text-medisetu-navy">
                  {statusLabel}
                </span>
              </div>
            </div>
          </div>

          {/* Reason */}
          {appointment.reason && (
            <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
              <div className="flex items-start gap-3">
                <FileText className="mt-0.5 h-4 w-4 flex-shrink-0 text-medisetu-primary" />

                <div>
                  <span className="block text-[11px] text-medisetu-muted">
                    Reason for Visit
                  </span>

                  <p className="mt-1 text-sm font-medium text-medisetu-navy">
                    {appointment.reason}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Doctor Details */}
          {(doctor?.qualification ||
            doctor?.experience !== undefined ||
            doctor?.consultation_fee) && (
            <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
              <h3 className="mb-2 text-sm font-bold text-medisetu-navy">
                Doctor Details
              </h3>

              <div className="space-y-1 text-xs text-medisetu-slate">
                {doctor?.qualification && (
                  <p>
                    <span className="font-semibold">
                      Qualification:
                    </span>{' '}
                    {doctor.qualification}
                  </p>
                )}

                {doctor?.experience !== undefined && (
                  <p>
                    <span className="font-semibold">
                      Experience:
                    </span>{' '}
                    {doctor.experience} years
                  </p>
                )}

                {doctor?.consultation_fee && (
                  <p>
                    <span className="font-semibold">
                      Consultation Fee:
                    </span>{' '}
                    ₹{doctor.consultation_fee}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Preparation Guidelines */}
          <div className="space-y-1 rounded-2xl border border-blue-100 bg-blue-50/60 p-3.5 text-xs text-medisetu-slate">
            <span className="block font-bold text-medisetu-navy">
              Preparation Guidelines:
            </span>

            <p>
              • Please reach the clinic 15 minutes before
              your appointment.
            </p>

            <p>
              • Carry your previous prescriptions and latest
              medical records if available.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          <PrimaryButton
            size="lg"
            fullWidth
            onClick={() => navigate('/dashboard')}
          >
            Go to Patient Dashboard
          </PrimaryButton>

          <OutlineButton
            size="lg"
            fullWidth
            onClick={() => navigate('/records')}
          >
            View Medical Records
          </OutlineButton>
        </div>
      </motion.div>
    </PatientLayout>
  );
};

export default AppointmentConfirmationScreen;