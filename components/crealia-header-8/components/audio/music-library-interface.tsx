"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectItem } from "@/components/ui/native-select"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, Download, Sparkles, Search } from "lucide-react"

const MOODS = ["happy", "sad", "energetic", "calm", "dramatic", "mysterious"]
const INSTRUMENTS = ["piano", "guitar", "drums", "synth", "strings", "bass"]

const SAMPLE_MUSIC = [
  { id: "m1", name: "Upbeat Corporate", mood: "happy", bpm: 120, length: 180, license: "free" },
  { id: "m2", name: "Calm Piano", mood: "calm", bpm: 80, length: 240, license: "premium" },
  { id: "m3", name: "Epic Cinematic", mood: "dramatic", bpm: 140, length: 200, license: "free" },
]

interface MusicLibraryInterfaceProps {
  isOpen: boolean
  onClose: () => void
}

export function MusicLibraryInterface({ isOpen, onClose }: MusicLibraryInterfaceProps) {
  // Panel state following panelStateExample
  const [library, setLibrary] = useState(SAMPLE_MUSIC)
  const [searchQuery, setSearchQuery] = useState("")
  const [generator, setGenerator] = useState({
    mood: "happy",
    bpm: 120,
    lengthSec: 30,
    instruments: ["piano"],
  })
  const [beatGrid, setBeatGrid] = useState(true)
  const [preview, setPreview] = useState<{ id: string; isPlaying: boolean } | null>(null)

  if (!isOpen) return null

  const handleSearch = () => {
    // Emit event: music.search.query
    console.log("[v0] music.search.query", { query: searchQuery })
  }

  const handleGenerate = () => {
    // Emit event: music.generate.request
    console.log("[v0] music.generate.request", generator)
  }

  const togglePreview = (id: string) => {
    if (preview?.id === id && preview.isPlaying) {
      setPreview({ id, isPlaying: false })
    } else {
      setPreview({ id, isPlaying: true })
    }
  }

  return (
    <div className="fixed inset-0 z-[110] bg-black/50 backdrop-blur-sm">
      <div className="fixed left-0 top-0 h-full w-[480px] bg-background border-r border-border shadow-2xl overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background border-b border-border p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold">Musique de fond</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* MusicSearch */}
          <Card id="music-search">
            <CardHeader>
              <CardTitle className="text-sm">Bibliothèque musicale</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher par mood, BPM, durée..."
                  className="flex-1"
                  aria-label="Recherche de musique"
                />
                <Button onClick={handleSearch} size="sm">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2 max-h-[250px] overflow-y-auto">
                {library.map((music) => (
                  <div
                    key={music.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium">{music.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {music.mood}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{music.bpm} BPM</span>
                        <span className="text-xs text-muted-foreground">{music.length}s</span>
                        <Badge variant={music.license === "free" ? "secondary" : "default"} className="text-xs">
                          {music.license}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => togglePreview(music.id)}>
                        {preview?.id === music.id && preview.isPlaying ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* MusicGenerator */}
          <Card id="music-generator">
            <CardHeader>
              <CardTitle className="text-sm">Générateur IA</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs">Ambiance</Label>
                <NativeSelect
                  value={generator.mood}
                  onChange={(e) => setGenerator((prev) => ({ ...prev, mood: e.target.value }))}
                >
                  {MOODS.map((mood) => (
                    <NativeSelectItem key={mood} value={mood}>
                      {mood}
                    </NativeSelectItem>
                  ))}
                </NativeSelect>
              </div>
              <div>
                <Label className="text-xs">BPM: {generator.bpm}</Label>
                <Slider
                  value={[generator.bpm]}
                  onValueChange={([value]) => setGenerator((prev) => ({ ...prev, bpm: value }))}
                  min={60}
                  max={180}
                  step={5}
                  className="mt-2"
                  aria-label="Tempo en BPM"
                />
              </div>
              <div>
                <Label className="text-xs">Durée (secondes): {generator.lengthSec}</Label>
                <Slider
                  value={[generator.lengthSec]}
                  onValueChange={([value]) => setGenerator((prev) => ({ ...prev, lengthSec: value }))}
                  min={10}
                  max={300}
                  step={10}
                  className="mt-2"
                  aria-label="Durée de la musique"
                />
              </div>
              <div>
                <Label className="text-xs">Instruments</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {INSTRUMENTS.map((inst) => (
                    <Badge
                      key={inst}
                      variant={generator.instruments.includes(inst) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        setGenerator((prev) => ({
                          ...prev,
                          instruments: prev.instruments.includes(inst)
                            ? prev.instruments.filter((i) => i !== inst)
                            : [...prev.instruments, inst],
                        }))
                      }}
                    >
                      {inst}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button onClick={handleGenerate} className="w-full">
                <Sparkles className="w-4 h-4 mr-2" />
                Générer la musique
              </Button>
            </CardContent>
          </Card>

          {/* BeatGridToggle */}
          <Card id="music-beat-grid">
            <CardHeader>
              <CardTitle className="text-sm">Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm">Grille de battement</Label>
                  <p className="text-xs text-muted-foreground">Afficher la grille rythmique</p>
                </div>
                <Button
                  variant={beatGrid ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setBeatGrid(!beatGrid)
                    console.log("[v0] music.beatGrid.toggle", { enabled: !beatGrid })
                  }}
                >
                  {beatGrid ? "Activé" : "Désactivé"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
