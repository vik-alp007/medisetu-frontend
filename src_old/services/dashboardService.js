import apiClient from './api';

/**
 * Dashboard Service
 * Endpoints provided by backend contract.
 */
export const dashboardService = {
  // GET /api/dashboard/patient/
  getPatientDashboard: async () => {
    const response = await apiClient.get('/api/dashboard/patient/');
    return response.data;
  },

  // GET /api/dashboard/doctor/
  getDoctorDashboard: async () => {
    const response = await apiClient.get('/api/dashboard/doctor/');
    return response.data;
  },

  // GET /api/dashboard/admin/
  getAdminDashboard: async () => {
    const response = await apiClient.get('/api/dashboard/admin/');
    return response.data;
  },
};
