import React from 'react';
import { FlaskConical, Sparkles } from 'lucide-react';

/**
 * Renders a NORMALIZED prediction ({disease, confidence, recommendations, isDemo}).
 * It never contains hardcoded predictions - see services/mlService.js.
 */
export const DiseasePredictionCard = ({ prediction }) => {
  if (!prediction) return null;
  const pct = prediction.confidence === null ? null : Math.round(prediction.confidence * 100);

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] p-4 space-y-3">
      {prediction.isDemo && (
        <div
          role="status"
          className="flex items-start gap-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300/70 dark:border-amber-800/60 p-3 text-xs text-amber-900 dark:text-amber-200"
        >
          <FlaskConical className="w-4 h-4 shrink-0 mt-0.5" />
          <p>
            <span className="font-bold">Demo mode.</span> No ML model is connected yet. This is
            placeholder output and must not be treated as a medical result.
          </p>
        </div>
      )}

      <div className="flex items-start gap-3">
        <span className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4" />
        </span>
        <div className="min-w-0">
          <p className="text-xs text-medisetu-muted dark:text-slate-400">Predicted condition</p>
          <p className="text-sm font-bold text-medisetu-navy dark:text-white break-words">
            {prediction.disease || 'No prediction returned'}
          </p>
        </div>
      </div>

      {pct !== null && (
        <div>
          <div className="flex justify-between text-xs text-medisetu-muted dark:text-slate-400 mb-1">
            <span>Confidence</span>
            <span className="font-semibold">{pct}%</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div className="h-full bg-purple-500 rounded-full" style={{ width: `${pct}%` }} />
          </div>
        </div>
      )}

      {prediction.recommendations.length > 0 && (
        <ul className="list-disc pl-5 space-y-1 text-xs text-medisetu-slate dark:text-slate-300">
          {prediction.recommendations.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      )}

      <p className="text-[11px] text-medisetu-muted dark:text-slate-500">
        Predictions are decision support only. Please consult your doctor.
      </p>
    </div>
  );
};

export default DiseasePredictionCard;
