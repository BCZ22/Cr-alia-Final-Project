"use client"

import { AppLayout } from "@/components/app-layout"
import { CoverImagesInterface } from "@/components/image/cover-images-interface"

export default function CoverImagesPage() {
  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Images de Couverture</h1>
          <p className="text-muted-foreground">
            Créez des images de couverture professionnelles pour tous vos réseaux sociaux
          </p>
        </div>
        <CoverImagesInterface />
      </div>
    </AppLayout>
  )
}
