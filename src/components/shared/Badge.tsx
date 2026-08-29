import React from 'react';
import { Grade } from '../../types';

interface BadgeProps {
  grade: Grade;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const gradeConfig: Record<Grade, { bg: string; text: string; label: string }> = {
  'Normal': {
    bg: 'bg-success-100',
    text: 'text-success-700',
    label: 'Normal',
  },
  'Immature Cataract': {
    bg: 'bg-warning-100',
    text: 'text-warning-700',
    label: 'Immature Cataract',
  },
  'Mature Cataract': {
    bg: 'bg-danger-100',
    text: 'text-danger-700',
    label: 'Mature Cataract',
  },
};

const sizeConfig = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-2 text-base font-semibold',
};

export const Badge: React.FC<BadgeProps> = ({ grade, size = 'md', className = '' }) => {
  const config = gradeConfig[grade];

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${config.bg} ${config.text} ${sizeConfig[size]} ${className}`}
    >
      {config.label}
    </span>
  );
};

export default Badge;
