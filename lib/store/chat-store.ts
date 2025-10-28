"use client";

import { create } from 'zustand';

// Define types based on your Supabase schema
interface User {
  id: string;
  // ... other user properties
}

interface Message {
  id: string;
  createdAt: string;
  content: string;
  role: 'user' | 'assistant';
}

interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  userId: string;
  messages: Message[];
}

interface ChatState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  streamingResponse: boolean;
  
  fetchConversations: (userId: string) => Promise<void>;
  setCurrentConversation: (conversationId: string | null) => void;
  addMessage: (message: Message) => void;
  setStreamingResponse: (isStreaming: boolean) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  currentConversation: null,
  messages: [],
  streamingResponse: false,

  fetchConversations: async (userId) => {
    try {
      const response = await fetch('/api/conversations');
      if (!response.ok) throw new Error('Failed to fetch');
      const conversations = await response.json();
      set({ conversations });
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  },

  setCurrentConversation: (conversationId) => {
    const { conversations } = get();
    if (conversationId === null) {
      set({ currentConversation: null, messages: [] });
    } else {
      const conversation = conversations.find(c => c.id === conversationId) || null;
      // In a real app, you might fetch messages for this conversation if they aren't already loaded
      set({ currentConversation: conversation, messages: conversation?.messages || [] });
    }
  },

  addMessage: (message) => {
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },
  
  setStreamingResponse: (isStreaming) => {
    set({ streamingResponse: isStreaming });
  }
}));
