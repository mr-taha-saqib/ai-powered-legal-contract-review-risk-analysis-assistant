'use client';

import { useState, useCallback } from 'react';
import { ChatMessageData, ChatResponse } from '@/types';

interface UseChatReturn {
  messages: ChatMessageData[];
  isSending: boolean;
  error: string | null;
  sendMessage: (message: string, clauseContext?: string) => Promise<void>;
  setMessages: (messages: ChatMessageData[]) => void;
  clearError: () => void;
}

export function useChat(contractId: string | undefined): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (message: string, clauseContext?: string) => {
    if (!contractId || !message.trim()) return;

    setIsSending(true);
    setError(null);

    // Optimistically add user message
    const optimisticUserMessage: ChatMessageData = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: message.trim(),
      clauseContext,
      createdAt: new Date().toISOString(),
    };

    setMessages(prev => [...prev, optimisticUserMessage]);

    try {
      const response = await fetch(`/api/contracts/${contractId}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message.trim(),
          clauseContext,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      const data: { userMessage: ChatMessageData; message: ChatMessageData } = await response.json();

      // Replace optimistic message with real one and add assistant response
      setMessages(prev => {
        // Remove the optimistic message
        const filtered = prev.filter(m => m.id !== optimisticUserMessage.id);
        // Add real user message and assistant response
        return [...filtered, data.userMessage, data.message];
      });
    } catch (err) {
      // Remove optimistic message on error
      setMessages(prev => prev.filter(m => m.id !== optimisticUserMessage.id));
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setIsSending(false);
    }
  }, [contractId]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    messages,
    isSending,
    error,
    sendMessage,
    setMessages,
    clearError,
  };
}

export default useChat;
