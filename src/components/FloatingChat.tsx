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
      {/* Chat Button */}
      <button
        onClick={onToggle}
        className={`
          fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg
          flex items-center justify-center transition-all z-40
          ${isOpen
            ? 'bg-gray-600 hover:bg-gray-700'
            : 'bg-[#1a365d] hover:bg-[#2d4a6f]'}
        `}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 w-[380px] h-[500px] bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col z-40 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-[#1a365d] text-white px-4 py-3 flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Contract Q&A</h3>
              {initialClauseContext && (
                <p className="text-xs text-white/70 mt-0.5">
                  Asking about: {initialClauseContext} clause
                </p>
              )}
            </div>
            <button
              onClick={onToggle}
              className="p-1 hover:bg-white/10 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {!contractId ? (
              <div className="text-center text-gray-500 py-8">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">Upload a contract to start chatting</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 text-center">
                  Ask me anything about this contract!
                </p>
                <div className="space-y-2">
                  <p className="text-xs text-gray-400 font-medium uppercase">
                    Suggested questions
                  </p>
                  {SUGGESTED_QUESTIONS.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestedQuestion(question)}
                      disabled={isSending}
                      className="w-full text-left text-sm p-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-700 transition-colors disabled:opacity-50"
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
                  <div className="flex items-center gap-2 text-gray-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Disclaimer */}
          <div className="px-4 py-2 border-t border-gray-100">
            <DisclaimerBanner compact />
          </div>

          {/* Input Area */}
          <form
            onSubmit={handleSubmit}
            className="p-3 border-t border-gray-200 flex gap-2"
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={contractId ? "Ask a question..." : "Upload a contract first"}
              disabled={!contractId || isSending}
              maxLength={1000}
              rows={1}
              className="flex-1 resize-none border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400"
            />
            <button
              type="submit"
              disabled={!input.trim() || isSending || !contractId}
              className="p-2 bg-[#1a365d] text-white rounded-lg hover:bg-[#2d4a6f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
