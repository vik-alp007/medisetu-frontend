import React from 'react';

/**
 * Reusable IconButton
 * Visual Reference: Call icon button (Screen 9), Settings gear (Screen 17), Menu dots (Screen 14)
 */
export const IconButton = ({
  icon: Icon,
  onClick,
  'aria-label': ariaLabel,
  variant = 'ghost', // 'ghost' | 'outline' | 'solid-blue' | 'light-blue'
  size = 'md',
  disabled = false,
  badge,
  className = '',
  ...props
}) => {
  const sizeStyles = {
    sm: 'w-8 h-8 p-1.5 rounded-full',
    md: 'w-10 h-10 p-2.5 rounded-full',
    lg: 'w-12 h-12 p-3 rounded-full',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const variantStyles = {
    ghost:
      'text-slate-600 hover:text-medisetu-primary hover:bg-slate-100',
    outline:
      'border border-slate-200 text-medisetu-primary hover:border-medisetu-primary hover:bg-blue-50/50',
    'solid-blue':
      'bg-medisetu-primary text-white hover:bg-medisetu-primary-hover shadow-xs',
    'light-blue':
      'bg-blue-50 text-medisetu-primary hover:bg-blue-100/80',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`relative inline-flex items-center justify-center transition-all duration-150 active:scale-95 ${
        sizeStyles[size]
      } ${variantStyles[variant]} ${
        disabled ? 'opacity-50 cursor-not-allowed active:scale-100' : ''
      } ${className}`}
      {...props}
    >
      {React.isValidElement(Icon) ? Icon : <Icon className={iconSizes[size]} />}
      {badge && (
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-medisetu-danger rounded-full ring-2 ring-white" />
      )}
    </button>
  );
};

export default IconButton;
