"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useChatStore } from '@/lib/store/chat-store'; // Assuming you have a `cn` utility

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { streamingResponse } = useChatStore();
  const isUser = message.role === 'user';
  const isStreaming = streamingResponse && !isUser;

  return (
    <motion.div
      className={cn("flex items-start gap-3", isUser && "justify-end")}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
          {/* AI Avatar Icon */}
        </div>
      )}
      <div
        className={cn(
          "max-w-[70%] rounded-2xl px-4 py-3 text-sm shadow-sm",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted",
          isStreaming && "animate-pulse"
        )}
      >
        {message.content}
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
          {/* User Avatar */}
        </div>
      )}
    </motion.div>
  );
}
