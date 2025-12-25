'use client';

import { FileText, Trash2 } from 'lucide-react';
import { ContractListItem } from '@/types';
import RiskBadge from './RiskBadge';
import { formatDate } from '@/lib/utils';

interface ContractHistoryProps {
  contracts: ContractListItem[];
  selectedId?: string;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export default function ContractHistory({
  contracts,
  selectedId,
  onSelect,
  onDelete,
  isLoading = false,
}: ContractHistoryProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className="bg-gray-100 animate-pulse rounded-lg p-4 h-20"
          />
        ))}
      </div>
    );
  }

  if (contracts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p className="text-sm">No contracts yet</p>
        <p className="text-xs mt-1">Upload your first contract to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-600 mb-3">
        Analysis History
      </h3>
      {contracts.map(contract => (
        <div
          key={contract.id}
          onClick={() => onSelect(contract.id)}
          className={`
            group relative bg-white rounded-lg p-3 cursor-pointer transition-all
            border-l-4 hover:shadow-sm
            ${selectedId === contract.id
              ? 'border-l-[#1a365d] bg-blue-50'
              : 'border-l-transparent hover:border-l-gray-300'}
          `}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {contract.originalName}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {formatDate(contract.createdAt)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {contract.analysis && (
                <RiskBadge level={contract.analysis.overallRiskLevel} size="sm" />
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(contract.id);
                }}
                className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Delete contract"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          {contract.analysis && (
            <p className="text-xs text-gray-400 mt-1">
              {contract.analysis.clauseCount} clause{contract.analysis.clauseCount !== 1 ? 's' : ''} detected
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
