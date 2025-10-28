"use client";

import React from 'react';
import { ChatSuggestions } from './ChatSuggestions';
import { ChatInput } from './ChatInput';
import { ChatMessage } from './ChatMessage';
import { useChatStore } from '@/lib/store/chat-store';

export function ChatWindow() {
  const { messages, currentConversation } = useChatStore();

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex-1 p-6 overflow-y-auto">
        {messages.length === 0 ? (
          <ChatSuggestions />
        ) : (
          <div className="space-y-6">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
          </div>
        )}
      </div>
      <div className="p-4 border-t bg-background">
        <ChatInput />
      </div>
    </div>
  );
}
