"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 6 6 18M6 6l12 12" />
  </svg>
)

const PlayIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
)

const LayersIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m12.83 2.18 8.48 8.48a1 1 0 0 1 0 1.42l-8.48 8.48a1 1 0 0 1-1.42 0l-8.48-8.48a1 1 0 0 1 0-1.42l8.48-8.48a1 1 0 0 1 1.42 0Z"
    />
  </svg>
)

interface VisualFXInterfaceProps {
  isOpen: boolean
  onClose: () => void
}

export function VisualFXInterface({ isOpen, onClose }: VisualFXInterfaceProps) {
  const [selectedEffects, setSelectedEffects] = useState<string[]>([])
  const [intensity, setIntensity] = useState([50])
  const [beatSync, setBeatSync] = useState(false)
  const [keyframesEnabled, setKeyframesEnabled] = useState(false)

  const effects = [
    { id: "cinematic", name: "Cinématique", category: "Couleur", description: "Look film professionnel" },
    { id: "glitch", name: "Glitch", category: "Effet", description: "Effet de bug numérique" },
    { id: "vhs", name: "VHS", category: "Rétro", description: "Style cassette vintage" },
    { id: "slowmo", name: "Slow Motion", category: "Temps", description: "Ralenti fluide" },
    { id: "splitscreen", name: "Split Screen", category: "Layout", description: "Écran divisé" },
    { id: "chromatic", name: "Aberration Chromatique", category: "Effet", description: "Séparation des couleurs" },
    { id: "bloom", name: "Bloom", category: "Lumière", description: "Effet de lumière diffuse" },
    { id: "grain", name: "Grain Film", category: "Texture", description: "Grain cinématographique" },
    { id: "vignette", name: "Vignette", category: "Cadre", description: "Assombrissement des bords" },
    { id: "lens", name: "Lens Flare", category: "Lumière", description: "Reflets de lentille" },
    { id: "pixelate", name: "Pixelate", category: "Effet", description: "Effet pixelisé" },
    { id: "mirror", name: "Mirror", category: "Effet", description: "Effet miroir" },
  ]

  const categories = ["Tous", "Couleur", "Effet", "Rétro", "Temps", "Layout", "Lumière", "Texture", "Cadre"]
  const [selectedCategory, setSelectedCategory] = useState("Tous")

  const filteredEffects = selectedCategory === "Tous" ? effects : effects.filter((e) => e.category === selectedCategory)

  const toggleEffect = (effectId: string) => {
    setSelectedEffects((prev) => (prev.includes(effectId) ? prev.filter((id) => id !== effectId) : [...prev, effectId]))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="w-full max-w-7xl bg-background rounded-3xl shadow-2xl border border-border/50">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/50">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Effets Visuels
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Empilez plusieurs effets avec keyframes et synchronisation audio
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full">
                <XIcon className="w-5 h-5" />
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
              {/* Left Panel - Effects Library */}
              <div className="lg:col-span-2 space-y-6">
                {/* Category Filter */}
                <div className="flex gap-2 flex-wrap">
                  {categories.map((cat) => (
                    <Button
                      key={cat}
                      variant={selectedCategory === cat ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(cat)}
                      className="rounded-full"
                    >
                      {cat}
                    </Button>
                  ))}
                </div>

                {/* Effects Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredEffects.map((effect) => (
                    <Card
                      key={effect.id}
                      className={`p-4 cursor-pointer transition-all hover:scale-105 ${
                        selectedEffects.includes(effect.id)
                          ? "border-2 border-primary bg-primary/5"
                          : "border border-border/50"
                      }`}
                      onClick={() => toggleEffect(effect.id)}
                    >
                      <div className="aspect-video bg-muted rounded-lg mb-3 flex items-center justify-center">
                        <PlayIcon className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">{effect.name}</h4>
                          {selectedEffects.includes(effect.id) && (
                            <Badge variant="default" className="text-xs">
                              Actif
                            </Badge>
                          )}
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {effect.category}
                        </Badge>
                        <p className="text-xs text-muted-foreground">{effect.description}</p>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Preview Area */}
                <Card className="p-6">
                  <Label className="text-sm font-medium mb-3 block">Aperçu avec effets appliqués</Label>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
                    <div className="text-center space-y-3">
                      <PlayIcon className="w-16 h-16 text-muted-foreground mx-auto" />
                      <p className="text-muted-foreground">
                        {selectedEffects.length} effet{selectedEffects.length > 1 ? "s" : ""} appliqué
                        {selectedEffects.length > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent">
                    <PlayIcon className="w-4 h-4 mr-2" />
                    Lire l'aperçu
                  </Button>
                </Card>
              </div>

              {/* Right Panel - Controls */}
              <div className="space-y-6">
                {/* Active Effects Stack */}
                <Card className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-sm font-medium">Effets actifs</Label>
                    <LayersIcon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  {selectedEffects.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">Aucun effet sélectionné</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedEffects.map((effectId, index) => {
                        const effect = effects.find((e) => e.id === effectId)
                        return (
                          <div key={effectId} className="p-3 bg-muted rounded-lg flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono text-muted-foreground">#{index + 1}</span>
                              <span className="text-sm font-medium">{effect?.name}</span>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => toggleEffect(effectId)}>
                              <XIcon className="w-4 h-4" />
                            </Button>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </Card>

                <Tabs defaultValue="settings" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="settings">Réglages</TabsTrigger>
                    <TabsTrigger value="keyframes">Keyframes</TabsTrigger>
                  </TabsList>

                  <TabsContent value="settings" className="space-y-6 mt-6">
                    {/* Global Intensity */}
                    <Card className="p-4">
                      <Label className="text-sm font-medium mb-3 block">Intensité globale: {intensity[0]}%</Label>
                      <Slider
                        value={intensity}
                        onValueChange={setIntensity}
                        min={0}
                        max={100}
                        step={5}
                        className="mb-2"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Subtil</span>
                        <span>Intense</span>
                      </div>
                    </Card>

                    {/* Options */}
                    <Card className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">Beat Sync</Label>
                          <p className="text-xs text-muted-foreground">Synchroniser avec la musique</p>
                        </div>
                        <Switch checked={beatSync} onCheckedChange={setBeatSync} />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">Keyframes</Label>
                          <p className="text-xs text-muted-foreground">Animer les effets</p>
                        </div>
                        <Switch checked={keyframesEnabled} onCheckedChange={setKeyframesEnabled} />
                      </div>
                    </Card>

                    {/* Presets */}
                    <Card className="p-4">
                      <Label className="text-sm font-medium mb-3 block">Presets</Label>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start text-sm bg-transparent">
                          Cinématique Pro
                        </Button>
                        <Button variant="outline" className="w-full justify-start text-sm bg-transparent">
                          Rétro Vintage
                        </Button>
                        <Button variant="outline" className="w-full justify-start text-sm bg-transparent">
                          Glitch Viral
                        </Button>
                        <Button variant="outline" className="w-full justify-start text-sm bg-transparent">
                          Slow Motion Épique
                        </Button>
                      </div>
                    </Card>
                  </TabsContent>

                  <TabsContent value="keyframes" className="space-y-6 mt-6">
                    <Card className="p-4">
                      <Label className="text-sm font-medium mb-3 block">Timeline des keyframes</Label>
                      <div className="h-32 bg-muted rounded-lg p-3 mb-4">
                        <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                          Timeline d'animation
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Button variant="outline" size="sm" className="w-full bg-transparent">
                          Ajouter un keyframe
                        </Button>
                        <Button variant="outline" size="sm" className="w-full bg-transparent">
                          Animation automatique
                        </Button>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <Label className="text-sm font-medium mb-3 block">Courbes d'animation</Label>
                      <div className="space-y-2">
                        <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                          Linéaire
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                          Ease In/Out
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                          Bounce
                        </Button>
                      </div>
                    </Card>
                  </TabsContent>
                </Tabs>

                {/* Apply Button */}
                <Button className="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground h-12">
                  Appliquer les effets
                </Button>

                {/* Save Preset */}
                <Button variant="outline" className="w-full bg-transparent">
                  Sauvegarder comme preset
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
