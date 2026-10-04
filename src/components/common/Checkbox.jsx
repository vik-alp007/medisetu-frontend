import React from 'react';
import { Check } from 'lucide-react';

/**
 * Reusable Checkbox Component
 * Visual Reference: Screens 5, 6, 7 (Terms & Conditions Checkbox)
 */
export const Checkbox = ({
  id,
  name,
  checked,
  onChange,
  label,
  children,
  error,
  disabled = false,
  className = '',
}) => {
  const checkboxId = id || name;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label
        htmlFor={checkboxId}
        className={`flex items-start gap-2.5 cursor-pointer select-none text-xs sm:text-sm text-medisetu-slate ${
          disabled ? 'opacity-60 cursor-not-allowed' : ''
        }`}
      >
        <div className="relative flex items-center justify-center mt-0.5">
          <input
            id={checkboxId}
            name={name}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className="sr-only"
          />
          <div
            className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all duration-150 ${
              checked
                ? 'bg-medisetu-primary border-medisetu-primary text-white shadow-xs'
                : 'bg-white border-slate-300 hover:border-slate-400'
            } ${error ? 'border-medisetu-danger' : ''}`}
          >
            {checked && <Check className="w-3 h-3 stroke-[3]" />}
          </div>
        </div>

        <div className="leading-tight">
          {children || label}
        </div>
      </label>

      {error && (
        <span className="text-xs text-medisetu-danger font-medium pl-6">
          {error}
        </span>
      )}
    </div>
  );
};

export default Checkbox;
