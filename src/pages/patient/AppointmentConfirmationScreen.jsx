import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Building2, 
  Video
} from 'lucide-react';

import PatientLayout from '../../layouts/PatientLayout';
import SuccessCheckmark from '../../components/feedback/SuccessCheckmark';
import PrimaryButton from '../../components/common/PrimaryButton';
import OutlineButton from '../../components/common/OutlineButton';
import StatusBadge from '../../components/common/StatusBadge';

import { getDoctorAvatar } from '../../utils/doctorAvatar';

export const AppointmentConfirmationScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const aptData = location.state?.appointment;

  if (!aptData) {
    return (
      <PatientLayout>
        <div className="max-w-xl mx-auto py-16 text-center space-y-4">
          <h1 className="text-2xl font-bold text-medisetu-navy">No Appointment Confirmation Found</h1>
          <p className="text-sm text-medisetu-muted">Please create an appointment first.</p>
          <PrimaryButton onClick={() => navigate('/doctors')}>Find a Doctor</PrimaryButton>
        </div>
      </PatientLayout>
    );
  }

  return (
    <PatientLayout>
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-xl mx-auto py-6 sm:py-10 space-y-6"
      >
        {/* Animated Success Checkmark */}
        <div className="flex flex-col items-center text-center space-y-3">
          <SuccessCheckmark size="lg" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-medisetu-navy">
            Appointment Confirmed!
          </h1>
          <p className="text-sm text-medisetu-muted max-w-sm">
            Your appointment has been successfully scheduled. We have sent confirmation details via SMS and email.
          </p>
        </div>

        {/* Appointment Summary Receipt Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-card space-y-5">
          {/* Header row with token */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs text-medisetu-muted block">Booking Reference</span>
              <span className="text-sm sm:text-base font-extrabold text-medisetu-navy tracking-wide">
                #{aptData.id}
              </span>
            </div>
            <StatusBadge status="Confirmed" variant="success" size="md" />
          </div>

          {/* Doctor Meta */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full overflow-hidden bg-blue-100 flex-shrink-0 border-2 border-white shadow-xs">
              {getDoctorAvatar(aptData.doctor_id || '1', aptData.doctor_name, 'w-full h-full')}
            </div>
            <div className="flex flex-col">
              <h2 className="text-base sm:text-lg font-bold text-medisetu-navy leading-tight">
                {aptData.doctor_name}
              </h2>
              <span className="text-xs sm:text-sm font-semibold text-medisetu-primary">
                {aptData.specialty}
              </span>
              <span className="text-xs text-medisetu-muted mt-0.5">
                {aptData.hospital || 'Apollo Hospitals, New Delhi'}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50/80 rounded-2xl p-4 border border-slate-100 text-xs sm:text-sm">
            <div className="flex items-center gap-2.5 text-medisetu-slate">
              <Calendar className="w-4 h-4 text-medisetu-primary flex-shrink-0" />
              <div>
                <span className="text-[11px] text-medisetu-muted block">Date</span>
                <span className="font-semibold text-medisetu-navy">{aptData.date}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-medisetu-slate">
              <Clock className="w-4 h-4 text-medisetu-primary flex-shrink-0" />
              <div>
                <span className="text-[11px] text-medisetu-muted block">Time Slot</span>
                <span className="font-semibold text-medisetu-navy">{aptData.time_slot}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-medisetu-slate">
              {aptData.consultation_type?.toLowerCase().includes('video') ? (
                <Video className="w-4 h-4 text-cyan-600 flex-shrink-0" />
              ) : (
                <Building2 className="w-4 h-4 text-medisetu-primary flex-shrink-0" />
              )}
              <div>
                <span className="text-[11px] text-medisetu-muted block">Type</span>
                <span className="font-semibold text-medisetu-navy">{aptData.consultation_type}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-medisetu-slate">
              <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0" />
              <div>
                <span className="text-[11px] text-medisetu-muted block">Location</span>
                <span className="font-semibold text-medisetu-navy truncate max-w-[150px]">
                  {aptData.hospital || 'Consultation Room 3B'}
                </span>
              </div>
            </div>
          </div>

          {/* Guidelines Box */}
          <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-3.5 text-xs text-medisetu-slate space-y-1">
            <span className="font-bold text-medisetu-navy block">Preparation Guidelines:</span>
            <p>• Please reach the clinic 15 minutes prior to verify vitals.</p>
            <p>• Carry your past medical prescriptions and latest test records.</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
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
