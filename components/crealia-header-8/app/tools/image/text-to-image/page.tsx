"use client"

import { AppLayout } from "@/components/app-layout"
import { TextToImageInterface } from "@/components/image/text-to-image-interface"

export default function TextToImagePage() {
  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Texte en Image</h1>
          <p className="text-muted-foreground">
            Générez des images uniques à partir de descriptions textuelles avec l'IA
          </p>
        </div>
        <TextToImageInterface />
      </div>
    </AppLayout>
  )
}
