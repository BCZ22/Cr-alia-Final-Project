"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 6 6 18M6 6l12 12" />
  </svg>
)

const UploadIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 16a4 4 0 0 1-.88-7.903A5 5 0 1 1 15.9 6L16 6a5 5 0 0 1 1 9.9M15 13l-3-3m0 0-3 3m3-3v12"
    />
  </svg>
)

const PlayIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
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

interface AutoEditingInterfaceProps {
  isOpen: boolean
  onClose: () => void
}

export function AutoEditingInterface({ isOpen, onClose }: AutoEditingInterfaceProps) {
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  const [selectedStyle, setSelectedStyle] = useState("dynamique")
  const [videoDuration, setVideoDuration] = useState([60])
  const [transitionSpeed, setTransitionSpeed] = useState([50])
  const [musicSync, setMusicSync] = useState(true)
  const [autoHighlights, setAutoHighlights] = useState(true)
  const [beatSync, setBeatSync] = useState(true)
  const [selectedMusic, setSelectedMusic] = useState("energique")
  const [variations, setVariations] = useState([3])

  if (!isOpen) return null

  const styles = [
    { id: "dynamique", name: "Dynamique", description: "Cuts rapides, transitions énergiques" },
    { id: "cinematique", name: "Cinématique", description: "Transitions douces, ambiance professionnelle" },
    { id: "vlog", name: "Vlog", description: "Style naturel et authentique" },
    { id: "corporate", name: "Corporate", description: "Professionnel et élégant" },
    { id: "storytelling", name: "Storytelling", description: "Narration fluide et captivante" },
    { id: "viral", name: "Viral", description: "Optimisé pour les réseaux sociaux" },
  ]

  const musicOptions = [
    { id: "energique", name: "Énergique", bpm: "140-160 BPM" },
    { id: "calme", name: "Calme", bpm: "80-100 BPM" },
    { id: "epic", name: "Épique", bpm: "120-140 BPM" },
    { id: "lofi", name: "Lo-Fi", bpm: "70-90 BPM" },
    { id: "corporate", name: "Corporate", bpm: "100-120 BPM" },
  ]

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="w-full max-w-7xl bg-background rounded-3xl shadow-2xl border border-border/50">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/50">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Montage Automatique IA
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Importez vos médias et laissez l'IA créer un montage professionnel
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full">
                <XIcon className="w-5 h-5" />
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
              {/* Left Panel - Upload & Preview */}
              <div className="lg:col-span-2 space-y-6">
                {/* Upload Zone */}
                <Card className="p-6 border-2 border-dashed border-border/50 hover:border-primary/30 transition-colors">
                  <div className="text-center space-y-4">
                    <div className="flex justify-center">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <UploadIcon className="w-8 h-8 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Importez vos médias</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Glissez-déposez un dossier ou sélectionnez plusieurs fichiers vidéo/image
                      </p>
                      <Button className="bg-primary text-primary-foreground">
                        <UploadIcon className="w-4 h-4 mr-2" />
                        Sélectionner des fichiers
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Formats supportés: MP4, MOV, AVI, JPG, PNG • Max 5GB par fichier
                    </p>
                  </div>
                </Card>

                {/* Preview Area */}
                <Card className="p-6">
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
                    <div className="text-center space-y-3">
                      <PlayIcon className="w-16 h-16 text-muted-foreground mx-auto" />
                      <p className="text-muted-foreground">Aperçu du montage généré</p>
                    </div>
                  </div>

                  {/* Timeline Preview */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Timeline du montage</Label>
                    <div className="h-24 bg-muted rounded-lg p-3 overflow-x-auto">
                      <div className="flex gap-2 h-full">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                          <div
                            key={i}
                            className="min-w-[80px] h-full bg-primary/20 rounded border border-primary/30 flex items-center justify-center"
                          >
                            <span className="text-xs text-muted-foreground">Clip {i}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Generated Variations */}
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Variations générées</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="space-y-2">
                        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                          <Badge variant="secondary">Version {i}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground text-center">
                          {i === 1 && "Dynamique"}
                          {i === 2 && "Équilibré"}
                          {i === 3 && "Calme"}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Right Panel - Controls */}
              <div className="space-y-6">
                <Tabs defaultValue="style" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="style">Style</TabsTrigger>
                    <TabsTrigger value="advanced">Avancé</TabsTrigger>
                  </TabsList>

                  <TabsContent value="style" className="space-y-6 mt-6">
                    {/* Style Selection */}
                    <Card className="p-4">
                      <Label className="text-sm font-medium mb-3 block">Style de montage</Label>
                      <div className="space-y-2">
                        {styles.map((style) => (
                          <button
                            key={style.id}
                            onClick={() => setSelectedStyle(style.id)}
                            className={`w-full p-3 rounded-lg text-left transition-all ${
                              selectedStyle === style.id
                                ? "bg-primary/10 border-2 border-primary"
                                : "bg-muted border-2 border-transparent hover:border-primary/30"
                            }`}
                          >
                            <div className="font-medium text-sm">{style.name}</div>
                            <div className="text-xs text-muted-foreground">{style.description}</div>
                          </button>
                        ))}
                      </div>
                    </Card>

                    {/* Music Selection */}
                    <Card className="p-4">
                      <Label className="text-sm font-medium mb-3 block">Musique de fond</Label>
                      <Select value={selectedMusic} onValueChange={setSelectedMusic}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {musicOptions.map((music) => (
                            <SelectItem key={music.id} value={music.id}>
                              {music.name} - {music.bpm}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Card>

                    {/* Duration */}
                    <Card className="p-4">
                      <Label className="text-sm font-medium mb-3 block">Durée cible: {videoDuration[0]}s</Label>
                      <Slider
                        value={videoDuration}
                        onValueChange={setVideoDuration}
                        min={15}
                        max={300}
                        step={5}
                        className="mb-2"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>15s</span>
                        <span>5min</span>
                      </div>
                    </Card>
                  </TabsContent>

                  <TabsContent value="advanced" className="space-y-6 mt-6">
                    {/* Advanced Options */}
                    <Card className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">Synchronisation musicale</Label>
                          <p className="text-xs text-muted-foreground">Cuts sur les temps forts</p>
                        </div>
                        <Switch checked={musicSync} onCheckedChange={setMusicSync} />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">Détection automatique des highlights</Label>
                          <p className="text-xs text-muted-foreground">IA sélectionne les meilleurs moments</p>
                        </div>
                        <Switch checked={autoHighlights} onCheckedChange={setAutoHighlights} />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">Beat Sync</Label>
                          <p className="text-xs text-muted-foreground">Transitions sur les beats</p>
                        </div>
                        <Switch checked={beatSync} onCheckedChange={setBeatSync} />
                      </div>
                    </Card>

                    {/* Transition Speed */}
                    <Card className="p-4">
                      <Label className="text-sm font-medium mb-3 block">
                        Vitesse des transitions: {transitionSpeed[0]}%
                      </Label>
                      <Slider
                        value={transitionSpeed}
                        onValueChange={setTransitionSpeed}
                        min={0}
                        max={100}
                        step={10}
                        className="mb-2"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Lent</span>
                        <span>Rapide</span>
                      </div>
                    </Card>

                    {/* Number of Variations */}
                    <Card className="p-4">
                      <Label className="text-sm font-medium mb-3 block">Nombre de variations: {variations[0]}</Label>
                      <Slider
                        value={variations}
                        onValueChange={setVariations}
                        min={1}
                        max={5}
                        step={1}
                        className="mb-2"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        L'IA générera {variations[0]} version{variations[0] > 1 ? "s" : ""} différente
                        {variations[0] > 1 ? "s" : ""}
                      </p>
                    </Card>
                  </TabsContent>
                </Tabs>

                {/* Generate Button */}
                <Button className="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground h-12">
                  <SparklesIcon className="w-5 h-5 mr-2" />
                  Générer le montage
                </Button>

                {/* Export Options */}
                <Card className="p-4">
                  <Label className="text-sm font-medium mb-3 block">Export</Label>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      TikTok (9:16, 60s max)
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      Instagram Reels (9:16, 90s max)
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      YouTube Shorts (9:16, 60s max)
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      YouTube (16:9, illimité)
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
