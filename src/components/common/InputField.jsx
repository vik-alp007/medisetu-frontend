import React from 'react';

/**
 * Reusable InputField
 * Visual Reference: Registration screens (Screens 5, 6, 7) & Search inputs
 */
export const InputField = ({
  label,
  id,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
  required = false,
  icon: Icon,
  rightElement,
  className = '',
  inputClassName = '',
  ...props
}) => {
  const inputId = id || name;

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-medisetu-slate">
          {label} {required && <span className="text-medisetu-danger">*</span>}
        </label>
      )}

      <div className="relative flex items-center w-full">
        {Icon && (
          <div className="absolute left-3.5 pointer-events-none text-slate-400">
            {React.isValidElement(Icon) ? Icon : <Icon className="w-4 h-4" />}
          </div>
        )}

        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          placeholder={placeholder}
          required={required}
          className={`w-full bg-white border text-sm text-medisetu-navy placeholder:text-slate-400 rounded-xl py-2.5 sm:py-3 transition-all outline-none duration-150 ${
            Icon ? 'pl-10' : 'pl-3.5'
          } ${rightElement ? 'pr-11' : 'pr-3.5'} ${
            error
              ? 'border-medisetu-danger focus:ring-2 focus:ring-red-100'
              : 'border-slate-200 hover:border-slate-300 focus:border-medisetu-primary focus:ring-2 focus:ring-blue-100'
          } ${disabled ? 'bg-slate-50 opacity-60 cursor-not-allowed' : ''} ${inputClassName}`}
          {...props}
        />

        {rightElement && (
          <div className="absolute right-3 flex items-center justify-center">
            {rightElement}
          </div>
        )}
      </div>

      {error && (
        <span className="text-xs text-medisetu-danger font-medium mt-0.5">
          {error}
        </span>
      )}
    </div>
  );
};

export default InputField;
