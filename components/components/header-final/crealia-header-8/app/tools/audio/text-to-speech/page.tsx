"use client"

import { AppLayout } from "@/components/app-layout"
import { TextToSpeechInterface } from "@/components/text-to-speech-interface"

export default function TextToSpeechPage() {
  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Synthèse Vocale</h1>
          <p className="text-muted-foreground">Convertissez du texte en parole naturelle avec des voix IA réalistes</p>
        </div>
        <TextToSpeechInterface />
      </div>
    </AppLayout>
  )
}
