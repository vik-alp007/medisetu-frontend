import React from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Reusable FilterChip Component
 * Visual Reference:
 * - Screen 9: Filter pills with dropdowns (Specialty ∨, Availability ∨, etc.)
 * - Screen 13: Category filter pills (All, Reports, Prescriptions, Visits)
 */
export const FilterChip = ({
  label,
  isActive = false,
  hasDropdown = true,
  onClick,
  count,
  disabled = false,
  className = '',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-150 select-none ${
        isActive
          ? 'bg-medisetu-primary text-white shadow-xs'
          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-medisetu-slate dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'} ${className}`}
    >
      <span>{label}</span>
      {count !== undefined && (
        <span
          className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
            isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
          }`}
        >
          {count}
        </span>
      )}
      {hasDropdown && (
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform ${
            isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'
          }`}
        />
      )}
    </button>
  );
};

export default FilterChip;
