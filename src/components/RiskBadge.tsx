'use client';

import { RiskLevel, RISK_COLORS } from '@/types';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function RiskBadge({ level, size = 'md', className = '' }: RiskBadgeProps) {
  const colors = RISK_COLORS[level];

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-xs px-2 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  return (
    <span
      className={`inline-flex items-center font-bold uppercase rounded ${sizeClasses[size]} ${className}`}
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
      }}
    >
      {level}
    </span>
  );
}
