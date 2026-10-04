import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MediSetuLogo from '../common/MediSetuLogo';
import ThemeToggle from '../common/ThemeToggle';

/**
 * Public Navigation Bar
 * Visual Reference: Screen 6 (Landing & Admin Registration)
 */
export const PublicNavbar = ({ activeLink = 'Home', onLoginClick }) => {
  const navigate = useNavigate();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/#about' },
    { label: 'Services', path: '/#services' },
    { label: 'Contact', path: '/#contact' },
  ];

  return (
    <header className="w-full bg-white/80 dark:bg-[#0F172A]/85 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 py-3.5 px-4 sm:px-8 sticky top-0 z-40 transition-all">
      <div className="max-w-[1280px] mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="hover:opacity-95 transition-opacity">
          <MediSetuLogo size="sm" showTagline={true} />
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Public Navigation">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className={`text-sm font-medium transition-colors duration-150 ${
                activeLink === link.label
                  ? 'text-medisetu-primary font-semibold'
                  : 'text-medisetu-slate dark:text-slate-300 hover:text-medisetu-primary dark:hover:text-blue-400'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions: Theme Toggle + Outline Login Button */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            type="button"
            onClick={onLoginClick || (() => navigate('/login'))}
            className="border-1.5 border-medisetu-primary text-medisetu-primary hover:bg-medisetu-primary hover:text-white px-5 py-2 rounded-full text-sm font-semibold transition-all duration-150 active:scale-95 shadow-xs"
          >
            Login
          </button>
        </div>
      </div>
    </header>
  );
};

export default PublicNavbar;
