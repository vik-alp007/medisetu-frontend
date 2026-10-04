import React from 'react';
import { Phone, ChevronRight } from 'lucide-react';
import PrimaryButton from '../common/PrimaryButton';
import DangerButton from '../common/DangerButton';
import OutlineButton from '../common/OutlineButton';

/**
 * Reusable EmergencyCard Component
 * Visual Reference: Emergency action cards (Screen 15) & Quick Help banner (Screen 8)
 */
export const EmergencyCard = ({
  variant = 'service', // 'service' (Screen 15) | 'banner' (Screen 8)
  title,
  subtitle,
  icon: Icon,
  actionText = 'Call Now',
  actionType = 'danger', // 'danger' (red) | 'primary' (blue) | 'outline' (slate)
  phoneNumber,
  onAction,
  className = '',
}) => {
  // Mode 1: Dashboard Emergency Quick Banner (Screen 8)
  if (variant === 'banner') {
    return (
      <div
        onClick={onAction}
        className={`w-full bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-3xl p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer hover:shadow-lg transition-all duration-200 active:scale-[0.99] ${className}`}
      >
        <div className="flex items-center gap-3.5">
          {Icon && (
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
              {React.isValidElement(Icon) ? Icon : <Icon className="w-5 h-5 text-white" />}
            </div>
          )}
          <div className="flex flex-col">
            <h3 className="text-base sm:text-lg font-bold leading-tight">
              {title || 'Emergency / Quick Help'}
            </h3>
            <p className="text-xs sm:text-sm text-red-100 mt-0.5">
              {subtitle || 'Get immediate hospital assistance'}
            </p>
          </div>
        </div>

        <div className="p-2 rounded-full bg-white/10 flex items-center justify-center">
          <ChevronRight className="w-5 h-5 text-white stroke-[2.5]" />
        </div>
      </div>
    );
  }

  // Mode 2: Emergency Action Card (Screen 15)
  return (
    <div
      className={`w-full bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 flex flex-col gap-4 shadow-xs ${className}`}
    >
      <div className="flex items-center gap-3.5">
        {Icon && (
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-medisetu-danger flex items-center justify-center flex-shrink-0">
            {React.isValidElement(Icon) ? Icon : <Icon className="w-6 h-6" />}
          </div>
        )}
        <div className="flex flex-col">
          <h3 className="text-base sm:text-lg font-bold text-medisetu-navy leading-tight">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-medisetu-muted mt-0.5">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="w-full pt-1">
        {actionType === 'danger' && (
          <DangerButton
            fullWidth
            icon={Phone}
            iconPosition="left"
            onClick={onAction}
          >
            {actionText}
          </DangerButton>
        )}

        {actionType === 'primary' && (
          <PrimaryButton
            fullWidth
            icon={Phone}
            iconPosition="left"
            onClick={onAction}
          >
            {actionText}
          </PrimaryButton>
        )}

        {actionType === 'outline' && (
          <OutlineButton
            fullWidth
            variant="neutral"
            onClick={onAction}
          >
            {actionText}
          </OutlineButton>
        )}
      </div>
    </div>
  );
};

export default EmergencyCard;
