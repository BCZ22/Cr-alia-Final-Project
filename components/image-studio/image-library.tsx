"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Trash2, Eye } from "lucide-react"

interface ImageItem {
  id: string
  url: string
  prompt?: string
  createdAt: Date
}

export default function ImageLibrary() {
  const images: ImageItem[] = []

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Bibliothèque d'images</h3>
      {images.length > 0 ? (
        <div className="grid grid-cols-2 gap-2">
          {images.map((img) => (
            <div key={img.id} className="relative group">
              <img
                src={img.url || "/placeholder.svg"}
                alt={img.prompt || "Generated"}
                className="w-full rounded border"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button size="sm" variant="secondary">
                  <Eye className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="secondary">
                  <Download className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="destructive">
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-8">Aucune image générée</p>
      )}
    </Card>
  )
}
