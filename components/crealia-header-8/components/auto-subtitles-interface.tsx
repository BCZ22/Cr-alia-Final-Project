"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"

const languages = [
  { id: "fr", name: "Français", flag: "🇫🇷" },
  { id: "en", name: "Anglais", flag: "🇬🇧" },
  { id: "es", name: "Espagnol", flag: "🇪🇸" },
  { id: "de", name: "Allemand", flag: "🇩🇪" },
  { id: "it", name: "Italien", flag: "🇮🇹" },
  { id: "pt", name: "Portugais", flag: "🇵🇹" },
  { id: "ar", name: "Arabe", flag: "🇸🇦" },
  { id: "zh", name: "Chinois", flag: "🇨🇳" },
  { id: "ja", name: "Japonais", flag: "🇯🇵" },
  { id: "ko", name: "Coréen", flag: "🇰🇷" },
]

const subtitleStyles = [
  { id: "classic", name: "Classique", desc: "Blanc sur noir", preview: "bg-black text-white" },
  { id: "modern", name: "Moderne", desc: "Fond transparent", preview: "bg-transparent text-white" },
  { id: "bold", name: "Gras", desc: "Texte épais", preview: "bg-black text-white font-bold" },
  { id: "outline", name: "Contour", desc: "Texte avec bordure", preview: "text-white" },
  { id: "shadow", name: "Ombre", desc: "Avec ombre portée", preview: "text-white" },
  { id: "box", name: "Boîte", desc: "Fond coloré", preview: "bg-primary text-white" },
]

const fontFamilies = [
  { id: "arial", name: "Arial" },
  { id: "helvetica", name: "Helvetica" },
  { id: "roboto", name: "Roboto" },
  { id: "opensans", name: "Open Sans" },
  { id: "montserrat", name: "Montserrat" },
  { id: "poppins", name: "Poppins" },
]

const positions = [
  { id: "top", name: "Haut", icon: "⬆️" },
  { id: "middle", name: "Milieu", icon: "↔️" },
  { id: "bottom", name: "Bas", icon: "⬇️" },
]

const animations = [
  { id: "none", name: "Aucune" },
  { id: "fade", name: "Fondu" },
  { id: "slide", name: "Glissement" },
  { id: "zoom", name: "Zoom" },
  { id: "bounce", name: "Rebond" },
  { id: "typewriter", name: "Machine à écrire" },
]

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
      d="M7 16a4 4 0 0 1-.88-7.903A5 5 0 1 1 15.9 6L16 6a5 5 0 0 1 1 9.9M15 13l-3-3m0 0-3 3m3-3v12"
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

const DownloadIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} points="7 10 12 15 17 10" />
    <line strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} x1="12" y1="15" x2="12" y2="3" />
  </svg>
)

const EditIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5m-1.414-9.414a2 2 0 1 1 2.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
)

const GlobeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} cx="12" cy="12" r="10" />
    <line strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} x1="2" y1="12" x2="22" y2="12" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
    />
  </svg>
)

const PlayIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
)

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polyline strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} points="20 6 9 17 4 12" />
  </svg>
)

interface AutoSubtitlesInterfaceProps {
  isOpen: boolean
  onClose: () => void
}

