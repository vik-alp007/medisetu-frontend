/**
 * Admin Dashboard Adapter
 *
 * Backend -> Service -> ADAPTER -> UI
 *
 * Inputs (optional):
 *   summary       GET /api/dashboard/admin/   (exact shape NOT yet documented)
 *   doctors       GET /api/doctors/
 *   patients      GET /api/patients/          (not in the documented list - may 403/404)
 *   appointments  GET /api/appointments/
 *   bills         GET /api/bills/
 *   records       GET /api/medical-records/
 *
 * Output matches mockAdminDashboard (data/mockDashboards.js).
 * When the real /api/dashboard/admin/ contract is provided, ONLY this file
 * needs to change (SUMMARY_KEYS block below).
 */
import {
  asList,
  totalOf,
  pickNumber,
  normalizeStatus,
  normalizeAppointment,
  sortAppointmentsDesc,
  PAID_STATUSES,
  CLOSED_BILL_STATUSES,
  personName,
  doctorName,
} from './commonAdapter';

// TEMPORARY GUESSES - REPLACE WITH ACTUAL /api/dashboard/admin/ KEYS
const SUMMARY_KEYS = {
  totalPatients: ['total_patients', 'patients_count', 'patient_count'],
  totalDoctors: ['total_doctors', 'doctors_count', 'doctor_count'],
  totalAppointments: ['total_appointments', 'appointments_count'],
  pendingAppointments: ['pending_appointments', 'pending_appointments_count'],
  pendingBills: ['pending_bills', 'pending_bills_count'],
  totalBills: ['total_bills', 'bills_count'],
  totalRevenue: ['total_revenue', 'revenue', 'total_collected'],
};

const amountOf = (bill) => Number(bill?.amount ?? bill?.consultation_fee ?? 0) || 0;

export const adaptAdminDashboard = ({ summary, doctors, patients, appointments, bills, records }) => {
  const sources = {};
  const notices = [];
  const stats = {};
  const billing = {};

  const put = (target, name, summaryKeys, derived) => {
    const fromBackend = pickNumber(summary, summaryKeys);
    if (fromBackend !== null) {
      target[name] = fromBackend;
      sources[name] = 'backend';
    } else if (derived !== null && derived !== undefined) {
      target[name] = derived;
      sources[name] = 'derived';
    } else {
      target[name] = null;
    }
  };

  const apptList = appointments ? asList(appointments).map(normalizeAppointment) : null;
  const billList = bills ? asList(bills) : null;

  put(stats, 'totalPatients', SUMMARY_KEYS.totalPatients, patients ? totalOf(patients) : null);
  put(stats, 'totalDoctors', SUMMARY_KEYS.totalDoctors, doctors ? totalOf(doctors) : null);
  put(stats, 'totalAppointments', SUMMARY_KEYS.totalAppointments, appointments ? totalOf(appointments) : null);
  put(
    stats,
    'pendingAppointments',
    SUMMARY_KEYS.pendingAppointments,
    apptList ? apptList.filter((a) => a.status === 'PENDING').length : null
  );

  put(billing, 'totalBills', SUMMARY_KEYS.totalBills, bills ? totalOf(bills) : null);
  put(
    billing,
    'pendingBills',
    SUMMARY_KEYS.pendingBills,
    billList ? billList.filter((b) => !CLOSED_BILL_STATUSES.includes(normalizeStatus(b.status))).length : null
  );
  put(
    billing,
    'collected',
    SUMMARY_KEYS.totalRevenue,
    billList
      ? billList
          .filter((b) => PAID_STATUSES.includes(normalizeStatus(b.status)))
          .reduce((sum, b) => sum + amountOf(b), 0)
      : null
  );
  billing.outstanding = billList
    ? billList
        .filter((b) => !CLOSED_BILL_STATUSES.includes(normalizeStatus(b.status)))
        .reduce((sum, b) => sum + amountOf(b), 0)
    : null;
  billing.totalBilled = billList ? billList.reduce((sum, b) => sum + amountOf(b), 0) : null;

  const statusCounts = {};
  (apptList || []).forEach((a) => {
    statusCounts[a.status] = (statusCounts[a.status] || 0) + 1;
  });
  const appointmentsByStatus = Object.entries(statusCounts).map(([status, count]) => ({ status, count }));

  // Recent activity: merge real appointments, bills, records, newest first.
  const activity = [];
  sortAppointmentsDesc(apptList || []).slice(0, 5).forEach((a) =>
    activity.push({
      id: `appt-${a.id}`,
      type: 'appointment',
      title: `Appointment ${a.status.toLowerCase()}`,
      detail: `${a.patientName} with ${a.doctorName}`,
      date: a.raw?.created_at || a.date,
    })
  );
  (billList || []).slice(0, 5).forEach((b) =>
    activity.push({
      id: `bill-${b.id}`,
      type: 'bill',
      title: `Bill ${String(b.status || 'pending').toLowerCase()}`,
      detail: `₹${amountOf(b).toLocaleString('en-IN')} - ${personName(b.patient_detail, b.patient, 'Patient')}`,
      date: b.created_at,
    })
  );
  asList(records).slice(0, 5).forEach((r) =>
    activity.push({
      id: `rec-${r.id}`,
      type: 'record',
      title: 'Medical record added',
      detail: r.diagnosis || 'Diagnosis not provided',
      date: r.created_at,
    })
  );
  const recentActivity = activity
    .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))
    .slice(0, 8);

  const doctorRows = asList(doctors)
    .slice(0, 6)
    .map((d) => ({
      id: d.id,
      name: doctorName(d.user, d.id),
      specialization: d.specialization || 'Specialization not provided',
    }));

  if (!summary) {
    notices.push(
      'The /api/dashboard/admin/ summary endpoint was unavailable. Figures below are derived from the individual list endpoints.'
    );
  }
  if (!patients) {
    notices.push('Total patients is unavailable: the patients list endpoint did not return data for this account.');
  }

  return {
    isDemo: false,
    stats,
    billing,
    appointmentsByStatus,
    recentActivity,
    doctors: doctorRows,
    sources,
    notices,
    _rawSummary: summary || null,
  };
};
