'use client';

import { useState, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';
import { ThemeProvider } from '@/contexts/ThemeContext';
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
      <ThemeProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <DisclaimerModal onAcknowledge={() => setIsDisclaimerAcknowledged(true)} />
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
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
          <aside className="w-full md:w-[350px] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-5 flex flex-col gap-6 overflow-y-auto">
            <div>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Upload Contract
              </h2>
              <UploadZone
                onUpload={handleUpload}
                isUploading={isUploading}
                uploadProgress={uploadProgress}
              />
            </div>

            <div className="flex-1 min-h-0">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                History
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
          <main className="flex-1 p-6 overflow-y-auto">
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
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                  <FileText className="w-10 h-10 text-gray-300 dark:text-gray-500" />
                </div>
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  No Contract Selected
                </h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-md">
                  Upload a contract or select one from your history to view the analysis.
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
    </ThemeProvider>
  );
}
