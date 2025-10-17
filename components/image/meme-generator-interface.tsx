"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NativeSelect, NativeSelectItem } from "@/components/ui/native-select"
import { NativeTabs, NativeTabsList, NativeTabsTrigger, NativeTabsContent } from "@/components/ui/native-tabs"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import {
  Sparkles,
  Upload,
  Download,
  Share2,
  AlertCircle,
  Lightbulb,
  Shield,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  X,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface MemeConfig {
  topText: string
  bottomText: string
  template: string
  textStyle: string
  fontSize: number
  hasCustomImage: boolean
}

interface ValidationError {
  field: string
  message: string
}

interface AISuggestion {
  topText: string
  bottomText: string
  tone: string
  confidence: number
}

interface ModerationResult {
  status: "safe" | "warning" | "blocked"
  issues: string[]
  suggestions: string[]
  score: number
}

function validateMemeConfig(config: MemeConfig): ValidationError[] {
  const errors: ValidationError[] = []

  if (config.topText.length > 100) {
    errors.push({ field: "topText", message: "Le texte du haut ne peut pas dépasser 100 caractères" })
  }

  if (config.bottomText.length > 100) {
    errors.push({ field: "bottomText", message: "Le texte du bas ne peut pas dépasser 100 caractères" })
  }

  if (config.fontSize < 20 || config.fontSize > 80) {
    errors.push({ field: "fontSize", message: "La taille de police doit être entre 20 et 80" })
  }

  if (config.template === "custom" && !config.hasCustomImage) {
    errors.push({ field: "template", message: "Veuillez importer une image pour le modèle personnalisé" })
  }

  return errors
}

interface MemeGeneratorInterfaceProps {
  isOpen: boolean
  onClose: () => void
}

export function MemeGeneratorInterface({ isOpen, onClose }: MemeGeneratorInterfaceProps) {
  const [topText, setTopText] = useState("")
  const [bottomText, setBottomText] = useState("")
  const [template, setTemplate] = useState("custom")
  const [textStyle, setTextStyle] = useState("classic")
  const [fontSize, setFontSize] = useState([48])
  const [hasCustomImage, setHasCustomImage] = useState(false)
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])
  const [generating, setGenerating] = useState(false)

  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([])
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const [selectedTone, setSelectedTone] = useState("funny")

  const [moderationResult, setModerationResult] = useState<ModerationResult | null>(null)
  const [checkingModeration, setCheckingModeration] = useState(false)
  const [autoModerate, setAutoModerate] = useState(true)

  const popularTemplates = [
    { id: "drake", name: "Drake Hotline Bling" },
    { id: "distracted", name: "Distracted Boyfriend" },
    { id: "buttons", name: "Two Buttons" },
    { id: "change-mind", name: "Change My Mind" },
    { id: "brain", name: "Expanding Brain" },
    { id: "success", name: "Success Kid" },
    { id: "disaster", name: "Disaster Girl" },
    { id: "doge", name: "Doge" },
    { id: "woman-yelling", name: "Woman Yelling at Cat" },
    { id: "stonks", name: "Stonks" },
  ]

  const textStyles = [
    { id: "classic", name: "Classique", description: "Impact blanc avec contour noir" },
    { id: "modern", name: "Moderne", description: "Sans-serif épuré" },
    { id: "minimal", name: "Minimaliste", description: "Texte simple sans effet" },
    { id: "bold", name: "Audacieux", description: "Gras avec ombre portée" },
  ]

  const tones = [
    { id: "funny", name: "Drôle", icon: "😂" },
    { id: "sarcastic", name: "Sarcastique", icon: "😏" },
    { id: "wholesome", name: "Bienveillant", icon: "🥰" },
    { id: "relatable", name: "Relatable", icon: "🤝" },
    { id: "absurd", name: "Absurde", icon: "🤪" },
  ]

  const handleImageUpload = () => {
    setHasCustomImage(true)
    console.log("[v0] Custom meme image uploaded")
    window.dispatchEvent(new CustomEvent("meme:image-uploaded"))
  }

  const handleAISuggest = () => {
    setLoadingSuggestions(true)
    console.log("[v0] Requesting AI caption suggestions with tone:", selectedTone)
    window.dispatchEvent(new CustomEvent("meme:ai-suggest-start", { detail: { tone: selectedTone } }))

    setTimeout(() => {
      const suggestions: AISuggestion[] = [
        {
          topText: "QUAND TU CODES TOUTE LA NUIT",
          bottomText: "ET ÇA MARCHE DU PREMIER COUP",
          tone: selectedTone,
          confidence: 0.95,
        },
        {
          topText: "MOI: JE VAIS ME COUCHER TÔT CE SOIR",
          bottomText: "AUSSI MOI À 3H DU MATIN",
          tone: selectedTone,
          confidence: 0.88,
        },
        {
          topText: "PERSONNE:",
          bottomText: "MOI EN TRAIN DE CRÉER DES MEMES",
          tone: selectedTone,
          confidence: 0.82,
        },
      ]

      setAiSuggestions(suggestions)
      setLoadingSuggestions(false)

      window.dispatchEvent(
        new CustomEvent("meme:ai-suggest-complete", {
          detail: { suggestions, tone: selectedTone },
        }),
      )
      console.log("[v0] AI suggestions generated:", suggestions.length)
    }, 2000)
  }

  const handleApplySuggestion = (suggestion: AISuggestion) => {
    setTopText(suggestion.topText)
    setBottomText(suggestion.bottomText)
    console.log("[v0] Applied AI suggestion:", suggestion)

    // Auto-check moderation after applying suggestion
    if (autoModerate) {
      handleCheckModeration(suggestion.topText, suggestion.bottomText)
    }
  }

  const handleCheckModeration = (top?: string, bottom?: string) => {
    const textToCheck = {
      topText: top || topText,
      bottomText: bottom || bottomText,
    }

    setCheckingModeration(true)
    console.log("[v0] Checking content moderation:", textToCheck)
    window.dispatchEvent(new CustomEvent("meme:moderation-start", { detail: textToCheck }))

    setTimeout(() => {
      // Simulate moderation check
      const hasIssues = Math.random() > 0.7
      const result: ModerationResult = hasIssues
        ? {
            status: "warning",
            issues: ["Contenu potentiellement sensible détecté"],
            suggestions: ["Considérez un langage plus inclusif", "Évitez les références controversées"],
            score: 0.65,
          }
        : {
            status: "safe",
            issues: [],
            suggestions: [],
            score: 0.95,
          }

      setModerationResult(result)
      setCheckingModeration(false)

      window.dispatchEvent(
        new CustomEvent("meme:moderation-complete", {
          detail: result,
        }),
      )
      console.log("[v0] Moderation check complete:", result)
    }, 1500)
  }

  const handleGenerate = () => {
    const config: MemeConfig = {
      topText,
      bottomText,
      template,
      textStyle,
      fontSize: fontSize[0],
      hasCustomImage,
    }

    const errors = validateMemeConfig(config)
    setValidationErrors(errors)

    if (errors.length > 0) {
      console.log("[v0] Validation failed:", errors)
      return
    }

    // Check moderation before generating
    if (autoModerate && !moderationResult) {
      handleCheckModeration()
      return
    }

    if (moderationResult?.status === "blocked") {
      setValidationErrors([{ field: "moderation", message: "Le contenu ne respecte pas les règles de modération" }])
      return
    }

    setGenerating(true)
    console.log("[v0] Generating meme:", config)

    window.dispatchEvent(new CustomEvent("meme:generation-start", { detail: config }))

    setTimeout(() => {
      const meme = {
        id: "meme-" + Date.now(),
        topText,
        bottomText,
        template,
        textStyle,
        url: "/generated-meme.png",
      }

      setGenerating(false)
      window.dispatchEvent(
        new CustomEvent("meme:generation-complete", {
          detail: { meme, config },
        }),
      )
      console.log("[v0] Meme generated:", meme)
    }, 2000)
  }

  const handleDownload = () => {
    const config: MemeConfig = {
      topText,
      bottomText,
      template,
      textStyle,
      fontSize: fontSize[0],
      hasCustomImage,
    }

    const errors = validateMemeConfig(config)
    if (errors.length > 0) {
      setValidationErrors(errors)
      return
    }

    console.log("[v0] Downloading meme")
    window.dispatchEvent(new CustomEvent("meme:download", { detail: config }))
  }

  const handleShare = () => {
    const config: MemeConfig = {
      topText,
      bottomText,
      template,
      textStyle,
      fontSize: fontSize[0],
      hasCustomImage,
    }

    const errors = validateMemeConfig(config)
    if (errors.length > 0) {
      setValidationErrors(errors)
      return
    }

    console.log("[v0] Sharing meme")
    window.dispatchEvent(new CustomEvent("meme:share", { detail: config }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-md">
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="w-full max-w-7xl bg-background rounded-3xl shadow-2xl border border-border/50">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/50">
              <div>
                <h2 className="text-2xl font-bold">Générateur de Memes</h2>
                <p className="text-muted-foreground text-sm mt-1">Créez des memes rapidement et facilement</p>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full">
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="h-[600px]">
              <div className="flex h-full gap-4 p-6 overflow-hidden">
                {/* Left Panel - Controls */}
                <div className="w-80 space-y-4 overflow-y-auto">
                  <Card className="p-4 space-y-4">
                    {validationErrors.length > 0 && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          {validationErrors.map((error, idx) => (
                            <div key={idx}>{error.message}</div>
                          ))}
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="template">Modèle</Label>
                      <NativeSelect value={template} onValueChange={setTemplate}>
                        <NativeSelectItem value="custom">Image personnalisée</NativeSelectItem>
                        {popularTemplates.map((t) => (
                          <NativeSelectItem key={t.id} value={t.id}>
                            {t.name}
                          </NativeSelectItem>
                        ))}
                      </NativeSelect>
                    </div>

                    {template === "custom" && (
                      <Button variant="outline" className="w-full bg-transparent" onClick={handleImageUpload}>
                        <Upload className="w-4 h-4 mr-2" />
                        {hasCustomImage ? "Changer l'image" : "Importer une image"}
                      </Button>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="top-text">Texte du haut</Label>
                      <Input
                        id="top-text"
                        placeholder="TEXTE DU HAUT"
                        value={topText}
                        onChange={(e) => {
                          setTopText(e.target.value.toUpperCase())
                          setModerationResult(null)
                        }}
                        className={validationErrors.some((e) => e.field === "topText") ? "border-destructive" : ""}
                      />
                      <p className="text-xs text-muted-foreground">{topText.length}/100 caractères</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bottom-text">Texte du bas</Label>
                      <Input
                        id="bottom-text"
                        placeholder="TEXTE DU BAS"
                        value={bottomText}
                        onChange={(e) => {
                          setBottomText(e.target.value.toUpperCase())
                          setModerationResult(null)
                        }}
                        className={validationErrors.some((e) => e.field === "bottomText") ? "border-destructive" : ""}
                      />
                      <p className="text-xs text-muted-foreground">{bottomText.length}/100 caractères</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="text-style">Style de texte</Label>
                      <NativeSelect value={textStyle} onValueChange={setTextStyle}>
                        {textStyles.map((style) => (
                          <NativeSelectItem key={style.id} value={style.id}>
                            <div>
                              <div className="font-medium">{style.name}</div>
                              <div className="text-xs text-muted-foreground">{style.description}</div>
                            </div>
                          </NativeSelectItem>
                        ))}
                      </NativeSelect>
                    </div>

                    <div className="space-y-2">
                      <Label>Taille de police: {fontSize[0]}px</Label>
                      <Slider value={fontSize} onValueChange={setFontSize} min={20} max={80} />
                    </div>

                    <Button className="w-full" onClick={handleGenerate} disabled={generating}>
                      <Sparkles className="w-4 h-4 mr-2" />
                      {generating ? "Génération..." : "Générer le meme"}
                    </Button>

                    <div className="flex gap-2 pt-4 border-t">
                      <Button className="flex-1" onClick={handleDownload}>
                        <Download className="w-4 h-4 mr-2" />
                        Télécharger
                      </Button>
                      <Button className="flex-1 bg-transparent" variant="outline" onClick={handleShare}>
                        <Share2 className="w-4 h-4 mr-2" />
                        Partager
                      </Button>
                    </div>
                  </Card>

                  <Card className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        <h3 className="font-semibold">Modération</h3>
                      </div>
                      {moderationResult && (
                        <Badge
                          variant={
                            moderationResult.status === "safe"
                              ? "default"
                              : moderationResult.status === "warning"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {moderationResult.status === "safe" && "Sûr"}
                          {moderationResult.status === "warning" && "Attention"}
                          {moderationResult.status === "blocked" && "Bloqué"}
                        </Badge>
                      )}
                    </div>

                    {moderationResult ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          {moderationResult.status === "safe" && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                          {moderationResult.status === "warning" && (
                            <AlertTriangle className="w-5 h-5 text-yellow-500" />
                          )}
                          {moderationResult.status === "blocked" && <XCircle className="w-5 h-5 text-red-500" />}
                          <span className="text-sm font-medium">
                            Score: {Math.round(moderationResult.score * 100)}%
                          </span>
                        </div>

                        {moderationResult.issues.length > 0 && (
                          <div className="space-y-2">
                            <Label className="text-sm">Problèmes détectés:</Label>
                            {moderationResult.issues.map((issue, idx) => (
                              <Alert key={idx} variant="destructive">
                                <AlertDescription className="text-xs">{issue}</AlertDescription>
                              </Alert>
                            ))}
                          </div>
                        )}

                        {moderationResult.suggestions.length > 0 && (
                          <div className="space-y-2">
                            <Label className="text-sm">Suggestions:</Label>
                            {moderationResult.suggestions.map((suggestion, idx) => (
                              <div key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                                <Lightbulb className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                <span>{suggestion}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full bg-transparent"
                          onClick={() => handleCheckModeration()}
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Revérifier
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground">
                          Vérifiez que votre contenu respecte les règles de la communauté
                        </p>
                        <Button
                          variant="outline"
                          className="w-full bg-transparent"
                          onClick={() => handleCheckModeration()}
                          disabled={(!topText && !bottomText) || checkingModeration}
                        >
                          <Shield className="w-4 h-4 mr-2" />
                          {checkingModeration ? "Vérification..." : "Vérifier le contenu"}
                        </Button>
                      </div>
                    )}
                  </Card>
                </div>

                {/* Right Panel - Preview and AI Suggestions */}
                <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                  <NativeTabs defaultValue="preview" className="flex-1 flex flex-col">
                    <NativeTabsList>
                      <NativeTabsTrigger value="preview">Aperçu</NativeTabsTrigger>
                      <NativeTabsTrigger value="ai-captions">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Légendes IA
                      </NativeTabsTrigger>
                    </NativeTabsList>

                    {/* Preview Tab */}
                    <NativeTabsContent value="preview" className="flex-1 flex items-center justify-center mt-4">
                      <div className="w-full h-full flex items-center justify-center bg-muted/20 rounded-lg p-8">
                        <Card className="w-full max-w-lg aspect-square flex flex-col items-center justify-between p-8 bg-gray-200">
                          <div
                            className="text-center font-bold text-white uppercase"
                            style={{
                              fontSize: `${fontSize[0]}px`,
                              textShadow:
                                textStyle === "classic"
                                  ? "2px 2px 0 rgb(0 0 0), -2px -2px 0 rgb(0 0 0), 2px -2px 0 rgb(0 0 0), -2px 2px 0 rgb(0 0 0)"
                                  : textStyle === "bold"
                                    ? "3px 3px 6px rgba(0,0,0,0.8)"
                                    : "none",
                              fontFamily: textStyle === "classic" ? "Impact, sans-serif" : "inherit",
                            }}
                          >
                            {topText || "TEXTE DU HAUT"}
                          </div>
                          <div className="text-center text-muted-foreground">
                            <p className="text-sm">Votre image apparaîtra ici</p>
                            {template !== "custom" && (
                              <p className="text-xs mt-1">
                                Modèle: {popularTemplates.find((t) => t.id === template)?.name}
                              </p>
                            )}
                          </div>
                          <div
                            className="text-center font-bold text-white uppercase"
                            style={{
                              fontSize: `${fontSize[0]}px`,
                              textShadow:
                                textStyle === "classic"
                                  ? "2px 2px 0 rgb(0 0 0), -2px -2px 0 rgb(0 0 0), 2px -2px 0 rgb(0 0 0), -2px 2px 0 rgb(0 0 0)"
                                  : textStyle === "bold"
                                    ? "3px 3px 6px rgba(0,0,0,0.8)"
                                    : "none",
                              fontFamily: textStyle === "classic" ? "Impact, sans-serif" : "inherit",
                            }}
                          >
                            {bottomText || "TEXTE DU BAS"}
                          </div>
                        </Card>
                      </div>
                    </NativeTabsContent>

                    <NativeTabsContent value="ai-captions" className="flex-1 overflow-y-auto mt-4 space-y-4">
                      <Card className="p-4 space-y-4">
                        <div>
                          <h3 className="font-semibold mb-2">Générer des légendes avec l'IA</h3>
                          <p className="text-sm text-muted-foreground">
                            Laissez l'IA vous suggérer des légendes créatives
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label>Ton souhaité</Label>
                          <div className="grid grid-cols-3 gap-2">
                            {tones.map((tone) => (
                              <Button
                                key={tone.id}
                                variant={selectedTone === tone.id ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedTone(tone.id)}
                                className={selectedTone !== tone.id ? "bg-transparent" : ""}
                              >
                                <span className="mr-1">{tone.icon}</span>
                                {tone.name}
                              </Button>
                            ))}
                          </div>
                        </div>

                        <Button className="w-full" onClick={handleAISuggest} disabled={loadingSuggestions}>
                          <Sparkles className="w-4 h-4 mr-2" />
                          {loadingSuggestions ? "Génération..." : "Générer des suggestions"}
                        </Button>
                      </Card>

                      {aiSuggestions.length > 0 && (
                        <div className="space-y-3">
                          <Label className="text-sm font-medium">Suggestions ({aiSuggestions.length})</Label>
                          {aiSuggestions.map((suggestion, idx) => (
                            <Card
                              key={idx}
                              className="p-4 space-y-3 hover:border-primary transition-colors cursor-pointer"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 space-y-2">
                                  <div>
                                    <p className="text-sm font-medium">Texte du haut:</p>
                                    <p className="text-sm text-muted-foreground">{suggestion.topText}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Texte du bas:</p>
                                    <p className="text-sm text-muted-foreground">{suggestion.bottomText}</p>
                                  </div>
                                </div>
                                <Badge variant="secondary">{Math.round(suggestion.confidence * 100)}%</Badge>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full bg-transparent"
                                onClick={() => handleApplySuggestion(suggestion)}
                              >
                                Utiliser cette suggestion
                              </Button>
                            </Card>
                          ))}
                        </div>
                      )}
                    </NativeTabsContent>
                  </NativeTabs>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
