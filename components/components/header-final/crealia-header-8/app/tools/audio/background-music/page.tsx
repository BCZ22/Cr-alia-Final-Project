"use client"

import { AppLayout } from "@/components/app-layout"
import { BackgroundMusicInterface } from "@/components/audio/background-music-interface"

export default function BackgroundMusicPage() {
  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Musique de Fond</h1>
          <p className="text-muted-foreground">Ajoutez de la musique de fond parfaite pour vos vidéos</p>
        </div>
        <BackgroundMusicInterface />
      </div>
    </AppLayout>
  )
}
