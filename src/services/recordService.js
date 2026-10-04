import apiClient from './api';

/**
 * Medical Records Service
 * Endpoints provided by backend contract.
 */
export const recordService = {
  // GET /api/medical-records/
  getMedicalRecords: async (params = {}) => {
    const response = await apiClient.get('/api/medical-records/', { params });
    return response.data;
  },

  // POST /api/medical-records/
  // TODO: Awaiting backend payload schema
  createMedicalRecord: async (payload) => {
    const response = await apiClient.post('/api/medical-records/', payload);
    return response.data;
  },

  // GET /api/medical-records/:id/
  getRecordById: async (id) => {
    const response = await apiClient.get(`/api/medical-records/${id}/`);
    return response.data;
  },

  // PUT /api/medical-records/:id/
  // TODO: Awaiting backend payload schema
  updateRecord: async (id, payload) => {
    const response = await apiClient.put(`/api/medical-records/${id}/`, payload);
    return response.data;
  },
};
