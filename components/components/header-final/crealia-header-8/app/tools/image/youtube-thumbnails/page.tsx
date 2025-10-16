"use client"

import { AppLayout } from "@/components/app-layout"
import { YoutubeThumbnailsInterface } from "@/components/image/youtube-thumbnails-interface"

export default function YoutubeThumbnailsPage() {
  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Miniatures YouTube</h1>
          <p className="text-muted-foreground">Créez des miniatures YouTube accrocheuses qui augmentent vos vues</p>
        </div>
        <YoutubeThumbnailsInterface />
      </div>
    </AppLayout>
  )
}
