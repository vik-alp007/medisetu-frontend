/**
 * Central switch for TEMPORARY demo fallbacks.
 * Controlled by VITE_ENABLE_DEMO_FALLBACK (default: enabled).
 * Set it to "false" in production to always show real error states instead.
 */
export const DEMO_FALLBACK_ENABLED =
  String(import.meta.env.VITE_ENABLE_DEMO_FALLBACK ?? 'true').toLowerCase() !== 'false';

/** True for errors where falling back to demo data would hide a real auth problem. */
export const isAuthError = (error) => [401, 403].includes(error?.response?.status);
