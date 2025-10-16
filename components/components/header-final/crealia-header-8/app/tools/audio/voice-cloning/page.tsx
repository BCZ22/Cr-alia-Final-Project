"use client"

import { AppLayout } from "@/components/app-layout"
import { VoiceCloningInterface } from "@/components/audio/voice-cloning-interface"

export default function VoiceCloningPage() {
  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Clonage de Voix</h1>
          <p className="text-muted-foreground">Clonez n'importe quelle voix et générez du contenu audio personnalisé</p>
        </div>
        <VoiceCloningInterface />
      </div>
    </AppLayout>
  )
}
