import React, { useMemo } from 'react';

interface PasswordStrengthProps {
  password: string;
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  const strength = useMemo(() => {
    if (!password) return 0;

    let score = 0;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;

    return score;
  }, [password]);

  if (!password) return null;

  const getStrengthColor = () => {
    if (strength <= 1) return 'bg-danger-500';
    if (strength <= 2) return 'bg-warning-500';
    if (strength <= 3) return 'bg-yellow-500';
    return 'bg-success-500';
  };

  const getStrengthLabel = () => {
    if (strength <= 1) return 'Weak';
    if (strength <= 2) return 'Fair';
    if (strength <= 3) return 'Good';
    return 'Strong';
  };

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`h-1 flex-1 rounded-full transition-colors duration-200 ${
              strength >= level ? getStrengthColor() : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      <p className={`text-xs font-medium ${
        strength <= 1 ? 'text-danger-600' :
        strength <= 2 ? 'text-warning-600' :
        strength <= 3 ? 'text-yellow-600' :
        'text-success-600'
      }`}>
        {getStrengthLabel()}
      </p>
    </div>
  );
};

export default PasswordStrength;
