'use client';

import { RiskLevel } from '@/types';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function RiskBadge({ level, size = 'md', className = '' }: RiskBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-xs px-2 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  const colorClasses = {
    high: 'bg-red-500 text-white dark:bg-red-400 dark:text-gray-900',
    medium: 'bg-amber-500 text-gray-900 dark:bg-amber-500 dark:text-gray-900',
    low: 'bg-green-500 text-white dark:bg-green-400 dark:text-gray-900',
  };

  return (
    <span
      className={`inline-flex items-center font-bold uppercase rounded ${sizeClasses[size]} ${colorClasses[level]} ${className}`}
    >
      {level}
    </span>
  );
}
