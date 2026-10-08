import apiClient from './api';
import { adaptPrediction } from './adapters/mlAdapter';
import { mockMlRawResponse } from '../data/mockMl';

/**
 * Machine Learning (ML) Disease Prediction Service
 *
 * Architecture:
 * React Frontend
 *   ↓ (POST /api/predict-disease/ with JWT Bearer & multipart/form-data)
 * Django Backend (https://hospital-management-system-ccc.onrender.com)
 *   ↓ (internally forwards report to ML microservice /predict-report)
 * ML Microservice (OCR + 16 ML Disease-Risk Models)
 *   ↓
 * Django Backend (saves MedicalRecord & constructs response)
 *   ↓
 * React Frontend (displays dynamic prediction & refreshed records)
 *
 * NOTE: The React frontend MUST NOT directly call the ML microservice.
 * Django handles all microservice communication internally.
 */

export const ML_ENABLED =
  String(import.meta.env.VITE_ML_ENABLED ?? 'true').toLowerCase() !== 'false';

// Real Django ML prediction endpoint path
export const ML_PREDICT_PATH = '/api/predict-disease/';

export const ALLOWED_REPORT_EXTENSIONS = ['pdf', 'jpg', 'jpeg', 'png', 'webp'];

export const ALLOWED_REPORT_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

export const MAX_REPORT_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

/**
 * Validate selected medical report file according to backend requirements.
 *
 * @param {File} file - Selected file object
 * @returns {{ isValid: boolean, error: string | null }}
 */
export const validateReportFile = (file) => {
  if (!file) {
    return {
      isValid: false,
      error: 'Please select a medical report file to upload.',
    };
  }

  if (file.size === 0) {
    return {
      isValid: false,
      error: 'The selected file is empty (0 bytes). Please choose a valid report document.',
    };
  }

  if (file.size > MAX_REPORT_FILE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      isValid: false,
      error: `File size (${sizeMb} MB) exceeds the maximum allowed limit of 10 MB.`,
    };
  }

  const nameParts = file.name ? file.name.split('.') : [];
  const extension = nameParts.length > 1 ? nameParts.pop().toLowerCase() : '';

  const isExtensionValid = ALLOWED_REPORT_EXTENSIONS.includes(extension);
  const isMimeValid =
    !file.type ||
    ALLOWED_REPORT_MIME_TYPES.includes(file.type.toLowerCase()) ||
    file.type.startsWith('image/');

  if (!isExtensionValid || !isMimeValid) {
    return {
      isValid: false,
      error: 'Unsupported file format. Please upload a PDF, JPG, JPEG, PNG, or WEBP document (up to 10 MB).',
    };
  }

  return { isValid: true, error: null };
};

/**
 * Extract clean, user-friendly error message from Axios / backend response.
 *
 * @param {any} error - Caught error object
 * @returns {string} User-facing error message
 */
export const getMlErrorMessage = (error) => {
  if (!error) {
    return 'An unexpected error occurred while analyzing the medical report.';
  }

  const status = error.response?.status;
  const data = error.response?.data;

  if (status === 401) {
    return 'Your session has expired or you are not logged in. Please sign in to access ML predictions.';
  }

  if (status === 403) {
    return 'Access denied. You do not have permission to run disease predictions with your account role.';
  }

  if (status === 413) {
    return 'The report file is too large for the hospital server to process. Please ensure the file is under 10 MB.';
  }

  if (status === 404) {
    return 'The ML prediction service endpoint was not found on the hospital server. Please verify backend deployment.';
  }

  if (status === 400) {
    if (data?.report_file) {
      const msg = Array.isArray(data.report_file)
        ? data.report_file[0]
        : data.report_file;
      return `Report file error: ${msg}`;
    }
    if (data?.detail) return data.detail;
    if (data?.message) return data.message;
    if (data?.error) return data.error;
    return 'Invalid request payload. Please verify that a supported report file was provided.';
  }

  if (status >= 500) {
    const serverMsg = data?.detail || data?.message || data?.error;
    return serverMsg && typeof serverMsg === 'string'
      ? `Hospital ML Server Notice: ${serverMsg}`
      : 'The ML prediction service encountered an error processing your report. Please try again or consult your doctor.';
  }

  if (error.code === 'ECONNABORTED' || error.message?.toLowerCase().includes('timeout')) {
    return 'The report analysis timed out while performing OCR and ML model evaluation. The service may be warming up. Please try again.';
  }

  if (error.message?.includes('Network Error') || !error.response) {
    return 'Unable to reach the hospital server. Please check your internet connection and try again.';
  }

  return error.message || 'Report analysis could not be completed.';
};

/**
 * Parse prediction response safely without assuming every optional field exists.
 *
 * @param {Object} data - Raw response from POST /api/predict-disease/
 * @returns {Object} Structured prediction object
 */
