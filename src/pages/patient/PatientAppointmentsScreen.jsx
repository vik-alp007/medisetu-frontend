import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarDays, Clock, Trash2 } from 'lucide-react';

import PatientLayout from '../../layouts/PatientLayout';
import TopHeader from '../../components/navigation/TopHeader';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/feedback/LoadingSpinner';
import ErrorAlert from '../../components/feedback/ErrorAlert';
import EmptyState from '../../components/feedback/EmptyState';

import { appointmentService } from '../../services/appointmentService';
import {
  asList,
  normalizeAppointment,
  sortAppointmentsAsc,
  sortAppointmentsDesc,
} from '../../services/adapters/commonAdapter';
import { formatDate, formatTime, getErrorMessage, toDateKey } from '../../utils/format';

/**
 * Patient appointments list - REAL data from GET /api/appointments/.
 * Target of the bottom-nav "Appointments" tab (there is no dedicated Figma
 * screen, so this reuses the existing card/typography language).
 */
export const PatientAppointmentsScreen = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState('upcoming');
  const [cancellingId, setCancellingId] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await appointmentService.getAppointments();
      setAppointments(asList(data).map(normalizeAppointment));
    } catch (err) {
      setAppointments([]);
      setError(getErrorMessage(err, 'Unable to load appointments. Please try again.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const { upcoming, past } = useMemo(() => {
    const today = toDateKey();
    const isPast = (a) =>
      ['COMPLETED', 'CANCELLED'].includes(a.status) || (a.date && a.date < today);
    return {
      upcoming: sortAppointmentsAsc(appointments.filter((a) => !isPast(a))),
      past: sortAppointmentsDesc(appointments.filter(isPast)),
    };
  }, [appointments]);

  const handleCancel = async (appointment) => {
    if (!window.confirm('Cancel this appointment? This cannot be undone.')) return;
    setCancellingId(appointment.id);
    setActionMessage(null);
    try {
      await appointmentService.deleteAppointment(appointment.id);
      // Only remove it from the list after the backend confirmed.
      setAppointments((prev) => prev.filter((a) => a.id !== appointment.id));
      setActionMessage({ type: 'success', text: 'Appointment cancelled.' });
    } catch (err) {
      setActionMessage({
        type: 'error',
        text: getErrorMessage(err, 'Unable to cancel this appointment. Please try again.'),
      });
    } finally {
      setCancellingId(null);
    }
  };

  const visible = tab === 'upcoming' ? upcoming : past;

  return (
    <PatientLayout>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-3xl mx-auto space-y-5"
      >
        <TopHeader title="Appointments" subtitle="Your upcoming and past visits" />

        <div className="flex gap-2" role="tablist" aria-label="Appointment filter">
          {[
            { id: 'upcoming', label: `Upcoming (${upcoming.length})` },
            { id: 'past', label: `Past (${past.length})` },
          ].map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                tab === t.id
                  ? 'bg-medisetu-primary text-white'
                  : 'bg-white dark:bg-[#1E293B] text-medisetu-muted dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {t.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => navigate('/doctors')}
            className="ml-auto px-4 py-2 rounded-xl text-sm font-semibold text-medisetu-primary hover:bg-blue-50 dark:hover:bg-blue-950/40"
          >
            + Book new
          </button>
        </div>

        {actionMessage && (
          <div
            role="status"
            className={`rounded-2xl p-3 text-sm ${
              actionMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300'
                : 'bg-red-50 text-red-800 dark:bg-red-950/30 dark:text-red-300'
            }`}
          >
            {actionMessage.text}
          </div>
        )}

        {loading && (
          <div className="py-16 flex flex-col items-center gap-3">
            <LoadingSpinner size="lg" />
            <span className="text-sm text-medisetu-muted">Loading appointments...</span>
          </div>
        )}

        {!loading && error && (
          <ErrorAlert title="Unable to load appointments" message={error} onRetry={load} />
        )}

        {!loading && !error && visible.length === 0 && (
          <EmptyState
            icon={CalendarDays}
            title={tab === 'upcoming' ? 'No upcoming appointments' : 'No past appointments'}
            message={
              tab === 'upcoming'
                ? 'You have nothing scheduled. Find a doctor to book your next visit.'
                : 'Completed and cancelled appointments will appear here.'
            }
            actionText={tab === 'upcoming' ? 'Find a doctor' : undefined}
            onAction={tab === 'upcoming' ? () => navigate('/doctors') : undefined}
          />
        )}

        {!loading && !error && visible.length > 0 && (
          <ul className="space-y-3">
            {visible.map((a) => (
              <li
                key={a.id}
                className="bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 shadow-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-base font-bold text-medisetu-navy dark:text-white truncate">
                      {a.doctorName}
                    </h3>
                    {a.raw?.doctor_detail?.specialization && (
                      <p className="text-xs text-medisetu-muted dark:text-slate-400">
                        {a.raw.doctor_detail.specialization}
                      </p>
                    )}
                  </div>
                  <StatusBadge status={a.status} size="sm" />
                </div>

                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs font-medium text-medisetu-primary dark:text-blue-400">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="w-3.5 h-3.5" />
                    {formatDate(a.date)}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {formatTime(a.time)}
                  </span>
                </div>

                {a.reason && (
                  <p className="mt-2 text-xs text-medisetu-muted dark:text-slate-400 break-words">
                    Reason: {a.reason}
                  </p>
                )}

                {tab === 'upcoming' && (
                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      disabled={cancellingId === a.id}
                      onClick={() => handleCancel(a)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-medisetu-danger hover:bg-red-50 dark:hover:bg-red-950/30 px-3 py-1.5 rounded-xl disabled:opacity-60"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      {cancellingId === a.id ? 'Cancelling...' : 'Cancel appointment'}
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </motion.div>
    </PatientLayout>
  );
};

export default PatientAppointmentsScreen;
