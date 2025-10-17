"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { NativeSelect, NativeSelectItem } from "@/components/ui/native-select"
import { Badge } from "@/components/ui/badge"
import { Sparkles } from "lucide-react"
import { CustomSelect } from "@/components/ui/custom-select"

const NARRATION_MODES = [
  { value: "documentary", label: "Documentaire", description: "Ton informatif et posé" },
  { value: "tutorial", label: "Tutoriel", description: "Ton pédagogique et clair" },
  { value: "ad", label: "Publicité", description: "Ton dynamique et engageant" },
  { value: "marketing", label: "Marketing", description: "Ton persuasif et professionnel" },
]

interface AutoNarrationInterfaceProps {
  isOpen: boolean
  onClose: () => void
}

export function AutoNarrationInterface({ isOpen, onClose }: AutoNarrationInterfaceProps) {
  // Panel state following panelStateExample
  const [input, setInput] = useState("")
  const [mode, setMode] = useState("documentary")
  const [slideSync, setSlideSync] = useState(false)
  const [pacing, setPacing] = useState("normal")
  const [isGenerating, setIsGenerating] = useState(false)

  if (!isOpen) return null

  const handleGenerate = () => {
    if (!input.trim()) return
    setIsGenerating(true)
    // Emit event: narration.generate.request
    console.log("[v0] narration.generate.request", { input, mode, slideSync, pacing })
    setTimeout(() => setIsGenerating(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-[110] bg-black/50 backdrop-blur-sm">
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-[640px] bg-background rounded-2xl shadow-2xl border border-border overflow-hidden">
          {/* Header */}
          <div className="bg-background border-b border-border p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Narration automatique</h2>
              <Button variant="ghost" size="sm" onClick={onClose}>
                ✕
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 max-h-[600px] overflow-y-auto">
            {/* InputSource */}
            <Card id="narration-input">
              <CardHeader>
                <CardTitle className="text-sm">Contenu source</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value)
                    // Emit event: narration.input.change
                    console.log("[v0] narration.input.change", { text: e.target.value })
                  }}
                  placeholder="Collez votre texte, article ou script ici..."
                  className="min-h-[200px] resize-none"
                  aria-label="Saisie du contenu source"
                />
                <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                  <span>{input.length} caractères</span>
                  {input.length > 0 && (
                    <Badge variant="secondary">~{Math.ceil(input.length / 150)} secondes estimées</Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* NarrationMode */}
            <Card id="narration-mode">
              <CardHeader>
                <CardTitle className="text-sm">Mode de narration</CardTitle>
              </CardHeader>
              <CardContent>
                <CustomSelect
                  value={mode}
                  onValueChange={(value) => {
                    setMode(value)
                    // Emit event: narration.mode.change
                    console.log("[v0] narration.mode.change", { mode: value })
                  }}
                  items={NARRATION_MODES.map((m) => ({
                    value: m.value,
                    label: m.label,
                    description: m.description,
                  }))}
                />
              </CardContent>
            </Card>

            {/* SlideSyncToggle */}
            <Card id="narration-slide-sync">
              <CardHeader>
                <CardTitle className="text-sm">Options avancées</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm">Synchronisation des diapositives</Label>
                    <p className="text-xs text-muted-foreground">Aligner la narration avec les transitions</p>
                  </div>
                  <Button
                    variant={slideSync ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setSlideSync(!slideSync)
                      // Emit event: narration.slideSync.toggle
                      console.log("[v0] narration.slideSync.toggle", { enabled: !slideSync })
                    }}
                  >
                    {slideSync ? "Activé" : "Désactivé"}
                  </Button>
                </div>

                <div>
                  <Label className="text-xs">Rythme de narration</Label>
                  <NativeSelect value={pacing} onChange={setPacing}>
                    <NativeSelectItem value="slow">Lent (posé)</NativeSelectItem>
                    <NativeSelectItem value="normal">Normal</NativeSelectItem>
                    <NativeSelectItem value="fast">Rapide (dynamique)</NativeSelectItem>
                  </NativeSelect>
                </div>
              </CardContent>
            </Card>

            {/* Preview Info */}
            <Card>
              <CardContent className="pt-6">
                <div className="bg-secondary/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Génération automatique</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        La narration sera générée avec des pauses naturelles, une emphase appropriée et des marqueurs de
                        chapitre automatiques.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-3">
              <Button onClick={handleGenerate} disabled={!input.trim() || isGenerating} className="flex-1">
                {isGenerating ? "Génération..." : "Générer la narration"}
              </Button>
              <Button variant="outline" onClick={onClose}>
                Annuler
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
