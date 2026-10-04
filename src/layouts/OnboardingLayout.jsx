import React from 'react';
import PaginationDots from '../components/navigation/PaginationDots';
import PrimaryButton from '../components/common/PrimaryButton';
import LinkButton from '../components/common/LinkButton';
import { ArrowRight } from 'lucide-react';

/**
 * Shared OnboardingLayout Component
 * Visual Reference: Screens 2, 3, 4 (Onboarding slides 1, 2, 3)
 */
export const OnboardingLayout = ({
  illustration,
  titlePrefix,
  titleHighlight,
  description,
  totalSlides = 3,
  currentSlide = 0,
  onNext,
  onSkip,
  onDotClick,
  nextLabel = 'Next',
  children,
}) => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#F5F9FF] via-[#E8F3FF] to-[#DCEBFF] flex flex-col justify-between relative overflow-hidden select-none">
      {/* Top Ambient Glow */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-white/70 to-transparent pointer-events-none" />

      {/* Main Content: Split 2-Column Desktop Grid */}
      <div className="flex-1 max-w-[1280px] w-full mx-auto px-6 sm:px-12 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 z-10 py-12">
        {/* Left: Illustration Area */}
        <div className="w-full max-w-md lg:max-w-lg flex items-center justify-center relative">
          <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-blue-100/50 absolute blur-2xl -z-0" />
          <div className="relative z-10 w-full flex items-center justify-center">
            {illustration}
          </div>
        </div>

        {/* Right: Copy & Stepper */}
        <div className="w-full max-w-md lg:max-w-lg flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-medisetu-navy tracking-tight leading-tight">
            {titlePrefix}{' '}
            <span className="text-medisetu-teal">{titleHighlight}</span>
          </h1>

          <p className="text-sm sm:text-base text-medisetu-muted max-w-md leading-relaxed">
            {description}
          </p>

          {/* Dots Indicator */}
          <div className="pt-2">
            <PaginationDots
              total={totalSlides}
              current={currentSlide}
              onDotClick={onDotClick}
            />
          </div>

          {children}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="w-full border-t border-blue-100/80 bg-white/70 backdrop-blur-md py-4 px-6 sm:px-12 z-20">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between">
          <LinkButton variant="muted" onClick={onSkip} size="sm">
            Skip
          </LinkButton>

          <PrimaryButton
            onClick={onNext}
            icon={ArrowRight}
            iconPosition="right"
            size="md"
          >
            {nextLabel}
          </PrimaryButton>
        </div>
      </div>

      {/* Bottom Wave Graphic */}
      <div className="w-full absolute bottom-0 left-0 right-0 pointer-events-none -z-0 opacity-40">
        <svg
          viewBox="0 0 1440 120"
          className="w-full h-auto block"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 60C320 20 640 100 960 70C1280 40 1440 20 1440 20V120H0V60Z"
            fill="#38BDF8"
          />
        </svg>
      </div>
    </div>
  );
};

export default OnboardingLayout;
