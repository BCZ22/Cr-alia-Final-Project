"use client";

import React from "react";

interface ComingSoonProps {
  title?: string;
  subtitle?: string;
}

export default function ComingSoon({
  title = "Coming Soon",
  subtitle = "Cette section sera bientôt disponible.",
}: ComingSoonProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="text-center max-w-2xl mx-auto space-y-6">
        <div className="text-6xl mb-4 animate-pulse">🚧</div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {title}
        </h1>
        <p className="text-lg text-muted-foreground">{subtitle}</p>
        <div className="pt-8">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 border border-primary/20 rounded-full">
            <svg
              className="w-5 h-5 text-primary animate-spin"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span className="text-sm font-medium text-primary">En développement</span>
          </div>
        </div>
      </div>
    </div>
  );
}

