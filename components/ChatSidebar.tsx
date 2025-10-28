"use client";

import React, { useEffect } from 'react';
import { Button } from './ui/button';
import { Plus, Search } from 'lucide-react';
import { useChatStore } from '@/lib/store/chat-store';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Menu } from 'lucide-react';

export function ChatSidebar() {
  const { conversations, fetchConversations, setCurrentConversation } = useChatStore();

  useEffect(() => {
    fetchConversations('1'); 
  }, [fetchConversations]);

  const sidebarContent = (
    <div className="bg-muted/50 border-r flex flex-col h-full p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Conversations</h2>
        <Button variant="ghost" size="icon" onClick={() => setCurrentConversation(null)}>
          <Plus className="w-5 h-5" />
        </Button>
      </div>
      <div className="relative mb-4">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search chats..."
          className="w-full pl-8 pr-2 py-1.5 rounded-md border bg-transparent text-sm"
        />
      </div>
      <div className="flex-1 overflow-y-auto">
        {conversations.length > 0 ? (
          <div className="space-y-2">
            {conversations.map((convo) => (
              <Button 
                key={convo.id} 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => setCurrentConversation(convo.id)}
              >
                {convo.title}
              </Button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center mt-8">No recent chats</p>
        )}
      </div>
      <div className="mt-auto">
        <p className="text-xs text-muted-foreground">User settings...</p>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden sm:flex sm:flex-col h-full">
        {sidebarContent}
      </div>
      <div className="sm:hidden p-2 border-b">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs p-0">
            {sidebarContent}
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
