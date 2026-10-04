import React from 'react';

/**
 * Pagination Dots Component
 * Visual Reference: Onboarding screens (Screens 2, 3, 4)
 */
export const PaginationDots = ({ total = 3, current = 0, onDotClick, className = '' }) => {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`} aria-label="Pagination Dots">
      {Array.from({ length: total }).map((_, index) => {
        const isActive = index === current;
        return (
          <button
            key={index}
            type="button"
            onClick={() => onDotClick && onDotClick(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`transition-all duration-300 rounded-full ${
              isActive
                ? 'w-6 h-2 bg-medisetu-primary shadow-xs'
                : 'w-2 h-2 bg-blue-200/90 hover:bg-blue-300'
            }`}
          />
        );
      })}
    </div>
  );
};

export default PaginationDots;
