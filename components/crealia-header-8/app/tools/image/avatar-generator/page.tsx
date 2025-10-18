"use client"

import { AppLayout } from "@/components/app-layout"
import { AiAvatarCreatorInterface } from "@/components/ai-avatar-creator-interface"

export default function AvatarGeneratorPage() {
  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Générateur d'Avatars</h1>
          <p className="text-muted-foreground">
            Créez des avatars personnalisés et uniques avec l'intelligence artificielle
          </p>
        </div>
        <AiAvatarCreatorInterface />
      </div>
    </AppLayout>
  )
}
