'use client';

import { FileText, Download, MessageCircle } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  contractName?: string;
  onExportPdf?: () => void;
  onOpenChat?: () => void;
  showExport?: boolean;
  showChat?: boolean;
}

export default function Header({
  contractName,
  onExportPdf,
  onOpenChat,
  showExport = false,
  showChat = false,
}: HeaderProps) {
  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="h-16 flex items-center justify-between px-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Contract Analyzer</h1>
            {contractName && (
              <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[300px]">
                {contractName}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {showExport && onExportPdf && (
            <button
              type="button"
              onClick={onExportPdf}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export PDF</span>
            </button>
          )}

          {showChat && onOpenChat && (
            <button
              type="button"
              onClick={onOpenChat}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors md:hidden"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
