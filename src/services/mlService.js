/**
 * ML Service
 *
 * Intended architecture (NOT all implemented yet):
 *
 *   Patient -> upload report -> reportService -> BACKEND stores report
 *           -> BACKEND / ML service analyses it -> disease prediction
 *           -> BACKEND stores result (if supported) -> frontend displays it
 *
 * STATUS
 *   - Report storage contract ........ NOT received (see reportService.js)
 *   - ML API contract ................ NOT received
 *   - Predictions shown by the UI .... DEMO placeholder only (data/mockMl.js)
 *
 * SECURITY: no ML keys or secrets belong in the frontend. If the ML service
 * needs a private key, the backend must proxy the call.
 *
 * WHEN THE REAL ML API ARRIVES:
 *   1. set ML_PREDICT_PATH below (a BACKEND proxy path, e.g. '/api/ml/predict/')
 *   2. set VITE_ML_ENABLED=true
 *   3. update services/adapters/mlAdapter.js to the real response keys
 *   The UI (DiseasePredictionCard) needs no change.
 */
import apiClient from './api';
import { adaptPrediction } from './adapters/mlAdapter';
import { mockMlRawResponse } from '../data/mockMl';

export const ML_ENABLED = String(import.meta.env.VITE_ML_ENABLED ?? 'false').toLowerCase() === 'true';

// TEMPORARY: real endpoint path not provided yet. Deliberately NOT guessed.
export const ML_PREDICT_PATH = null;

export const mlService = {
  /**
   * @param {{ file?: File, recordId?: number|string }} input
   * @returns {Promise<{disease, confidence, recommendations, isDemo}>}
   */
  analyzeReport: async ({ file, recordId } = {}) => {
    if (!ML_ENABLED) {
      // TEMPORARY ML MOCK - REPLACE WITH REAL ML API
      return adaptPrediction(mockMlRawResponse, { isDemo: true });
    }

    if (!ML_PREDICT_PATH) {
      throw new Error(
        'ML is enabled but no prediction endpoint has been configured (ML_PREDICT_PATH in services/mlService.js).'
      );
    }

    const form = new FormData();
    if (file) form.append('report_file', file); // TEMPORARY FIELD NAME - confirm with ML/backend team
    if (recordId !== undefined) form.append('record_id', String(recordId));

    const response = await apiClient.post(ML_PREDICT_PATH, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 120000,
    });
    return adaptPrediction(response.data, { isDemo: false });
  },
};

export default mlService;
