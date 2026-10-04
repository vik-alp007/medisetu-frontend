import React from 'react';
import { Check } from 'lucide-react';

/**
 * Reusable BookingStepper Component
 * Visual Reference: Appointment booking progress bar (Screen 11)
 * Steps: 1. Doctor -> 2. Schedule -> 3. Confirm
 */
export const BookingStepper = ({
  currentStep = 2, // 1 | 2 | 3
  steps = [
    { number: 1, label: 'Doctor' },
    { number: 2, label: 'Schedule' },
    { number: 3, label: 'Confirm' },
  ],
  className = '',
}) => {
  return (
    <div className={`w-full max-w-md mx-auto py-2 ${className}`}>
      <div className="relative flex items-center justify-between">
        {/* Continuous Connecting Line */}
        <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 -z-0" />

        {/* Steps */}
        {steps.map((step) => {
          const isCompleted = step.number < currentStep;
          const isActive = step.number === currentStep;

          return (
            <div key={step.number} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                  isCompleted
                    ? 'bg-medisetu-primary text-white ring-4 ring-blue-50'
                    : isActive
                    ? 'bg-medisetu-primary text-white ring-4 ring-blue-100 shadow-xs'
                    : 'bg-white border-2 border-slate-300 text-slate-400'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : step.number}
              </div>

              <span
                className={`text-xs mt-1.5 font-medium ${
                  isActive
                    ? 'text-medisetu-primary font-bold'
                    : isCompleted
                    ? 'text-medisetu-slate'
                    : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BookingStepper;
