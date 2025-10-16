"use client"

import { AppLayout } from "@/components/app-layout"
import { ImageEnhancerInterface } from "@/components/image/image-enhancer-interface"

export default function ImageEnhancerPage() {
  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Améliorateur d'Images</h1>
          <p className="text-muted-foreground">Améliorez la qualité de vos images avec des outils d'IA avancés</p>
        </div>
        <ImageEnhancerInterface />
      </div>
    </AppLayout>
  )
}
