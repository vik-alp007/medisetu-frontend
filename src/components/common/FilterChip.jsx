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
  onClear,
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
          : 'bg-white border border-slate-200 text-medisetu-slate hover:bg-slate-50 hover:border-slate-300'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'} ${className}`}
    >
      <span>{label}</span>
      {count !== undefined && (
        <span
          className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
            isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
          }`}
        >
          {count}
        </span>
      )}
      {hasDropdown && (
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform ${
            isActive ? 'text-white' : 'text-slate-400'
          }`}
        />
      )}
    </button>
  );
};

export default FilterChip;
