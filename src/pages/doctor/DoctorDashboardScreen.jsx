import React from 'react';
import { motion } from 'framer-motion';
import {
  CalendarCheck,
  CalendarClock,
  Users,
  ClipboardList,
  Pill,
  FileText,
  Clock,
} from 'lucide-react';

import StaffLayout from '../../layouts/StaffLayout';
import StatCard from '../../components/dashboard/StatCard';
import DashboardSection, { SectionEmpty } from '../../components/dashboard/DashboardSection';
import { DemoBanner, NoticeBanner } from '../../components/dashboard/DemoBanner';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSkeleton from '../../components/feedback/LoadingSkeleton';
import ErrorAlert from '../../components/feedback/ErrorAlert';

import { useAuth } from '../../context/AuthContext';
import { useAsync } from '../../hooks/useAsync';
import { getDoctorDashboardData } from '../../services/doctorDashboardService';
import { formatDate, formatTime, getGreeting, getErrorMessage } from '../../utils/format';

const AppointmentRow = ({ appt, showDate }) => (
  <li className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-medisetu-primary dark:text-blue-400 flex items-center justify-center shrink-0">
      <Clock className="w-4 h-4" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-sm font-semibold text-medisetu-navy dark:text-white truncate">{appt.patientName}</p>
      <p className="text-xs text-medisetu-muted dark:text-slate-400 truncate">
        {showDate && appt.date ? `${formatDate(appt.date)} · ` : ''}
        {formatTime(appt.time)}
        {appt.reason ? ` · ${appt.reason}` : ''}
      </p>
    </div>
    <StatusBadge status={appt.status} size="sm" />
  </li>
);

export const DoctorDashboardScreen = () => {
  const { user } = useAuth();
  const { data, loading, error, reload } = useAsync(getDoctorDashboardData);

  const name =
    data?.doctor?.name ||
    [user?.first_name, user?.last_name].filter(Boolean).join(' ') ||
    user?.username ||
    'Doctor';
  const doctorLabel = /^dr\.?\s/i.test(name) ? name : `Dr. ${name}`;

  return (
    <StaffLayout roleLabel="Doctor Portal">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="space-y-5"
      >
        <div>
          <p className="text-xs sm:text-sm font-medium text-medisetu-muted dark:text-slate-400">
            {getGreeting()}
          </p>
          <h1 className="text-xl sm:text-2xl font-bold text-medisetu-navy dark:text-white mt-0.5 break-words">
            {doctorLabel}
          </h1>
          {data?.doctor?.specialization && (
            <p className="text-sm text-medisetu-muted dark:text-slate-400 mt-0.5">
              {data.doctor.specialization}
            </p>
          )}
        </div>

        {loading && (
          <div className="space-y-4" aria-busy="true">
            <p className="text-sm text-medisetu-muted dark:text-slate-400">Loading your dashboard...</p>
            <LoadingSkeleton />
          </div>
        )}

        {!loading && error && (
          <ErrorAlert
            title="Unable to load your dashboard"
            message={getErrorMessage(error, 'Unable to load your dashboard. Please try again.')}
            onRetry={reload}
          />
        )}

        {!loading && !error && data && (
          <>
            {data.isDemo && <DemoBanner reason={data.demoReason} onRetry={reload} />}
            <NoticeBanner notices={data.notices} />

            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
              <StatCard label="Today" value={data.stats.todayAppointments} hint="Appointments" icon={CalendarCheck} source={data.sources.todayAppointments} />
              <StatCard label="Upcoming" value={data.stats.upcomingAppointments} hint="Scheduled ahead" icon={CalendarClock} tone="teal" source={data.sources.upcomingAppointments} />
              <StatCard label="Pending" value={data.stats.pendingAppointments} hint="Awaiting action" icon={ClipboardList} tone="amber" source={data.sources.pendingAppointments} />
              <StatCard label="Patients" value={data.stats.totalPatients} hint="Under your care" icon={Users} tone="purple" source={data.sources.totalPatients} />
              <StatCard label="Records" value={data.stats.recordsCount} hint="Medical records" icon={FileText} tone="emerald" source={data.sources.recordsCount} />
              <StatCard label="Prescriptions" value={data.stats.prescriptionsCount} hint="Issued" icon={Pill} source={data.sources.prescriptionsCount} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <DashboardSection title="Today's Appointments" subtitle="Your schedule for today">
                {data.todayAppointments.length ? (
                  <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                    {data.todayAppointments.map((a) => (
                      <AppointmentRow key={a.id} appt={a} />
                    ))}
                  </ul>
                ) : (
                  <SectionEmpty>
                    {data.hasAppointmentData === false
                      ? 'Appointment details are not available yet.'
                      : 'No appointments scheduled for today.'}
                  </SectionEmpty>
                )}
              </DashboardSection>

              <DashboardSection title="Upcoming Appointments" subtitle="Next scheduled visits">
                {data.upcomingAppointments.length ? (
                  <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                    {data.upcomingAppointments.map((a) => (
                      <AppointmentRow key={a.id} appt={a} showDate />
                    ))}
                  </ul>
                ) : (
                  <SectionEmpty>No upcoming appointments.</SectionEmpty>
                )}
              </DashboardSection>

              <DashboardSection title="Recent Patients" subtitle="Most recent visits">
                {data.recentPatients.length ? (
                  <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                    {data.recentPatients.map((p) => (
                      <li key={p.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                        <span className="text-sm font-semibold text-medisetu-navy dark:text-white truncate">{p.name}</span>
                        <span className="text-xs text-medisetu-muted dark:text-slate-400 shrink-0">
                          {p.lastVisit ? formatDate(p.lastVisit) : ''}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <SectionEmpty>No recent patients yet.</SectionEmpty>
                )}
              </DashboardSection>

              <DashboardSection title="Recent Medical Records" subtitle="Latest diagnoses you recorded">
                {data.recentRecords.length ? (
                  <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                    {data.recentRecords.map((r) => (
                      <li key={r.id} className="py-3 first:pt-0 last:pb-0 min-w-0">
                        <p className="text-sm font-semibold text-medisetu-navy dark:text-white truncate">{r.diagnosis}</p>
                        <p className="text-xs text-medisetu-muted dark:text-slate-400 truncate">
                          {r.patientName}
                          {r.date ? ` · ${formatDate(r.date)}` : ''}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <SectionEmpty>No medical records found.</SectionEmpty>
                )}
              </DashboardSection>

              <DashboardSection title="Recent Prescriptions" subtitle="Latest medicines prescribed" className="lg:col-span-2">
                {data.recentPrescriptions.length ? (
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 divide-y sm:divide-y-0 divide-slate-100 dark:divide-slate-800">
                    {data.recentPrescriptions.map((p) => (
                      <li key={p.id} className="py-3 sm:py-2 min-w-0">
                        <p className="text-sm font-semibold text-medisetu-navy dark:text-white truncate">{p.medicine}</p>
                        <p className="text-xs text-medisetu-muted dark:text-slate-400 truncate">
                          {p.patientName}
                          {p.date ? ` · ${formatDate(p.date)}` : ''}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <SectionEmpty>No prescriptions found.</SectionEmpty>
                )}
              </DashboardSection>
            </div>
          </>
        )}
      </motion.div>
    </StaffLayout>
  );
};

export default DoctorDashboardScreen;
