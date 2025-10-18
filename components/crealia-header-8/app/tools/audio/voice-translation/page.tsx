"use client"

import { AppLayout } from "@/components/app-layout"
import { VoiceTranslationInterface } from "@/components/audio/voice-translation-interface"

export default function VoiceTranslationPage() {
  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Traduction Vocale</h1>
          <p className="text-muted-foreground">Traduisez automatiquement la voix de vos vidéos dans d'autres langues</p>
        </div>
        <VoiceTranslationInterface />
      </div>
    </AppLayout>
  )
}
