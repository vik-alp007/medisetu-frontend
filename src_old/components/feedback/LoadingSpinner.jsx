import React from 'react';

/**
 * Reusable LoadingSpinner Component
 * Visual Reference: Splash loader (Screen 1) & general page loading
 */
export const LoadingSpinner = ({ size = 'md', message, className = '' }) => {
  const sizeStyles = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-2.5',
    lg: 'w-12 h-12 border-3',
  };

  return (
    <div className={`flex flex-col items-center justify-center p-6 gap-3 ${className}`}>
      <div
        className={`rounded-full border-medisetu-primary/20 border-t-medisetu-primary animate-spin ${sizeStyles[size]}`}
      />
      {message && (
        <span className="text-xs sm:text-sm font-medium text-medisetu-muted">
          {message}
        </span>
      )}
    </div>
  );
};

export default LoadingSpinner;
