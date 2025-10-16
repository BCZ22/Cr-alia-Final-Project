"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"

const reelStyles = [
  { id: "viral", name: "Viral", desc: "Accrocheur et tendance", color: "from-pink-500 to-purple-500" },
  { id: "educational", name: "Éducatif", desc: "Informatif et clair", color: "from-blue-500 to-cyan-500" },
  { id: "motivational", name: "Motivant", desc: "Inspirant et énergique", color: "from-orange-500 to-red-500" },
  { id: "storytelling", name: "Storytelling", desc: "Narratif et captivant", color: "from-green-500 to-teal-500" },
  { id: "comedy", name: "Comédie", desc: "Drôle et divertissant", color: "from-yellow-500 to-orange-500" },
  { id: "aesthetic", name: "Esthétique", desc: "Visuel et artistique", color: "from-purple-500 to-pink-500" },
]

const platforms = [
  { id: "instagram", name: "Instagram Reels", icon: "📸", ratio: "9:16", duration: "90s" },
  { id: "tiktok", name: "TikTok", icon: "🎵", ratio: "9:16", duration: "60s" },
  { id: "youtube", name: "YouTube Shorts", icon: "▶️", ratio: "9:16", duration: "60s" },
  { id: "facebook", name: "Facebook Reels", icon: "👥", ratio: "9:16", duration: "90s" },
]

const musicMoods = [
  { id: "upbeat", name: "Énergique", emoji: "⚡" },
  { id: "chill", name: "Relaxant", emoji: "🌊" },
  { id: "dramatic", name: "Dramatique", emoji: "🎭" },
  { id: "happy", name: "Joyeux", emoji: "😊" },
  { id: "epic", name: "Épique", emoji: "🔥" },
  { id: "romantic", name: "Romantique", emoji: "💕" },
]

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 6 6 18" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m6 6 12 12" />
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

const VideoIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polygon strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} points="23 7 16 12 23 17 23 7" />
    <rect
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      x="1"
      y="5"
      width="15"
      height="14"
      rx="2"
      ry="2"
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

const DownloadIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} points="7 10 12 15 17 10" />
    <line strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} x1="12" y1="15" x2="12" y2="3" />
  </svg>
)

const RefreshIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    />
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

const ImageIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      x="3"
      y="3"
      width="18"
      height="18"
      rx="2"
      ry="2"
    />
    <circle strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} cx="8.5" cy="8.5" r="1.5" />
    <polyline strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} points="21 15 16 10 5 21" />
  </svg>
)

const TrashIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polyline strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} points="3 6 5 6 21 6" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
    />
  </svg>
)

interface AIReelsGeneratorInterfaceProps {
  isOpen: boolean
  onClose: () => void
}

