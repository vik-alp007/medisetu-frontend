import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Reusable DangerButton
 * Visual Reference: "📞 Call Now" for Ambulance (Screen 15) & "Logout" (Screen 17)
 */
export const DangerButton = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  loading = false,
  fullWidth = false,
  size = 'md',
  icon: Icon,
  variant = 'solid', // 'solid' (red background) | 'outline' (red border)
  className = '',
  ...props
}) => {
  const sizeStyles = {
    sm: 'py-1.5 px-3 text-xs rounded-xl gap-1.5',
    md: 'py-2.5 sm:py-3 px-5 sm:px-6 text-sm font-semibold rounded-2xl gap-2',
    lg: 'py-3.5 px-8 text-base font-semibold rounded-2xl gap-2.5',
  };

  const variantStyles = {
    solid:
      'bg-medisetu-danger hover:bg-medisetu-danger-hover text-white shadow-xs',
    outline:
      'bg-red-50/60 border border-red-200 text-medisetu-danger hover:bg-red-100/70',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center font-semibold transition-all duration-150 active:scale-[0.98] ${
        fullWidth ? 'w-full' : ''
      } ${variantStyles[variant]} ${sizeStyles[size]} ${
        disabled || loading ? 'opacity-60 cursor-not-allowed active:scale-100' : ''
      } ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-current" />
          <span>Processing...</span>
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

export default DangerButton;
