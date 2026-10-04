import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import OnboardingLayout from '../../layouts/OnboardingLayout';
import DoctorIllustration from '../../assets/illustrations/DoctorIllustration';
import CalendarClockIllustration from '../../assets/illustrations/CalendarClockIllustration';
import HealthChecklistIllustration from '../../assets/illustrations/HealthChecklistIllustration';

/**
 * OnboardingScreen: Screens 2, 3, 4
 * Single screen managing 3 slide states with Framer Motion transitions.
 */
export const OnboardingScreen = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const slides = [
    {
      id: 'slide-1',
      titlePrefix: 'Find the right',
      titleHighlight: 'doctor',
      description: 'Search specialists and hospitals easily, based on your needs.',
      illustration: <DoctorIllustration />,
    },
    {
      id: 'slide-2',
      titlePrefix: 'Book',
      titleHighlight: 'appointments',
      description: 'Choose your doctor, date and time in just a few taps.',
      illustration: <CalendarClockIllustration />,
    },
    {
      id: 'slide-3',
      titlePrefix: 'Manage your',
      titleHighlight: 'health',
      description: 'Access your records, prescriptions and bills all in one place.',
      illustration: <HealthChecklistIllustration />,
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      // Completed onboarding -> proceed to Registration
      navigate('/register');
    }
  };

  const handleSkip = () => {
    navigate('/register');
  };

  const activeSlide = slides[currentSlide];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeSlide.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
        className="w-full min-h-screen"
      >
        <OnboardingLayout
          illustration={activeSlide.illustration}
          titlePrefix={activeSlide.titlePrefix}
          titleHighlight={activeSlide.titleHighlight}
          description={activeSlide.description}
          totalSlides={slides.length}
          currentSlide={currentSlide}
          onNext={handleNext}
          onSkip={handleSkip}
          onDotClick={setCurrentSlide}
          nextLabel={currentSlide === slides.length - 1 ? 'Next →' : 'Next →'}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default OnboardingScreen;
