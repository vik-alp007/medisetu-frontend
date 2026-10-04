import React from 'react';
import { Pill } from 'lucide-react';

/**
 * Reusable MedicineItem Component
 * Visual Reference: Prescribed Medicines List in Screen 14
 */
export const MedicineItem = ({
  name,
  dosage,
  frequency,
  duration,
  color = 'red', // 'red' | 'blue' | 'amber'
  className = '',
}) => {
  const colorStyles = {
    red: 'bg-rose-50 text-rose-500 border-rose-100',
    blue: 'bg-blue-50 text-blue-500 border-blue-100',
    amber: 'bg-amber-50 text-amber-500 border-amber-100',
  };

  const badgeStyle = colorStyles[color] || colorStyles.blue;

  return (
    <div
      className={`w-full bg-slate-50/70 border border-slate-200/60 rounded-2xl p-3 sm:p-3.5 flex items-center justify-between gap-3 ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0 ${badgeStyle}`}>
          <Pill className="w-4 h-4" />
        </div>

        <div className="flex flex-col">
          <div className="flex items-baseline gap-1.5">
            <h4 className="text-sm font-bold text-medisetu-navy leading-tight">
              {name}
            </h4>
            {dosage && (
              <span className="text-xs font-medium text-medisetu-muted">
                {dosage}
              </span>
            )}
          </div>
          {frequency && (
            <span className="text-xs text-medisetu-muted mt-0.5">{frequency}</span>
          )}
        </div>
      </div>

      {duration && (
        <span className="text-xs font-semibold text-medisetu-navy bg-white px-2.5 py-1 rounded-lg border border-slate-200/70 flex-shrink-0">
          {duration}
        </span>
      )}
    </div>
  );
};

export default MedicineItem;
