import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, X, CheckCircle2, Loader2, Sparkles } from 'lucide-react';

import ErrorAlert from '../feedback/ErrorAlert';
import DiseasePredictionCard from './DiseasePredictionCard';
import {
  validateReportFile,
  MAX_REPORT_SIZE_MB,
} from '../../services/reportService';
import { mlService, getMlErrorMessage } from '../../services/mlService';
import { adaptPrediction } from '../../services/adapters/mlAdapter';

const sizeLabel = (bytes) =>
  bytes > 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;

/**
 * ReportUploadCard
 *
 * Direct medical report upload & ML disease prediction card.
 * Calls Django backend endpoint: POST /api/predict-disease/
 * Automatically archives the MedicalRecord and displays the prediction.
 */
export const ReportUploadCard = ({ onUploaded }) => {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [validationError, setValidationError] = useState(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [successNotice, setSuccessNotice] = useState(null);

  const reset = () => {
    setFile(null);
    setValidationError(null);
    setIsAnalyzing(false);
    setAnalysisError(null);
    setPrediction(null);
    setSuccessNotice(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleSelect = (event) => {
    const selected = event.target.files?.[0];
    reset();
    if (!selected) return;
    const check = validateReportFile(selected);
    if (!check.valid) {
      setValidationError(check.error);
      return;
    }
    setFile(selected);
  };

  const handleAnalyze = async () => {
    if (!file || isAnalyzing) return;

    setIsAnalyzing(true);
    setAnalysisError(null);
    setSuccessNotice(null);
    setPrediction(null);

    try {
      // 1. Direct call to Django POST /api/predict-disease/
      const rawResponse = await mlService.predictDisease(file);

      // 2. Adapt normalized prediction for display
      const adapted = adaptPrediction(rawResponse, { isDemo: false });
      setPrediction(adapted);

      const recordId = rawResponse?.medical_record_id || rawResponse?.id;
      setSuccessNotice(
        recordId
          ? `Analysis complete. Medical Record #${recordId} has been archived in your profile.`
          : 'Analysis complete. Your report has been archived to your medical records.'
      );

      // 3. Notify parent to refresh the medical records list
      if (onUploaded) {
        onUploaded(rawResponse);
      }
    } catch (err) {
      console.error('ML Report analysis failed:', err);
      const friendlyMessage = getMlErrorMessage(err);
      setAnalysisError(friendlyMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <section className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#1E293B] p-4 sm:p-5 space-y-4 shadow-sm">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-base font-bold text-medisetu-navy dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-medisetu-primary" />
            <span>Upload & Analyze Medical Report</span>
          </h2>
          <p className="text-xs text-medisetu-muted dark:text-slate-400 mt-0.5">
            Supported formats: PDF, JPG, JPEG, PNG, WEBP up to {MAX_REPORT_SIZE_MB} MB.
          </p>
        </div>
      </div>

      <input
        ref={inputRef}
        id="report-file"
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
        onChange={handleSelect}
        className="sr-only"
        disabled={isAnalyzing}
      />

      {!file ? (
        <label
          htmlFor="report-file"
          className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-medisetu-primary px-4 py-8 text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-800/40"
        >
          <UploadCloud className="w-8 h-8 text-medisetu-primary" />
          <span className="text-sm font-semibold text-medisetu-navy dark:text-white">
            Choose a medical report
          </span>
          <span className="text-xs text-medisetu-muted dark:text-slate-400">
            Tap to browse clinical lab files or diagnostic tests
          </span>
        </label>
      ) : (
        <div className="flex items-center gap-3 rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/30 dark:bg-blue-950/20 p-3.5">
          <FileText className="w-6 h-6 text-medisetu-primary shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-medisetu-navy dark:text-white truncate">
              {file.name}
            </p>
            <p className="text-xs text-medisetu-muted dark:text-slate-400">
              {sizeLabel(file.size)}
            </p>
          </div>
          <button
            type="button"
            onClick={reset}
            disabled={isAnalyzing}
            aria-label="Remove file"
            className="p-1.5 rounded-lg text-slate-400 hover:text-medisetu-danger disabled:opacity-50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {validationError && (
        <ErrorAlert title="Invalid file format" message={validationError} />
      )}

      {file && (
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-medisetu-primary hover:bg-medisetu-primary-hover text-white text-sm font-semibold shadow-xs transition-transform active:scale-95 disabled:opacity-60"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Running ML Analysis (OCR + Risk Models)...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze Medical Report</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={reset}
            disabled={isAnalyzing}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50"
          >
            Choose another file
          </button>
        </div>
      )}

      {/* Analysis Error Alert */}
      {analysisError && (
        <ErrorAlert
          title="Analysis Could Not Be Completed"
          message={analysisError}
          onRetry={handleAnalyze}
        />
      )}

      {/* Success Notification */}
      {successNotice && (
        <p
          role="status"
          className="flex items-center gap-2 text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-200 dark:border-emerald-900"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successNotice}</span>
        </p>
      )}

      {/* Prediction Output */}
      {prediction && <DiseasePredictionCard prediction={prediction} />}
    </section>
  );
};

export default ReportUploadCard;
