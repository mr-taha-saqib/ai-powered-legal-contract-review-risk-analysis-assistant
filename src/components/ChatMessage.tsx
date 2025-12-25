'use client';

import { User, Bot } from 'lucide-react';
import { ChatMessageData } from '@/types';
import { formatDateTime } from '@/lib/utils';

interface ChatMessageProps {
  message: ChatMessageData;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div
        className={`
          w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
          ${isUser ? 'bg-[#1a365d]' : 'bg-gray-200'}
        `}
      >
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-gray-600" />
        )}
      </div>

      {/* Message Content */}
      <div
        className={`
          max-w-[80%] rounded-lg px-4 py-2
          ${isUser
            ? 'bg-[#1a365d] text-white'
            : 'bg-gray-100 text-gray-800'}
        `}
      >
        <div className="text-sm whitespace-pre-wrap break-words">
          {message.content}
        </div>
        <div
          className={`
            text-xs mt-1
            ${isUser ? 'text-white/60' : 'text-gray-400'}
          `}
        >
          {formatDateTime(message.createdAt)}
        </div>
      </div>
    </div>
  );
}
