import React from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Reusable SelectDropdown
 * Visual Reference: Screens 5, 6, 7 (Gender, Specialization, Designation)
 */
export const SelectDropdown = ({
  label,
  id,
  name,
  value,
  onChange,
  onBlur,
  options = [],
  placeholder = 'Select an option',
  error,
  disabled = false,
  required = false,
  icon: Icon,
  className = '',
  ...props
}) => {
  const selectId = id || name;

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={selectId} className="text-xs font-semibold text-medisetu-slate dark:text-slate-300">
          {label} {required && <span className="text-medisetu-danger">*</span>}
        </label>
      )}

      <div className="relative flex items-center w-full">
        {Icon && (
          <div className="absolute left-3.5 pointer-events-none text-slate-400 dark:text-slate-500">
            {React.isValidElement(Icon) ? Icon : <Icon className="w-4 h-4" />}
          </div>
        )}

        <select
          id={selectId}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          className={`w-full bg-white dark:bg-slate-800 border text-sm text-medisetu-navy dark:text-white rounded-xl py-2.5 sm:py-3 transition-all outline-none appearance-none cursor-pointer duration-150 ${
            Icon ? 'pl-10' : 'pl-3.5'
          } pr-10 ${
            error
              ? 'border-medisetu-danger focus:ring-2 focus:ring-red-100 dark:focus:ring-red-950/40'
              : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 focus:border-medisetu-primary dark:focus:border-medisetu-primary focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30'
          } ${disabled ? 'bg-slate-50 dark:bg-slate-800/50 opacity-60 cursor-not-allowed' : ''} ${
            !value ? 'text-slate-400 dark:text-slate-500' : 'text-medisetu-navy dark:text-white'
          }`}
          {...props}
        >
          <option value="" disabled className="dark:bg-slate-800 dark:text-slate-400">
            {placeholder}
          </option>
          {options.map((opt) => {
            const optVal = typeof opt === 'string' ? opt : opt.value;
            const optLabel = typeof opt === 'string' ? opt : opt.label;
            return (
              <option key={optVal} value={optVal} className="text-medisetu-navy dark:text-white dark:bg-slate-800">
                {optLabel}
              </option>
            );
          })}
        </select>

        {/* Trailing Chevron Icon */}
        <div className="absolute right-3.5 pointer-events-none text-slate-400">
          <ChevronDown className="w-4 h-4 stroke-[2.2]" />
        </div>
      </div>

      {error && (
        <span className="text-xs text-medisetu-danger font-medium mt-0.5">
          {error}
        </span>
      )}
    </div>
  );
};

export default SelectDropdown;
