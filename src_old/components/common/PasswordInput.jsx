import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import InputField from './InputField';

/**
 * Reusable PasswordInput
 * Visual Reference: Screens 5, 6, 7 with Lock icon & Eye toggle
 */
export const PasswordInput = ({
  label,
  id,
  name = 'password',
  placeholder = 'Password',
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <InputField
      label={label}
      id={id}
      name={name}
      type={showPassword ? 'text' : 'password'}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      error={error}
      disabled={disabled}
      required={required}
      icon={Lock}
      className={className}
      rightElement={
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
          tabIndex={-1}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      }
      {...props}
    />
  );
};

export default PasswordInput;
