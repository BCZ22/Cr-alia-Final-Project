"use client"

import { AppLayout } from "@/components/app-layout"
import { PodcastEditorInterface } from "@/components/audio/podcast-editor-interface"

export default function PodcastEditorPage() {
  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Éditeur de Podcast</h1>
          <p className="text-muted-foreground">Éditez et améliorez vos podcasts automatiquement avec l'IA</p>
        </div>
        <PodcastEditorInterface />
      </div>
    </AppLayout>
  )
}