export function AutoSubtitlesInterface({ isOpen, onClose }: AutoSubtitlesInterfaceProps) {
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null)
  const [sourceLanguage, setSourceLanguage] = useState<string>("auto")
  const [targetLanguages, setTargetLanguages] = useState<string[]>([])
  const [selectedStyle, setSelectedStyle] = useState<string>("classic")
  const [selectedFont, setSelectedFont] = useState<string>("arial")
  const [selectedPosition, setSelectedPosition] = useState<string>("bottom")
  const [selectedAnimation, setSelectedAnimation] = useState<string>("fade")
  const [fontSize, setFontSize] = useState([24])
  const [isGenerating, setIsGenerating] = useState(false)
  const [hasGenerated, setHasGenerated] = useState(false)
  const [showEditor, setShowEditor] = useState(false)
  const [subtitles, setSubtitles] = useState<Array<{ time: string; text: string }>>([
    { time: "00:00", text: "Bienvenue dans cette vidéo" },
    { time: "00:03", text: "Aujourd'hui nous allons découvrir" },
    { time: "00:06", text: "Comment créer des sous-titres automatiques" },
  ])

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedVideo(file)
    }
  }

  const toggleTargetLanguage = (langId: string) => {
    setTargetLanguages((prev) => (prev.includes(langId) ? prev.filter((id) => id !== langId) : [...prev, langId]))
  }

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      setHasGenerated(true)
    }, 5000)
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
                  Sous-titres Automatiques
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Générez des sous-titres IA multilingues pour vos vidéos
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
                  {/* Video Upload */}
                  {!uploadedVideo ? (
                    <div
                      className="border-2 border-dashed border-border rounded-2xl p-12 text-center hover:border-primary/50 transition-colors cursor-pointer"
                      onClick={() => document.getElementById("subtitle-video-upload")?.click()}
                    >
                      <UploadIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">Importer une vidéo</h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        Glissez-déposez votre vidéo ou cliquez pour parcourir
                      </p>
                      <p className="text-xs text-muted-foreground">Formats supportés: MP4, MOV, AVI (max 500MB)</p>
                      <input
                        id="subtitle-video-upload"
                        type="file"
                        accept="video/*"
                        onChange={handleVideoUpload}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Video Preview */}
                      <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <VideoIcon className="w-16 h-16 text-white/50" />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                          <div className="flex items-center justify-between text-white">
                            <div className="flex items-center gap-3">
                              <Button size="sm" variant="secondary" className="rounded-full w-10 h-10 p-0">
                                <PlayIcon className="w-4 h-4" />
                              </Button>
                              <div>
                                <h4 className="font-medium text-sm">{uploadedVideo.name}</h4>
                                <p className="text-xs text-white/70">
                                  {(uploadedVideo.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setUploadedVideo(null)}>
                              Changer
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Language Detection */}
                      <div className="space-y-3">
                        <label className="text-sm font-medium">Langue source</label>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant={sourceLanguage === "auto" ? "default" : "outline"}
                            onClick={() => setSourceLanguage("auto")}
                            className="bg-transparent"
                          >
                            <SparklesIcon className="w-4 h-4 mr-2" />
                            Détection automatique
                          </Button>
                          <select
                            className="bg-background border border-border rounded-lg px-3 py-2 text-sm"
                            value={sourceLanguage}
                            onChange={(e) => setSourceLanguage(e.target.value)}
                          >
                            <option value="auto">Auto</option>
                            {languages.map((lang) => (
                              <option key={lang.id} value={lang.id}>
                                {lang.flag} {lang.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Translation Languages */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">Traduire en (optionnel)</label>
                          <Badge variant="secondary" className="text-xs">
                            {targetLanguages.length} sélectionnée(s)
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                          {languages.map((lang) => (
                            <Button
                              key={lang.id}
                              variant={targetLanguages.includes(lang.id) ? "default" : "outline"}
                              size="sm"
                              onClick={() => toggleTargetLanguage(lang.id)}
                              className="h-auto py-2 flex flex-col items-center gap-1 bg-transparent"
                            >
                              <span className="text-lg">{lang.flag}</span>
                              <span className="text-xs">{lang.name}</span>
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Subtitle Style */}
                      <div className="space-y-3">
                        <label className="text-sm font-medium">Style de sous-titres</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {subtitleStyles.map((style) => (
                            <Card
                              key={style.id}
                              className={`cursor-pointer transition-all duration-200 ${
                                selectedStyle === style.id
                                  ? "border-primary bg-primary/5 shadow-md"
                                  : "hover:border-primary/50"
                              }`}
                              onClick={() => setSelectedStyle(style.id)}
                            >
                              <CardContent className="p-3">
                                <div
                                  className={`w-full h-8 rounded flex items-center justify-center text-xs mb-2 ${style.preview}`}
                                >
                                  Exemple
                                </div>
                                <h4 className="font-medium text-sm mb-1">{style.name}</h4>
                                <p className="text-xs text-muted-foreground">{style.desc}</p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>

                      {/* Font Settings */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <label className="text-sm font-medium">Police</label>
                          <select
                            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm"
                            value={selectedFont}
                            onChange={(e) => setSelectedFont(e.target.value)}
                          >
                            {fontFamilies.map((font) => (
                              <option key={font.id} value={font.id}>
                                {font.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">Taille</label>
                            <span className="text-sm text-primary font-medium">{fontSize[0]}px</span>
                          </div>
                          <Slider value={fontSize} onValueChange={setFontSize} min={12} max={48} step={2} />
                        </div>
                      </div>

                      {/* Position */}
                      <div className="space-y-3">
                        <label className="text-sm font-medium">Position</label>
                        <div className="grid grid-cols-3 gap-3">
                          {positions.map((pos) => (
                            <Button
                              key={pos.id}
                              variant={selectedPosition === pos.id ? "default" : "outline"}
                              onClick={() => setSelectedPosition(pos.id)}
                              className="bg-transparent"
                            >
                              <span className="mr-2">{pos.icon}</span>
                              {pos.name}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Animation */}
                      <div className="space-y-3">
                        <label className="text-sm font-medium">Animation</label>
                        <div className="grid grid-cols-3 gap-2">
                          {animations.map((anim) => (
                            <Button
                              key={anim.id}
                              variant={selectedAnimation === anim.id ? "default" : "outline"}
                              size="sm"
                              onClick={() => setSelectedAnimation(anim.id)}
                              className="bg-transparent"
                            >
                              {anim.name}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Generate Button */}
                      {!hasGenerated ? (
                        <Button
                          className="w-full"
                          size="lg"
                          onClick={handleGenerate}
                          disabled={!uploadedVideo || isGenerating}
                        >
                          {isGenerating ? (
                            <>
                              <SparklesIcon className="w-5 h-5 mr-2 animate-pulse" />
                              Génération en cours...
                            </>
                          ) : (
                            <>
                              <SparklesIcon className="w-5 h-5 mr-2" />
                              Générer les sous-titres
                            </>
                          )}
                        </Button>
                      ) : (
                        <div className="flex gap-3">
                          <Button
                            variant="outline"
                            className="flex-1 bg-transparent"
                            onClick={() => setShowEditor(true)}
                          >
                            <EditIcon className="w-4 h-4 mr-2" />
                            Éditer
                          </Button>
                          <Button className="flex-1">
                            <DownloadIcon className="w-4 h-4 mr-2" />
                            Exporter
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Right Panel - Preview & Info */}
                <div className="space-y-4">
                  {/* Settings Summary */}
                  <div className="space-y-2 p-4 bg-secondary/20 rounded-xl">
                    <h4 className="text-sm font-semibold">Paramètres</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Langue source:</span>
                        <span className="font-medium">{sourceLanguage === "auto" ? "Auto" : sourceLanguage}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Traductions:</span>
                        <span className="font-medium">{targetLanguages.length || "Aucune"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Style:</span>
                        <span className="font-medium">{subtitleStyles.find((s) => s.id === selectedStyle)?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Police:</span>
                        <span className="font-medium">{fontFamilies.find((f) => f.id === selectedFont)?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Taille:</span>
                        <span className="font-medium">{fontSize[0]}px</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Position:</span>
                        <span className="font-medium">{positions.find((p) => p.id === selectedPosition)?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Animation:</span>
                        <span className="font-medium">{animations.find((a) => a.id === selectedAnimation)?.name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Subtitle Preview */}
                  {hasGenerated && (
                    <div className="space-y-3">
                      <label className="text-sm font-medium">Aperçu des sous-titres</label>
                      <div className="space-y-2 max-h-[300px] overflow-y-auto p-3 bg-secondary/10 rounded-xl">
                        {subtitles.map((sub, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-2 hover:bg-secondary/20 rounded-lg transition-colors"
                          >
                            <Badge variant="secondary" className="text-xs shrink-0">
                              {sub.time}
                            </Badge>
                            <p className="text-sm flex-1">{sub.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Export Options */}
                  {hasGenerated && (
                    <div className="space-y-3 p-4 bg-secondary/20 rounded-xl">
                      <h4 className="text-sm font-semibold">Options d'export</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Format vidéo:</span>
                          <select className="bg-background border border-border rounded px-2 py-1 text-xs">
                            <option>MP4</option>
                            <option>MOV</option>
                            <option>AVI</option>
                          </select>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Format sous-titres:</span>
                          <select className="bg-background border border-border rounded px-2 py-1 text-xs">
                            <option>Intégrés</option>
                            <option>SRT</option>
                            <option>VTT</option>
                            <option>ASS</option>
                          </select>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Qualité:</span>
                          <select className="bg-background border border-border rounded px-2 py-1 text-xs">
                            <option>Originale</option>
                            <option>1080p</option>
                            <option>720p</option>
                            <option>480p</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Features */}
                  <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <CheckIcon className="w-4 h-4 text-primary" />
                      Fonctionnalités
                    </h4>
                    <ul className="text-xs text-muted-foreground space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckIcon className="w-3 h-3 text-primary mt-0.5 shrink-0" />
                        <span>Détection automatique de la langue</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckIcon className="w-3 h-3 text-primary mt-0.5 shrink-0" />
                        <span>Traduction multilingue instantanée</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckIcon className="w-3 h-3 text-primary mt-0.5 shrink-0" />
                        <span>Synchronisation précise au pixel près</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckIcon className="w-3 h-3 text-primary mt-0.5 shrink-0" />
                        <span>Styles et animations personnalisables</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckIcon className="w-3 h-3 text-primary mt-0.5 shrink-0" />
                        <span>Édition manuelle des sous-titres</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckIcon className="w-3 h-3 text-primary mt-0.5 shrink-0" />
                        <span>Export dans tous les formats</span>
                      </li>
                    </ul>
                  </div>

                  {/* Tips */}
                  <div className="p-4 bg-secondary/20 rounded-xl">
                    <h4 className="text-sm font-semibold mb-2">Conseils</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Utilisez une vidéo avec un audio clair</li>
                      <li>• Évitez les bruits de fond importants</li>
                      <li>• Vérifiez les sous-titres avant export</li>
                      <li>• Testez différents styles pour votre audience</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtitle Editor Modal */}
      {showEditor && (
        <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-background rounded-2xl shadow-2xl border border-border/50">
            <div className="flex items-center justify-between p-4 border-b border-border/50">
              <h3 className="text-lg font-semibold">Éditeur de sous-titres</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowEditor(false)}>
                <XIcon className="w-5 h-5" />
              </Button>
            </div>
            <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
              {subtitles.map((sub, index) => (
                <div key={index} className="flex gap-3 p-3 bg-secondary/10 rounded-lg">
                  <input
                    type="text"
                    value={sub.time}
                    className="w-20 bg-background border border-border rounded px-2 py-1 text-sm"
                    readOnly
                  />
                  <Textarea
                    value={sub.text}
                    onChange={(e) => {
                      const newSubtitles = [...subtitles]
                      newSubtitles[index].text = e.target.value
                      setSubtitles(newSubtitles)
                    }}
                    className="flex-1 min-h-[60px] resize-none"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 p-4 border-t border-border/50">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowEditor(false)}>
                Annuler
              </Button>
              <Button className="flex-1" onClick={() => setShowEditor(false)}>
                Enregistrer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
