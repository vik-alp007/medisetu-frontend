import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Stethoscope,
  CalendarCheck,
  CalendarClock,
  IndianRupee,
  Receipt,
  Wallet,
  CalendarPlus,
  FileText,
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
import { getAdminDashboardData } from '../../services/adminDashboardService';
import { formatCurrency, formatDate, getGreeting, getErrorMessage } from '../../utils/format';

const activityIcon = { appointment: CalendarPlus, bill: Receipt, record: FileText };

export const AdminDashboardScreen = () => {
  const { user } = useAuth();
  const { data, loading, error, reload } = useAsync(getAdminDashboardData);

  const name =
    [user?.first_name, user?.last_name].filter(Boolean).join(' ').trim() || user?.username || 'Administrator';

  const maxStatusCount = data?.appointmentsByStatus?.reduce((m, s) => Math.max(m, s.count), 0) || 1;

  return (
    <StaffLayout roleLabel="Admin Portal">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="space-y-5"
      >
        <div>
          <p className="text-xs sm:text-sm font-medium text-medisetu-muted dark:text-slate-400">{getGreeting()}</p>
          <h1 className="text-xl sm:text-2xl font-bold text-medisetu-navy dark:text-white mt-0.5 break-words">
            {name}
          </h1>
          <p className="text-sm text-medisetu-muted dark:text-slate-400 mt-0.5">Hospital overview</p>
        </div>

        {loading && (
          <div className="space-y-4" aria-busy="true">
            <p className="text-sm text-medisetu-muted dark:text-slate-400">Loading hospital statistics...</p>
            <LoadingSkeleton />
          </div>
        )}

        {!loading && error && (
          <ErrorAlert
            title="Unable to load the admin dashboard"
            message={getErrorMessage(error, 'Unable to load hospital statistics. Please try again.')}
            onRetry={reload}
          />
        )}

        {!loading && !error && data && (
          <>
            {data.isDemo && <DemoBanner reason={data.demoReason} onRetry={reload} />}
            <NoticeBanner notices={data.notices} />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <StatCard label="Total Patients" value={data.stats.totalPatients} hint="Registered" icon={Users} source={data.sources.totalPatients} />
              <StatCard label="Total Doctors" value={data.stats.totalDoctors} hint="On the platform" icon={Stethoscope} tone="teal" source={data.sources.totalDoctors} />
              <StatCard label="Appointments" value={data.stats.totalAppointments} hint="All time" icon={CalendarCheck} tone="purple" source={data.sources.totalAppointments} />
              <StatCard label="Pending" value={data.stats.pendingAppointments} hint="Awaiting confirmation" icon={CalendarClock} tone="amber" source={data.sources.pendingAppointments} />
            </div>

            <DashboardSection title="Billing Overview" subtitle="Based on bills visible to your account">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <StatCard label="Total Billed" value={data.billing.totalBilled === null ? null : formatCurrency(data.billing.totalBilled)} hint="All bills" icon={Receipt} />
                <StatCard label="Revenue Collected" value={data.billing.collected === null ? null : formatCurrency(data.billing.collected)} hint="Paid bills" icon={IndianRupee} tone="emerald" source={data.sources.collected} />
                <StatCard label="Outstanding" value={data.billing.outstanding === null ? null : formatCurrency(data.billing.outstanding)} hint="Unpaid" icon={Wallet} tone="amber" />
                <StatCard label="Pending Bills" value={data.billing.pendingBills} hint={`of ${data.billing.totalBills ?? '—'} total`} icon={Receipt} tone="purple" source={data.sources.pendingBills} />
              </div>
            </DashboardSection>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <DashboardSection title="Appointments by Status" subtitle="Distribution across all appointments">
                {data.appointmentsByStatus.length ? (
                  <ul className="space-y-3">
                    {data.appointmentsByStatus.map((s) => (
                      <li key={s.status}>
                        <div className="flex items-center justify-between mb-1">
                          <StatusBadge status={s.status} size="sm" />
                          <span className="text-sm font-semibold text-medisetu-navy dark:text-white">{s.count}</span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-medisetu-primary"
                            style={{ width: `${Math.max(4, (s.count / maxStatusCount) * 100)}%` }}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <SectionEmpty>No appointment data available.</SectionEmpty>
                )}
              </DashboardSection>

              <DashboardSection title="Recent Activity" subtitle="Latest appointments, bills and records">
                {data.recentActivity.length ? (
                  <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                    {data.recentActivity.map((a) => {
                      const Icon = activityIcon[a.type] || FileText;
                      return (
                        <li key={a.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                          <span className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-medisetu-primary dark:text-blue-400 flex items-center justify-center shrink-0">
                            <Icon className="w-4 h-4" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-medisetu-navy dark:text-white truncate">{a.title}</p>
                            <p className="text-xs text-medisetu-muted dark:text-slate-400 truncate">{a.detail}</p>
                          </div>
                          <span className="text-[11px] text-medisetu-muted dark:text-slate-400 shrink-0">
                            {a.date ? formatDate(a.date) : ''}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <SectionEmpty>No recent activity.</SectionEmpty>
                )}
              </DashboardSection>

              <DashboardSection title="Doctors" subtitle="Registered medical staff" className="lg:col-span-2">
                {data.doctors.length ? (
                  <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {data.doctors.map((d) => (
                      <li key={d.id} className="flex items-center gap-3 rounded-2xl border border-slate-100 dark:border-slate-800 p-3 min-w-0">
                        <span className="w-9 h-9 rounded-full bg-teal-50 dark:bg-teal-950/50 text-medisetu-teal flex items-center justify-center shrink-0">
                          <Stethoscope className="w-4 h-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-medisetu-navy dark:text-white truncate">{d.name}</p>
                          <p className="text-xs text-medisetu-muted dark:text-slate-400 truncate">{d.specialization}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <SectionEmpty>No doctors found.</SectionEmpty>
                )}
              </DashboardSection>
            </div>
          </>
        )}
      </motion.div>
    </StaffLayout>
  );
};

export default AdminDashboardScreen;
