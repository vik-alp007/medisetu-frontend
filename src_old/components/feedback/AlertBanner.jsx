import React from 'react';
import { Info, AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';

/**
 * Reusable AlertBanner Component
 * Visual Reference: Confirmation banner (Screen 12) & Information notices
 */
export const AlertBanner = ({
  variant = 'info', // 'info' | 'warning' | 'danger' | 'success'
  message,
  children,
  icon: CustomIcon,
  className = '',
}) => {
  const config = {
    info: {
      bg: 'bg-blue-50/80 border-blue-200 text-blue-900',
      icon: Info,
      iconColor: 'text-medisetu-primary',
    },
    warning: {
      bg: 'bg-amber-50/80 border-amber-200 text-amber-900',
      icon: AlertTriangle,
      iconColor: 'text-amber-600',
    },
    danger: {
      bg: 'bg-red-50/80 border-red-200 text-red-900',
      icon: AlertCircle,
      iconColor: 'text-medisetu-danger',
    },
    success: {
      bg: 'bg-emerald-50/80 border-emerald-200 text-emerald-900',
      icon: CheckCircle,
      iconColor: 'text-emerald-600',
    },
  };

  const current = config[variant] || config.info;
  const Icon = CustomIcon || current.icon;

  return (
    <div
      role="status"
      className={`w-full border rounded-2xl p-3.5 sm:p-4 flex items-center gap-3 text-xs sm:text-sm font-medium ${
        current.bg
      } ${className}`}
    >
      <Icon className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${current.iconColor}`} />
      <div className="flex-1 leading-snug">
        {children || message}
      </div>
    </div>
  );
};

export default AlertBanner;
