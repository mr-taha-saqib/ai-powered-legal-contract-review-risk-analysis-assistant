'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, MessageCircle, FileText, Lightbulb, AlertCircle } from 'lucide-react';
import { ClauseData, CLAUSE_TYPE_NAMES, RISK_COLORS } from '@/types';
import RiskBadge from './RiskBadge';

interface ClauseCardProps {
  clause: ClauseData;
  onAskQuestion: (clauseType: string) => void;
}

export default function ClauseCard({ clause, onAskQuestion }: ClauseCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const colors = RISK_COLORS[clause.riskLevel];

  const getBorderColor = () => {
    switch (clause.riskLevel) {
      case 'high': return 'border-red-200 hover:border-red-300';
      case 'medium': return 'border-yellow-200 hover:border-yellow-300';
      case 'low': return 'border-green-200 hover:border-green-300';
      default: return 'border-gray-200';
    }
  };

  const getGradient = () => {
    switch (clause.riskLevel) {
      case 'high': return 'from-red-50 to-pink-50';
      case 'medium': return 'from-yellow-50 to-orange-50';
      case 'low': return 'from-green-50 to-emerald-50';
      default: return 'from-gray-50 to-slate-50';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header - Clickable to expand/collapse */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center gap-3">
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          )}
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {CLAUSE_TYPE_NAMES[clause.type]}
          </span>
        </div>
        <RiskBadge level={clause.riskLevel} />
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-gray-100 dark:border-gray-700">
          {/* Original Text */}
          <div className="pt-4">
            <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">
              Contract Text
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic">
              &quot;{clause.originalText}&quot;
            </p>
          </div>

          {/* Plain Language Explanation */}
          <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h4 className="text-xs font-medium text-blue-900 dark:text-blue-300 uppercase mb-2">
              Plain Language
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {clause.plainLanguageExplanation}
            </p>
          </div>

          {/* Risk Reasons */}
          <div>
            <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">
              Risk Factors
            </h4>
            <ul className="space-y-1.5">
              {clause.riskReasons.map((reason, index) => (
                <li
                  key={index}
                  className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2"
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                    style={{ backgroundColor: colors.bg }}
                  />
                  {reason}
                </li>
              ))}
            </ul>
          </div>

          {/* Override Justification (if applicable) */}
          {clause.isOverride && clause.overrideJustification && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
              <h4 className="text-xs font-medium text-amber-900 dark:text-amber-300 uppercase mb-1">
                Special Consideration
              </h4>
              <p className="text-sm text-amber-800 dark:text-amber-300">
                {clause.overrideJustification}
              </p>
            </div>
          )}

          {/* Ask Question Button */}
          <button
            type="button"
            onClick={() => onAskQuestion(clause.type)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg transition-colors w-full justify-center font-medium"
          >
            <MessageCircle className="w-4 h-4" />
            Ask a question about this
          </button>
        </div>
      )}
    </div>
  );
}
