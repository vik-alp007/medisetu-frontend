import React from 'react';
import { Check } from 'lucide-react';

/**
 * Reusable Radio Option Card
 * Visual Reference: Booking consultation type selection (Screens 11 & 12)
 * e.g., "In-person (At hospital)" vs "Video Consultation (Online)"
 */
export const RadioOptionCard = ({
  id,
  name,
  value,
  selectedValue,
  onChange,
  title,
  subtitle,
  icon: Icon,
  disabled = false,
  className = '',
}) => {
  const isSelected = selectedValue === value;

  return (
    <label
      htmlFor={id}
      className={`relative flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl border cursor-pointer select-none transition-all duration-150 ${
        isSelected
          ? 'bg-blue-50/50 border-medisetu-primary ring-1 ring-medisetu-primary/30'
          : 'bg-white border-slate-200 hover:border-slate-300'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-[0.99]'} ${className}`}
    >
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={isSelected}
        onChange={() => !disabled && onChange(value)}
        disabled={disabled}
        className="sr-only"
      />

      {/* Radio circle indicator with check */}
      <div
        className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
          isSelected
            ? 'bg-medisetu-primary border-medisetu-primary text-white shadow-xs'
            : 'border-slate-300 bg-white'
        }`}
      >
        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
      </div>

      {Icon && (
        <div className={`p-2 rounded-xl ${isSelected ? 'bg-blue-100 text-medisetu-primary' : 'bg-slate-100 text-slate-500'}`}>
          <Icon className="w-4 h-4" />
        </div>
      )}

      <div className="flex flex-col">
        <span className={`text-sm font-semibold leading-tight ${isSelected ? 'text-medisetu-navy' : 'text-medisetu-slate'}`}>
          {title}
        </span>
        {subtitle && (
          <span className="text-xs text-medisetu-muted mt-0.5 leading-tight">
            {subtitle}
          </span>
        )}
      </div>
    </label>
  );
};

export default RadioOptionCard;
