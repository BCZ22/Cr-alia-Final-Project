"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Sparkles,
  Upload,
  Download,
  ImageIcon,
  Undo,
  Redo,
  Plus,
  ArrowRight,
  Smile,
  Zap,
  AlertCircle,
  X,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ThumbnailConfig {
  mainText: string
  template: string
  backgroundColor: string
  textSize: number
  textStroke: number
  batchMode: boolean
  hasBackgroundImage: boolean
}

interface ValidationError {
  field: string
  message: string
}

function validateThumbnailConfig(config: ThumbnailConfig): ValidationError[] {
  const errors: ValidationError[] = []

  if (!config.mainText || config.mainText.trim().length === 0) {
    errors.push({ field: "mainText", message: "Le texte principal est requis" })
  }

  if (config.mainText.length > 50) {
    errors.push({ field: "mainText", message: "Le texte ne peut pas dépasser 50 caractères" })
  }

  if (config.textSize < 40 || config.textSize > 100) {
    errors.push({ field: "textSize", message: "La taille du texte doit être entre 40 et 100" })
  }

  if (config.textStroke < 0 || config.textStroke > 10) {
    errors.push({ field: "textStroke", message: "Le contour du texte doit être entre 0 et 10" })
  }

  return errors
}

interface YouTubeThumbnailsInterfaceProps {
  isOpen: boolean
  onClose: () => void
}

