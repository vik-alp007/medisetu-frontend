import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Reusable PrimaryButton
 * Visual Reference: "Next →", "Create Account", "Book Appointment", "Pay Now"
 */
export const PrimaryButton = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  loading = false,
  isLoading = false,
  fullWidth = false,
  size = 'md',
  icon: Icon,
  iconPosition = 'right',
  className = '',
  ...props
}) => {
  const sizeStyles = {
    sm: 'py-2 px-4 text-xs rounded-xl gap-1.5',
    md: 'py-2.5 sm:py-3 px-5 sm:px-6 text-sm font-semibold rounded-2xl gap-2',
    lg: 'py-3.5 px-8 text-base font-semibold rounded-2xl gap-2.5',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading || isLoading}
      className={`inline-flex items-center justify-center bg-medisetu-primary hover:bg-medisetu-primary-hover active:scale-[0.98] text-white font-semibold transition-all duration-150 shadow-xs ${
        fullWidth ? 'w-full' : ''
      } ${sizeStyles[size]} ${
        disabled || loading || isLoading ? 'opacity-60 cursor-not-allowed hover:bg-medisetu-primary active:scale-100' : ''
      } ${className}`}
      {...props}
    >
      {loading || isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-white" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && (
            <span className="flex-shrink-0">
              {React.isValidElement(Icon) ? Icon : <Icon className="w-4 h-4" />}
            </span>
          )}
          <span>{children}</span>
          {Icon && iconPosition === 'right' && (
            <span className="flex-shrink-0">
              {React.isValidElement(Icon) ? Icon : <Icon className="w-4 h-4" />}
            </span>
          )}
        </>
      )}
    </button>
  );
};

export default PrimaryButton;
