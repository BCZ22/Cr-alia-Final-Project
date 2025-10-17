"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { NativeSelect, NativeSelectItem } from "@/components/ui/native-select"
import { Slider } from "@/components/ui/slider"
import { Sparkles, RefreshCw, Wand2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface IllustrationConfig {
  prompt: string
  style: string
  mood: string
  colorPalette: string
  complexity: number
  aspectRatio: string
}

interface ValidationError {
  field: string
  message: string
}

function validateIllustrationConfig(config: IllustrationConfig): ValidationError[] {
  const errors: ValidationError[] = []

  if (!config.prompt || config.prompt.trim().length === 0) {
    errors.push({ field: "prompt", message: "La description est requise" })
  }

  if (config.prompt.length < 10) {
    errors.push({ field: "prompt", message: "La description doit contenir au moins 10 caractères" })
  }

  if (config.prompt.length > 500) {
    errors.push({ field: "prompt", message: "La description ne peut pas dépasser 500 caractères" })
  }

  if (config.complexity < 1 || config.complexity > 10) {
    errors.push({ field: "complexity", message: "La complexité doit être entre 1 et 10" })
  }

  return errors
}

export function IllustrationAIInterface() {
  const [prompt, setPrompt] = useState("")
  const [style, setStyle] = useState("digital-art")
  const [mood, setMood] = useState("neutral")
  const [colorPalette, setColorPalette] = useState("vibrant")
  const [complexity, setComplexity] = useState([5])
  const [aspectRatio, setAspectRatio] = useState("1:1")
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])
  const [generating, setGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<any>(null)

  const styles = [
    { id: "digital-art", name: "Art numérique", description: "Illustration numérique moderne" },
    { id: "watercolor", name: "Aquarelle", description: "Style aquarelle doux" },
    { id: "oil-painting", name: "Peinture à l'huile", description: "Texture de peinture classique" },
    { id: "sketch", name: "Croquis", description: "Dessin au crayon" },
    { id: "cartoon", name: "Cartoon", description: "Style bande dessinée" },
    { id: "anime", name: "Anime", description: "Style manga japonais" },
    { id: "3d-render", name: "Rendu 3D", description: "Illustration 3D réaliste" },
    { id: "pixel-art", name: "Pixel Art", description: "Style rétro 8-bit" },
    { id: "vector", name: "Vectoriel", description: "Illustration vectorielle plate" },
    { id: "abstract", name: "Abstrait", description: "Art abstrait moderne" },
  ]

  const moods = [
    { id: "neutral", name: "Neutre" },
    { id: "happy", name: "Joyeux" },
    { id: "calm", name: "Calme" },
    { id: "energetic", name: "Énergique" },
    { id: "mysterious", name: "Mystérieux" },
    { id: "dramatic", name: "Dramatique" },
    { id: "playful", name: "Ludique" },
    { id: "serious", name: "Sérieux" },
  ]

  const colorPalettes = [
    { id: "vibrant", name: "Vibrant", colors: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A"] },
    { id: "pastel", name: "Pastel", colors: ["#FFB6C1", "#B0E0E6", "#DDA0DD", "#F0E68C"] },
    { id: "monochrome", name: "Monochrome", colors: ["#000000", "#404040", "#808080", "#C0C0C0"] },
    { id: "warm", name: "Chaud", colors: ["#FF6B35", "#F7931E", "#FDC830", "#FF4500"] },
    { id: "cool", name: "Froid", colors: ["#006994", "#0099CC", "#66CCFF", "#4A90E2"] },
    { id: "earth", name: "Terre", colors: ["#8B4513", "#D2691E", "#CD853F", "#DEB887"] },
    { id: "neon", name: "Néon", colors: ["#FF00FF", "#00FFFF", "#FFFF00", "#FF1493"] },
  ]

  const aspectRatios = [
    { id: "1:1", name: "Carré (1:1)", dimensions: "1024x1024" },
    { id: "16:9", name: "Paysage (16:9)", dimensions: "1920x1080" },
    { id: "9:16", name: "Portrait (9:16)", dimensions: "1080x1920" },
    { id: "4:3", name: "Standard (4:3)", dimensions: "1600x1200" },
    { id: "21:9", name: "Ultra-large (21:9)", dimensions: "2560x1080" },
  ]

  const handleGenerate = () => {
    const config: IllustrationConfig = {
      prompt,
      style,
      mood,
      colorPalette,
      complexity: complexity[0],
      aspectRatio,
    }

    const errors = validateIllustrationConfig(config)
    setValidationErrors(errors)

    if (errors.length > 0) {
      console.log("[v0] Validation failed:", errors)
      return
    }

    setGenerating(true)
    console.log("[v0] Generating illustration:", config)

    window.dispatchEvent(new CustomEvent("illustration:generation-start", { detail: config }))

    setTimeout(() => {
      const image = {
        id: "illustration-" + Date.now(),
        prompt,
        style,
        mood,
        url: "/generated-illustration.png",
      }

      setGeneratedImage(image)
      setGenerating(false)

      window.dispatchEvent(
        new CustomEvent("illustration:generation-complete", {
          detail: { image, config },
        }),
      )
      console.log("[v0] Illustration generated:", image)
    }, 4000)
  }

  const handleEnhancePrompt = () => {
    console.log("[v0] Enhancing prompt with AI")
    window.dispatchEvent(new CustomEvent("illustration:enhance-prompt-start", { detail: { prompt } }))

    setTimeout(() => {
      const enhanced = `${prompt}, highly detailed, professional quality, ${styles.find((s) => s.id === style)?.name.toLowerCase()}, ${moods.find((m) => m.id === mood)?.name.toLowerCase()} atmosphere, ${colorPalettes.find((c) => c.id === colorPalette)?.name.toLowerCase()} color palette`

      setPrompt(enhanced)

      window.dispatchEvent(
        new CustomEvent("illustration:enhance-prompt-complete", {
          detail: { original: prompt, enhanced },
        }),
      )
      console.log("[v0] Prompt enhanced")
    }, 1000)
  }

  const handleRegenerate = () => {
    console.log("[v0] Regenerating illustration with same config")
    window.dispatchEvent(new CustomEvent("illustration:regenerate"))
    handleGenerate()
  }

  const handleDownload = (format: string) => {
    if (!generatedImage) return

    console.log("[v0] Downloading illustration in format:", format)
    window.dispatchEvent(
      new CustomEvent("illustration:download", {
        detail: { imageId: generatedImage.id, format },
      }),
    )
  }

  return (
    <div className="flex h-full gap-4">
      {/* Left Panel - Controls */}
      <div className="w-80 space-y-4 overflow-y-auto">
        <Card className="p-4 space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Illustration IA</h3>
            <p className="text-sm text-muted-foreground">Créez des illustrations uniques avec l'IA</p>
          </div>

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
            <Label htmlFor="prompt">Description *</Label>
            <Textarea
              id="prompt"
              placeholder="Décrivez l'illustration que vous souhaitez créer..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              className={validationErrors.some((e) => e.field === "prompt") ? "border-destructive" : ""}
            />
            <p className="text-xs text-muted-foreground">{prompt.length}/500 caractères</p>
          </div>

          <Button className="w-full bg-transparent" variant="outline" onClick={handleEnhancePrompt} disabled={!prompt}>
            <Wand2 className="w-4 h-4 mr-2" />
            Améliorer la description
          </Button>

          <div className="space-y-2">
            <Label htmlFor="style">Style artistique</Label>
            <NativeSelect value={style} onChange={(e) => setStyle(e.target.value)}>
              {styles.map((s) => (
                <NativeSelectItem key={s.id} value={s.id}>
                  <div>
                    <div className="font-medium">{s.name}</div>
                    <div className="text-xs text-muted-foreground">{s.description}</div>
                  </div>
                </NativeSelectItem>
              ))}
            </NativeSelect>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mood">Ambiance</Label>
            <NativeSelect value={mood} onChange={(e) => setMood(e.target.value)}>
              {moods.map((m) => (
                <NativeSelectItem key={m.id} value={m.id}>
                  {m.name}
                </NativeSelectItem>
              ))}
            </NativeSelect>
          </div>

          <div className="space-y-2">
            <Label htmlFor="color-palette">Palette de couleurs</Label>
            <NativeSelect value={colorPalette} onChange={(e) => setColorPalette(e.target.value)}>
              {colorPalettes.map((palette) => (
                <NativeSelectItem key={palette.id} value={palette.id}>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {palette.colors.map((color, idx) => (
                        <div key={idx} className="w-3 h-3 rounded" style={{ backgroundColor: color }} />
                      ))}
                    </div>
                    <span>{palette.name}</span>
                  </div>
                </NativeSelectItem>
              ))}
            </NativeSelect>
          </div>

          <div className="space-y-2">
            <Label htmlFor="aspect-ratio">Format</Label>
            <NativeSelect value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)}>
              {aspectRatios.map((ratio) => (
                <NativeSelectItem key={ratio.id} value={ratio.id}>
                  {ratio.name} - {ratio.dimensions}
                </NativeSelectItem>
              ))}
            </NativeSelect>
          </div>

          <div className="space-y-2">
            <Label>Niveau de détail: {complexity[0]}/10</Label>
            <Slider value={complexity} onValueChange={setComplexity} min={1} max={10} />
            <p className="text-xs text-muted-foreground">
              {complexity[0] <= 3 ? "Simple" : complexity[0] <= 7 ? "Détaillé" : "Très détaillé"}
            </p>
          </div>

          <Button className="w-full" onClick={handleGenerate} disabled={!prompt || generating}>
            <Sparkles className="w-4 h-4 mr-2" />
            {generating ? "Génération en cours..." : "Générer l'illustration"}
          </Button>

          {generatedImage && (
            <div className="space-y-2 pt-4 border-t">
              <Button className="w-full bg-transparent" variant="outline" onClick={handleRegenerate}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Régénérer
              </Button>
              <NativeSelect onChange={(e) => handleDownload(e.target.value)}>
                <NativeSelectItem value="png">PNG (haute qualité)</NativeSelectItem>
                <NativeSelectItem value="jpg">JPG (optimisé)</NativeSelectItem>
                <NativeSelectItem value="svg">SVG (vectoriel)</NativeSelectItem>
                <NativeSelectItem value="webp">WebP (web)</NativeSelectItem>
              </NativeSelect>
            </div>
          )}
        </Card>
      </div>

      {/* Right Panel - Preview */}
      <div className="flex-1 flex items-center justify-center bg-muted/20 rounded-lg p-4">
        {generatedImage ? (
          <Card className="w-full max-w-3xl aspect-video flex items-center justify-center">
            <div className="text-center p-8">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold mb-2">Illustration générée</h3>
              <p className="text-sm text-muted-foreground">{prompt.substring(0, 100)}...</p>
              <div className="mt-4 flex gap-2 justify-center text-xs text-muted-foreground">
                <span>Style: {styles.find((s) => s.id === style)?.name}</span>
                <span>•</span>
                <span>Format: {aspectRatio}</span>
              </div>
            </div>
          </Card>
        ) : (
          <div className="text-center text-muted-foreground p-8">
            <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">Votre illustration apparaîtra ici</p>
            <p className="text-sm mt-2">Décrivez ce que vous souhaitez créer et générez</p>
          </div>
        )}
      </div>
    </div>
  )
}