export function YoutubeThumbnailsInterface({ isOpen, onClose }: YouTubeThumbnailsInterfaceProps) {
  const [template, setTemplate] = useState("bold")
  const [textSize, setTextSize] = useState([70])
  const [textStroke, setTextStroke] = useState([3])
  const [backgroundColor, setBackgroundColor] = useState("#FF0000")
  const [mainText, setMainText] = useState("")
  const [batchMode, setBatchMode] = useState(false)
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])
  const [hasBackgroundImage, setHasBackgroundImage] = useState(false)
  const [generating, setGenerating] = useState(false)

  const handleGenerate = () => {
    const config: ThumbnailConfig = {
      mainText,
      template,
      backgroundColor,
      textSize: textSize[0],
      textStroke: textStroke[0],
      batchMode,
      hasBackgroundImage,
    }

    const errors = validateThumbnailConfig(config)
    setValidationErrors(errors)

    if (errors.length > 0) {
      console.log("[v0] Validation failed:", errors)
      return
    }

    setGenerating(true)
    console.log("[v0] Generating YouTube thumbnail:", config)

    window.dispatchEvent(new CustomEvent("youtube-thumbnail:generation-start", { detail: config }))

    setTimeout(() => {
      const thumbnails = batchMode
        ? Array.from({ length: 5 }, (_, i) => ({ id: `thumb-${i}`, variant: i + 1 }))
        : [{ id: "thumb-0", variant: 1 }]

      setGenerating(false)
      window.dispatchEvent(
        new CustomEvent("youtube-thumbnail:generation-complete", {
          detail: { thumbnails, config },
        }),
      )
      console.log("[v0] Generated", thumbnails.length, "thumbnails")
    }, 2000)
  }

  const handleAISuggest = () => {
    console.log("[v0] Requesting AI suggestions from video")
    window.dispatchEvent(new CustomEvent("youtube-thumbnail:ai-suggest-start"))

    setTimeout(() => {
      const suggestions = {
        mainText: "INCROYABLE DÉCOUVERTE",
        backgroundColor: "#FF6B00",
        template: "clickbait",
      }

      setMainText(suggestions.mainText)
      setBackgroundColor(suggestions.backgroundColor)
      setTemplate(suggestions.template)

      window.dispatchEvent(
        new CustomEvent("youtube-thumbnail:ai-suggest-complete", {
          detail: suggestions,
        }),
      )
      console.log("[v0] AI suggestions applied:", suggestions)
    }, 1500)
  }

  const handleImageUpload = () => {
    setHasBackgroundImage(true)
    console.log("[v0] Background image uploaded")
    window.dispatchEvent(new CustomEvent("youtube-thumbnail:image-uploaded"))
  }

  const handleAddEffect = (effect: string) => {
    console.log("[v0] Adding effect:", effect)
    window.dispatchEvent(
      new CustomEvent("youtube-thumbnail:effect-added", {
        detail: { effect },
      }),
    )
  }

  const handleSmartCrop = (cropType: string) => {
    console.log("[v0] Applying smart crop:", cropType)
    window.dispatchEvent(
      new CustomEvent("youtube-thumbnail:smart-crop", {
        detail: { cropType },
      }),
    )
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-md">
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Card className="w-full max-w-7xl h-[90vh] flex flex-col bg-background rounded-3xl shadow-2xl border border-border/50">
          <div className="flex items-center justify-between p-6 border-b border-border/50">
            <div>
              <h2 className="text-2xl font-bold">Miniatures YouTube</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Créez des miniatures accrocheuses optimisées 1280×720px
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full">
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex-1 flex gap-4 overflow-hidden p-6">
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

            <div className="flex-1 flex items-center justify-center bg-muted/20 rounded-lg p-4">
              <Card
                className="w-full max-w-4xl aspect-video flex items-center justify-center relative overflow-hidden"
                style={{ backgroundColor: backgroundColor + "20" }}
              >
                <div className="text-center p-8">
                  {mainText ? (
                    <h2
                      className="text-5xl font-bold leading-tight"
                      style={{
                        fontSize: `${textSize[0]}px`,
                        WebkitTextStroke: `${textStroke[0]}px black`,
                        color: "white",
                        textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                      }}
                    >
                      {mainText}
                    </h2>
                  ) : (
                    <div className="text-muted-foreground">
                      <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
                      <p className="text-lg font-medium">Aperçu de votre miniature YouTube</p>
                      <p className="text-sm mt-2">1280 × 720 pixels</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            <div className="w-80 space-y-4 overflow-y-auto">
              <Card className="p-4 space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Miniatures YouTube</h3>
                  <p className="text-sm text-muted-foreground">
                    Créez des miniatures accrocheuses optimisées 1280×720px
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="template">Modèle</Label>
                  <select
                    id="template"
                    value={template}
                    onChange={(e) => setTemplate(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="bold">Audacieux</option>
                    <option value="minimal">Minimaliste</option>
                    <option value="gaming">Gaming</option>
                    <option value="vlog">Vlog</option>
                    <option value="tutorial">Tutoriel</option>
                    <option value="clickbait">Clickbait Pro</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Image de fond</Label>
                  <Button variant="outline" className="w-full bg-transparent" onClick={handleImageUpload}>
                    <Upload className="w-4 h-4 mr-2" />
                    {hasBackgroundImage ? "Changer l'image" : "Importer une image"}
                  </Button>
                </div>

                <Button className="w-full bg-transparent" variant="outline" onClick={handleAISuggest}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Suggérer depuis la vidéo (IA)
                </Button>

                <div className="space-y-2">
                  <Label htmlFor="bg-color">Couleur de fond</Label>
                  <div className="flex gap-2">
                    <Input
                      id="bg-color"
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-20 h-10"
                    />
                    <Input
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="main-text">Texte principal *</Label>
                  <Input
                    id="main-text"
                    placeholder="Votre titre accrocheur"
                    maxLength={50}
                    value={mainText}
                    onChange={(e) => setMainText(e.target.value)}
                    className={validationErrors.some((e) => e.field === "mainText") ? "border-destructive" : ""}
                  />
                  <p className="text-xs text-muted-foreground">{mainText.length}/50 caractères</p>
                </div>

                <div className="space-y-2">
                  <Label>Taille du texte: {textSize[0]}%</Label>
                  <Slider value={textSize} onValueChange={setTextSize} min={40} max={100} />
                </div>

                <div className="space-y-2">
                  <Label>Contour du texte: {textStroke[0]}px</Label>
                  <Slider value={textStroke} onValueChange={setTextStroke} min={0} max={10} />
                </div>

                <div className="space-y-2">
                  <Label>Effets "Clickbait"</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleAddEffect("arrows")}>
                      <ArrowRight className="w-4 h-4 mr-1" />
                      Flèches
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleAddEffect("emojis")}>
                      <Smile className="w-4 h-4 mr-1" />
                      Emojis
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleAddEffect("glow")}>
                      <Zap className="w-4 h-4 mr-1" />
                      Contours brillants
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleAddEffect("sparkles")}>
                      <Sparkles className="w-4 h-4 mr-1" />
                      Effets lumineux
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Recadrage intelligent</Label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() => handleSmartCrop("faces")}
                      disabled={!hasBackgroundImage}
                    >
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Centrer visages
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() => handleSmartCrop("portrait")}
                      disabled={!hasBackgroundImage}
                    >
                      Découper portrait
                    </Button>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <Label>Génération en batch</Label>
                  <Button variant="outline" className="w-full bg-transparent" onClick={() => setBatchMode(!batchMode)}>
                    <Sparkles className="w-4 h-4 mr-2" />
                    {batchMode ? "Mode batch activé" : "Générer plusieurs versions"}
                  </Button>
                  {batchMode && <p className="text-xs text-muted-foreground">Créez 5 variantes automatiquement</p>}
                </div>

                <Button className="w-full" onClick={handleGenerate} disabled={!mainText || generating}>
                  {generating ? "Génération..." : "Générer la miniature"}
                </Button>
              </Card>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border-t bg-background">
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Undo className="w-4 h-4 mr-2" />
                Annuler
              </Button>
              <Button variant="outline" size="sm">
                <Redo className="w-4 h-4 mr-2" />
                Rétablir
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Publier sur YouTube
              </Button>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter au projet
              </Button>
              <Button size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exporter JPG
              </Button>
              <Button variant="default">Appliquer</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export { YoutubeThumbnailsInterface as YouTubeThumbnailsInterface }
