import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

/**
 * Reusable ErrorAlert Component
 * Used when real backend API calls fail.
 * Displays error message and retry button without silently replacing with mock data.
 */
export const ErrorAlert = ({
  title = 'Something went wrong',
  message,
  onRetry,
  className = '',
}) => {
  return (
    <div
      role="alert"
      className={`w-full bg-red-50/80 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 text-medisetu-danger dark:text-red-400 ${className}`}
    >
      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />

      <div className="flex-1">
        <h4 className="text-sm font-bold text-red-900 dark:text-red-200 leading-tight">
          {title}
        </h4>
        {message && (
          <p className="text-xs sm:text-sm text-red-700 dark:text-red-300 mt-1 leading-relaxed">
            {message}
          </p>
        )}

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white px-3.5 py-1.5 rounded-xl transition-colors active:scale-95 shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorAlert;
