"use client"

import { AppLayout } from "@/components/app-layout"
import { VoiceChangerInterface } from "@/components/voice-changer-interface"

export default function VoiceChangerPage() {
  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Modificateur de Voix</h1>
          <p className="text-muted-foreground">Transformez votre voix avec des effets et filtres professionnels</p>
        </div>
        <VoiceChangerInterface />
      </div>
    </AppLayout>
  )
}
