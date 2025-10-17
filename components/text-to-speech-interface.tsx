"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

const languages = [
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
]

const voiceStyles = [
  { id: "masculine", name: "Masculine", icon: "👨" },
  { id: "feminine", name: "Féminine", icon: "👩" },
  { id: "child", name: "Enfant", icon: "👶" },
  { id: "robotic", name: "Robotique", icon: "🤖" },
  { id: "narrator", name: "Narrateur", icon: "🎙️" },
  { id: "energetic", name: "Énergique", icon: "⚡" },
]

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 6 6 18" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m6 6 12 12" />
  </svg>
)

const PlayIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
)

const DownloadIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} points="7 10 12 15 17 10" />
    <line strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} x1="12" y1="15" x2="12" y2="3" />
  </svg>
)

interface TextToSpeechInterfaceProps {
  isOpen: boolean
  onClose: () => void
}

export function TextToSpeechInterface({ isOpen, onClose }: TextToSpeechInterfaceProps) {
  const [text, setText] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("fr")
  const [selectedVoice, setSelectedVoice] = useState("masculine")
  const [speed, setSpeed] = useState([1])
  const [pitch, setPitch] = useState([1])
  const [expressivity, setExpressivity] = useState([0.5])
  const [isGenerating, setIsGenerating] = useState(false)
  const [hasGenerated, setHasGenerated] = useState(false)

  const maxChars = 5000
  const remainingChars = maxChars - text.length

  const handleGenerate = () => {
    setIsGenerating(true)
    // Simulate generation
    setTimeout(() => {
      setIsGenerating(false)
      setHasGenerated(true)
    }, 2000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="w-full max-w-6xl bg-background rounded-3xl shadow-2xl animate-scale-up border border-border/50">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/50">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Texte en discours
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Convertissez votre texte en voix naturelle avec l'IA
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full hover:bg-secondary/80">
                <XIcon className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              {/* Text Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Votre texte</label>
                <Textarea
                  placeholder="Tapez votre script ici..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[150px] resize-none"
                  maxLength={maxChars}
                />
                <div className="flex justify-end">
                  <span className={`text-xs ${remainingChars < 100 ? "text-destructive" : "text-muted-foreground"}`}>
                    {remainingChars} caractères restants
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Language Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Langue</label>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          <span className="flex items-center gap-2">
                            <span>{lang.flag}</span>
                            <span>{lang.name}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Voice Style Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Style de voix</label>
                  <div className="grid grid-cols-3 gap-2">
                    {voiceStyles.map((voice) => (
                      <Card
                        key={voice.id}
                        className={`cursor-pointer transition-all duration-200 ${
                          selectedVoice === voice.id
                            ? "border-primary bg-primary/5"
                            : "hover:border-primary/50 hover:bg-secondary/50"
                        }`}
                        onClick={() => setSelectedVoice(voice.id)}
                      >
                        <CardContent className="p-3 text-center">
                          <div className="text-2xl mb-1">{voice.icon}</div>
                          <div className="text-xs font-medium">{voice.name}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>

              {/* Advanced Options */}
              <div className="space-y-4 p-4 bg-secondary/20 rounded-xl">
                <h3 className="text-sm font-semibold">Options avancées</h3>

                <div className="space-y-4">
                  {/* Speed */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm">Vitesse</label>
                      <span className="text-sm text-muted-foreground">{speed[0]}x</span>
                    </div>
                    <Slider value={speed} onValueChange={setSpeed} min={0.5} max={2} step={0.1} />
                  </div>

                  {/* Pitch */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm">Tonalité</label>
                      <span className="text-sm text-muted-foreground">
                        {pitch[0] < 1 ? "Grave" : pitch[0] > 1 ? "Aigu" : "Normal"}
                      </span>
                    </div>
                    <Slider value={pitch} onValueChange={setPitch} min={0.5} max={1.5} step={0.1} />
                  </div>

                  {/* Expressivity */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm">Expressivité</label>
                      <span className="text-sm text-muted-foreground">
                        {expressivity[0] < 0.3 ? "Neutre" : expressivity[0] > 0.7 ? "Émotionnelle" : "Modérée"}
                      </span>
                    </div>
                    <Slider value={expressivity} onValueChange={setExpressivity} min={0} max={1} step={0.1} />
                  </div>
                </div>
              </div>

              {/* Preview Section */}
              {hasGenerated && (
                <div className="space-y-4 p-4 bg-primary/5 rounded-xl border border-primary/20">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">Prévisualisation</h3>
                    <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                      Prêt
                    </Badge>
                  </div>

                  {/* Audio Player Mockup */}
                  <div className="flex items-center gap-4 p-4 bg-background rounded-lg">
                    <Button size="sm" className="rounded-full w-10 h-10 p-0">
                      <PlayIcon className="w-4 h-4" />
                    </Button>
                    <div className="flex-1 h-12 bg-secondary/50 rounded-lg relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center gap-1 px-2">
                        {Array.from({ length: 50 }).map((_, i) => (
                          <div
                            key={i}
                            className="flex-1 bg-primary/40 rounded-full"
                            style={{ height: `${Math.random() * 100}%` }}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">0:00 / 0:15</span>
                  </div>

                  {/* Export Options */}
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 bg-transparent">
                      <DownloadIcon className="w-4 h-4 mr-2" />
                      MP3
                    </Button>
                    <Button variant="outline" className="flex-1 bg-transparent">
                      <DownloadIcon className="w-4 h-4 mr-2" />
                      WAV
                    </Button>
                    <Button variant="outline" className="flex-1 bg-transparent">
                      <DownloadIcon className="w-4 h-4 mr-2" />
                      OGG
                    </Button>
                  </div>

                  <Button className="w-full">Ajouter à mon projet</Button>
                </div>
              )}

              {/* Generate Button */}
              {!hasGenerated && (
                <Button className="w-full" size="lg" onClick={handleGenerate} disabled={!text.trim() || isGenerating}>
                  {isGenerating ? "Génération en cours..." : "Générer la voix"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
