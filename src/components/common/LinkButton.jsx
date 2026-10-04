import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Reusable LinkButton
 * Visual Reference: "Skip" (Screens 2, 3, 4), "View All" (Screen 8), "Login" link (Screen 5)
 */
export const LinkButton = ({
  children,
  to,
  onClick,
  variant = 'primary', // 'primary' (blue) | 'muted' (slate/grey)
  size = 'sm',
  className = '',
  ...props
}) => {
  const variantStyles = {
    primary: 'text-medisetu-primary hover:text-medisetu-primary-hover font-semibold',
    muted: 'text-medisetu-muted hover:text-medisetu-slate font-medium',
  };

  const sizeStyles = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
  };

  const combinedClasses = `inline-flex items-center gap-1 transition-colors duration-150 underline-offset-4 hover:underline ${
    variantStyles[variant]
  } ${sizeStyles[size]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={combinedClasses} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={combinedClasses} {...props}>
      {children}
    </button>
  );
};

export default LinkButton;
