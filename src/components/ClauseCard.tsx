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
    <div className={`group bg-white rounded-2xl border-2 ${getBorderColor()} overflow-hidden shadow-md hover:shadow-xl transition-all duration-300`}>
      {/* Header - Clickable to expand/collapse */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r ${getGradient()} hover:opacity-90 transition-all duration-300`}
      >
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-lg ${isExpanded ? 'bg-white/80' : 'bg-white/60 group-hover:bg-white/80'} transition-all shadow-sm`}>
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-600" />
            )}
          </div>
          <span className="font-bold text-gray-900 text-base">
            {CLAUSE_TYPE_NAMES[clause.type]}
          </span>
        </div>
        <RiskBadge level={clause.riskLevel} />
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-6 pb-6 pt-4 space-y-5 bg-white animate-slide-in">
          {/* Original Text */}
          <div className="relative overflow-hidden rounded-xl border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-slate-50">
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-gray-200 rounded-lg">
                  <FileText className="w-4 h-4 text-gray-600" />
                </div>
                <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wide">
                  Contract Text
                </h4>
              </div>
              <p className="text-sm text-gray-800 leading-relaxed italic pl-7">
                &quot;{clause.originalText}&quot;
              </p>
            </div>
          </div>

          {/* Plain Language Explanation */}
          <div className="relative overflow-hidden rounded-xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-blue-50">
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-indigo-200 rounded-lg">
                  <Lightbulb className="w-4 h-4 text-indigo-700" />
                </div>
                <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-wide">
                  Plain Language
                </h4>
              </div>
              <p className="text-sm text-gray-800 leading-relaxed pl-7 font-medium">
                {clause.plainLanguageExplanation}
              </p>
            </div>
          </div>

          {/* Risk Reasons */}
          <div className={`relative overflow-hidden rounded-xl border-2 bg-gradient-to-br ${
            clause.riskLevel === 'high' ? 'border-red-200 from-red-50 to-pink-50' :
            clause.riskLevel === 'medium' ? 'border-yellow-200 from-yellow-50 to-orange-50' :
            'border-green-200 from-green-50 to-emerald-50'
          }`}>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className={`p-1.5 rounded-lg ${
                  clause.riskLevel === 'high' ? 'bg-red-200' :
                  clause.riskLevel === 'medium' ? 'bg-yellow-200' :
                  'bg-green-200'
                }`}>
                  <AlertCircle className={`w-4 h-4 ${
                    clause.riskLevel === 'high' ? 'text-red-700' :
                    clause.riskLevel === 'medium' ? 'text-yellow-700' :
                    'text-green-700'
                  }`} />
                </div>
                <h4 className={`text-xs font-bold uppercase tracking-wide ${
                  clause.riskLevel === 'high' ? 'text-red-700' :
                  clause.riskLevel === 'medium' ? 'text-yellow-700' :
                  'text-green-700'
                }`}>
                  Why This Risk Level
                </h4>
              </div>
              <ul className="space-y-2 pl-7">
                {clause.riskReasons.map((reason, index) => (
                  <li
                    key={index}
                    className="text-sm text-gray-700 flex items-start gap-3 font-medium"
                  >
                    <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                      clause.riskLevel === 'high' ? 'bg-red-500' :
                      clause.riskLevel === 'medium' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`} />
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Override Justification (if applicable) */}
          {clause.isOverride && clause.overrideJustification && (
            <div className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl">
              <h4 className="text-xs font-bold text-amber-700 uppercase mb-2 tracking-wide">
                Special Consideration
              </h4>
              <p className="text-sm text-amber-900 font-medium leading-relaxed">
                {clause.overrideJustification}
              </p>
            </div>
          )}

          {/* Ask Question Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onAskQuestion(clause.type)}
              className="group/btn flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 w-full justify-center font-semibold"
            >
              <MessageCircle className="w-5 h-5 transition-transform group-hover/btn:scale-110" />
              Ask a question about this clause
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
