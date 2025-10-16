"use client"

import { AppLayout } from "@/components/app-layout"
import { CustomLogosInterface } from "@/components/image/custom-logos-interface"

export default function CustomLogosPage() {
  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Logos Personnalisés</h1>
          <p className="text-muted-foreground">Créez des logos professionnels uniques pour votre marque avec l'IA</p>
        </div>
        <CustomLogosInterface />
      </div>
    </AppLayout>
  )
}
