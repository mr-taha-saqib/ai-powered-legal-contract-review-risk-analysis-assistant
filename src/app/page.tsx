'use client';

import { useState, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';
import Header from '@/components/Header';
import UploadZone from '@/components/UploadZone';
import ContractHistory from '@/components/ContractHistory';
import AnalysisResults from '@/components/AnalysisResults';
import FloatingChat from '@/components/FloatingChat';
import DisclaimerModal from '@/components/DisclaimerModal';
import { generatePdfReport } from '@/components/PdfReport';
import { useContracts } from '@/hooks/useContracts';
import { useChat } from '@/hooks/useChat';
import { FileText } from 'lucide-react';

export default function Home() {
  const [isDisclaimerAcknowledged, setIsDisclaimerAcknowledged] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [clauseContext, setClauseContext] = useState<string | undefined>(undefined);

  const {
    contracts,
    selectedContract,
    chatMessages,
    isLoading,
    isUploading,
    uploadProgress,
    error: contractError,
    selectContract,
    uploadContract,
    deleteContract,
    clearError: clearContractError,
  } = useContracts();

  const {
    messages,
    isSending,
    error: chatError,
    sendMessage,
    setMessages,
    clearError: clearChatError,
  } = useChat(selectedContract?.id);

  // Sync chat messages from contract selection
  useEffect(() => {
    setMessages(chatMessages);
  }, [chatMessages, setMessages]);

  // Show error toasts
  useEffect(() => {
    if (contractError) {
      toast.error(contractError);
      clearContractError();
    }
  }, [contractError, clearContractError]);

  useEffect(() => {
    if (chatError) {
      toast.error(chatError);
      clearChatError();
    }
  }, [chatError, clearChatError]);

  const handleUpload = useCallback(async (file: File) => {
    try {
      await uploadContract(file);
      toast.success('Contract analyzed successfully!');
    } catch {
      // Error already handled by hook
    }
  }, [uploadContract]);

  const handleDeleteContract = useCallback(async (id: string) => {
    if (!confirm('Are you sure you want to delete this contract?')) return;

    try {
      await deleteContract(id);
      toast.success('Contract deleted');
    } catch {
      // Error already handled by hook
    }
  }, [deleteContract]);

  const handleAskQuestion = useCallback((clauseType: string) => {
    setClauseContext(clauseType);
    setIsChatOpen(true);
  }, []);

  const handleClearClauseContext = useCallback(() => {
    setClauseContext(undefined);
  }, []);

  const handleExportPdf = useCallback(async () => {
    if (!selectedContract?.analysis) return;

    try {
      await generatePdfReport({
        contractName: selectedContract.originalName,
        analysisDate: selectedContract.createdAt,
        overallRiskLevel: selectedContract.analysis.overallRiskLevel,
        summary: selectedContract.analysis.summary,
        clauses: selectedContract.analysis.clauses,
      });
      toast.success('PDF exported successfully!');
    } catch (err) {
      toast.error('Failed to export PDF');
      console.error('PDF export error:', err);
    }
  }, [selectedContract]);

  const handleSendMessage = useCallback(async (message: string, context?: string) => {
    await sendMessage(message, context || clauseContext);
  }, [sendMessage, clauseContext]);

  // Don't render main content until disclaimer is acknowledged
  if (!isDisclaimerAcknowledged) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
        <DisclaimerModal onAcknowledge={() => setIsDisclaimerAcknowledged(true)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 flex flex-col">
      {/* Header */}
      <Header
        contractName={selectedContract?.originalName}
        onExportPdf={handleExportPdf}
        onOpenChat={() => setIsChatOpen(true)}
        showExport={!!selectedContract?.analysis}
        showChat={!!selectedContract}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left Panel - Upload & History */}
        <aside className="w-full md:w-[400px] bg-white/80 backdrop-blur-sm border-r-2 border-gray-200/50 p-6 flex flex-col gap-6 overflow-y-auto shadow-xl">
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></span>
              Upload Contract
            </h2>
            <UploadZone
              onUpload={handleUpload}
              isUploading={isUploading}
              uploadProgress={uploadProgress}
            />
          </div>

          <div className="flex-1 min-h-0">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></span>
              Contract History
            </h2>
            <ContractHistory
              contracts={contracts}
              selectedId={selectedContract?.id}
              onSelect={selectContract}
              onDelete={handleDeleteContract}
              isLoading={isLoading && contracts.length === 0}
            />
          </div>
        </aside>

        {/* Right Panel - Analysis Results */}
        <main className="flex-1 p-8 overflow-y-auto">
          {isLoading && selectedContract ? (
            <AnalysisResults
              clauses={[]}
              summary=""
              overallRiskLevel="low"
              onAskQuestion={handleAskQuestion}
              isLoading={true}
            />
          ) : selectedContract?.analysis ? (
            <AnalysisResults
              clauses={selectedContract.analysis.clauses}
              summary={selectedContract.analysis.summary}
              overallRiskLevel={selectedContract.analysis.overallRiskLevel}
              onAskQuestion={handleAskQuestion}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full blur-2xl opacity-40"></div>
                <div className="relative w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center shadow-lg">
                  <FileText className="w-12 h-12 text-indigo-500" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                No Contract Selected
              </h2>
              <p className="text-gray-600 max-w-md leading-relaxed">
                Upload a new contract or select one from your history to view the AI-powered risk analysis.
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Floating Chat */}
      <FloatingChat
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(!isChatOpen)}
        messages={messages}
        onSendMessage={handleSendMessage}
        isSending={isSending}
        contractId={selectedContract?.id}
        initialClauseContext={clauseContext}
        onClearClauseContext={handleClearClauseContext}
      />
    </div>
  );
}
