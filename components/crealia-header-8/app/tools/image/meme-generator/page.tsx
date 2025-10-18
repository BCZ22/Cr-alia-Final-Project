"use client"

import { AppLayout } from "@/components/app-layout"
import { MemeGeneratorInterface } from "@/components/image/meme-generator-interface"

export default function MemeGeneratorPage() {
  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Générateur de Memes</h1>
          <p className="text-muted-foreground">Créez des memes viraux rapidement et facilement</p>
        </div>
        <MemeGeneratorInterface />
      </div>
    </AppLayout>
  )
}
