import apiClient from './api';

/**
 * Patient Service
 * Endpoints provided by backend contract.
 */
export const patientService = {
  // GET /api/patients/
  getPatients: async (params = {}) => {
    const response = await apiClient.get('/api/patients/', { params });
    return response.data;
  },

  // GET /api/patients/my-profile/
  getMyProfile: async () => {
    const response = await apiClient.get('/api/patients/my-profile/');
    return response.data;
  },

  // POST /api/patients/profile/
  // TODO: Awaiting backend payload schema
  createProfile: async (payload) => {
    const response = await apiClient.post('/api/patients/profile/', payload);
    return response.data;
  },

  // PUT /api/patients/profile/
  // TODO: Awaiting backend payload schema
  updateProfile: async (payload) => {
    const response = await apiClient.put('/api/patients/profile/', payload);
    return response.data;
  },

  // GET /api/patients/:id/
  getPatientById: async (id) => {
    const response = await apiClient.get(`/api/patients/${id}/`);
    return response.data;
  },
};
