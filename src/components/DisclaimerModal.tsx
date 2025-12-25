'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { storage, DISCLAIMER_ACKNOWLEDGED_KEY, DISCLAIMER_TEXT } from '@/lib/utils';

interface DisclaimerModalProps {
  onAcknowledge: () => void;
}

export default function DisclaimerModal({ onAcknowledge }: DisclaimerModalProps) {
  const [isChecked, setIsChecked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already acknowledged
    const acknowledged = storage.get(DISCLAIMER_ACKNOWLEDGED_KEY, false);
    if (!acknowledged) {
      setIsVisible(true);
    } else {
      onAcknowledge();
    }
  }, [onAcknowledge]);

  const handleContinue = () => {
    if (!isChecked) return;
    storage.set(DISCLAIMER_ACKNOWLEDGED_KEY, true);
    setIsVisible(false);
    onAcknowledge();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-4 flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-amber-600" />
          <h2 className="text-lg font-bold text-gray-900">
            {DISCLAIMER_TEXT.modal.title}
          </h2>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <p className="text-gray-700 leading-relaxed mb-6">
            {DISCLAIMER_TEXT.modal.content}
          </p>

          {/* Checkbox */}
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              className="w-5 h-5 mt-0.5 rounded border-gray-300 text-[#1a365d] focus:ring-[#1a365d] cursor-pointer"
            />
            <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
              {DISCLAIMER_TEXT.modal.checkbox}
            </span>
          </label>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <button
            onClick={handleContinue}
            disabled={!isChecked}
            className={`
              w-full py-3 rounded-lg font-medium transition-all
              ${isChecked
                ? 'bg-[#1a365d] text-white hover:bg-[#2d4a6f]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
            `}
          >
            {DISCLAIMER_TEXT.modal.button}
          </button>
        </div>
      </div>
    </div>
  );
}
