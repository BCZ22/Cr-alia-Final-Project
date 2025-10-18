"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, Sparkles, Search } from "lucide-react"

const SFX_CATEGORIES = ["Ambiance", "UI", "Nature", "Musique", "Voix", "Effets"]

const SAMPLE_SFX = [
  { id: "sfx1", name: "Whoosh doux", category: "UI", duration: 200, bpm: null },
  { id: "sfx2", name: "Clic moderne", category: "UI", duration: 100, bpm: null },
  { id: "sfx3", name: "Pluie légère", category: "Nature", duration: 5000, bpm: null },
  { id: "sfx4", name: "Vent fort", category: "Nature", duration: 3000, bpm: null },
]

interface SFXInterfaceProps {
  isOpen: boolean
  onClose: () => void
}

export function SFXInterface({ isOpen, onClose }: SFXInterfaceProps) {
  // Panel state following panelStateExample
  const [searchResults, setSearchResults] = useState(SAMPLE_SFX)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [generator, setGenerator] = useState({
    prompt: "soft whoosh, 200ms",
    lengthMs: 200,
  })
  const [preview, setPreview] = useState<{ id: string; isPlaying: boolean } | null>(null)
  const [clipParams, setClipParams] = useState({
    fadeInMs: 10,
    fadeOutMs: 10,
    reverse: false,
    pitchShiftSemis: 0,
    reverb: "none",
  })

  if (!isOpen) return null

  const handleSearch = () => {
    // Emit event: sfx.search.query
    console.log("[v0] sfx.search.query", {
      query: searchQuery,
      filters: { category: selectedCategory },
    })
    // Filter results
    const filtered = SAMPLE_SFX.filter((sfx) => {
      const matchesQuery = sfx.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = !selectedCategory || sfx.category === selectedCategory
      return matchesQuery && matchesCategory
    })
    setSearchResults(filtered)
  }

  const handleGenerate = () => {
    // Emit event: sfx.generate.request
    console.log("[v0] sfx.generate.request", {
      prompt: generator.prompt,
      lengthMs: generator.lengthMs,
    })
  }

  const togglePreview = (id: string) => {
    if (preview?.id === id && preview.isPlaying) {
      setPreview({ id, isPlaying: false })
      console.log("[v0] sfx.preview.stop")
    } else {
      setPreview({ id, isPlaying: true })
      console.log("[v0] sfx.preview.play", { id })
    }
  }

  return (
    <div className="fixed inset-0 z-[110] bg-black/50 backdrop-blur-sm">
      <div className="fixed left-0 top-0 h-full w-[460px] bg-background border-r border-border shadow-2xl overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background border-b border-border p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold">Effets sonores (SFX)</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              id="sfx-generate-btn"
              onClick={handleGenerate}
              disabled={!generator.prompt.trim()}
              className="flex-1"
              aria-label="Générer un effet sonore"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Générer
            </Button>
            <Button id="sfx-import-btn" variant="secondary" aria-label="Importer un effet">
              Importer
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* SfxSearch */}
          <Card id="sfx-search">
            <CardHeader>
              <CardTitle className="text-sm">Rechercher des effets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher par nom, tag..."
                  className="flex-1"
                  aria-label="Recherche d'effets sonores"
                />
                <Button onClick={handleSearch} size="sm">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {SFX_CATEGORIES.map((cat) => (
                  <Badge
                    key={cat}
                    variant={selectedCategory === cat ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedCategory(selectedCategory === cat ? null : cat)
                      handleSearch()
                    }}
                  >
                    {cat}
                  </Badge>
                ))}
              </div>
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {searchResults.map((sfx) => (
                  <div
                    key={sfx.id}
                    className="flex items-center justify-between p-2 rounded-lg border border-border hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium">{sfx.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {sfx.category} • {sfx.duration}ms
                      </p>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => togglePreview(sfx.id)}>
                      {preview?.id === sfx.id && preview.isPlaying ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* SfxGenerator */}
          <Card id="sfx-generator">
            <CardHeader>
              <CardTitle className="text-sm">Générateur IA</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs">Prompt</Label>
                <Textarea
                  value={generator.prompt}
                  onChange={(e) => setGenerator((prev) => ({ ...prev, prompt: e.target.value }))}
                  placeholder="Décrivez l'effet sonore souhaité..."
                  className="mt-2 min-h-[80px]"
                  aria-label="Prompt pour générer un effet sonore"
                />
              </div>
              <div>
                <Label className="text-xs">Durée (ms)</Label>
                <Input
                  type="number"
                  value={generator.lengthMs}
                  onChange={(e) =>
                    setGenerator((prev) => ({ ...prev, lengthMs: Number.parseInt(e.target.value) || 200 }))
                  }
                  min={50}
                  max={10000}
                  className="mt-2"
                  aria-label="Durée de l'effet en millisecondes"
                />
              </div>
            </CardContent>
          </Card>

          {/* PreviewWaveform */}
          <Card id="sfx-preview-waveform">
            <CardHeader>
              <CardTitle className="text-sm">Prévisualisation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-secondary/20 rounded-lg p-4 h-24 flex items-center justify-center">
                {preview?.isPlaying ? (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    <span className="text-sm">Lecture en cours...</span>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Sélectionnez un effet pour prévisualiser</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* ClipParams */}
          <Card id="sfx-clip-params">
            <CardHeader>
              <CardTitle className="text-sm">Paramètres du clip</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs">Fade In (ms): {clipParams.fadeInMs}</Label>
                <Slider
                  value={[clipParams.fadeInMs]}
                  onValueChange={([value]) => {
                    setClipParams((prev) => ({ ...prev, fadeInMs: value }))
                    console.log("[v0] sfx.params.change", { params: { ...clipParams, fadeInMs: value } })
                  }}
                  min={0}
                  max={5000}
                  step={10}
                  className="mt-2"
                  aria-label="Durée du fade in"
                />
              </div>
              <div>
                <Label className="text-xs">Fade Out (ms): {clipParams.fadeOutMs}</Label>
                <Slider
                  value={[clipParams.fadeOutMs]}
                  onValueChange={([value]) => {
                    setClipParams((prev) => ({ ...prev, fadeOutMs: value }))
                    console.log("[v0] sfx.params.change", { params: { ...clipParams, fadeOutMs: value } })
                  }}
                  min={0}
                  max={5000}
                  step={10}
                  className="mt-2"
                  aria-label="Durée du fade out"
                />
              </div>
              <div>
                <Label className="text-xs">Pitch Shift (demi-tons): {clipParams.pitchShiftSemis}</Label>
                <Slider
                  value={[clipParams.pitchShiftSemis]}
                  onValueChange={([value]) => {
                    setClipParams((prev) => ({ ...prev, pitchShiftSemis: value }))
                    console.log("[v0] sfx.params.change", { params: { ...clipParams, pitchShiftSemis: value } })
                  }}
                  min={-12}
                  max={12}
                  step={1}
                  className="mt-2"
                  aria-label="Décalage de hauteur"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="reverse-audio"
                  checked={clipParams.reverse}
                  onChange={(e) => {
                    setClipParams((prev) => ({ ...prev, reverse: e.target.checked }))
                    console.log("[v0] sfx.params.change", { params: { ...clipParams, reverse: e.target.checked } })
                  }}
                  className="rounded"
                />
                <Label htmlFor="reverse-audio" className="text-xs cursor-pointer">
                  Inverser l'audio
                </Label>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
