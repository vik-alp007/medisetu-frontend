import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

/**
 * Reusable SuccessCheckmark Component
 * Visual Reference: Celebratory badge from Screen 12 (Appointment Confirmed)
 */
export const SuccessCheckmark = ({
  title = 'Appointment Confirmed!',
  subtitle = 'Your appointment has been successfully booked. You will receive a notification shortly.',
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center ${className}`}>
      {/* Animated Circle Badge with Confetti Particles */}
      <div className="relative w-36 h-36 flex items-center justify-center mb-6">
        {/* Confetti Particle Accents matching Screen 12 */}
        <span className="absolute top-2 left-6 w-2.5 h-2.5 rounded-full bg-cyan-400" />
        <span className="absolute top-1 right-10 w-2.5 h-2.5 rounded-full bg-purple-500" />
        <span className="absolute bottom-3 left-10 w-2.5 h-2.5 rounded-full bg-teal-400" />
        <span className="absolute bottom-5 right-7 w-2.5 h-2.5 rounded-sm rotate-45 bg-amber-400" />
        <span className="absolute top-1/2 -left-2 w-2.5 h-2.5 rounded-full bg-blue-500" />
        <span className="absolute top-1/2 -right-2 w-2.5 h-2.5 rounded-full bg-pink-400" />

        {/* Soft background halo */}
        <div className="w-28 h-28 rounded-full bg-emerald-50 border-8 border-emerald-100/60 flex items-center justify-center shadow-lg">
          {/* Solid Green Check Circle */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 15, stiffness: 250 }}
            className="w-20 h-20 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/30"
          >
            <Check className="w-10 h-10 stroke-[3.5]" />
          </motion.div>
        </div>
      </div>

      {title && (
        <h2 className="text-2xl sm:text-3xl font-extrabold text-medisetu-navy tracking-tight">
          {title}
        </h2>
      )}

      {subtitle && (
        <p className="text-sm sm:text-base text-medisetu-muted max-w-sm mt-2 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SuccessCheckmark;
