"use client"

import { AppLayout } from "@/components/app-layout"
import { NarrationGeneratorInterface } from "@/components/audio/narration-generator-interface"

export default function NarrationGeneratorPage() {
  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Générateur de Narration</h1>
          <p className="text-muted-foreground">Créez des narrations professionnelles pour vos vidéos avec l'IA</p>
        </div>
        <NarrationGeneratorInterface />
      </div>
    </AppLayout>
  )
}
