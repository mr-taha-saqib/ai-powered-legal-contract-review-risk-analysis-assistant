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
        className={`text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded ${className}`}
      >
        <span className="font-medium">Note:</span> For informational purposes only.
      </div>
    );
  }

  return (
    <div
      className={`
        flex items-start gap-3 p-4 rounded-lg
        bg-[#fff3cd] border border-[#ffc107]
        ${className}
      `}
    >
      <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
      <p className="text-sm text-amber-800 leading-relaxed">
        {DISCLAIMER_TEXT.standard}
      </p>
    </div>
  );
}
