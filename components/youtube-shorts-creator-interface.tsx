"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

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

const YouTubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
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

const TagIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
    />
  </svg>
)

const TrendingIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
)

interface YouTubeShortsCreatorInterfaceProps {
  isOpen: boolean
  onClose: () => void
}

export function YouTubeShortsCreatorInterface({ isOpen, onClose }: YouTubeShortsCreatorInterfaceProps) {
  const [video, setVideo] = useState<File | null>(null)
  const [selectedStyle, setSelectedStyle] = useState("engaging")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [addHooks, setAddHooks] = useState(true)
  const [addCaptions, setAddCaptions] = useState(true)
  const [addMusic, setAddMusic] = useState(true)
  const [videoSpeed, setVideoSpeed] = useState([100])
  const [duration, setDuration] = useState([60])
  const [autoOptimize, setAutoOptimize] = useState(true)

  if (!isOpen) return null

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setVideo(file)
    }
  }

  const styles = [
    {
      id: "engaging",
      name: "Engageant",
      description: "Captivant et dynamique",
      color: "from-red-500 to-orange-500",
      emoji: "🔥",
    },
    {
      id: "educational",
      name: "Éducatif",
      description: "Informatif et clair",
      color: "from-blue-500 to-cyan-500",
      emoji: "📚",
    },
    {
      id: "entertainment",
      name: "Divertissement",
      description: "Amusant et léger",
      color: "from-purple-500 to-pink-500",
      emoji: "🎬",
    },
    {
      id: "tutorial",
      name: "Tutoriel",
      description: "Étape par étape",
      color: "from-green-500 to-teal-500",
      emoji: "🎯",
    },
  ]

  const hooks = [
    { id: "question", name: "Question", icon: "❓" },
    { id: "shocking", name: "Choquant", icon: "😱" },
    { id: "curiosity", name: "Curiosité", icon: "🤔" },
    { id: "promise", name: "Promesse", icon: "✨" },
  ]

  const suggestedTags = ["Shorts", "YouTube", "Viral", "Trending", "Tutorial", "HowTo", "Tips", "Quick", "Fast", "Easy"]

  const generateTitle = () => {
    const titles = [
      "Cette astuce va changer votre vie ! 🤯",
      "Personne ne connaît cette technique secrète",
      "Comment faire ça en 60 secondes",
      "Vous ne croirez pas ce résultat ! 😱",
      "La méthode que tout le monde devrait connaître",
    ]
    setTitle(titles[Math.floor(Math.random() * titles.length)])
  }

  const generateDescription = () => {
    const descriptions = [
      "Découvrez cette astuce incroyable qui va vous faire gagner du temps ! N'oubliez pas de vous abonner pour plus de contenu comme celui-ci. 🔔\n\n#Shorts #Tutorial #Tips",
      "Dans ce Short, je vous montre comment faire quelque chose d'incroyable en moins d'une minute. Suivez-moi pour plus ! 🚀\n\n#YouTube #HowTo #Quick",
      "Cette technique simple va vous épater ! Partagez avec vos amis qui en ont besoin. 💡\n\n#Viral #Trending #MustWatch",
    ]
    setDescription(descriptions[Math.floor(Math.random() * descriptions.length)])
  }

  return (
    <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="w-full max-w-7xl bg-background rounded-3xl shadow-2xl animate-scale-up border border-border/50">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                  <YouTubeIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                    Créateur YouTube Shorts
                  </h2>
                  <p className="text-muted-foreground text-sm mt-1">Créez des Shorts optimisés pour YouTube</p>
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
                    <p className="text-muted-foreground text-xs">MP4, MOV jusqu'à 500MB • Max 60 secondes</p>
                  </label>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Preview Section */}
                  <div className="lg:col-span-1 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Aperçu Shorts</h3>
                      <Badge
                        variant="secondary"
                        className="text-xs bg-gradient-to-r from-red-500/10 to-orange-500/10 text-red-600 border-red-200"
                      >
                        <YouTubeIcon className="w-3 h-3 mr-1" />
                        9:16
                      </Badge>
                    </div>

                    {/* Phone Preview */}
                    <div className="relative mx-auto" style={{ width: "280px" }}>
                      <div className="aspect-[9/16] bg-gradient-to-br from-secondary/20 to-secondary/5 rounded-3xl overflow-hidden border-4 border-border/50 shadow-2xl">
                        <div className="relative h-full bg-gradient-to-br from-red-500/10 to-orange-500/10 flex items-center justify-center">
                          <SparklesIcon className="w-12 h-12 text-primary" />

                          {/* YouTube Shorts UI Overlay */}
                          <div className="absolute top-4 right-4 flex flex-col gap-3">
                            <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                              </svg>
                            </button>
                            <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                                />
                              </svg>
                            </button>
                          </div>

                          {/* Bottom UI */}
                          <div className="absolute bottom-4 left-4 right-16">
                            <div className="text-white mb-3">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-500" />
                                <span className="text-sm font-semibold">@votre_chaine</span>
                                <button className="px-3 py-1 bg-red-600 rounded-full text-xs font-bold">
                                  S'abonner
                                </button>
                              </div>
                              <p className="text-sm font-semibold mb-1 line-clamp-2">{title || "Votre titre ici..."}</p>
                              <p className="text-xs opacity-80 line-clamp-2">
                                {description.split("\n")[0] || "Votre description..."}
                              </p>
                            </div>
                          </div>

                          {/* Right Side Actions */}
                          <div className="absolute right-3 bottom-20 flex flex-col gap-5">
                            <div className="flex flex-col items-center gap-1">
                              <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                                👍
                              </button>
                              <span className="text-white text-xs font-semibold">12K</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                              <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                                👎
                              </button>
                              <span className="text-white text-xs font-semibold">Dislike</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                              <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                                💬
                              </button>
                              <span className="text-white text-xs font-semibold">856</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                              <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                                ➤
                              </button>
                              <span className="text-white text-xs font-semibold">Share</span>
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-500" />
                          </div>

                          {/* Shorts Logo */}
                          <div className="absolute top-4 left-4">
                            <div className="flex items-center gap-2 text-white">
                              <YouTubeIcon className="w-6 h-6" />
                              <span className="text-sm font-bold">Shorts</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Video Info */}
                    <div className="flex items-center gap-2 p-3 bg-secondary/30 rounded-lg">
                      <YouTubeIcon className="w-5 h-5 text-red-500" />
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
                    {/* Styles */}
                    <div>
                      <h3 className="font-semibold mb-3">Style de contenu</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {styles.map((style) => (
                          <Card
                            key={style.id}
                            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                              selectedStyle === style.id
                                ? "border-red-500 bg-red-500/5"
                                : "border-border/50 hover:border-red-500/30"
                            }`}
                            onClick={() => setSelectedStyle(style.id)}
                          >
                            <div className="p-4">
                              <div
                                className={`w-full h-20 rounded-lg bg-gradient-to-br ${style.color} mb-3 flex items-center justify-center text-3xl`}
                              >
                                {style.emoji}
                              </div>
                              <h4 className="font-medium text-sm mb-1">{style.name}</h4>
                              <p className="text-xs text-muted-foreground">{style.description}</p>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* Title */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium">Titre</label>
                        <Button size="sm" variant="outline" onClick={generateTitle} className="text-xs bg-transparent">
                          <SparklesIcon className="w-3 h-3 mr-1" />
                          Générer avec IA
                        </Button>
                      </div>
                      <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Un titre accrocheur pour votre Short..."
                        maxLength={100}
                      />
                      <span className="text-xs text-muted-foreground mt-1 block">{title.length}/100 caractères</span>
                    </div>

                    {/* Description */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium">Description</label>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={generateDescription}
                          className="text-xs bg-transparent"
                        >
                          <SparklesIcon className="w-3 h-3 mr-1" />
                          Générer avec IA
                        </Button>
                      </div>
                      <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Décrivez votre Short et ajoutez des hashtags..."
                        className="min-h-[100px] resize-none"
                        maxLength={5000}
                      />
                      <span className="text-xs text-muted-foreground mt-1 block">
                        {description.length}/5000 caractères
                      </span>
                    </div>

                    {/* Tags */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <TagIcon className="w-4 h-4 text-primary" />
                        <label className="text-sm font-medium">Tags suggérés</label>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {suggestedTags.map((tag) => (
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

                    {/* Duration & Speed */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium">Durée</label>
                          <span className="text-sm text-muted-foreground">{duration[0]}s</span>
                        </div>
                        <Slider value={duration} onValueChange={setDuration} min={15} max={60} step={5} />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium">Vitesse</label>
                          <span className="text-sm text-muted-foreground">{videoSpeed[0]}%</span>
                        </div>
                        <Slider value={videoSpeed} onValueChange={setVideoSpeed} min={50} max={200} step={10} />
                      </div>
                    </div>

                    {/* Hooks */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingIcon className="w-4 h-4 text-primary" />
                        <h3 className="font-semibold">Accroches virales</h3>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {hooks.map((hook) => (
                          <Card
                            key={hook.id}
                            className="p-3 cursor-pointer transition-all duration-200 hover:shadow-md border-border/50 hover:border-red-500/30"
                          >
                            <div className="text-center">
                              <div className="text-2xl mb-2">{hook.icon}</div>
                              <p className="text-xs font-medium">{hook.name}</p>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* Features Toggles */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Card className="p-4 border-border/50">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Accroches</span>
                          <Switch checked={addHooks} onCheckedChange={setAddHooks} />
                        </div>
                      </Card>
                      <Card className="p-4 border-border/50">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Sous-titres</span>
                          <Switch checked={addCaptions} onCheckedChange={setAddCaptions} />
                        </div>
                      </Card>
                      <Card className="p-4 border-border/50">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Musique</span>
                          <Switch checked={addMusic} onCheckedChange={setAddMusic} />
                        </div>
                      </Card>
                      <Card className="p-4 border-border/50">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Optimiser</span>
                          <Switch checked={autoOptimize} onCheckedChange={setAutoOptimize} />
                        </div>
                      </Card>
                    </div>

                    {/* Export */}
                    <div className="pt-4 border-t border-border/50">
                      <div className="flex gap-3">
                        <Button
                          className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                          size="lg"
                        >
                          <SparklesIcon className="w-4 h-4 mr-2" />
                          Créer le Short
                        </Button>
                        <Button variant="outline" size="lg" className="bg-transparent">
                          Aperçu
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground text-center mt-2">
                        Optimisé pour YouTube Shorts • Format 9:16 • Max 60 secondes
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
