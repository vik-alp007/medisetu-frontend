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
    success: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200/80 dark:border-emerald-800/50',
    danger: 'bg-red-50 dark:bg-red-950/40 text-medisetu-danger dark:text-red-400 border-red-200/80 dark:border-red-800/50',
    warning: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200/80 dark:border-amber-800/50',
    neutral: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    info: 'bg-blue-50 dark:bg-blue-950/40 text-medisetu-primary dark:text-blue-400 border-blue-200/80 dark:border-blue-800/50',
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