export function AIReelsGeneratorInterface({ isOpen, onClose }: AIReelsGeneratorInterfaceProps) {
  const [topic, setTopic] = useState("")
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null)
  const [selectedPlatform, setSelectedPlatform] = useState<string>("instagram")
  const [selectedMusicMood, setSelectedMusicMood] = useState<string | null>(null)
  const [duration, setDuration] = useState([30])
  const [includeSubtitles, setIncludeSubtitles] = useState(true)
  const [includeMusic, setIncludeMusic] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [hasGenerated, setHasGenerated] = useState(false)
  const [generatedScenes, setGeneratedScenes] = useState<string[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<
    Array<{ name: string; type: string; size: number; preview?: string }>
  >([])
  const [isDragging, setIsDragging] = useState(false)

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return

    const newFiles = Array.from(files).map((file) => ({
      name: file.name,
      type: file.type,
      size: file.size,
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
    }))

    setUploadedFiles((prev) => [...prev, ...newFiles])
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileUpload(e.dataTransfer.files)
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setGeneratedScenes([
        "Scène d'ouverture accrocheuse avec texte animé",
        "Transition dynamique avec effet de zoom",
        "Contenu principal avec visuels engageants",
        "Call-to-action final avec animation",
      ])
      setIsGenerating(false)
      setHasGenerated(true)
    }, 4000)
  }

  const handleRegenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
    }, 3000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="w-full max-w-7xl bg-background rounded-3xl shadow-2xl animate-scale-up border border-border/50">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/50">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Générateur de Reels IA
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Créez des Reels viraux en quelques secondes avec l'IA
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full hover:bg-secondary/80">
                <XIcon className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Panel - Configuration */}
                <div className="lg:col-span-2 space-y-6">
                  {/* File Upload Section */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Importer vos médias (optionnel)</label>
                    <div
                      className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-200 ${
                        isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        multiple
                        accept="image/*,video/*"
                        onChange={(e) => handleFileUpload(e.target.files)}
                      />
                      <label htmlFor="file-upload" className="flex flex-col items-center justify-center cursor-pointer">
                        <UploadIcon className="w-12 h-12 text-muted-foreground mb-3" />
                        <p className="text-sm font-medium mb-1">Glissez-déposez vos fichiers ici</p>
                        <p className="text-xs text-muted-foreground mb-3">ou cliquez pour parcourir</p>
                        <p className="text-xs text-muted-foreground">
                          Images et vidéos acceptées (max 100MB par fichier)
                        </p>
                      </label>
                    </div>

                    {/* Uploaded Files List */}
                    {uploadedFiles.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">
                          {uploadedFiles.length} fichier{uploadedFiles.length > 1 ? "s" : ""} importé
                          {uploadedFiles.length > 1 ? "s" : ""}
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {uploadedFiles.map((file, index) => (
                            <div
                              key={index}
                              className="relative group bg-secondary/20 rounded-lg p-3 border border-border/50"
                            >
                              {file.preview ? (
                                <div className="aspect-square rounded-md overflow-hidden mb-2 bg-secondary">
                                  <img
                                    src={file.preview || "/placeholder.svg"}
                                    alt={file.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="aspect-square rounded-md overflow-hidden mb-2 bg-secondary flex items-center justify-center">
                                  <VideoIcon className="w-8 h-8 text-muted-foreground" />
                                </div>
                              )}
                              <p className="text-xs font-medium truncate mb-1">{file.name}</p>
                              <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                              <Button
                                variant="destructive"
                                size="sm"
                                className="absolute top-1 right-1 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeFile(index)}
                              >
                                <TrashIcon className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Topic Input */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Sujet du Reel</label>
                    <Textarea
                      placeholder="Ex: 5 astuces pour améliorer votre productivité, recette rapide de smoothie, tutoriel maquillage..."
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="min-h-[100px] resize-none"
                    />
                    <p className="text-xs text-muted-foreground">
                      Décrivez le sujet de votre Reel. Plus vous êtes précis, meilleur sera le résultat.
                    </p>
                  </div>

                  {/* Style Selection */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Style de Reel</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {reelStyles.map((style) => (
                        <Card
                          key={style.id}
                          className={`cursor-pointer transition-all duration-200 ${
                            selectedStyle === style.id
                              ? "border-primary bg-primary/5 shadow-md"
                              : "hover:border-primary/50"
                          }`}
                          onClick={() => setSelectedStyle(style.id)}
                        >
                          <CardContent className="p-4">
                            <div className={`w-full h-2 rounded-full bg-gradient-to-r ${style.color} mb-3`} />
                            <h4 className="font-medium text-sm mb-1">{style.name}</h4>
                            <p className="text-xs text-muted-foreground">{style.desc}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Platform Selection */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Plateforme cible</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {platforms.map((platform) => (
                        <Card
                          key={platform.id}
                          className={`cursor-pointer transition-all duration-200 ${
                            selectedPlatform === platform.id
                              ? "border-primary bg-primary/5 shadow-md"
                              : "hover:border-primary/50"
                          }`}
                          onClick={() => setSelectedPlatform(platform.id)}
                        >
                          <CardContent className="p-4 text-center">
                            <div className="text-3xl mb-2">{platform.icon}</div>
                            <h4 className="font-medium text-sm mb-1">{platform.name}</h4>
                            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                              <span>{platform.ratio}</span>
                              <span>•</span>
                              <span>{platform.duration}</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Duration Slider */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Durée du Reel</label>
                      <span className="text-sm text-primary font-medium">{duration[0]}s</span>
                    </div>
                    <Slider value={duration} onValueChange={setDuration} min={15} max={90} step={5} />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>15s</span>
                      <span>90s</span>
                    </div>
                  </div>

                  {/* Music Mood */}
                  {includeMusic && (
                    <div className="space-y-3">
                      <label className="text-sm font-medium">Ambiance musicale</label>
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                        {musicMoods.map((mood) => (
                          <Button
                            key={mood.id}
                            variant={selectedMusicMood === mood.id ? "default" : "outline"}
                            className="h-auto py-3 flex flex-col items-center gap-1"
                            onClick={() => setSelectedMusicMood(mood.id)}
                          >
                            <span className="text-xl">{mood.emoji}</span>
                            <span className="text-xs">{mood.name}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Options */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Options</label>
                    <div className="flex flex-wrap gap-3">
                      <Button
                        variant={includeSubtitles ? "default" : "outline"}
                        size="sm"
                        onClick={() => setIncludeSubtitles(!includeSubtitles)}
                        className="bg-transparent"
                      >
                        Sous-titres automatiques
                      </Button>
                      <Button
                        variant={includeMusic ? "default" : "outline"}
                        size="sm"
                        onClick={() => setIncludeMusic(!includeMusic)}
                        className="bg-transparent"
                      >
                        <MusicIcon className="w-4 h-4 mr-2" />
                        Musique de fond
                      </Button>
                    </div>
                  </div>

                  {/* Generate Button */}
                  {!hasGenerated ? (
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleGenerate}
                      disabled={!topic || !selectedStyle || isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <SparklesIcon className="w-5 h-5 mr-2 animate-pulse" />
                          Génération en cours...
                        </>
                      ) : (
                        <>
                          <SparklesIcon className="w-5 h-5 mr-2" />
                          Générer le Reel
                        </>
                      )}
                    </Button>
                  ) : (
                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1 bg-transparent" onClick={handleRegenerate}>
                        <RefreshIcon className="w-4 h-4 mr-2" />
                        Régénérer
                      </Button>
                      <Button className="flex-1">
                        <DownloadIcon className="w-4 h-4 mr-2" />
                        Télécharger
                      </Button>
                    </div>
                  )}
                </div>

                {/* Right Panel - Preview & Info */}
                <div className="space-y-4">
                  {/* Preview */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Aperçu</label>
                    <div className="relative aspect-[9/16] bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl overflow-hidden border border-border/50">
                      {hasGenerated ? (
                        <div className="absolute inset-0 flex items-center justify-center p-6">
                          <div className="text-center">
                            <VideoIcon className="w-16 h-16 mx-auto mb-4 text-primary" />
                            <p className="text-sm font-medium mb-2">Reel généré avec succès!</p>
                            <p className="text-xs text-muted-foreground">Votre Reel de {duration[0]}s est prêt</p>
                          </div>
                        </div>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center p-6">
                          <div className="text-center">
                            <SparklesIcon className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">L'aperçu apparaîtra ici après la génération</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Generated Scenes */}
                  {hasGenerated && generatedScenes.length > 0 && (
                    <div className="space-y-3 p-4 bg-secondary/20 rounded-xl">
                      <h4 className="text-sm font-semibold">Scènes générées</h4>
                      <div className="space-y-2">
                        {generatedScenes.map((scene, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-background rounded-lg">
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-medium text-primary">{index + 1}</span>
                            </div>
                            <p className="text-sm text-muted-foreground flex-1">{scene}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="space-y-2 p-4 bg-secondary/20 rounded-xl">
                    <h4 className="text-sm font-semibold">Informations</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Durée:</span>
                        <span className="font-medium">{duration[0]}s</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Format:</span>
                        <span className="font-medium">9:16 (Vertical)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Résolution:</span>
                        <span className="font-medium">1080x1920</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Style:</span>
                        <span className="font-medium">
                          {selectedStyle ? reelStyles.find((s) => s.id === selectedStyle)?.name : "Non sélectionné"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tips */}
                  <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                    <h4 className="text-sm font-semibold mb-2">Conseils pour un Reel viral</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Accrochez dans les 3 premières secondes</li>
                      <li>• Utilisez des sous-titres pour plus d'engagement</li>
                      <li>• Choisissez une musique tendance</li>
                      <li>• Ajoutez un call-to-action clair</li>
                    </ul>
                  </div>

                  {/* Quick Actions */}
                  {hasGenerated && (
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full bg-transparent" size="sm">
                        Ajouter au projet
                      </Button>
                      <Button variant="outline" className="w-full bg-transparent" size="sm">
                        Partager
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
