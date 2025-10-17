"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Mic, Play, Download } from "lucide-react"

export function VoiceCloningInterface() {
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [text, setText] = useState("")
  const [pitch, setPitch] = useState([50])
  const [speed, setSpeed] = useState([50])
  const [processing, setProcessing] = useState(false)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("audio/")) {
      setAudioFile(file)
    }
  }

  const handleClone = async () => {
    setProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 4000))
    setProcessing(false)
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Échantillon Vocal</h2>

        {!audioFile ? (
          <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 cursor-pointer hover:border-primary transition-colors">
            <Mic className="w-12 h-12 mb-4 text-muted-foreground" />
            <span className="text-sm font-medium mb-1">Télécharger un échantillon vocal</span>
            <span className="text-xs text-muted-foreground">MP3, WAV, M4A (minimum 30 secondes)</span>
            <input type="file" accept="audio/*" onChange={handleFileUpload} className="hidden" />
          </label>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <audio src={URL.createObjectURL(audioFile)} controls className="w-full" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{audioFile.name}</p>
                <p className="text-sm text-muted-foreground">{(audioFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setAudioFile(null)}>
                Supprimer
              </Button>
            </div>
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <p className="text-sm font-medium mb-1">Conseils pour un meilleur clonage</p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Utilisez un audio clair sans bruit de fond</li>
            <li>• Minimum 30 secondes d'échantillon</li>
            <li>• Parlez naturellement et clairement</li>
          </ul>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Génération de Voix</h2>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Texte à Synthétiser</Label>
            <Textarea
              placeholder="Entrez le texte que vous souhaitez générer avec la voix clonée..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={6}
            />
            <p className="text-xs text-muted-foreground">{text.length} caractères</p>
          </div>

          <div className="space-y-2">
            <Label>Hauteur de Voix: {pitch[0]}%</Label>
            <Slider value={pitch} onValueChange={setPitch} min={0} max={100} step={5} />
          </div>

          <div className="space-y-2">
            <Label>Vitesse: {speed[0]}%</Label>
            <Slider value={speed} onValueChange={setSpeed} min={0} max={100} step={5} />
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Aperçu Audio</span>
              <Button size="sm" variant="outline">
                <Play className="w-4 h-4" />
              </Button>
            </div>
            <div className="h-2 bg-background rounded-full overflow-hidden">
              <div className="h-full bg-primary w-0" />
            </div>
          </div>

          <div className="flex gap-3">
            <Button className="flex-1" onClick={handleClone} disabled={!audioFile || !text || processing}>
              {processing ? "Clonage..." : "Cloner Voix"}
            </Button>
            <Button variant="outline" disabled={!audioFile || !text || processing}>
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
