"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Upload, Sparkles, FileAudio, Trash2 } from "lucide-react"

const AUTO_EDIT_PRESETS = [
  { id: "voice-first", label: "Voix prioritaire", description: "Optimise la clarté vocale" },
  { id: "music-bed", label: "Lit musical", description: "Équilibre voix et musique" },
  { id: "interview", label: "Interview", description: "Multi-pistes avec transitions" },
]

interface PodcastIAInterfaceProps {
  isOpen: boolean
  onClose: () => void
}

export function PodcastIAInterface({ isOpen, onClose }: PodcastIAInterfaceProps) {
  // Panel state following panelStateExample
  const [builder, setBuilder] = useState({
    title: "",
    tracks: [] as Array<{ id: string; name: string; duration: number }>,
    guests: [] as string[],
  })
  const [autoedit, setAutoedit] = useState({
    noiseReduction: true,
    normalize: true,
    fillersRemoval: true,
  })
  const [shownotes, setShownotes] = useState<string | null>(null)
  const [selectedPreset, setSelectedPreset] = useState("voice-first")
  const [isProcessing, setIsProcessing] = useState(false)

  if (!isOpen) return null

  const handleTrackUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newTracks = files.map((file, idx) => ({
      id: `track-${Date.now()}-${idx}`,
      name: file.name,
      duration: Math.random() * 3600 + 600, // Mock duration
    }))
    setBuilder((prev) => ({
      ...prev,
      tracks: [...prev.tracks, ...newTracks],
    }))
    // Emit event: podcast.builder.update
    console.log("[v0] podcast.builder.update", { tracks: newTracks })
  }

  const handleAutoEdit = () => {
    setIsProcessing(true)
    // Emit event: podcast.autoedit.request
    console.log("[v0] podcast.autoedit.request", { preset: selectedPreset, options: autoedit })
    setTimeout(() => setIsProcessing(false), 3000)
  }

  const handleGenerateShownotes = () => {
    // Emit event: podcast.shownotes.generate
    console.log("[v0] podcast.shownotes.generate")
    setShownotes("Notes générées automatiquement...")
  }

  const removeTrack = (id: string) => {
    setBuilder((prev) => ({
      ...prev,
      tracks: prev.tracks.filter((t) => t.id !== id),
    }))
  }

  return (
    <div className="fixed inset-0 z-[110] bg-black/50 backdrop-blur-sm">
      <div className="fixed right-0 top-0 h-full w-[600px] bg-background border-l border-border shadow-2xl overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background border-b border-border p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold">Podcast IA</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* EpisodeBuilder */}
          <Card id="podcast-builder">
            <CardHeader>
              <CardTitle className="text-sm">Constructeur d'épisode</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs">Titre de l'épisode</Label>
                <Input
                  value={builder.title}
                  onChange={(e) => setBuilder((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Mon épisode de podcast..."
                  className="mt-2"
                  aria-label="Titre de l'épisode"
                />
              </div>

              <div>
                <Label className="text-xs">Pistes audio</Label>
                <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer hover:border-primary transition-colors mt-2">
                  <Upload className="w-6 h-6 mb-2 text-muted-foreground" />
                  <span className="text-sm font-medium">Télécharger des pistes</span>
                  <span className="text-xs text-muted-foreground">MP3, WAV, OGG</span>
                  <input
                    type="file"
                    accept="audio/*"
                    multiple
                    onChange={handleTrackUpload}
                    className="hidden"
                    aria-label="Télécharger des pistes audio"
                  />
                </label>

                {builder.tracks.length > 0 && (
                  <div className="space-y-2 mt-3">
                    {builder.tracks.map((track) => (
                      <div
                        key={track.id}
                        className="flex items-center justify-between p-2 rounded-lg border border-border"
                      >
                        <div className="flex items-center gap-2 flex-1">
                          <FileAudio className="w-4 h-4 text-muted-foreground" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{track.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {Math.floor(track.duration / 60)}:
                              {String(Math.floor(track.duration % 60)).padStart(2, "0")}
                            </p>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => removeTrack(track.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex items-center justify-between p-2 bg-secondary/20 rounded-lg">
                      <span className="text-sm font-medium">{builder.tracks.length} piste(s)</span>
                      <Badge variant="secondary">
                        Total: {Math.floor(builder.tracks.reduce((sum, t) => sum + t.duration, 0) / 60).toFixed(0)} min
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* AutoEditOptions */}
          <Card id="podcast-autoedit">
            <CardHeader>
              <CardTitle className="text-sm">Montage automatique</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs">Preset de mixage</Label>
                <div className="grid gap-2 mt-2">
                  {AUTO_EDIT_PRESETS.map((preset) => (
                    <div
                      key={preset.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedPreset === preset.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedPreset(preset.id)}
                    >
                      <p className="text-sm font-medium">{preset.label}</p>
                      <p className="text-xs text-muted-foreground">{preset.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="noise-reduction"
                    checked={autoedit.noiseReduction}
                    onChange={(e) => setAutoedit((prev) => ({ ...prev, noiseReduction: e.target.checked }))}
                    className="rounded"
                  />
                  <Label htmlFor="noise-reduction" className="text-xs cursor-pointer">
                    Réduction de bruit
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="normalize"
                    checked={autoedit.normalize}
                    onChange={(e) => setAutoedit((prev) => ({ ...prev, normalize: e.target.checked }))}
                    className="rounded"
                  />
                  <Label htmlFor="normalize" className="text-xs cursor-pointer">
                    Normalisation audio
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="fillers-removal"
                    checked={autoedit.fillersRemoval}
                    onChange={(e) => setAutoedit((prev) => ({ ...prev, fillersRemoval: e.target.checked }))}
                    className="rounded"
                  />
                  <Label htmlFor="fillers-removal" className="text-xs cursor-pointer">
                    Suppression des mots de remplissage
                  </Label>
                </div>
              </div>

              <Button
                onClick={handleAutoEdit}
                disabled={builder.tracks.length === 0 || isProcessing}
                className="w-full"
              >
                {isProcessing ? "Traitement..." : "Lancer le montage auto"}
              </Button>
            </CardContent>
          </Card>

          {/* ShowNotesGenerator */}
          <Card id="podcast-shownotes">
            <CardHeader>
              <CardTitle className="text-sm">Notes de l'émission</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={handleGenerateShownotes} variant="secondary" className="w-full">
                <Sparkles className="w-4 h-4 mr-2" />
                Générer les notes automatiquement
              </Button>
              {shownotes && (
                <div className="p-3 bg-secondary/20 rounded-lg">
                  <p className="text-xs text-muted-foreground">{shownotes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
