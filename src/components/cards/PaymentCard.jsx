import React from 'react';
import PrimaryButton from '../common/PrimaryButton';
import StatusBadge from '../common/StatusBadge';

/**
 * Reusable PaymentCard Component
 * Visual Reference: Outstanding Amount Card & Payment History (Screen 16)
 */
export const PaymentCard = ({
  variant = 'outstanding', // 'outstanding' | 'history'
  amount,
  status = 'Due',
  date,
  onPay,
  className = '',
}) => {
  // Mode 1: Outstanding Balance Hero Card (Screen 16)
  if (variant === 'outstanding') {
    return (
      <div
        className={`w-full bg-red-50/60 border border-red-200/80 rounded-3xl p-5 sm:p-6 flex flex-col gap-4 shadow-xs ${className}`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm font-semibold text-medisetu-danger">
            Outstanding Amount
          </span>
          <StatusBadge status={status} variant="danger" size="sm" />
        </div>

        <div className="text-3xl sm:text-4xl font-extrabold text-medisetu-danger tracking-tight">
          ₹{amount?.toLocaleString() || '0'}
        </div>

        <PrimaryButton fullWidth onClick={onPay} size="lg">
          Pay Now
        </PrimaryButton>
      </div>
    );
  }

  // Mode 2: Previous Payments Row Item (Screen 16)
  return (
    <div
      className={`w-full bg-white rounded-2xl border border-slate-200/80 p-3.5 sm:p-4 flex items-center justify-between gap-4 ${className}`}
    >
      <div className="flex flex-col">
        <span className="text-base sm:text-lg font-bold text-medisetu-navy">
          ₹{amount?.toLocaleString() || '0'}
        </span>
        {date && (
          <span className="text-xs text-medisetu-muted mt-0.5">{date}</span>
        )}
      </div>

      <StatusBadge status={status || 'Paid'} variant="success" size="md" />
    </div>
  );
};

export default PaymentCard;
