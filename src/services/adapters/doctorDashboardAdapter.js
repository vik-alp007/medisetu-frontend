/**
 * Doctor Dashboard Adapter
 *
 * Backend -> Service -> ADAPTER -> UI
 *
 * Inputs (all optional; whatever the backend gave us):
 *   summary       GET /api/dashboard/doctor/   (exact shape NOT yet documented)
 *   appointments  GET /api/appointments/       (backend scopes to the doctor via JWT)
 *   records       GET /api/medical-records/
 *   prescriptions GET /api/prescriptions/
 *   me            GET /api/auth/me/
 *
 * Output is the NORMALIZED structure consumed by DoctorDashboardScreen
 * (same shape as mockDoctorDashboard in data/mockDashboards.js).
 *
 * When the real /api/dashboard/doctor/ contract is provided, ONLY this file
 * needs to change (the SUMMARY_KEYS block below).
 *
 * `sources.<stat>` records where each number came from:
 *   'backend' = taken from the dashboard endpoint
 *   'derived' = computed from real list endpoints
 *   (absent)  = unavailable -> UI shows "—"
 */
import {
  asList,
  totalOf,
  pickNumber,
  pickList,
  personName,
  doctorName,
  normalizeAppointment,
  normalizeStatus,
  sortAppointmentsAsc,
  sortAppointmentsDesc,
} from './commonAdapter';
import { toDateKey } from '../../utils/format';

// TEMPORARY GUESSES - REPLACE WITH ACTUAL /api/dashboard/doctor/ KEYS
const SUMMARY_KEYS = {
  todayAppointments: ['today_appointments', 'todays_appointments', 'appointments_today'],
  upcomingAppointments: ['upcoming_appointments', 'upcoming_appointments_count'],
  pendingAppointments: ['pending_appointments', 'pending_appointments_count'],
  totalPatients: ['total_patients', 'patients_count', 'patient_count', 'total_patients_count'],
  recordsCount: ['total_records', 'records_count', 'medical_records_count'],
  prescriptionsCount: ['total_prescriptions', 'prescriptions_count'],
  recentPatients: ['recent_patients'],
};

const ACTIVE = (a) => !['CANCELLED', 'COMPLETED'].includes(a.status);

export const adaptDoctorDashboard = ({ summary, appointments, records, prescriptions, me }) => {
  const sources = {};
  const notices = [];
  const stats = {};

  const todayKey = toDateKey();
  const apptList = appointments ? sortAppointmentsAsc(asList(appointments).map(normalizeAppointment)) : null;

  const todayAppointments = apptList ? apptList.filter((a) => a.date === todayKey && ACTIVE(a)) : [];
  const upcomingAppointments = apptList
    ? apptList.filter((a) => a.date && a.date > todayKey && ACTIVE(a))
    : [];

  const setStat = (name, summaryKeys, derivedValue) => {
    const fromBackend = pickNumber(summary, summaryKeys);
    if (fromBackend !== null) {
      stats[name] = fromBackend;
      sources[name] = 'backend';
    } else if (derivedValue !== null && derivedValue !== undefined) {
      stats[name] = derivedValue;
      sources[name] = 'derived';
    } else {
      stats[name] = null;
    }
  };

  setStat('todayAppointments', SUMMARY_KEYS.todayAppointments, apptList ? todayAppointments.length : null);
  setStat('upcomingAppointments', SUMMARY_KEYS.upcomingAppointments, apptList ? upcomingAppointments.length : null);
  setStat(
    'pendingAppointments',
    SUMMARY_KEYS.pendingAppointments,
    apptList ? apptList.filter((a) => a.status === 'PENDING').length : null
  );

  // Unique patients seen in this doctor's appointments + records.
  const patientIds = new Set();
  asList(appointments).forEach((a) => a?.patient != null && patientIds.add(a.patient));
  asList(records).forEach((r) => r?.patient != null && patientIds.add(r.patient));
  setStat('totalPatients', SUMMARY_KEYS.totalPatients, appointments || records ? patientIds.size : null);

  setStat('recordsCount', SUMMARY_KEYS.recordsCount, records ? totalOf(records) : null);
  setStat('prescriptionsCount', SUMMARY_KEYS.prescriptionsCount, prescriptions ? totalOf(prescriptions) : null);

  // Recent patients: prefer backend list, otherwise derive from appointments (newest first)
  let recentPatients = [];
  const backendRecent = pickList(summary, SUMMARY_KEYS.recentPatients);
  if (backendRecent) {
    recentPatients = backendRecent.map((p, i) => ({
      id: p?.id ?? i,
      name: personName(p?.patient_detail || p, p?.id, 'Patient'),
      lastVisit: p?.last_visit || p?.date || null,
    }));
  } else if (apptList) {
    const seen = new Set();
    sortAppointmentsDesc(apptList).forEach((a) => {
      const key = a.raw?.patient ?? a.patientName;
      if (!seen.has(key) && a.date && a.date <= todayKey && seen.size < 5) {
        seen.add(key);
        recentPatients.push({ id: key, name: a.patientName, lastVisit: a.date });
      }
    });
  }

  const recentRecords = asList(records)
    .slice(0, 5)
    .map((r) => ({
      id: r.id,
      patientName: personName(r.patient_detail, r.patient, 'Patient'),
      diagnosis: r.diagnosis || 'Diagnosis not provided',
      date: r.created_at || null,
    }));

  const recentPrescriptions = asList(prescriptions)
    .slice(0, 5)
    .map((p) => ({
      id: p.id,
      patientName: personName(p.patient_detail, p.patient, 'Patient'),
      medicine: p.medicine_name || 'Medicine not provided',
      date: p.created_at || null,
    }));

  if (!summary) {
    notices.push(
      'The /api/dashboard/doctor/ summary endpoint was unavailable. Figures below are derived from your appointments, records and prescriptions.'
    );
  }

  return {
    isDemo: false,
    doctor: {
      name: me ? doctorName(me) : 'Doctor',
      specialization: summary?.specialization || null,
    },
    stats,
    todayAppointments: todayAppointments.map((a) => ({ ...a, raw: undefined })),
    upcomingAppointments: upcomingAppointments.slice(0, 6).map((a) => ({ ...a, raw: undefined })),
    recentPatients,
    recentRecords,
    recentPrescriptions,
    hasAppointmentData: Boolean(apptList),
    hasRecordData: Boolean(records),
    hasPrescriptionData: Boolean(prescriptions),
    sources,
    notices,
    // Kept for debugging / future mapping work - never rendered.
    _rawSummary: summary || null,
  };
};

export { normalizeStatus };
