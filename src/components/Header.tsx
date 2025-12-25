'use client';

import { FileText, Download, MessageCircle, Sparkles } from 'lucide-react';

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
    <header className="relative bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#6366f1] text-white shadow-lg backdrop-blur-sm">
      <div className="absolute inset-0 bg-black/5"></div>
      <div className="relative h-20 flex items-center justify-between px-6 max-w-[1920px] mx-auto">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-white/20 rounded-xl blur-md"></div>
            <div className="relative bg-white/10 backdrop-blur-sm p-2.5 rounded-xl border border-white/20">
              <FileText className="w-6 h-6" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">Contract Analyzer</h1>
              <Sparkles className="w-5 h-5 text-yellow-300" />
            </div>
            {contractName && (
              <span className="text-white/70 text-sm font-medium truncate max-w-[300px] mt-0.5">
                {contractName}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {showExport && onExportPdf && (
            <button
              onClick={onExportPdf}
              className="group relative flex items-center gap-2 px-5 py-2.5 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-xl transition-all duration-300 border border-white/20 hover:border-white/30 hover:shadow-lg hover:shadow-white/10"
            >
              <Download className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span className="text-sm font-semibold">Export PDF</span>
            </button>
          )}

          {showChat && onOpenChat && (
            <button
              onClick={onOpenChat}
              className="group relative flex items-center gap-2 px-5 py-2.5 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-xl transition-all duration-300 border border-white/20 hover:border-white/30 hover:shadow-lg hover:shadow-white/10 md:hidden"
            >
              <MessageCircle className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span className="text-sm font-semibold">Chat</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
