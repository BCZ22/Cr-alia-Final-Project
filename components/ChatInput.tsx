"use client";

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Mic, Send } from 'lucide-react';
import { useChatStore } from '@/lib/store/chat-store';

export function ChatInput() {
  const [inputValue, setInputValue] = useState('');
  const { addMessage, setStreamingResponse } = useChatStore();

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user' as const,
      createdAt: new Date().toISOString(),
    };
    addMessage(userMessage);
    setInputValue('');
    setStreamingResponse(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...useChatStore.getState().messages, userMessage] }),
      });

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantResponse = '';
      const assistantMessageId = (Date.now() + 1).toString();
      
      // Add a placeholder for the assistant's message
      addMessage({
        id: assistantMessageId,
        content: '...',
        role: 'assistant' as const,
        createdAt: new Date().toISOString()
      });


      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        assistantResponse += chunk;
        
        // Update the assistant's message content in the store
        const messages = useChatStore.getState().messages;
        const updatedMessages = messages.map(msg => 
            msg.id === assistantMessageId ? { ...msg, content: assistantResponse } : msg
        );
        useChatStore.setState({ messages: updatedMessages });
      }

    } catch (error) {
      console.error('Error streaming response:', error);
      // Handle error state in UI
    } finally {
      setStreamingResponse(false);
    }
  };

  return (
    <div className="relative">
      <textarea
        placeholder="Décrivez votre projet de contenu..."
        className="w-full resize-none rounded-xl border border-border bg-transparent py-3 pl-4 pr-24 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
        rows={1}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
          }
        }}
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Mic className="w-5 h-5" />
        </Button>
        <Button size="icon" onClick={handleSendMessage} disabled={!inputValue.trim()}>
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
