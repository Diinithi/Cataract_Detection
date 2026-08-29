import React from 'react';
import { Grade } from '../../types';

interface ConfidenceBarProps {
  confidence: number;
  grade: Grade;
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
}

const gradeColors: Record<Grade, { bar: string; bg: string }> = {
  'Normal': {
    bar: 'bg-success-500',
    bg: 'bg-success-100',
  },
  'Immature Cataract': {
    bar: 'bg-warning-500',
    bg: 'bg-warning-100',
  },
  'Mature Cataract': {
    bar: 'bg-danger-500',
    bg: 'bg-danger-100',
  },
};

export const ConfidenceBar: React.FC<ConfidenceBarProps> = ({
  confidence,
  grade,
  showLabel = true,
  animated = true,
  className = '',
}) => {
  const colors = gradeColors[grade];

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between mb-1 text-sm">
          <span className="text-gray-600">Confidence</span>
          <span className="font-medium text-gray-900">{confidence.toFixed(1)}%</span>
        </div>
      )}
      <div className={`h-2 rounded-full ${colors.bg} overflow-hidden`}>
        <div
          className={`h-full rounded-full ${colors.bar} ${animated ? 'animate-bar' : ''}`}
          style={{ ['--bar-width' as string]: `${confidence}%`, width: animated ? '0%' : `${confidence}%` }}
        />
      </div>
    </div>
  );
};

export default ConfidenceBar;
