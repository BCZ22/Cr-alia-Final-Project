"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { NativeSelect, NativeSelectItem } from "@/components/ui/native-select"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, RotateCcw } from "lucide-react"
import { CustomSelect } from "@/components/ui/custom-select"

const VOICES = [
  { id: "voice_default", name: "Voix par défaut", language: "fr-FR", gender: "neutral" },
  { id: "voice_male_1", name: "Homme 1", language: "fr-FR", gender: "male" },
  { id: "voice_female_1", name: "Femme 1", language: "fr-FR", gender: "female" },
  { id: "voice_male_2", name: "Homme 2 (Profond)", language: "fr-FR", gender: "male" },
  { id: "voice_female_2", name: "Femme 2 (Douce)", language: "fr-FR", gender: "female" },
]

const EXPORT_FORMATS = [
  { value: "wav", label: "WAV (Haute qualité)" },
  { value: "mp3", label: "MP3 (Compressé)" },
  { value: "ogg", label: "OGG (Web)" },
]

interface TTSInterfaceProps {
  isOpen: boolean
  onClose: () => void
}

export function TTSInterface({ isOpen, onClose }: TTSInterfaceProps) {
  // Panel state following panelStateExample
  const [script, setScript] = useState("")
  const [voiceId, setVoiceId] = useState("voice_default")
  const [prosody, setProsody] = useState({
    speed: 1,
    pitch: 0,
    emphasis: 0,
    pauseInsertion: false,
  })
  const [variants, setVariants] = useState(1)
  const [preview, setPreview] = useState({
    stream: false,
    currentTime: 0,
    isPlaying: false,
  })
  const [exportOptions, setExportOptions] = useState({
    format: "wav",
    sampleRate: 48000,
    generateSrt: true,
  })

  const [isGenerating, setIsGenerating] = useState(false)

  if (!isOpen) return null

  const handleSynthesize = () => {
    if (!script.trim()) return
    setIsGenerating(true)
    // Emit event: tts.synthesize.request
    console.log("[v0] tts.synthesize.request", {
      script,
      voiceId,
      prosody,
      variants,
      exportOptions,
    })
    setTimeout(() => setIsGenerating(false), 2000)
  }

  const handlePreview = () => {
    setPreview((prev) => ({ ...prev, isPlaying: !prev.isPlaying }))
    // Emit event: tts.preview.play or tts.preview.stop
    console.log(`[v0] tts.preview.${preview.isPlaying ? "stop" : "play"}`)
  }

  const handleReset = () => {
    setScript("")
    setVoiceId("voice_default")
    setProsody({ speed: 1, pitch: 0, emphasis: 0, pauseInsertion: false })
    setVariants(1)
    setExportOptions({ format: "wav", sampleRate: 48000, generateSrt: true })
    // Emit event: tts.reset
    console.log("[v0] tts.reset")
  }

  return (
    <div className="fixed inset-0 z-[110] bg-black/50 backdrop-blur-sm">
      <div className="fixed right-0 top-0 h-full w-[520px] bg-background border-l border-border shadow-2xl overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background border-b border-border p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold">Voix Off IA (TTS)</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              id="tts-synthesize-btn"
              onClick={handleSynthesize}
              disabled={!script.trim() || isGenerating}
              className="flex-1"
              aria-label="Synthétiser la voix"
            >
              {isGenerating ? "Génération..." : "Synthétiser"}
            </Button>
            <Button id="tts-preview-btn" onClick={handlePreview} variant="secondary" aria-label="Prévisualiser">
              {preview.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button id="tts-reset-btn" onClick={handleReset} variant="outline" aria-label="Réinitialiser">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* ScriptInput */}
          <Card id="tts-script-input">
            <CardHeader>
              <CardTitle className="text-sm">Script</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={script}
                onChange={(e) => {
                  setScript(e.target.value)
                  // Emit event: tts.script.change
                  console.log("[v0] tts.script.change", { text: e.target.value })
                }}
                placeholder="Entrez votre texte ici... (max 20 000 caractères)"
                className="min-h-[200px] resize-none"
                maxLength={20000}
                aria-label="Saisie du script"
              />
              <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                <span>{script.length} / 20 000 caractères</span>
                {script.length > 0 && (
                  <Badge variant="secondary">{Math.ceil(script.length / 150)} segments estimés</Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* VoiceSelector */}
          <Card id="tts-voice-selector">
            <CardHeader>
              <CardTitle className="text-sm">Voix</CardTitle>
            </CardHeader>
            <CardContent>
              <CustomSelect
                value={voiceId}
                onValueChange={(value) => {
                  setVoiceId(value)
                  // Emit event: tts.voice.change
                  console.log("[v0] tts.voice.change", { voiceId: value })
                }}
                items={VOICES.map((voice) => ({
                  value: voice.id,
                  label: voice.name,
                  badge: voice.gender,
                }))}
              />
            </CardContent>
          </Card>

          {/* ProsodyControls */}
          <Card id="tts-prosody-controls">
            <CardHeader>
              <CardTitle className="text-sm">Prosodie</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs">Vitesse: {prosody.speed.toFixed(1)}x</Label>
                <Slider
                  value={[prosody.speed]}
                  onValueChange={([value]) => {
                    setProsody((prev) => ({ ...prev, speed: value }))
                    // Emit event: tts.prosody.change
                    console.log("[v0] tts.prosody.change", { prosody: { ...prosody, speed: value } })
                  }}
                  min={0.5}
                  max={2}
                  step={0.1}
                  className="mt-2"
                  aria-label="Contrôle de la vitesse"
                />
              </div>
              <div>
                <Label className="text-xs">
                  Hauteur: {prosody.pitch > 0 ? "+" : ""}
                  {prosody.pitch}
                </Label>
                <Slider
                  value={[prosody.pitch]}
                  onValueChange={([value]) => {
                    setProsody((prev) => ({ ...prev, pitch: value }))
                    console.log("[v0] tts.prosody.change", { prosody: { ...prosody, pitch: value } })
                  }}
                  min={-6}
                  max={6}
                  step={1}
                  className="mt-2"
                  aria-label="Contrôle de la hauteur"
                />
              </div>
              <div>
                <Label className="text-xs">Emphase: {prosody.emphasis}</Label>
                <Slider
                  value={[prosody.emphasis]}
                  onValueChange={([value]) => {
                    setProsody((prev) => ({ ...prev, emphasis: value }))
                    console.log("[v0] tts.prosody.change", { prosody: { ...prosody, emphasis: value } })
                  }}
                  min={0}
                  max={10}
                  step={1}
                  className="mt-2"
                  aria-label="Contrôle de l'emphase"
                />
              </div>
            </CardContent>
          </Card>

          {/* VariantsCount */}
          <Card id="tts-variants-count">
            <CardHeader>
              <CardTitle className="text-sm">Variantes</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                type="number"
                value={variants}
                onChange={(e) => {
                  const value = Math.max(1, Math.min(5, Number.parseInt(e.target.value) || 1))
                  setVariants(value)
                  // Emit event: tts.variants.change
                  console.log("[v0] tts.variants.change", { n: value })
                }}
                min={1}
                max={5}
                aria-label="Nombre de variantes"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Générer {variants} version{variants > 1 ? "s" : ""} avec des variations subtiles
              </p>
            </CardContent>
          </Card>

          {/* PreviewPlayer */}
          <Card id="tts-preview-player">
            <CardHeader>
              <CardTitle className="text-sm">Prévisualisation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-secondary/20 rounded-lg p-4 text-center">
                {preview.isPlaying ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                      <span className="text-sm">Lecture en cours...</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-1">
                      <div className="bg-primary h-1 rounded-full w-1/3 transition-all" />
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Cliquez sur Prévisualiser pour écouter</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* ExportOptions */}
          <Card id="tts-export-options">
            <CardHeader>
              <CardTitle className="text-sm">Options d'export</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs">Format</Label>
                <NativeSelect
                  value={exportOptions.format}
                  onChange={(e) => {
                    setExportOptions((prev) => ({ ...prev, format: e.target.value }))
                    // Emit event: tts.export.prepare
                    console.log("[v0] tts.export.prepare", { export: { ...exportOptions, format: e.target.value } })
                  }}
                >
                  {EXPORT_FORMATS.map((format) => (
                    <NativeSelectItem key={format.value} value={format.value}>
                      {format.label}
                    </NativeSelectItem>
                  ))}
                </NativeSelect>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="generate-srt"
                  checked={exportOptions.generateSrt}
                  onChange={(e) => {
                    setExportOptions((prev) => ({ ...prev, generateSrt: e.target.checked }))
                    console.log("[v0] tts.export.prepare", {
                      export: { ...exportOptions, generateSrt: e.target.checked },
                    })
                  }}
                  className="rounded"
                />
                <Label htmlFor="generate-srt" className="text-xs cursor-pointer">
                  Générer les sous-titres (SRT)
                </Label>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
