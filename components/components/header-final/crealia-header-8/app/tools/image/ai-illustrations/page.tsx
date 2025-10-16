"use client"

import { AppLayout } from "@/components/app-layout"
import { AiIllustrationsInterface } from "@/components/image/ai-illustrations-interface"

export default function AiIllustrationsPage() {
  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Illustrations IA</h1>
          <p className="text-muted-foreground">Générez des illustrations vectorielles professionnelles avec l'IA</p>
        </div>
        <AiIllustrationsInterface />
      </div>
    </AppLayout>
  )
}
