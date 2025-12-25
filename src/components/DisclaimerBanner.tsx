'use client';

import { AlertTriangle } from 'lucide-react';
import { DISCLAIMER_TEXT } from '@/lib/utils';

interface DisclaimerBannerProps {
  compact?: boolean;
  className?: string;
}

export default function DisclaimerBanner({
  compact = false,
  className = '',
}: DisclaimerBannerProps) {
  if (compact) {
    return (
      <div
        className={`text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950 px-2 py-1 rounded ${className}`}
      >
        <span className="font-medium">Note:</span> For informational purposes only.
      </div>
    );
  }

  return (
    <div
      className={`
        flex items-start gap-3 p-4 rounded-lg
        bg-[#fff3cd] dark:bg-amber-950 border border-[#ffc107] dark:border-amber-800
        ${className}
      `}
    >
      <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
      <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
        {DISCLAIMER_TEXT.standard}
      </p>
    </div>
  );
}
