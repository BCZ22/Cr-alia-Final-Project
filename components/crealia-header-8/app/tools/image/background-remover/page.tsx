"use client"

import { AppLayout } from "@/components/app-layout"
import { BackgroundRemoverInterface } from "@/components/background-remover-interface"

export default function BackgroundRemoverPage() {
  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Supprimer l'Arrière-plan</h1>
          <p className="text-muted-foreground">Supprimez automatiquement l'arrière-plan de vos images avec précision</p>
        </div>
        <BackgroundRemoverInterface />
      </div>
    </AppLayout>
  )
}
