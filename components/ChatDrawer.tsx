"use client";

import React from 'react';
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ChatSidebar } from './ChatSidebar';
import { ChatWindow } from './ChatWindow';

interface ChatDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChatDrawer({ open, onOpenChange }: ChatDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full md:w-[80vw] lg:w-[70vw] p-0 flex flex-col sm:max-w-none h-full">
        <div className="flex sm:grid sm:grid-cols-[300px_1fr] h-full flex-col">
          <ChatSidebar />
          <ChatWindow />
        </div>
      </SheetContent>
    </Sheet>
  );
}
