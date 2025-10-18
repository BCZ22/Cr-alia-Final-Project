"use client"

import { AppLayout } from "@/components/app-layout"
import { SocialBannersInterface } from "@/components/image/social-banners-interface"

export default function SocialBannersPage() {
  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Bannières Sociales</h1>
          <p className="text-muted-foreground">Créez des bannières optimisées pour toutes les plateformes sociales</p>
        </div>
        <SocialBannersInterface />
      </div>
    </AppLayout>
  )
}
