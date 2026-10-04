import React from 'react';

/**
 * Reusable StatusBadge Component
 * Visual Reference: "Top Rated", "Active", "Completed", "Due", "Paid", "+ Consulted"
 */
export const StatusBadge = ({
  status,
  variant, // 'success' | 'danger' | 'warning' | 'neutral' | 'info'
  size = 'md',
  className = '',
}) => {
  // Infer variant from status string if not explicitly passed
  const getAutoVariant = (statusText = '') => {
    const s = String(statusText).toLowerCase();
    if (s.includes('active') || s.includes('paid') || s.includes('top rated') || s.includes('consulted')) {
      return 'success';
    }
    if (s.includes('due') || s.includes('urgent') || s.includes('cancelled')) {
      return 'danger';
    }
    if (s.includes('pending') || s.includes('warning')) {
      return 'warning';
    }
    if (s.includes('completed') || s.includes('closed')) {
      return 'neutral';
    }
    return 'info';
  };

  const finalVariant = variant || getAutoVariant(status);

  const variantStyles = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    danger: 'bg-red-50 text-medisetu-danger border-red-200/80',
    warning: 'bg-amber-50 text-amber-700 border-amber-200/80',
    neutral: 'bg-slate-100 text-slate-600 border-slate-200',
    info: 'bg-blue-50 text-medisetu-primary border-blue-200/80',
  };

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 rounded-full font-semibold',
    md: 'text-xs px-2.5 py-1 rounded-full font-semibold',
    lg: 'text-sm px-3.5 py-1.5 rounded-full font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 border ${
        variantStyles[finalVariant]
      } ${sizeStyles[size]} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      <span>{status}</span>
    </span>
  );
};

export default StatusBadge;
