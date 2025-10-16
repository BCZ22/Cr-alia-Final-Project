"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Upload, Search, Play, Download } from "lucide-react"

const POPULAR_SFX = [
  { name: "Whoosh", category: "Transition" },
  { name: "Click", category: "UI" },
  { name: "Pop", category: "UI" },
  { name: "Explosion", category: "Action" },
  { name: "Applaudissements", category: "Ambiance" },
  { name: "Rire", category: "Voix" },
  { name: "Notification", category: "UI" },
  { name: "Swoosh", category: "Transition" },
]

export function SoundEffectsInterface() {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedEffects, setSelectedEffects] = useState<string[]>([])
  const [processing, setProcessing] = useState(false)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("video/")) {
      setVideoFile(file)
    }
  }

  const toggleEffect = (effectName: string) => {
    setSelectedEffects((prev) =>
      prev.includes(effectName) ? prev.filter((e) => e !== effectName) : [...prev, effectName],
    )
  }

  const handleApply = async () => {
    setProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setProcessing(false)
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Télécharger Vidéo</h2>

        {!videoFile ? (
          <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 cursor-pointer hover:border-primary transition-colors">
            <Upload className="w-12 h-12 mb-4 text-muted-foreground" />
            <span className="text-sm font-medium mb-1">Cliquez pour télécharger une vidéo</span>
            <span className="text-xs text-muted-foreground">MP4, MOV, AVI jusqu'à 500MB</span>
            <input type="file" accept="video/*" onChange={handleFileUpload} className="hidden" />
          </label>
        ) : (
          <div className="space-y-4">
            <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
              <video src={URL.createObjectURL(videoFile)} controls className="w-full h-full rounded-lg" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{videoFile.name}</p>
                <p className="text-sm text-muted-foreground">{(videoFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setVideoFile(null)}>
                Supprimer
              </Button>
            </div>
          </div>
        )}
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Effets Sonores</h2>

        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher des effets sonores..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div>
            <Label className="mb-3 block">Effets Populaires</Label>
            <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
              {POPULAR_SFX.map((sfx) => (
                <Card
                  key={sfx.name}
                  className={`p-3 cursor-pointer transition-colors ${
                    selectedEffects.includes(sfx.name) ? "border-primary bg-primary/5" : "hover:border-primary/50"
                  }`}
                  onClick={() => toggleEffect(sfx.name)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{sfx.name}</span>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                      <Play className="w-3 h-3" />
                    </Button>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {sfx.category}
                  </Badge>
                </Card>
              ))}
            </div>
          </div>

          {selectedEffects.length > 0 && (
            <div className="p-4 bg-muted rounded-lg">
              <Label className="mb-2 block">Effets Sélectionnés ({selectedEffects.length})</Label>
              <div className="flex flex-wrap gap-2">
                {selectedEffects.map((effect) => (
                  <Badge key={effect} variant="default" className="cursor-pointer" onClick={() => toggleEffect(effect)}>
                    {effect} ×
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button className="flex-1" onClick={handleApply} disabled={!videoFile || processing}>
              {processing ? "Application..." : "Appliquer Effets"}
            </Button>
            <Button variant="outline" disabled={!videoFile || processing}>
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
