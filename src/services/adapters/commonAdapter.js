/**
 * Shared helpers for turning backend payloads into stable UI shapes.
 * Backend field names confirmed from real responses are used first;
 * a few likely alternates are tolerated so a small backend rename does not
 * crash the UI. Nothing here invents data.
 */

export const asList = (payload) =>
  Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.results)
    ? payload.results
    : [];

/** Total including pagination `count` when the backend paginates. */
export const totalOf = (payload) =>
  typeof payload?.count === 'number' ? payload.count : asList(payload).length;

export const personName = (detail, fallbackId, label = 'Patient') => {
  const user = detail?.user || detail;
  const full = [user?.first_name, user?.last_name].filter(Boolean).join(' ').trim();
  return (
    full ||
    detail?.name ||
    user?.username ||
    (fallbackId !== undefined && fallbackId !== null ? `${label} #${fallbackId}` : label)
  );
};

export const doctorName = (detail, fallbackId) => {
  const base = personName(detail, fallbackId, 'Doctor');
  return /^dr\.?\s/i.test(base) ? base : `Dr. ${base}`;
};

/** First numeric value found under any of `keys`; arrays count by length. */
export const pickNumber = (obj, keys) => {
  for (const key of keys) {
    const v = obj?.[key];
    if (typeof v === 'number') return v;
    if (typeof v === 'string' && v.trim() !== '' && !Number.isNaN(Number(v))) return Number(v);
    if (Array.isArray(v)) return v.length;
  }
  return null;
};

export const pickList = (obj, keys) => {
  for (const key of keys) {
    if (Array.isArray(obj?.[key])) return obj[key];
  }
  return null;
};

export const normalizeStatus = (status) => String(status || '').trim().toUpperCase();

export const PAID_STATUSES = ['PAID', 'COMPLETED', 'SUCCESS'];
export const CLOSED_BILL_STATUSES = [...PAID_STATUSES, 'CANCELLED', 'REFUNDED', 'FAILED'];

export const normalizeAppointment = (a) => ({
  id: a?.id,
  patientName: personName(a?.patient_detail, a?.patient, 'Patient'),
  doctorName: doctorName(a?.doctor_detail, a?.doctor),
  date: a?.appointment_date || a?.date || null,
  time: a?.appointment_time || a?.time || null,
  reason: a?.reason || '',
  status: normalizeStatus(a?.status) || 'PENDING',
  raw: a,
});

const byDateTime = (a, b) =>
  `${a.date || ''} ${a.time || ''}`.localeCompare(`${b.date || ''} ${b.time || ''}`);

export const sortAppointmentsAsc = (list) => [...list].sort(byDateTime);
export const sortAppointmentsDesc = (list) => [...list].sort((a, b) => byDateTime(b, a));
