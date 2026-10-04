import apiClient from './api';

/**
 * Prescriptions Service
 * Endpoints provided by backend contract.
 */
export const prescriptionService = {
  // GET /api/prescriptions/
  getPrescriptions: async (params = {}) => {
    const response = await apiClient.get('/api/prescriptions/', { params });
    return response.data;
  },

  // POST /api/prescriptions/
  // TODO: Awaiting backend payload schema
  createPrescription: async (payload) => {
    const response = await apiClient.post('/api/prescriptions/', payload);
    return response.data;
  },

  // GET /api/prescriptions/:id/
  getPrescriptionById: async (id) => {
    const response = await apiClient.get(`/api/prescriptions/${id}/`);
    return response.data;
  },

  // PUT /api/prescriptions/:id/
  // TODO: Awaiting backend payload schema
  updatePrescription: async (id, payload) => {
    const response = await apiClient.put(`/api/prescriptions/${id}/`, payload);
    return response.data;
  },
};
