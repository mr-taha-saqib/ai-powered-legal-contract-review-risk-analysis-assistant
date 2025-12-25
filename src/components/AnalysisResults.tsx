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
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>
          <Loader2 className="relative w-16 h-16 text-[#6366f1] animate-spin mb-6" />
        </div>
        <p className="text-lg font-semibold text-gray-800">Analyzing your contract...</p>
        <p className="text-sm text-gray-500 mt-2">Our AI is reviewing clauses and assessing risks</p>
      </div>
    );
  }

  if (clauses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-gray-200 rounded-full blur-xl opacity-50"></div>
          <FileQuestion className="relative w-20 h-20 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-3">
          No Standard Clauses Detected
        </h3>
        <p className="text-sm text-gray-600 max-w-md leading-relaxed">
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
    <div className="space-y-6 animate-fade-in">
      {/* Summary Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-white to-indigo-50/30 rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl -translate-y-32 translate-x-32"></div>

        <div className="relative p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Analysis Summary</h2>
            </div>
            <RiskBadge level={overallRiskLevel} size="lg" />
          </div>

          <p className="text-gray-700 leading-relaxed mb-6 text-base">{summary}</p>

          {/* Risk Breakdown - Modern Cards */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
              <div className="relative bg-white rounded-xl p-4 border-2 border-red-200 shadow-sm group-hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-red-600" />
                  </div>
                  <span className="text-2xl font-bold text-red-600">{riskCounts.high}</span>
                </div>
                <span className="text-sm font-semibold text-gray-700">High Risk</span>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
              <div className="relative bg-white rounded-xl p-4 border-2 border-yellow-200 shadow-sm group-hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Minus className="w-5 h-5 text-yellow-600" />
                  </div>
                  <span className="text-2xl font-bold text-yellow-600">{riskCounts.medium}</span>
                </div>
                <span className="text-sm font-semibold text-gray-700">Medium Risk</span>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
              <div className="relative bg-white rounded-xl p-4 border-2 border-green-200 shadow-sm group-hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingDown className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-2xl font-bold text-green-600">{riskCounts.low}</span>
                </div>
                <span className="text-sm font-semibold text-gray-700">Low Risk</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clauses Section */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></span>
          Detected Clauses
        </h3>
        <div className="space-y-4">
          {clauses.map((clause, index) => (
            <div
              key={clause.id}
              className="animate-slide-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <ClauseCard
                clause={clause}
                onAskQuestion={onAskQuestion}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <DisclaimerBanner />
    </div>
  );
}
