"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 6 6 18M6 6l12 12" />
  </svg>
)

const SparklesIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
    />
  </svg>
)

const PlayIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
)

interface AITransitionsInterfaceProps {
  isOpen: boolean
  onClose: () => void
}

export function AITransitionsInterface({ isOpen, onClose }: AITransitionsInterfaceProps) {
  const [selectedTransition, setSelectedTransition] = useState("warp")
  const [duration, setDuration] = useState([500])
  const [intensity, setIntensity] = useState([50])
  const [beatSync, setBeatSync] = useState(true)
  const [autoGenerate, setAutoGenerate] = useState(false)
  const [customPrompt, setCustomPrompt] = useState("")

  const transitions = [
    { id: "warp", name: "Warp", category: "IA", description: "Déformation fluide entre clips" },
    { id: "morph", name: "Morph", category: "IA", description: "Transformation progressive" },
    { id: "clone", name: "Clone", category: "IA", description: "Effet de clonage créatif" },
    { id: "glitch", name: "Glitch", category: "Effet", description: "Effet de bug numérique" },
    { id: "zoom", name: "Zoom Blur", category: "Classique", description: "Zoom avec flou" },
    { id: "slide", name: "Slide", category: "Classique", description: "Glissement directionnel" },
    { id: "fade", name: "Fade", category: "Classique", description: "Fondu enchaîné" },
    { id: "dissolve", name: "Dissolve", category: "Classique", description: "Dissolution progressive" },
    { id: "swipe", name: "Swipe", category: "Moderne", description: "Balayage dynamique" },
    { id: "spin", name: "Spin", category: "Moderne", description: "Rotation 3D" },
    { id: "cube", name: "Cube", category: "3D", description: "Rotation en cube" },
    { id: "flip", name: "Flip", category: "3D", description: "Retournement 3D" },
  ]

  const categories = ["Tous", "IA", "Classique", "Moderne", "3D", "Effet"]
  const [selectedCategory, setSelectedCategory] = useState("Tous")

  const filteredTransitions = transitions.filter((t) => t.category === selectedCategory)

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
                  Transitions IA
                </h2>
                <p className="text-muted-foreground text-sm mt-1">Transitions intelligentes et personnalisées par IA</p>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full">
                <XIcon className="w-5 h-5" />
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
              {/* Left Panel - Transition Gallery */}
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

                {/* Transition Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredTransitions.map((transition) => (
                    <Card
                      key={transition.id}
                      className={`p-4 cursor-pointer transition-all hover:scale-105 ${
                        selectedTransition === transition.id
                          ? "border-2 border-primary bg-primary/5"
                          : "border border-border/50"
                      }`}
                      onClick={() => setSelectedTransition(transition.id)}
                    >
                      <div className="aspect-video bg-muted rounded-lg mb-3 flex items-center justify-center">
                        <PlayIcon className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">{transition.name}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {transition.category}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{transition.description}</p>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Preview Area */}
                <Card className="p-6">
                  <Label className="text-sm font-medium mb-3 block">Aperçu de la transition</Label>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
                    <div className="text-center space-y-3">
                      <PlayIcon className="w-16 h-16 text-muted-foreground mx-auto" />
                      <p className="text-muted-foreground">
                        Aperçu: {transitions.find((t) => t.id === selectedTransition)?.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 bg-transparent">
                      <PlayIcon className="w-4 h-4 mr-2" />
                      Lire l'aperçu
                    </Button>
                    <Button variant="outline" className="flex-1 bg-transparent">
                      Appliquer à la timeline
                    </Button>
                  </div>
                </Card>
              </div>

              {/* Right Panel - Controls */}
              <div className="space-y-6">
                <Tabs defaultValue="settings" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="settings">Réglages</TabsTrigger>
                    <TabsTrigger value="ai">IA Custom</TabsTrigger>
                  </TabsList>

                  <TabsContent value="settings" className="space-y-6 mt-6">
                    {/* Duration */}
                    <Card className="p-4">
                      <Label className="text-sm font-medium mb-3 block">Durée: {duration[0]}ms</Label>
                      <Slider
                        value={duration}
                        onValueChange={setDuration}
                        min={100}
                        max={2000}
                        step={100}
                        className="mb-2"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>100ms</span>
                        <span>2s</span>
                      </div>
                    </Card>

                    {/* Intensity */}
                    <Card className="p-4">
                      <Label className="text-sm font-medium mb-3 block">Intensité: {intensity[0]}%</Label>
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
                          <Label className="text-sm font-medium">Auto-génération</Label>
                          <p className="text-xs text-muted-foreground">IA choisit les transitions</p>
                        </div>
                        <Switch checked={autoGenerate} onCheckedChange={setAutoGenerate} />
                      </div>
                    </Card>

                    {/* Presets */}
                    <Card className="p-4">
                      <Label className="text-sm font-medium mb-3 block">Presets</Label>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start bg-transparent">
                          Dynamique (transitions rapides)
                        </Button>
                        <Button variant="outline" className="w-full justify-start bg-transparent">
                          Cinématique (transitions douces)
                        </Button>
                        <Button variant="outline" className="w-full justify-start bg-transparent">
                          Viral (transitions tendance)
                        </Button>
                      </div>
                    </Card>
                  </TabsContent>

                  <TabsContent value="ai" className="space-y-6 mt-6">
                    {/* AI Custom Transition */}
                    <Card className="p-4">
                      <Label className="text-sm font-medium mb-3 block">Créer une transition personnalisée</Label>
                      <p className="text-xs text-muted-foreground mb-4">
                        Décrivez la transition que vous souhaitez et l'IA la générera
                      </p>
                      <Input
                        placeholder="Ex: Une transition avec des particules dorées qui explosent..."
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        className="mb-4"
                      />
                      <Button className="w-full bg-gradient-to-r from-primary to-primary/80">
                        <SparklesIcon className="w-4 h-4 mr-2" />
                        Générer la transition
                      </Button>
                    </Card>

                    {/* AI Suggestions */}
                    <Card className="p-4">
                      <Label className="text-sm font-medium mb-3 block">Suggestions IA</Label>
                      <div className="space-y-2">
                        {[
                          "Transition liquide fluide",
                          "Effet de portail dimensionnel",
                          "Explosion de couleurs",
                          "Morphing organique",
                        ].map((suggestion, i) => (
                          <button
                            key={i}
                            onClick={() => setCustomPrompt(suggestion)}
                            className="w-full p-3 text-left text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </Card>

                    {/* Saved Custom Transitions */}
                    <Card className="p-4">
                      <Label className="text-sm font-medium mb-3 block">Mes transitions personnalisées</Label>
                      <div className="space-y-2">
                        <div className="p-3 bg-muted rounded-lg flex items-center justify-between">
                          <span className="text-sm">Particules dorées</span>
                          <Button variant="ghost" size="sm">
                            Utiliser
                          </Button>
                        </div>
                        <div className="p-3 bg-muted rounded-lg flex items-center justify-between">
                          <span className="text-sm">Portail magique</span>
                          <Button variant="ghost" size="sm">
                            Utiliser
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </TabsContent>
                </Tabs>

                {/* Apply Button */}
                <Button className="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground h-12">
                  Appliquer la transition
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
