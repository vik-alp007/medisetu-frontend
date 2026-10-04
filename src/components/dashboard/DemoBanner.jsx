import React from 'react';
import { FlaskConical, Info } from 'lucide-react';

/** Shown whenever a dashboard is displaying TEMPORARY demo data. */
export const DemoBanner = ({ reason, onRetry }) => (
  <div
    role="status"
    className="w-full rounded-2xl border border-amber-300/70 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/30 p-4 flex items-start gap-3 text-amber-900 dark:text-amber-200"
  >
    <FlaskConical className="w-5 h-5 mt-0.5 shrink-0" />
    <div className="flex-1 text-sm">
      <p className="font-bold">Demo data – waiting for backend statistics</p>
      <p className="text-xs mt-0.5 leading-relaxed">
        {reason || 'The dashboard API did not respond.'} The numbers and names below are placeholders,
        not real hospital records.
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 text-xs font-semibold underline underline-offset-2 hover:no-underline"
        >
          Try the real server again
        </button>
      )}
    </div>
  </div>
);

export const NoticeBanner = ({ notices }) =>
  notices?.length ? (
    <div className="w-full rounded-2xl border border-blue-200/80 dark:border-blue-900/60 bg-blue-50 dark:bg-blue-950/30 p-3 flex items-start gap-3 text-blue-900 dark:text-blue-200">
      <Info className="w-4 h-4 mt-0.5 shrink-0" />
      <ul className="text-xs space-y-1 leading-relaxed">
        {notices.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>
    </div>
  ) : null;

export default DemoBanner;
