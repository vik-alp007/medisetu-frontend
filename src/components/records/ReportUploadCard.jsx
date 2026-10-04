import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, X, CheckCircle2, FlaskConical, Loader2 } from 'lucide-react';

import ErrorAlert from '../feedback/ErrorAlert';
import DiseasePredictionCard from './DiseasePredictionCard';
import {
  reportService,
  validateReportFile,
  MAX_REPORT_SIZE_MB,
  REPORT_UPLOAD_ENABLED,
} from '../../services/reportService';
import { mlService } from '../../services/mlService';
import { getErrorMessage } from '../../utils/format';

const sizeLabel = (bytes) =>
  bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;

/**
 * Report upload + analysis. Honest states only:
 *   - never says "uploaded" unless reportService really uploaded
 *   - never shows a prediction unless mlService returned one (demo is labelled)
 */
export const ReportUploadCard = ({ onUploaded }) => {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [validationError, setValidationError] = useState(null);

  const [uploadState, setUploadState] = useState('idle'); // idle | uploading | uploaded | demo | error
  const [progress, setProgress] = useState(0);
  const [uploadMessage, setUploadMessage] = useState(null);

  const [analysisState, setAnalysisState] = useState('idle'); // idle | running | done | error
  const [prediction, setPrediction] = useState(null);
  const [analysisError, setAnalysisError] = useState(null);

  const reset = () => {
    setFile(null);
    setValidationError(null);
    setUploadState('idle');
    setProgress(0);
    setUploadMessage(null);
    setAnalysisState('idle');
    setPrediction(null);
    setAnalysisError(null);
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

  const handleUpload = async () => {
    setUploadState('uploading');
    setProgress(0);
    setUploadMessage(null);
    try {
      const result = await reportService.uploadReport(file, { onProgress: setProgress });
      setUploadMessage(result.message);
      setUploadState(result.uploaded ? 'uploaded' : 'demo');
      if (result.uploaded) onUploaded?.(result.record);
    } catch (err) {
      setUploadMessage(getErrorMessage(err, err?.message || 'Upload failed. Please try again.'));
      setUploadState('error');
    }
  };

  const handleAnalyze = async () => {
    setAnalysisState('running');
    setAnalysisError(null);
    try {
      const result = await mlService.analyzeReport({ file });
      setPrediction(result);
      setAnalysisState('done');
    } catch (err) {
      setAnalysisError(getErrorMessage(err, err?.message || 'Analysis failed. Please try again.'));
      setAnalysisState('error');
    }
  };

  const busy = uploadState === 'uploading' || analysisState === 'running';

  return (
    <section className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#1E293B] p-4 sm:p-5 space-y-4">
      <div>
        <h2 className="text-base font-bold text-medisetu-navy dark:text-white">Upload a medical report</h2>
        <p className="text-xs text-medisetu-muted dark:text-slate-400 mt-0.5">
          PDF, JPG or PNG up to {MAX_REPORT_SIZE_MB} MB.
        </p>
      </div>

      {!REPORT_UPLOAD_ENABLED && (
        <div className="flex items-start gap-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300/70 dark:border-amber-800/60 p-3 text-xs text-amber-900 dark:text-amber-200">
          <FlaskConical className="w-4 h-4 shrink-0 mt-0.5" />
          <p>
            Report upload to the hospital server is not connected yet (waiting for the backend
            contract). Files are only checked on your device.
          </p>
        </div>
      )}

      <input
        ref={inputRef}
        id="report-file"
        type="file"
        accept="application/pdf,image/jpeg,image/png"
        onChange={handleSelect}
        className="sr-only"
        disabled={busy}
      />

      {!file ? (
        <label
          htmlFor="report-file"
          className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-medisetu-primary px-4 py-8 text-center cursor-pointer transition-colors"
        >
          <UploadCloud className="w-7 h-7 text-medisetu-primary" />
          <span className="text-sm font-semibold text-medisetu-navy dark:text-white">Choose a report</span>
          <span className="text-xs text-medisetu-muted dark:text-slate-400">Tap to browse your files</span>
        </label>
      ) : (
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-700 p-3">
          <FileText className="w-5 h-5 text-medisetu-primary shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-medisetu-navy dark:text-white truncate">{file.name}</p>
            <p className="text-xs text-medisetu-muted dark:text-slate-400">{sizeLabel(file.size)}</p>
          </div>
          <button
            type="button"
            onClick={reset}
            disabled={busy}
            aria-label="Remove file"
            className="p-1.5 rounded-lg text-slate-400 hover:text-medisetu-danger disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {validationError && <ErrorAlert title="Can't use this file" message={validationError} />}

      {file && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleUpload}
            disabled={busy || uploadState === 'uploaded' || uploadState === 'demo'}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-medisetu-primary hover:bg-medisetu-primary-hover text-white text-sm font-semibold disabled:opacity-60"
          >
            {uploadState === 'uploading' && <Loader2 className="w-4 h-4 animate-spin" />}
            {uploadState === 'uploading'
              ? REPORT_UPLOAD_ENABLED
                ? `Uploading ${progress}%`
                : 'Checking...'
              : REPORT_UPLOAD_ENABLED
              ? 'Upload report'
              : 'Check file (demo)'}
          </button>
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={busy}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-sm font-semibold text-medisetu-navy dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-60"
          >
            {analysisState === 'running' && <Loader2 className="w-4 h-4 animate-spin" />}
            {analysisState === 'running' ? 'Analyzing...' : 'Analyze report'}
          </button>
        </div>
      )}

      {uploadState === 'uploading' && REPORT_UPLOAD_ENABLED && (
        <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div className="h-full bg-medisetu-primary transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}

      {uploadState === 'uploaded' && (
        <p role="status" className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="w-4 h-4" /> {uploadMessage}
        </p>
      )}
      {uploadState === 'demo' && (
        <p role="status" className="text-xs text-amber-800 dark:text-amber-300">{uploadMessage}</p>
      )}
      {uploadState === 'error' && (
        <ErrorAlert title="Upload failed" message={uploadMessage} onRetry={handleUpload} />
      )}

      {analysisState === 'error' && (
        <ErrorAlert title="Analysis failed" message={analysisError} onRetry={handleAnalyze} />
      )}
      {analysisState === 'done' && <DiseasePredictionCard prediction={prediction} />}
    </section>
  );
};

export default ReportUploadCard;
