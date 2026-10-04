/**
 * Doctor Dashboard Service
 *
 * Backend -> SERVICE -> Adapter -> UI
 *
 * Strategy (real data first, never silently mocked):
 *  1. Call the real endpoints in parallel:
 *       GET /api/dashboard/doctor/   (summary - contract not yet documented)
 *       GET /api/appointments/  GET /api/medical-records/  GET /api/prescriptions/
 *       GET /api/auth/me/
 *  2. Whatever succeeds goes through doctorDashboardAdapter.
 *  3. If EVERYTHING fails for a non-auth reason (server down / 404 / 5xx),
 *     and demo fallback is enabled, return the labelled DEMO dataset from
 *     data/mockDashboards.js. 401/403 errors are always thrown, never masked.
 */
import apiClient from './api';
import { dashboardService } from './dashboardService';
import { adaptDoctorDashboard } from './adapters/doctorDashboardAdapter';
import { mockDoctorDashboard } from '../data/mockDashboards';
import { DEMO_FALLBACK_ENABLED, isAuthError } from './demoMode';

const value = (settled) => (settled.status === 'fulfilled' ? settled.value : null);

export const getDoctorDashboardData = async () => {
  const results = await Promise.allSettled([
    dashboardService.getDoctorDashboard(),
    apiClient.get('/api/appointments/').then((r) => r.data),
    apiClient.get('/api/medical-records/').then((r) => r.data),
    apiClient.get('/api/prescriptions/').then((r) => r.data),
    apiClient.get('/api/auth/me/').then((r) => r.data),
  ]);

  const [summary, appointments, records, prescriptions, me] = results.map(value);
  const rejected = results.filter((r) => r.status === 'rejected');

  const authFailure = rejected.find((r) => isAuthError(r.reason));
  if (authFailure) throw authFailure.reason;

  const dataLoaded = [summary, appointments, records, prescriptions].some(Boolean);
  if (!dataLoaded) {
    if (DEMO_FALLBACK_ENABLED) {
      // TEMPORARY MOCK - BACKEND CONTRACT PENDING
      return {
        ...mockDoctorDashboard,
        demoReason: 'The hospital server did not return dashboard data.',
      };
    }
    throw rejected[0]?.reason || new Error('Unable to load doctor dashboard');
  }

  return adaptDoctorDashboard({ summary, appointments, records, prescriptions, me });
};
