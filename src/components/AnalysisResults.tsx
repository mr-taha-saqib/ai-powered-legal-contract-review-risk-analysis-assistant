'use client';

import { FileQuestion, Loader2, TrendingUp, TrendingDown, Minus, Shield } from 'lucide-react';
import { ClauseData, RiskLevel } from '@/types';
import RiskBadge from './RiskBadge';
import ClauseCard from './ClauseCard';
import DisclaimerBanner from './DisclaimerBanner';

interface AnalysisResultsProps {
  clauses: ClauseData[];
  summary: string;
  overallRiskLevel: RiskLevel;
  onAskQuestion: (clauseType: string) => void;
  isLoading?: boolean;
}

export default function AnalysisResults({
  clauses,
  summary,
  overallRiskLevel,
  onAskQuestion,
  isLoading = false,
}: AnalysisResultsProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-sm font-medium text-gray-900">Analyzing contract...</p>
        <p className="text-xs text-gray-500 mt-1">This may take a moment</p>
      </div>
    );
  }

  if (clauses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <FileQuestion className="w-16 h-16 text-gray-300 mb-4" />
        <h3 className="text-base font-semibold text-gray-900 mb-2">
          No Standard Clauses Detected
        </h3>
        <p className="text-sm text-gray-600 max-w-md">
          This document may not be a typical contract, or it uses non-standard
          formatting. You can still use the chat feature to ask questions about
          the document.
        </p>
      </div>
    );
  }

  // Count clauses by risk level
  const riskCounts = clauses.reduce(
    (acc, clause) => {
      acc[clause.riskLevel]++;
      return acc;
    },
    { high: 0, medium: 0, low: 0 } as Record<RiskLevel, number>
  );

  return (
    <div className="space-y-6">
      {/* Summary Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Analysis Summary</h2>
          <RiskBadge level={overallRiskLevel} size="lg" />
        </div>

        <p className="text-sm text-gray-700 leading-relaxed mb-6">{summary}</p>

        {/* Risk Breakdown */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="text-2xl font-semibold text-red-600 mb-1">{riskCounts.high}</div>
            <div className="text-xs font-medium text-gray-600">High Risk</div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <div className="text-2xl font-semibold text-orange-600 mb-1">{riskCounts.medium}</div>
            <div className="text-xs font-medium text-gray-600">Medium Risk</div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="text-2xl font-semibold text-green-600 mb-1">{riskCounts.low}</div>
            <div className="text-xs font-medium text-gray-600">Low Risk</div>
          </div>
        </div>
      </div>

      {/* Clauses Section */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          Detected Clauses
        </h3>
        <div className="space-y-3">
          {clauses.map(clause => (
            <ClauseCard
              key={clause.id}
              clause={clause}
              onAskQuestion={onAskQuestion}
            />
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <DisclaimerBanner />
    </div>
  );
}
