'use client';

import { FileText, Download, MessageCircle } from 'lucide-react';

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
    <header className="bg-[#1a365d] text-white h-16 flex items-center justify-between px-6 shadow-md">
      <div className="flex items-center gap-3">
        <FileText className="w-6 h-6" />
        <h1 className="text-xl font-bold">Contract Analyzer</h1>
        {contractName && (
          <>
            <span className="text-white/50 mx-2">|</span>
            <span className="text-white/80 text-sm truncate max-w-[300px]">
              {contractName}
            </span>
          </>
        )}
      </div>

      <div className="flex items-center gap-3">
        {showExport && onExportPdf && (
          <button
            onClick={onExportPdf}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">Export PDF</span>
          </button>
        )}

        {showChat && onOpenChat && (
          <button
            onClick={onOpenChat}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors md:hidden"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Chat</span>
          </button>
        )}
      </div>
    </header>
  );
}
