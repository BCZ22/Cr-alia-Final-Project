"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { NativeSelect, NativeSelectItem } from "@/components/ui/native-select"
import { Slider } from "@/components/ui/slider"
import { Upload, Music, Play, Pause, Download } from "lucide-react"

const MUSIC_GENRES = [
  "Cinématique",
  "Corporate",
  "Électronique",
  "Acoustique",
  "Hip-Hop",
  "Jazz",
  "Rock",
  "Ambient",
  "Classique",
  "Pop",
]

const MUSIC_MOODS = ["Énergique", "Calme", "Inspirant", "Dramatique", "Joyeux", "Mélancolique", "Mystérieux", "Épique"]

export function BackgroundMusicInterface() {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [genre, setGenre] = useState("corporate")
  const [mood, setMood] = useState("inspirant")
  const [duration, setDuration] = useState([30])
  const [volume, setVolume] = useState([70])
  const [processing, setProcessing] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("video/")) {
      setVideoFile(file)
    }
  }

  const handleGenerate = async () => {
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
        <h2 className="text-xl font-semibold mb-4">Paramètres Musicaux</h2>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Genre Musical</Label>
            <NativeSelect value={genre} onChange={(e) => setGenre(e.target.value)}>
              {MUSIC_GENRES.map((g) => (
                <NativeSelectItem key={g} value={g.toLowerCase()}>
                  {g}
                </NativeSelectItem>
              ))}
            </NativeSelect>
          </div>

          <div className="space-y-2">
            <Label>Ambiance</Label>
            <NativeSelect value={mood} onChange={(e) => setMood(e.target.value)}>
              {MUSIC_MOODS.map((m) => (
                <NativeSelectItem key={m} value={m.toLowerCase()}>
                  {m}
                </NativeSelectItem>
              ))}
            </NativeSelect>
          </div>

          <div className="space-y-2">
            <Label>Durée (secondes): {duration[0]}s</Label>
            <Slider value={duration} onValueChange={setDuration} min={10} max={300} step={5} />
          </div>

          <div className="space-y-2">
            <Label>Volume: {volume[0]}%</Label>
            <Slider value={volume} onValueChange={setVolume} min={0} max={100} step={5} />
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Music className="w-5 h-5 text-primary" />
              <span className="font-medium">Aperçu Musical</span>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <div className="flex-1 h-2 bg-background rounded-full overflow-hidden">
                <div className="h-full bg-primary w-1/3" />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button className="flex-1" onClick={handleGenerate} disabled={!videoFile || processing}>
              {processing ? "Génération..." : "Générer Musique"}
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
