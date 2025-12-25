'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { ChatMessageData, SUGGESTED_QUESTIONS } from '@/types';
import ChatMessage from './ChatMessage';
import DisclaimerBanner from './DisclaimerBanner';

interface FloatingChatProps {
  isOpen: boolean;
  onToggle: () => void;
  messages: ChatMessageData[];
  onSendMessage: (message: string, clauseContext?: string) => Promise<void>;
  isSending: boolean;
  contractId?: string;
  initialClauseContext?: string;
  onClearClauseContext?: () => void;
}

export default function FloatingChat({
  isOpen,
  onToggle,
  messages,
  onSendMessage,
  isSending,
  contractId,
  initialClauseContext,
  onClearClauseContext,
}: FloatingChatProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Clear clause context when chat closes
  useEffect(() => {
    if (!isOpen && onClearClauseContext) {
      onClearClauseContext();
    }
  }, [isOpen, onClearClauseContext]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending || !contractId) return;

    const message = input.trim();
    setInput('');
    await onSendMessage(message, initialClauseContext);
  };

  const handleSuggestedQuestion = async (question: string) => {
    if (isSending || !contractId) return;
    await onSendMessage(question, initialClauseContext);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <>
      {/* Chat Button - Modern Floating */}
      <button
        type="button"
        onClick={onToggle}
        className={`
          group fixed bottom-8 right-8 w-16 h-16 rounded-2xl shadow-2xl
          flex items-center justify-center transition-all duration-300 z-40
          hover:scale-110 active:scale-95
          ${isOpen
            ? 'bg-gradient-to-br from-gray-600 to-gray-700 rotate-90'
            : 'bg-gradient-to-br from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600'}
        `}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
        {isOpen ? (
          <X className="relative w-7 h-7 text-white" />
        ) : (
          <MessageCircle className="relative w-7 h-7 text-white" />
        )}
        {!isOpen && messages.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-white">
            {messages.length > 9 ? '9+' : messages.length}
          </span>
        )}
      </button>

      {/* Chat Panel - Modern Design */}
      {isOpen && (
        <div
          className="fixed bottom-28 right-8 w-[420px] h-[600px] bg-white rounded-2xl shadow-2xl border-2 border-gray-200 flex flex-col z-40 overflow-hidden animate-slide-in"
        >
          {/* Header - Gradient */}
          <div className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 text-white px-6 py-4">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">AI Contract Assistant</h3>
                {initialClauseContext && (
                  <p className="text-xs text-white/80 mt-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-white/80 rounded-full"></span>
                    Asking about: {initialClauseContext} clause
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={onToggle}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-gray-50 to-white">
            {!contractId ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-indigo-200 rounded-full blur-xl opacity-40"></div>
                  <MessageCircle className="relative w-16 h-16 text-indigo-400" />
                </div>
                <p className="text-base font-semibold text-gray-700">No Contract Loaded</p>
                <p className="text-sm text-gray-500 mt-1">Upload a contract to start chatting</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="space-y-5">
                <div className="text-center">
                  <p className="text-base font-semibold text-gray-800 mb-1">
                    Ask me anything about your contract!
                  </p>
                  <p className="text-sm text-gray-500">
                    I can help explain clauses, assess risks, and answer questions
                  </p>
                </div>
                <div className="space-y-3">
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                    Suggested Questions
                  </p>
                  {SUGGESTED_QUESTIONS.map((question, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSuggestedQuestion(question)}
                      disabled={isSending}
                      className="w-full text-left text-sm p-4 bg-white hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 border-2 border-gray-200 hover:border-indigo-300 rounded-xl text-gray-700 transition-all disabled:opacity-50 shadow-sm hover:shadow-md font-medium"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map(message => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                {isSending && (
                  <div className="flex items-center gap-3 text-indigo-600 bg-indigo-50 p-3 rounded-xl">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm font-medium">AI is thinking...</span>
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Disclaimer */}
          <div className="px-5 py-3 border-t border-gray-200 bg-gray-50">
            <DisclaimerBanner compact />
          </div>

          {/* Input Area - Modern */}
          <form
            onSubmit={handleSubmit}
            className="p-4 border-t-2 border-gray-200 flex gap-3 bg-white"
          >
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={contractId ? "Type your question here..." : "Upload a contract first"}
                disabled={!contractId || isSending}
                maxLength={1000}
                rows={1}
                className="w-full resize-none border-2 border-gray-300 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm focus:outline-none transition-all disabled:bg-gray-100 disabled:text-gray-400 pr-12"
              />
              <span className="absolute bottom-3 right-3 text-xs text-gray-400">
                {input.length}/1000
              </span>
            </div>
            <button
              type="submit"
              disabled={!input.trim() || isSending || !contractId}
              className="p-3.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
