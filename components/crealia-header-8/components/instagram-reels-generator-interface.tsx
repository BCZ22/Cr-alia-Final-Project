"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 6 6 18" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m6 6 12 12" />
  </svg>
)

const UploadIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
    />
  </svg>
)

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
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

const MusicIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 18V5l12-2v13" />
    <circle strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} cx="6" cy="18" r="3" />
    <circle strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} cx="18" cy="16" r="3" />
  </svg>
)

interface InstagramReelsGeneratorInterfaceProps {
  isOpen: boolean
  onClose: () => void
}

export function InstagramReelsGeneratorInterface({ isOpen, onClose }: InstagramReelsGeneratorInterfaceProps) {
  const [video, setVideo] = useState<File | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState("trending")
  const [addMusic, setAddMusic] = useState(true)
  const [addCaptions, setAddCaptions] = useState(true)
  const [addEffects, setAddEffects] = useState(true)
  const [transitionSpeed, setTransitionSpeed] = useState([50])
  const [musicVolume, setMusicVolume] = useState([70])
  const [captionStyle, setCaptionStyle] = useState("modern")
  const [duration, setDuration] = useState([30])

  if (!isOpen) return null

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setVideo(file)
    }
  }

  const templates = [
    { id: "trending", name: "Tendance", description: "Style viral actuel", color: "from-pink-500 to-purple-500" },
    { id: "minimal", name: "Minimaliste", description: "Élégant et simple", color: "from-gray-400 to-gray-600" },
    { id: "energetic", name: "Énergique", description: "Dynamique et rapide", color: "from-orange-500 to-red-500" },
    { id: "aesthetic", name: "Esthétique", description: "Visuellement plaisant", color: "from-blue-400 to-cyan-400" },
  ]

  const captionStyles = [
    { id: "modern", name: "Moderne", preview: "Aa" },
    { id: "bold", name: "Gras", preview: "Aa" },
    { id: "elegant", name: "Élégant", preview: "Aa" },
    { id: "playful", name: "Ludique", preview: "Aa" },
  ]

  const musicGenres = [
    { id: "pop", name: "Pop", icon: "🎵" },
    { id: "electronic", name: "Électro", icon: "🎹" },
    { id: "hiphop", name: "Hip-Hop", icon: "🎤" },
    { id: "chill", name: "Chill", icon: "🎧" },
  ]

  return (
    <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="w-full max-w-7xl bg-background rounded-3xl shadow-2xl animate-scale-up border border-border/50">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
                  <InstagramIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                    Générateur Instagram Reels
                  </h2>
                  <p className="text-muted-foreground text-sm mt-1">Créez des Reels viraux optimisés pour Instagram</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full hover:bg-secondary/80">
                <XIcon className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-6">
              {!video ? (
                <div className="border-2 border-dashed border-border rounded-2xl p-16 text-center hover:border-primary/50 transition-colors">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                    id="video-upload"
                  />
                  <label htmlFor="video-upload" className="cursor-pointer">
                    <UploadIcon className="w-20 h-20 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Importer votre vidéo</h3>
                    <p className="text-muted-foreground text-sm mb-2">Glissez-déposez ou cliquez pour sélectionner</p>
                    <p className="text-muted-foreground text-xs">MP4, MOV jusqu'à 500MB</p>
                  </label>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Preview Section */}
                  <div className="lg:col-span-1 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Aperçu</h3>
                      <Badge
                        variant="secondary"
                        className="text-xs bg-gradient-to-r from-pink-500/10 to-purple-500/10 text-pink-600 border-pink-200"
                      >
                        <InstagramIcon className="w-3 h-3 mr-1" />
                        9:16
                      </Badge>
                    </div>

                    {/* Phone Preview */}
                    <div className="relative mx-auto" style={{ width: "280px" }}>
                      <div className="aspect-[9/16] bg-gradient-to-br from-secondary/20 to-secondary/5 rounded-3xl overflow-hidden border-4 border-border/50 shadow-2xl">
                        <div className="relative h-full bg-gradient-to-br from-pink-500/10 to-purple-500/10 flex items-center justify-center">
                          <SparklesIcon className="w-12 h-12 text-primary" />

                          {/* Instagram UI Overlay */}
                          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-500" />
                              <span className="text-white text-sm font-semibold">@votre_compte</span>
                            </div>
                            <div className="text-white">⋯</div>
                          </div>

                          {/* Bottom UI */}
                          <div className="absolute bottom-4 left-4 right-16">
                            <div className="text-white text-sm mb-2">
                              <p className="font-semibold">@votre_compte</p>
                              <p className="text-xs opacity-90">Votre description ici...</p>
                            </div>
                            <div className="flex items-center gap-2 text-white text-xs">
                              <MusicIcon className="w-3 h-3" />
                              <span>Musique originale</span>
                            </div>
                          </div>

                          {/* Right Side Actions */}
                          <div className="absolute right-4 bottom-20 flex flex-col gap-4">
                            <div className="flex flex-col items-center gap-1">
                              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                ❤️
                              </div>
                              <span className="text-white text-xs">125K</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                💬
                              </div>
                              <span className="text-white text-xs">2.3K</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                ➤
                              </div>
                              <span className="text-white text-xs">890</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Video Info */}
                    <div className="flex items-center gap-2 p-3 bg-secondary/30 rounded-lg">
                      <InstagramIcon className="w-5 h-5 text-pink-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{video.name}</p>
                        <p className="text-xs text-muted-foreground">{(video.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => setVideo(null)} className="rounded-full">
                        <XIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Settings Section */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Templates */}
                    <div>
                      <h3 className="font-semibold mb-3">Modèles de Reels</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {templates.map((template) => (
                          <Card
                            key={template.id}
                            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                              selectedTemplate === template.id
                                ? "border-pink-500 bg-pink-500/5"
                                : "border-border/50 hover:border-pink-500/30"
                            }`}
                            onClick={() => setSelectedTemplate(template.id)}
                          >
                            <div className="p-4">
                              <div
                                className={`w-full h-20 rounded-lg bg-gradient-to-br ${template.color} mb-3 flex items-center justify-center`}
                              >
                                <SparklesIcon className="w-8 h-8 text-white" />
                              </div>
                              <h4 className="font-medium text-sm mb-1">{template.name}</h4>
                              <p className="text-xs text-muted-foreground">{template.description}</p>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* Duration */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium">Durée du Reel</label>
                        <span className="text-sm text-muted-foreground">{duration[0]}s</span>
                      </div>
                      <Slider value={duration} onValueChange={setDuration} min={15} max={90} step={15} />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>15s</span>
                        <span>30s</span>
                        <span>60s</span>
                        <span>90s</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="p-4 border-border/50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <MusicIcon className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium">Musique</span>
                          </div>
                          <Switch checked={addMusic} onCheckedChange={setAddMusic} />
                        </div>
                        {addMusic && (
                          <div className="space-y-2 mt-3">
                            <div className="grid grid-cols-2 gap-2">
                              {musicGenres.map((genre) => (
                                <button
                                  key={genre.id}
                                  className="p-2 text-xs rounded-lg border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-colors"
                                >
                                  <span className="mr-1">{genre.icon}</span>
                                  {genre.name}
                                </button>
                              ))}
                            </div>
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-muted-foreground">Volume</span>
                                <span className="text-xs text-muted-foreground">{musicVolume[0]}%</span>
                              </div>
                              <Slider value={musicVolume} onValueChange={setMusicVolume} min={0} max={100} step={5} />
                            </div>
                          </div>
                        )}
                      </Card>

                      <Card className="p-4 border-border/50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">💬</span>
                            <span className="text-sm font-medium">Sous-titres</span>
                          </div>
                          <Switch checked={addCaptions} onCheckedChange={setAddCaptions} />
                        </div>
                        {addCaptions && (
                          <div className="space-y-2 mt-3">
                            <div className="grid grid-cols-2 gap-2">
                              {captionStyles.map((style) => (
                                <button
                                  key={style.id}
                                  className={`p-2 text-sm rounded-lg border transition-colors ${
                                    captionStyle === style.id
                                      ? "border-primary bg-primary/5"
                                      : "border-border/50 hover:border-primary/30"
                                  }`}
                                  onClick={() => setCaptionStyle(style.id)}
                                >
                                  <div className="font-bold mb-1">{style.preview}</div>
                                  <div className="text-xs text-muted-foreground">{style.name}</div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </Card>

                      <Card className="p-4 border-border/50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <SparklesIcon className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium">Effets</span>
                          </div>
                          <Switch checked={addEffects} onCheckedChange={setAddEffects} />
                        </div>
                        {addEffects && (
                          <div className="space-y-2 mt-3">
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-muted-foreground">Transitions</span>
                                <span className="text-xs text-muted-foreground">{transitionSpeed[0]}%</span>
                              </div>
                              <Slider
                                value={transitionSpeed}
                                onValueChange={setTransitionSpeed}
                                min={0}
                                max={100}
                                step={10}
                              />
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              <Badge variant="secondary" className="text-xs">
                                Zoom
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                Flou
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                Glitch
                              </Badge>
                            </div>
                          </div>
                        )}
                      </Card>
                    </div>

                    {/* Export */}
                    <div className="pt-4 border-t border-border/50">
                      <div className="flex gap-3">
                        <Button
                          className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                          size="lg"
                        >
                          <SparklesIcon className="w-4 h-4 mr-2" />
                          Générer le Reel
                        </Button>
                        <Button variant="outline" size="lg" className="bg-transparent">
                          Aperçu
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground text-center mt-2">
                        Optimisé pour Instagram • Format 9:16 • Jusqu'à 90 secondes
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