export const parsePredictionResponse = (data) => {
  if (!data) return null;

  const prediction =
    data.prediction ||
    (data.status === 'success' ? data : null) ||
    {};

  const mlServiceResponse =
    prediction.ml_service_response ||
    data.ml_service_response ||
    null;

  // Extract primary disease name
  let primaryDisease = null;
  if (typeof prediction.disease === 'string' && prediction.disease.trim()) {
    primaryDisease = prediction.disease.trim();
  } else if (Array.isArray(prediction.results) && prediction.results.length > 0) {
    const first = prediction.results[0];
    primaryDisease = typeof first === 'string' ? first : first?.disease;
  } else if (
    Array.isArray(mlServiceResponse?.results) &&
    mlServiceResponse.results.length > 0
  ) {
    const first = mlServiceResponse.results[0];
    primaryDisease = typeof first === 'string' ? first : first?.disease;
  }

  // Extract confidence
  const confidence =
    prediction.confidence !== undefined && prediction.confidence !== null
      ? String(prediction.confidence)
      : null;

  // Extract recommendation
  const recommendation =
    prediction.recommendation && typeof prediction.recommendation === 'string'
      ? prediction.recommendation.trim()
      : null;

  // Extract risk results list (e.g. from 16 ML models)
  let riskResults = [];
  if (Array.isArray(mlServiceResponse?.results)) {
    riskResults = mlServiceResponse.results.filter(
      (item) => typeof item === 'object' && item !== null && item.disease
    );
  } else if (Array.isArray(prediction.results)) {
    riskResults = prediction.results.filter(
      (item) => typeof item === 'object' && item !== null && item.disease
    );
  } else if (Array.isArray(data.results)) {
    riskResults = data.results.filter(
      (item) => typeof item === 'object' && item !== null && item.disease
    );
  }

  // Extract written results
  const writtenResults =
    mlServiceResponse?.written_result ||
    prediction.written_result ||
    data.written_result ||
    [];

  // Extract graph data
  const graphData =
    mlServiceResponse?.graph_data ||
    prediction.graph_data ||
    data.graph_data ||
    [];

  // Record ID & URL
  const medicalRecordId =
    data.medical_record_id !== undefined && data.medical_record_id !== null
      ? data.medical_record_id
      : data.id || null;

  const reportFileUrl =
    data.report_file_url || data.file_url || data.report_file || null;

  const message = data.message || 'ML Disease prediction completed.';

  return {
    raw: data,
    message,
    primaryDisease: primaryDisease || 'Clinical Report Analyzed',
    confidence,
    recommendation,
    riskResults,
    writtenResults,
    graphData,
    medicalRecordId,
    reportFileUrl,
  };
};

/**
 * Service methods
 */
export const mlService = {
  /**
   * Upload report file and predict disease via Django backend.
   *
   * Endpoint: POST /api/predict-disease/
   * Django handles:
   * - Forwarding report to ML microservice /predict-report
   * - Running OCR and ML disease-risk models
   * - Automatically creating the MedicalRecord in Django
   * - Returning the prediction payload
   *
   * @param {File} reportFile - Binary File object (PDF, JPG, PNG, WEBP, max 10MB)
   * @param {string} [symptoms] - Optional user symptoms description
   * @returns {Promise<Object>} Backend response
   */
  predictDisease: async (reportFile, symptoms = '') => {
    // 1. Validate file
    const validation = validateReportFile(reportFile);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    // 2. Build multipart/form-data
    const formData = new FormData();
    formData.append('report_file', reportFile);

    if (symptoms && typeof symptoms === 'string' && symptoms.trim()) {
      formData.append('symptoms', symptoms.trim());
    }

    // 3. Send request via existing apiClient (JWT automatically attached by interceptor)
    const response = await apiClient.post(ML_PREDICT_PATH, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 120000,
    });

    return response.data;
  },

  /**
   * Analyze report adapter method (used by ReportUploadCard).
   * Supports both real ML endpoint and fallback demo mode.
   *
   * @param {{ file?: File, recordId?: number|string, symptoms?: string }} input
   * @returns {Promise<{disease, confidence, recommendations, isDemo}>}
   */
  analyzeReport: async ({ file, recordId, symptoms } = {}) => {
    if (!file && !recordId) {
      if (!ML_ENABLED) {
        return adaptPrediction(mockMlRawResponse, { isDemo: true });
      }
      throw new Error('Please select a report file to analyze.');
    }

    if (!ML_ENABLED) {
      return adaptPrediction(mockMlRawResponse, { isDemo: true });
    }

    // Call real predictDisease implementation
    const rawData = await mlService.predictDisease(file, symptoms || '');
    return adaptPrediction(rawData, { isDemo: false });
  },
};

export default mlService;
