/**
 * Doctor Adapter
 *
 * Backend (REAL) shape from GET /api/doctors/ and /api/doctors/:id/:
 * {
 *   id, user: { id, username, email, first_name, last_name, role },
 *   specialization, phone, qualification, experience,
 *   consultation_fee, available_days, available_from, available_to
 * }
 *
 * The UI screens (profile, booking) also read convenience fields such as
 * `name`, `specialty`, `consultationFee`, `availableSlots`, `availableDays`.
 * The backend does NOT send those, so they are DERIVED here from real fields.
 * Nothing is invented: if the backend sends no availability window, the
 * derived slot list is empty and the UI shows its "no slots" state.
 *
 * Raw backend fields are preserved, so existing code that reads them keeps working.
 */

const DAY_ORDER = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAY_ALIASES = {
  monday: 'Mon', mon: 'Mon',
  tuesday: 'Tue', tue: 'Tue', tues: 'Tue',
  wednesday: 'Wed', wed: 'Wed',
  thursday: 'Thu', thu: 'Thu', thur: 'Thu', thurs: 'Thu',
  friday: 'Fri', fri: 'Fri',
  saturday: 'Sat', sat: 'Sat',
  sunday: 'Sun', sun: 'Sun',
};

export const SLOT_INTERVAL_MINUTES = 30;

const toMinutes = (value) => {
  if (!value) return null;
  const [h, m] = String(value).split(':');
  const hours = Number(h);
  const minutes = Number(m ?? 0);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
  return hours * 60 + minutes;
};

const formatSlot = (totalMinutes) => {
  const hours24 = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const suffix = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 || 12;
  return `${String(hours12).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${suffix}`;
};

/** "09:00:00" + "17:00:00" -> ["09:00 AM", "09:30 AM", ... "04:30 PM"] */
export const buildSlots = (from, to, interval = SLOT_INTERVAL_MINUTES) => {
  const start = toMinutes(from);
  const end = toMinutes(to);
  if (start === null || end === null || end <= start) return [];
  const slots = [];
  for (let t = start; t + interval <= end; t += interval) {
    slots.push(formatSlot(t));
  }
  return slots;
};

/** "Monday to Friday" | "Mon, Wed, Fri" -> ["Mon","Tue","Wed","Thu","Fri"] */
export const parseAvailableDays = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((d) => DAY_ALIASES[String(d).toLowerCase()]).filter(Boolean);
  }
  const text = String(value).toLowerCase();
  const rangeMatch = text.match(/([a-z]+)\s*(?:to|-|–)\s*([a-z]+)/);
  if (rangeMatch) {
    const from = DAY_ORDER.indexOf(DAY_ALIASES[rangeMatch[1]]);
    const to = DAY_ORDER.indexOf(DAY_ALIASES[rangeMatch[2]]);
    if (from >= 0 && to >= 0) {
      const days = [];
      for (let i = from; ; i = (i + 1) % 7) {
        days.push(DAY_ORDER[i]);
        if (i === to) break;
      }
      return days;
    }
  }
  return text
    .split(/[,&/]|\band\b/)
    .map((d) => DAY_ALIASES[d.trim()])
    .filter(Boolean);
};

export const getDoctorDisplayName = (doctor) => {
  const full = [doctor?.user?.first_name, doctor?.user?.last_name]
    .filter(Boolean)
    .join(' ')
    .trim();
  const base = full || doctor?.user?.username || doctor?.name || 'Doctor';
  return /^dr\.?\s/i.test(base) ? base : `Dr. ${base}`;
};

export const normalizeDoctor = (raw) => {
  if (!raw || typeof raw !== 'object') return raw;
  const fee = raw.consultation_fee ?? raw.consultationFee ?? null;
  return {
    ...raw,
    name: getDoctorDisplayName(raw),
    specialty: raw.specialization || raw.specialty || '',
    consultationFee: fee !== null && fee !== '' ? Number(fee) : null,
    experienceYears: raw.experience ?? null,
    availableDays: parseAvailableDays(raw.available_days ?? raw.availableDays),
    availableSlots: Array.isArray(raw.availableSlots)
      ? raw.availableSlots
      : buildSlots(raw.available_from, raw.available_to),
  };
};

export const normalizeDoctorList = (payload) => {
  const list = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.results)
    ? payload.results
    : [];
  return list.map(normalizeDoctor);
};
