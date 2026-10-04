import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Reusable OutlineButton
 * Visual Reference: "Login", "View", "Edit Profile", "View Nearby"
 */
export const OutlineButton = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  loading = false,
  fullWidth = false,
  size = 'md',
  icon: Icon,
  variant = 'primary', // 'primary' (blue) | 'neutral' (slate/grey)
  className = '',
  ...props
}) => {
  const sizeStyles = {
    sm: 'py-1 px-3 text-xs rounded-xl gap-1.5',
    md: 'py-2 px-4 text-sm font-semibold rounded-xl gap-2',
    lg: 'py-2.5 px-6 text-base font-semibold rounded-2xl gap-2.5',
  };

  const variantStyles = {
    primary:
      'border border-medisetu-primary text-medisetu-primary hover:bg-blue-50/60 active:bg-blue-100/70',
    neutral:
      'border border-slate-200 text-medisetu-slate hover:bg-slate-50 hover:border-slate-300',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center font-medium transition-all duration-150 active:scale-[0.98] ${
        fullWidth ? 'w-full' : ''
      } ${variantStyles[variant]} ${sizeStyles[size]} ${
        disabled || loading ? 'opacity-60 cursor-not-allowed active:scale-100' : ''
      } ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {Icon && (
            <span className="flex-shrink-0">
              {React.isValidElement(Icon) ? Icon : <Icon className="w-4 h-4" />}
            </span>
          )}
          <span>{children}</span>
        </>
      )}
    </button>
  );
};

export default OutlineButton;
