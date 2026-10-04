/** Small shared formatting helpers (pure functions, no mock data). */

export const getGreeting = (date = new Date()) => {
  const hour = date.getHours();
  if (hour < 12) return 'Good Morning,';
  if (hour < 17) return 'Good Afternoon,';
  return 'Good Evening,';
};

export const toDateKey = (date = new Date()) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const formatDate = (value) => {
  if (!value) return 'Date not provided';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);
  return parsed.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const formatTime = (time) => {
  if (!time) return 'Time not provided';
  const [hours, minutes] = String(time).split(':');
  const h = Number(hours);
  if (minutes === undefined || Number.isNaN(h)) return String(time);
  const suffix = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${minutes.slice(0, 2)} ${suffix}`;
};

export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || amount === '') return '—';
  const n = Number(amount);
  if (Number.isNaN(n)) return String(amount);
  return `₹${n.toLocaleString('en-IN')}`;
};

export const getErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
  const data = error?.response?.data;
  if (typeof data?.detail === 'string') return data.detail;
  if (typeof data?.message === 'string') return data.message;
  if (!error?.response && error?.code === 'ECONNABORTED') {
    return 'The server took too long to respond. It may be waking up - please retry in a few seconds.';
  }
  if (!error?.response && error?.message) {
    return 'Unable to reach the server. Check your connection and try again.';
  }
  return fallback;
};
