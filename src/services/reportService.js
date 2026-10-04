/**
 * Report Service - medical report upload
 *
 * KNOWN: medical-record responses contain a `report_file` field
 *        (id, patient, doctor, appointment, diagnosis, doctor_notes,
 *         report_file, created_at).
 * UNKNOWN: whether patients may upload, which endpoint accepts the file, and
 *          which extra fields (doctor, diagnosis, ...) are required.
 *
 * TEMPORARY MOCK
 * REAL BACKEND REPORT UPLOAD CONTRACT NOT RECEIVED YET
 *
 * While VITE_REPORT_UPLOAD_ENABLED is not "true", NOTHING is sent to the
 * server and the function resolves with { uploaded: false, demo: true } so the
 * UI can say plainly that the file was only validated locally.
 *
 * WHEN THE CONTRACT ARRIVES: set VITE_REPORT_UPLOAD_ENABLED=true and adjust
 * UPLOAD_PATH / buildFormData() below - nothing else.
 */
import apiClient from './api';

export const REPORT_UPLOAD_ENABLED =
  String(import.meta.env.VITE_REPORT_UPLOAD_ENABLED ?? 'false').toLowerCase() === 'true';

export const MAX_REPORT_SIZE_MB = 10;
export const ALLOWED_REPORT_TYPES = {
  'application/pdf': 'PDF',
  'image/jpeg': 'JPG',
  'image/png': 'PNG',
};

// UNCONFIRMED - adjust when the backend team confirms.
const UPLOAD_PATH = '/api/medical-records/';
const buildFormData = (file) => {
  const form = new FormData();
  form.append('report_file', file);
  return form;
};

export const validateReportFile = (file) => {
  if (!file) return { valid: false, error: 'Please choose a report file.' };
  if (!ALLOWED_REPORT_TYPES[file.type]) {
    return { valid: false, error: 'Unsupported file type. Please upload a PDF, JPG or PNG.' };
  }
  if (file.size === 0) return { valid: false, error: 'This file is empty.' };
  if (file.size > MAX_REPORT_SIZE_MB * 1024 * 1024) {
    return { valid: false, error: `File is too large. Maximum size is ${MAX_REPORT_SIZE_MB} MB.` };
  }
  return { valid: true, error: null };
};

export const reportService = {
  /**
   * @returns {Promise<{uploaded: boolean, demo: boolean, record?: object, message: string}>}
   */
  uploadReport: async (file, { onProgress } = {}) => {
    const check = validateReportFile(file);
    if (!check.valid) throw new Error(check.error);

    if (!REPORT_UPLOAD_ENABLED) {
      // TEMPORARY MOCK - nothing is uploaded and we say so.
      return {
        uploaded: false,
        demo: true,
        message:
          'Demo mode: the file was checked on your device only. It has NOT been sent to the hospital server because the report upload API is not connected yet.',
      };
    }

    const response = await apiClient.post(UPLOAD_PATH, buildFormData(file), {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 120000,
      onUploadProgress: (event) => {
        if (onProgress && event.total) onProgress(Math.round((event.loaded / event.total) * 100));
      },
    });

    return {
      uploaded: true,
      demo: false,
      record: response.data,
      message: 'Report uploaded successfully.',
    };
  },
};

export default reportService;
