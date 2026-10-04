import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import MediSetuLogo from '../../components/common/MediSetuLogo';

/**
 * Screen 1: Splash / Loading Screen
 * Exact visual match: Centered MediSetu brand, circular spinner, bottom blue ocean waves
 */
export const SplashScreen = () => {
  const navigate = useNavigate();

  // Subtle auto-transition to onboarding after 2.6s, or immediate on click
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/onboarding');
    }, 2600);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      onClick={() => navigate('/onboarding')}
      className="w-full h-screen flex flex-col justify-between items-center relative overflow-hidden bg-gradient-to-b from-[#F5F9FF] via-[#E8F3FF] to-[#D5E9FF] select-none cursor-pointer"
    >
      {/* Top ambient soft glow */}
      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-white/70 to-transparent pointer-events-none" />

      {/* Centered Brand & Loader */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex-1 flex flex-col items-center justify-center -mt-16 z-10"
      >
        <MediSetuLogo size="lg" showTagline={true} className="flex-col text-center" />

        {/* Circular Spinner & Loading Text */}
        <div className="mt-12 flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-medisetu-primary/30 border-t-medisetu-primary animate-spin" />
          <span className="text-sm font-medium text-medisetu-muted tracking-wide">
            Loading...
          </span>
        </div>
      </motion.div>

      {/* Layered Organic Bottom Wave Graphic (Figma Match) */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full relative z-0"
      >
        <svg
          viewBox="0 0 1440 240"
          className="w-full h-auto block drop-shadow-lg"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Back Wave */}
          <path
            d="M0 140C240 100 480 180 720 150C960 120 1200 60 1440 100V240H0V140Z"
            fill="#38BDF8"
            fillOpacity="0.4"
          />
          {/* Middle Wave */}
          <path
            d="M0 160C300 130 600 200 900 165C1200 130 1350 90 1440 120V240H0V160Z"
            fill="#0284C7"
            fillOpacity="0.75"
          />
          {/* Front Primary Wave */}
          <path
            d="M0 185C360 150 720 220 1080 180C1260 160 1380 140 1440 150V240H0V185Z"
            fill="#0369A1"
          />
        </svg>
      </motion.div>
    </div>
  );
};

export default SplashScreen;
