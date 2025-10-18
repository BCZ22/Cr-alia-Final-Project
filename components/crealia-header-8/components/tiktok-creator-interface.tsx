"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

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

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
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

const HashtagIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 20L3 20M17 20L21 20M7 4L3 4M17 4L21 4M9 20L10 4M15 20L14 4M20 9L4 9M20 15L4 15"
    />
  </svg>
)

interface TikTokCreatorInterfaceProps {
  isOpen: boolean
  onClose: () => void
}

export function TikTokCreatorInterface({ isOpen, onClose }: TikTokCreatorInterfaceProps) {
  const [video, setVideo] = useState<File | null>(null)
  const [selectedVibe, setSelectedVibe] = useState("viral")
  const [caption, setCaption] = useState("")
  const [addTrending, setAddTrending] = useState(true)
  const [addEffects, setAddEffects] = useState(true)
  const [addStickers, setAddStickers] = useState(false)
  const [videoSpeed, setVideoSpeed] = useState([100])
  const [duration, setDuration] = useState([60])
  const [autoHashtags, setAutoHashtags] = useState(true)

  if (!isOpen) return null

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setVideo(file)
    }
  }

  const vibes = [
    { id: "viral", name: "Viral", description: "Tendances actuelles", color: "from-cyan-400 to-blue-500", emoji: "🔥" },
    {
      id: "comedy",
      name: "Comédie",
      description: "Drôle et engageant",
      color: "from-yellow-400 to-orange-500",
      emoji: "😂",
    },
    {
      id: "aesthetic",
      name: "Esthétique",
      description: "Visuellement plaisant",
      color: "from-pink-400 to-purple-500",
      emoji: "✨",
    },
    {
      id: "educational",
      name: "Éducatif",
      description: "Informatif et utile",
      color: "from-green-400 to-teal-500",
      emoji: "📚",
    },
  ]

  const trendingEffects = [
    { id: "greenscreen", name: "Green Screen", icon: "🎬" },
    { id: "duet", name: "Duet", icon: "👥" },
    { id: "stitch", name: "Stitch", icon: "✂️" },
    { id: "zoom", name: "Zoom", icon: "🔍" },
  ]

  const suggestedHashtags = ["#fyp", "#foryou", "#viral", "#trending", "#tiktok", "#pourtoi", "#france", "#2024"]

  const generateCaption = () => {
    const captions = [
      "Vous ne croirez jamais ce qui s'est passé... 😱",
      "POV: Quand tu découvres cette astuce incroyable 🤯",
      "Personne ne parle de ça mais... 👀",
      "Attendez la fin ! 🔥",
      "C'est tellement satisfaisant à regarder ✨",
    ]
    setCaption(captions[Math.floor(Math.random() * captions.length)])
  }

  return (
    <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="w-full max-w-7xl bg-background rounded-3xl shadow-2xl animate-scale-up border border-border/50">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-pink-500 flex items-center justify-center">
                  <TikTokIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
                    Créateur TikTok
                  </h2>
                  <p className="text-muted-foreground text-sm mt-1">Créez des TikToks viraux avec l'IA</p>
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
                      <h3 className="font-semibold">Aperçu TikTok</h3>
                      <Badge
                        variant="secondary"
                        className="text-xs bg-gradient-to-r from-cyan-400/10 to-pink-500/10 text-cyan-600 border-cyan-200"
                      >
                        <TikTokIcon className="w-3 h-3 mr-1" />
                        9:16
                      </Badge>
                    </div>

                    {/* Phone Preview */}
                    <div className="relative mx-auto" style={{ width: "280px" }}>
                      <div className="aspect-[9/16] bg-gradient-to-br from-secondary/20 to-secondary/5 rounded-3xl overflow-hidden border-4 border-border/50 shadow-2xl">
                        <div className="relative h-full bg-gradient-to-br from-cyan-400/10 to-pink-500/10 flex items-center justify-center">
                          <SparklesIcon className="w-12 h-12 text-primary" />

                          {/* TikTok UI Overlay */}
                          <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold">Abonnement</span>
                              <span className="text-sm opacity-60">|</span>
                              <span className="text-sm font-bold">Pour toi</span>
                            </div>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                              />
                            </svg>
                          </div>

                          {/* Bottom UI */}
                          <div className="absolute bottom-4 left-4 right-16">
                            <div className="text-white mb-3">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-pink-500" />
                                <span className="text-sm font-semibold">@votre_compte</span>
                                <button className="px-3 py-1 bg-red-500 rounded text-xs font-bold">Suivre</button>
                              </div>
                              <p className="text-sm mb-2">{caption || "Votre description ici..."}</p>
                              <div className="flex flex-wrap gap-1 text-xs">
                                {suggestedHashtags.slice(0, 4).map((tag) => (
                                  <span key={tag} className="font-semibold">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-white text-xs">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M9 18V5l12-2v13" />
                                <circle cx="6" cy="18" r="3" />
                                <circle cx="18" cy="16" r="3" />
                              </svg>
                              <span>Son original - @votre_compte</span>
                            </div>
                          </div>

                          {/* Right Side Actions */}
                          <div className="absolute right-3 bottom-20 flex flex-col gap-5">
                            <div className="flex flex-col items-center gap-1">
                              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                                ❤️
                              </div>
                              <span className="text-white text-xs font-semibold">245K</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                                💬
                              </div>
                              <span className="text-white text-xs font-semibold">3.2K</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                                🔖
                              </div>
                              <span className="text-white text-xs font-semibold">890</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                                ➤
                              </div>
                              <span className="text-white text-xs font-semibold">1.5K</span>
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-pink-500 animate-spin-slow" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Video Info */}
                    <div className="flex items-center gap-2 p-3 bg-secondary/30 rounded-lg">
                      <TikTokIcon className="w-5 h-5 text-cyan-500" />
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
                    {/* Vibes */}
                    <div>
                      <h3 className="font-semibold mb-3">Ambiance TikTok</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {vibes.map((vibe) => (
                          <Card
                            key={vibe.id}
                            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                              selectedVibe === vibe.id
                                ? "border-cyan-500 bg-cyan-500/5"
                                : "border-border/50 hover:border-cyan-500/30"
                            }`}
                            onClick={() => setSelectedVibe(vibe.id)}
                          >
                            <div className="p-4">
                              <div
                                className={`w-full h-20 rounded-lg bg-gradient-to-br ${vibe.color} mb-3 flex items-center justify-center text-3xl`}
                              >
                                {vibe.emoji}
                              </div>
                              <h4 className="font-medium text-sm mb-1">{vibe.name}</h4>
                              <p className="text-xs text-muted-foreground">{vibe.description}</p>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* Caption */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium">Description</label>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={generateCaption}
                          className="text-xs bg-transparent"
                        >
                          <SparklesIcon className="w-3 h-3 mr-1" />
                          Générer avec IA
                        </Button>
                      </div>
                      <Textarea
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        placeholder="Écrivez une description accrocheuse..."
                        className="min-h-[80px] resize-none"
                        maxLength={150}
                      />
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-muted-foreground">{caption.length}/150 caractères</span>
                        <div className="flex items-center gap-1">
                          <Switch checked={autoHashtags} onCheckedChange={setAutoHashtags} />
                          <span className="text-xs text-muted-foreground">Hashtags auto</span>
                        </div>
                      </div>
                    </div>

                    {/* Hashtags */}
                    {autoHashtags && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <HashtagIcon className="w-4 h-4 text-primary" />
                          <label className="text-sm font-medium">Hashtags suggérés</label>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {suggestedHashtags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Duration & Speed */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium">Durée</label>
                          <span className="text-sm text-muted-foreground">{duration[0]}s</span>
                        </div>
                        <Slider value={duration} onValueChange={setDuration} min={15} max={180} step={15} />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium">Vitesse</label>
                          <span className="text-sm text-muted-foreground">{videoSpeed[0]}%</span>
                        </div>
                        <Slider value={videoSpeed} onValueChange={setVideoSpeed} min={50} max={200} step={10} />
                      </div>
                    </div>

                    {/* Effects */}
                    <div>
                      <h3 className="font-semibold mb-3">Effets tendance</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {trendingEffects.map((effect) => (
                          <Card
                            key={effect.id}
                            className="p-3 cursor-pointer transition-all duration-200 hover:shadow-md border-border/50 hover:border-cyan-500/30"
                          >
                            <div className="text-center">
                              <div className="text-2xl mb-2">{effect.icon}</div>
                              <p className="text-xs font-medium">{effect.name}</p>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* Features Toggles */}
                    <div className="grid grid-cols-3 gap-4">
                      <Card className="p-4 border-border/50">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Tendances</span>
                          <Switch checked={addTrending} onCheckedChange={setAddTrending} />
                        </div>
                      </Card>
                      <Card className="p-4 border-border/50">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Effets</span>
                          <Switch checked={addEffects} onCheckedChange={setAddEffects} />
                        </div>
                      </Card>
                      <Card className="p-4 border-border/50">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Stickers</span>
                          <Switch checked={addStickers} onCheckedChange={setAddStickers} />
                        </div>
                      </Card>
                    </div>

                    {/* Export */}
                    <div className="pt-4 border-t border-border/50">
                      <div className="flex gap-3">
                        <Button
                          className="flex-1 bg-gradient-to-r from-cyan-400 to-pink-500 hover:from-cyan-500 hover:to-pink-600"
                          size="lg"
                        >
                          <SparklesIcon className="w-4 h-4 mr-2" />
                          Créer le TikTok
                        </Button>
                        <Button variant="outline" size="lg" className="bg-transparent">
                          Aperçu
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground text-center mt-2">
                        Optimisé pour TikTok • Format 9:16 • Jusqu'à 3 minutes
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
