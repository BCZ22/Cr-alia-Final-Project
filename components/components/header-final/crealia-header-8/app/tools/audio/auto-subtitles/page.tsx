"use client"

import { AppLayout } from "@/components/app-layout"
import { AutoSubtitlesInterface } from "@/components/auto-subtitles-interface"

export default function AutoSubtitlesPage() {
  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Sous-titres Automatiques</h1>
          <p className="text-muted-foreground">Générez des sous-titres précis automatiquement pour vos vidéos</p>
        </div>
        <AutoSubtitlesInterface />
      </div>
    </AppLayout>
  )
}
