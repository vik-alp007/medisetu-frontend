import apiClient from './api';

/**
 * Billing Service
 * Endpoints provided by backend contract.
 */
export const billingService = {
  // GET /api/bills/
  getBills: async (params = {}) => {
    const response = await apiClient.get('/api/bills/', { params });
    return response.data;
  },

  // POST /api/bills/
  // TODO: Awaiting backend payload schema
  createBill: async (payload) => {
    const response = await apiClient.post('/api/bills/', payload);
    return response.data;
  },

  // GET /api/bills/:id/
  getBillById: async (id) => {
    const response = await apiClient.get(`/api/bills/${id}/`);
    return response.data;
  },

  // PUT /api/bills/:id/
  // TODO: Awaiting backend payload schema
  updateBill: async (id, payload) => {
    const response = await apiClient.put(`/api/bills/${id}/`, payload);
    return response.data;
  },
};
