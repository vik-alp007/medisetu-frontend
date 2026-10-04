/**
 * Admin Dashboard Service
 *
 * Backend -> SERVICE -> Adapter -> UI
 *
 * Same strategy as doctorDashboardService: real endpoints first, adapter
 * normalizes, labelled DEMO fallback only if everything fails for a
 * non-auth reason and VITE_ENABLE_DEMO_FALLBACK is not "false".
 */
import apiClient from './api';
import { dashboardService } from './dashboardService';
import { adaptAdminDashboard } from './adapters/adminDashboardAdapter';
import { mockAdminDashboard } from '../data/mockDashboards';
import { DEMO_FALLBACK_ENABLED, isAuthError } from './demoMode';

const value = (settled) => (settled.status === 'fulfilled' ? settled.value : null);
const get = (url) => apiClient.get(url).then((r) => r.data);

export const getAdminDashboardData = async () => {
  const results = await Promise.allSettled([
    dashboardService.getAdminDashboard(),
    get('/api/doctors/'),
    get('/api/patients/'), // not in the documented endpoint list - tolerated if it fails
    get('/api/appointments/'),
    get('/api/bills/'),
    get('/api/medical-records/'),
  ]);

  const [summary, doctors, patients, appointments, bills, records] = results.map(value);
  const rejected = results.filter((r) => r.status === 'rejected');

  // Only the documented endpoints may surface an auth error; /api/patients/ is optional.
  const authFailure = results.find(
    (r, i) => i !== 2 && r.status === 'rejected' && isAuthError(r.reason)
  );
  if (authFailure) throw authFailure.reason;

  const dataLoaded = [summary, doctors, appointments, bills, records].some(Boolean);
  if (!dataLoaded) {
    if (DEMO_FALLBACK_ENABLED) {
      // TEMPORARY MOCK - REPLACE WITH REAL ADMIN DASHBOARD API RESPONSE
      return {
        ...mockAdminDashboard,
        demoReason: 'The hospital server did not return dashboard data.',
      };
    }
    throw rejected[0]?.reason || new Error('Unable to load admin dashboard');
  }

  return adaptAdminDashboard({ summary, doctors, patients, appointments, bills, records });
};
