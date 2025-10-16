"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { NativeSelect, NativeSelectItem } from "@/components/ui/native-select"
import { Slider } from "@/components/ui/slider"
import { Upload, BookOpen, Play, Download } from "lucide-react"

const VOICE_STYLES = [
  "Narrateur Professionnel",
  "Documentaire",
  "Storytelling",
  "Éducatif",
  "Dramatique",
  "Conversationnel",
  "Énergique",
  "Calme",
]

const VOICE_GENDERS = ["Masculin", "Féminin", "Neutre"]

export function NarrationGeneratorInterface() {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [script, setScript] = useState("")
  const [voiceStyle, setVoiceStyle] = useState("narrateur")
  const [voiceGender, setVoiceGender] = useState("masculin")
  const [speed, setSpeed] = useState([50])
  const [processing, setProcessing] = useState(false)

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
        <h2 className="text-xl font-semibold mb-4">Vidéo et Script</h2>

        {!videoFile ? (
          <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 cursor-pointer hover:border-primary transition-colors mb-4">
            <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
            <span className="text-sm font-medium mb-1">Télécharger une vidéo (optionnel)</span>
            <span className="text-xs text-muted-foreground">MP4, MOV, AVI</span>
            <input type="file" accept="video/*" onChange={handleFileUpload} className="hidden" />
          </label>
        ) : (
          <div className="space-y-4 mb-4">
            <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
              <video src={URL.createObjectURL(videoFile)} controls className="w-full h-full rounded-lg" />
            </div>
            <Button variant="outline" size="sm" onClick={() => setVideoFile(null)} className="w-full">
              Supprimer Vidéo
            </Button>
          </div>
        )}

        <div className="space-y-2">
          <Label>Script de Narration</Label>
          <Textarea
            placeholder="Entrez votre script de narration ici..."
            value={script}
            onChange={(e) => setScript(e.target.value)}
            rows={10}
          />
          <p className="text-xs text-muted-foreground">
            {script.length} caractères • ~{Math.ceil(script.length / 150)} secondes
          </p>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Paramètres de Voix</h2>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Style de Voix</Label>
            <NativeSelect value={voiceStyle} onChange={(e) => setVoiceStyle(e.target.value)}>
              {VOICE_STYLES.map((style) => (
                <NativeSelectItem key={style} value={style.toLowerCase()}>
                  {style}
                </NativeSelectItem>
              ))}
            </NativeSelect>
          </div>

          <div className="space-y-2">
            <Label>Genre de Voix</Label>
            <NativeSelect value={voiceGender} onChange={(e) => setVoiceGender(e.target.value)}>
              {VOICE_GENDERS.map((gender) => (
                <NativeSelectItem key={gender} value={gender.toLowerCase()}>
                  {gender}
                </NativeSelectItem>
              ))}
            </NativeSelect>
          </div>

          <div className="space-y-2">
            <Label>Vitesse de Parole: {speed[0]}%</Label>
            <Slider value={speed} onValueChange={setSpeed} min={0} max={100} step={5} />
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <BookOpen className="w-5 h-5 text-primary" />
              <span className="font-medium">Aperçu Narration</span>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline">
                <Play className="w-4 h-4" />
              </Button>
              <div className="flex-1 h-2 bg-background rounded-full overflow-hidden">
                <div className="h-full bg-primary w-0" />
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <p className="text-sm font-medium mb-1">Conseils pour une meilleure narration</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Utilisez des phrases courtes et claires</li>
              <li>• Ajoutez des pauses avec "..."</li>
              <li>• Variez le ton pour plus d'engagement</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button className="flex-1" onClick={handleGenerate} disabled={!script || processing}>
              {processing ? "Génération..." : "Générer Narration"}
            </Button>
            <Button variant="outline" disabled={!script || processing}>
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
