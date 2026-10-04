import React from 'react';
import { Inbox } from 'lucide-react';
import PrimaryButton from '../common/PrimaryButton';

/**
 * Reusable EmptyState Component
 * For empty lists, searches with no results, or unpopulated sections
 */
export const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No records found',
  message = 'There is currently no data to display.',
  description, // alias of `message` - several screens pass this name
  actionText,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`w-full bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 sm:p-12 flex flex-col items-center justify-center text-center ${className}`}
    >
      <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950/60 text-medisetu-primary dark:text-blue-400 flex items-center justify-center mb-4">
        {React.isValidElement(Icon) ? Icon : <Icon className="w-8 h-8" />}
      </div>

      <h3 className="text-base sm:text-lg font-bold text-medisetu-navy dark:text-white leading-tight">
        {title}
      </h3>

      <p className="text-xs sm:text-sm text-medisetu-muted dark:text-slate-400 max-w-sm mt-1 mb-5 leading-relaxed">
        {description ?? message}
      </p>

      {actionText && onAction && (
        <PrimaryButton size="sm" onClick={onAction}>
          {actionText}
        </PrimaryButton>
      )}
    </div>
  );
};

export default EmptyState;
