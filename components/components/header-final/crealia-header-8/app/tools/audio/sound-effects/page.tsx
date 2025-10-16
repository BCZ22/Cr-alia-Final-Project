"use client"

import { AppLayout } from "@/components/app-layout"
import { SoundEffectsInterface } from "@/components/audio/sound-effects-interface"

export default function SoundEffectsPage() {
  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Effets Sonores</h1>
          <p className="text-muted-foreground">Ajoutez des effets sonores professionnels à vos vidéos</p>
        </div>
        <SoundEffectsInterface />
      </div>
    </AppLayout>
  )
}
