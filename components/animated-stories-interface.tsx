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

const ZapIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
)

const LayersIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2L2 7l10 5 10-5-10-5z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 17l10 5 10-5" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 12l10 5 10-5" />
  </svg>
)

const PlayIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
)

interface AnimatedStoriesInterfaceProps {
  isOpen: boolean
  onClose: () => void
}

export function AnimatedStoriesInterface({ isOpen, onClose }: AnimatedStoriesInterfaceProps) {
  const [content, setContent] = useState<File | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState("modern")
  const [storyText, setStoryText] = useState("")
  const [addAnimations, setAddAnimations] = useState(true)
  const [addMusic, setAddMusic] = useState(true)
  const [addStickers, setAddStickers] = useState(true)
  const [animationSpeed, setAnimationSpeed] = useState([100])
  const [duration, setDuration] = useState([15])
  const [autoTransitions, setAutoTransitions] = useState(true)

  if (!isOpen) return null

  const handleContentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setContent(file)
    }
  }

  const templates = [
    {
      id: "modern",
      name: "Moderne",
      description: "Animations fluides",
      color: "from-blue-400 to-purple-500",
      emoji: "✨",
    },
    {
      id: "minimal",
      name: "Minimaliste",
      description: "Élégant et simple",
      color: "from-gray-400 to-gray-600",
      emoji: "⚪",
    },
    {
      id: "vibrant",
      name: "Vibrant",
      description: "Couleurs éclatantes",
      color: "from-pink-400 to-orange-500",
      emoji: "🌈",
    },
    {
      id: "elegant",
      name: "Élégant",
      description: "Sophistiqué et raffiné",
      color: "from-purple-400 to-indigo-500",
      emoji: "💎",
    },
  ]

  const animations = [
    { id: "fade", name: "Fondu", icon: "🌫️" },
    { id: "slide", name: "Glissement", icon: "➡️" },
    { id: "zoom", name: "Zoom", icon: "🔍" },
    { id: "rotate", name: "Rotation", icon: "🔄" },
  ]

  const stickers = [
    { id: "emoji", name: "Emojis", icon: "😊" },
    { id: "shapes", name: "Formes", icon: "⭐" },
    { id: "text", name: "Texte", icon: "💬" },
    { id: "effects", name: "Effets", icon: "✨" },
  ]

  const generateStoryText = () => {
    const texts = [
      "Découvrez cette histoire incroyable ! 🌟",
      "Moment magique à partager avec vous ✨",
      "Vous allez adorer cette surprise ! 🎁",
      "Une expérience unique vous attend 🚀",
      "Préparez-vous à être émerveillé ! 💫",
    ]
    setStoryText(texts[Math.floor(Math.random() * texts.length)])
  }

  return (
    <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="w-full max-w-7xl bg-background rounded-3xl shadow-2xl animate-scale-up border border-border/50">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                  <ZapIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                    Stories Animées
                  </h2>
                  <p className="text-muted-foreground text-sm mt-1">Créez des stories captivantes avec animations</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full hover:bg-secondary/80">
                <XIcon className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-6">
              {!content ? (
                <div className="border-2 border-dashed border-border rounded-2xl p-16 text-center hover:border-primary/50 transition-colors">
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleContentUpload}
                    className="hidden"
                    id="content-upload"
                  />
                  <label htmlFor="content-upload" className="cursor-pointer">
                    <UploadIcon className="w-20 h-20 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Importer votre contenu</h3>
                    <p className="text-muted-foreground text-sm mb-2">Glissez-déposez ou cliquez pour sélectionner</p>
                    <p className="text-muted-foreground text-xs">Images ou vidéos • JPG, PNG, MP4 jusqu'à 100MB</p>
                  </label>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Preview Section */}
                  <div className="lg:col-span-1 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Aperçu Story</h3>
                      <Badge
                        variant="secondary"
                        className="text-xs bg-gradient-to-r from-purple-400/10 to-pink-500/10 text-purple-600 border-purple-200"
                      >
                        <LayersIcon className="w-3 h-3 mr-1" />
                        9:16
                      </Badge>
                    </div>

                    {/* Phone Preview */}
                    <div className="relative mx-auto" style={{ width: "280px" }}>
                      <div className="aspect-[9/16] bg-gradient-to-br from-secondary/20 to-secondary/5 rounded-3xl overflow-hidden border-4 border-border/50 shadow-2xl">
                        <div className="relative h-full bg-gradient-to-br from-purple-400/10 to-pink-500/10 flex items-center justify-center">
                          <SparklesIcon className="w-12 h-12 text-primary animate-pulse" />

                          {/* Story UI Overlay */}
                          <div className="absolute top-4 left-4 right-4">
                            <div className="flex gap-1 mb-3">
                              <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                                <div className="h-full w-3/4 bg-white rounded-full" />
                              </div>
                              <div className="flex-1 h-1 bg-white/30 rounded-full" />
                              <div className="flex-1 h-1 bg-white/30 rounded-full" />
                            </div>
                            <div className="flex items-center gap-2 text-white">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 border-2 border-white" />
                              <span className="text-sm font-semibold">votre_compte</span>
                              <span className="text-xs opacity-60">2h</span>
                            </div>
                          </div>

                          {/* Story Content */}
                          <div className="absolute inset-0 flex items-center justify-center p-8">
                            <div className="text-center text-white">
                              <div className="text-4xl mb-4 animate-bounce">✨</div>
                              <p className="text-lg font-bold mb-2">{storyText || "Votre texte ici..."}</p>
                              <p className="text-sm opacity-80">Swipe up pour en savoir plus</p>
                            </div>
                          </div>

                          {/* Bottom Actions */}
                          <div className="absolute bottom-4 left-4 right-4">
                            <div className="flex items-center justify-between text-white">
                              <div className="flex items-center gap-3">
                                <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                  ❤️
                                </button>
                                <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                  💬
                                </button>
                                <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                  ➤
                                </button>
                              </div>
                              <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                ⋯
                              </button>
                            </div>
                          </div>

                          {/* Swipe Up Indicator */}
                          <div className="absolute bottom-16 left-1/2 -translate-x-1/2">
                            <div className="flex flex-col items-center text-white animate-bounce">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Content Info */}
                    <div className="flex items-center gap-2 p-3 bg-secondary/30 rounded-lg">
                      <LayersIcon className="w-5 h-5 text-purple-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{content.name}</p>
                        <p className="text-xs text-muted-foreground">{(content.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => setContent(null)} className="rounded-full">
                        <XIcon className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Preview Button */}
                    <Button className="w-full bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600">
                      <PlayIcon className="w-4 h-4 mr-2" />
                      Prévisualiser l'animation
                    </Button>
                  </div>

                  {/* Settings Section */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Templates */}
                    <div>
                      <h3 className="font-semibold mb-3">Modèles de story</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {templates.map((template) => (
                          <Card
                            key={template.id}
                            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                              selectedTemplate === template.id
                                ? "border-purple-500 bg-purple-500/5"
                                : "border-border/50 hover:border-purple-500/30"
                            }`}
                            onClick={() => setSelectedTemplate(template.id)}
                          >
                            <div className="p-4">
                              <div
                                className={`w-full h-20 rounded-lg bg-gradient-to-br ${template.color} mb-3 flex items-center justify-center text-3xl`}
                              >
                                {template.emoji}
                              </div>
                              <h4 className="font-medium text-sm mb-1">{template.name}</h4>
                              <p className="text-xs text-muted-foreground">{template.description}</p>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* Story Text */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium">Texte de la story</label>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={generateStoryText}
                          className="text-xs bg-transparent"
                        >
                          <SparklesIcon className="w-3 h-3 mr-1" />
                          Générer avec IA
                        </Button>
                      </div>
                      <Textarea
                        value={storyText}
                        onChange={(e) => setStoryText(e.target.value)}
                        placeholder="Ajoutez un texte captivant à votre story..."
                        className="min-h-[80px] resize-none"
                        maxLength={200}
                      />
                      <span className="text-xs text-muted-foreground mt-1 block">
                        {storyText.length}/200 caractères
                      </span>
                    </div>

                    {/* Duration & Speed */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium">Durée</label>
                          <span className="text-sm text-muted-foreground">{duration[0]}s</span>
                        </div>
                        <Slider value={duration} onValueChange={setDuration} min={5} max={30} step={5} />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium">Vitesse animation</label>
                          <span className="text-sm text-muted-foreground">{animationSpeed[0]}%</span>
                        </div>
                        <Slider value={animationSpeed} onValueChange={setAnimationSpeed} min={50} max={200} step={10} />
                      </div>
                    </div>

                    {/* Animations */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <ZapIcon className="w-4 h-4 text-primary" />
                        <h3 className="font-semibold">Types d'animations</h3>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {animations.map((animation) => (
                          <Card
                            key={animation.id}
                            className="p-3 cursor-pointer transition-all duration-200 hover:shadow-md border-border/50 hover:border-purple-500/30"
                          >
                            <div className="text-center">
                              <div className="text-2xl mb-2">{animation.icon}</div>
                              <p className="text-xs font-medium">{animation.name}</p>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* Stickers */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <SparklesIcon className="w-4 h-4 text-primary" />
                        <h3 className="font-semibold">Stickers et éléments</h3>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {stickers.map((sticker) => (
                          <Card
                            key={sticker.id}
                            className="p-3 cursor-pointer transition-all duration-200 hover:shadow-md border-border/50 hover:border-purple-500/30"
                          >
                            <div className="text-center">
                              <div className="text-2xl mb-2">{sticker.icon}</div>
                              <p className="text-xs font-medium">{sticker.name}</p>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* Features Toggles */}
                    <div className="grid grid-cols-3 gap-4">
                      <Card className="p-4 border-border/50">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Animations</span>
                          <Switch checked={addAnimations} onCheckedChange={setAddAnimations} />
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
                          <span className="text-sm font-medium">Stickers</span>
                          <Switch checked={addStickers} onCheckedChange={setAddStickers} />
                        </div>
                      </Card>
                    </div>

                    {/* Advanced Options */}
                    <Card className="p-4 border-border/50 bg-secondary/20">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-sm">Transitions automatiques</h4>
                          <p className="text-xs text-muted-foreground">
                            Ajoute des transitions fluides entre les éléments
                          </p>
                        </div>
                        <Switch checked={autoTransitions} onCheckedChange={setAutoTransitions} />
                      </div>
                    </Card>

                    {/* Export */}
                    <div className="pt-4 border-t border-border/50">
                      <div className="flex gap-3">
                        <Button
                          className="flex-1 bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600"
                          size="lg"
                        >
                          <SparklesIcon className="w-4 h-4 mr-2" />
                          Créer la Story
                        </Button>
                        <Button variant="outline" size="lg" className="bg-transparent">
                          Exporter
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground text-center mt-2">
                        Compatible Instagram, Facebook, Snapchat • Format 9:16 • Jusqu'à 30 secondes
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
