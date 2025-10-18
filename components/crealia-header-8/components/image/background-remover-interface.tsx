"use client"

import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Upload, Download, Eraser, Undo, Redo, AlertCircle, ImageIcon, Brush, Sparkles } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

interface BackgroundRemovalConfig {
  mode: string
  edgeSmoothing: number
  featherRadius: number
  hasImage: boolean
  replaceBackground: boolean
  backgroundColor?: string
  maskTool?: string
  brushSize?: number
  blurBackground?: boolean
  blurIntensity?: number
}

interface ValidationError {
  field: string
  message: string
}

function validateBackgroundRemovalConfig(config: BackgroundRemovalConfig): ValidationError[] {
  const errors: ValidationError[] = []

  if (!config.hasImage) {
    errors.push({ field: "image", message: "Veuillez importer une image" })
  }

  if (config.edgeSmoothing < 0 || config.edgeSmoothing > 100) {
    errors.push({ field: "edgeSmoothing", message: "Le lissage des bords doit être entre 0 et 100" })
  }

  if (config.featherRadius < 0 || config.featherRadius > 50) {
    errors.push({ field: "featherRadius", message: "Le rayon de contour progressif doit être entre 0 et 50" })
  }

  return errors
}

export function BackgroundRemoverInterface({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [mode, setMode] = useState("auto")
  const [edgeSmoothing, setEdgeSmoothing] = useState([50])
  const [featherRadius, setFeatherRadius] = useState([5])
  const [replaceBackground, setReplaceBackground] = useState(false)
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF")
  const [hasImage, setHasImage] = useState(false)
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [processedImage, setProcessedImage] = useState<any>(null)
  const [maskTool, setMaskTool] = useState("brush")
  const [brushSize, setBrushSize] = useState([20])
  const [blurBackground, setBlurBackground] = useState(false)
  const [blurIntensity, setBlurIntensity] = useState([50])

  const modes = [
    { id: "auto", name: "Automatique", description: "Détection IA du sujet principal" },
    { id: "person", name: "Personne", description: "Optimisé pour les portraits" },
    { id: "product", name: "Produit", description: "Optimisé pour les objets" },
    { id: "manual", name: "Manuel", description: "Sélection manuelle" },
  ]

  const backgroundPresets = [
    { id: "transparent", name: "Transparent", color: "transparent" },
    { id: "white", name: "Blanc", color: "#FFFFFF" },
    { id: "black", name: "Noir", color: "#000000" },
    { id: "gray", name: "Gris", color: "#808080" },
    { id: "blue", name: "Bleu", color: "#4A90E2" },
    { id: "gradient", name: "Dégradé", color: "linear-gradient" },
  ]

  const handleImageUpload = () => {
    setHasImage(true)
    console.log("[v0] Image uploaded for background removal")
    window.dispatchEvent(new CustomEvent("background-remover:image-uploaded"))
  }

  const handleRemoveBackground = () => {
    const config: BackgroundRemovalConfig = {
      mode,
      edgeSmoothing: edgeSmoothing[0],
      featherRadius: featherRadius[0],
      hasImage,
      replaceBackground,
      backgroundColor: replaceBackground ? backgroundColor : undefined,
      maskTool,
      brushSize: brushSize[0],
      blurBackground,
      blurIntensity: blurIntensity[0],
    }

    const errors = validateBackgroundRemovalConfig(config)
    setValidationErrors(errors)

    if (errors.length > 0) {
      console.log("[v0] Validation failed:", errors)
      return
    }

    setProcessing(true)
    setProgress(0)
    console.log("[v0] Starting background removal:", config)

    window.dispatchEvent(new CustomEvent("background-remover:start", { detail: config }))

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setProcessing(false)

          const image = {
            id: "processed-" + Date.now(),
            mode,
            hasTransparentBg: !replaceBackground,
            url: "/processed-image.png",
          }

          setProcessedImage(image)

          window.dispatchEvent(
            new CustomEvent("background-remover:complete", {
              detail: { image, config },
            }),
          )
          console.log("[v0] Background removal complete:", image)

          return 100
        }
        return prev + 4
      })
    }, 100)
  }

  const handleUndo = () => {
    console.log("[v0] Undo background removal")
    window.dispatchEvent(new CustomEvent("background-remover:undo"))
  }

  const handleRedo = () => {
    console.log("[v0] Redo background removal")
    window.dispatchEvent(new CustomEvent("background-remover:redo"))
  }

  const handleDownload = (format: string) => {
    if (!processedImage) return

    console.log("[v0] Downloading processed image in format:", format)
    window.dispatchEvent(
      new CustomEvent("background-remover:download", {
        detail: { imageId: processedImage.id, format },
      }),
    )
  }

  const handleReplaceBackground = (preset: string) => {
    const presetData = backgroundPresets.find((p) => p.id === preset)
    if (presetData && presetData.color !== "transparent" && presetData.color !== "linear-gradient") {
      setBackgroundColor(presetData.color)
    }
    console.log("[v0] Background replaced with preset:", preset)
    window.dispatchEvent(
      new CustomEvent("background-remover:replace-background", {
        detail: { preset },
      }),
    )
  }

  const handleMaskToolChange = (tool: string) => {
    setMaskTool(tool)
    console.log("[v0] Mask tool changed to:", tool)
  }

  const handleRefineEdges = () => {
    console.log("[v0] Refining edges")
    window.dispatchEvent(new CustomEvent("background-remover:refine-edges"))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-md">
      <div className="fixed inset-0">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="w-full max-w-7xl bg-background rounded-3xl shadow-2xl border border-border/50 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-border/50">
              <div>
                <h2 className="text-2xl font-bold">Supprimer l'arrière-plan</h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Retirez l'arrière-plan de vos images automatiquement ou manuellement
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </div>

            <div className="flex-1 flex gap-4 overflow-hidden p-6">
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
                    <Label>Image</Label>
                    <Button variant="outline" className="w-full bg-transparent" onClick={handleImageUpload}>
                      <Upload className="w-4 h-4 mr-2" />
                      {hasImage ? "Changer l'image" : "Importer une image"}
                    </Button>
                    {hasImage && (
                      <p className="text-xs text-muted-foreground">image-original.jpg • 1920x1080 • 2.1 MB</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mode">Mode de détection</Label>
                    <select
                      id="mode"
                      value={mode}
                      onChange={(e) => setMode(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="auto">Automatique - Détection IA du sujet principal</option>
                      <option value="person">Personne - Optimisé pour les portraits</option>
                      <option value="product">Produit - Optimisé pour les objets</option>
                      <option value="manual">Manuel - Sélection manuelle</option>
                    </select>
                  </div>

                  {mode === "manual" && (
                    <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                      <Label>Outils de masque</Label>
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          variant={maskTool === "brush" ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleMaskToolChange("brush")}
                        >
                          <Brush className="w-4 h-4 mr-1" />
                          Pinceau
                        </Button>
                        <Button
                          variant={maskTool === "eraser" ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleMaskToolChange("eraser")}
                        >
                          <Eraser className="w-4 h-4 mr-1" />
                          Gomme
                        </Button>
                        <Button
                          variant={maskTool === "refine" ? "default" : "outline"}
                          size="sm"
                          onClick={handleRefineEdges}
                        >
                          <Sparkles className="w-4 h-4 mr-1" />
                          Affiner
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <Label>Taille du pinceau: {brushSize[0]}px</Label>
                        <Slider value={brushSize} onValueChange={setBrushSize} min={5} max={100} />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Lissage des bords: {edgeSmoothing[0]}%</Label>
                    <Slider value={edgeSmoothing} onValueChange={setEdgeSmoothing} min={0} max={100} />
                  </div>

                  <div className="space-y-2">
                    <Label>Contour progressif: {featherRadius[0]}px</Label>
                    <Slider value={featherRadius} onValueChange={setFeatherRadius} min={0} max={50} />
                  </div>

                  <Button className="w-full" onClick={handleRemoveBackground} disabled={!hasImage || processing}>
                    <Eraser className="w-4 h-4 mr-2" />
                    {processing ? "Traitement en cours..." : "Supprimer l'arrière-plan"}
                  </Button>

                  {processing && (
                    <div className="space-y-2">
                      <Progress value={progress} />
                      <p className="text-xs text-center text-muted-foreground">{progress}% terminé</p>
                    </div>
                  )}

                  {processedImage && (
                    <div className="space-y-4 pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="replace-bg">Remplacer l'arrière-plan</Label>
                        <Switch id="replace-bg" checked={replaceBackground} onCheckedChange={setReplaceBackground} />
                      </div>

                      {replaceBackground && (
                        <div className="space-y-2">
                          <Label>Arrière-plan de remplacement</Label>
                          <div className="grid grid-cols-3 gap-2">
                            {backgroundPresets.map((preset) => (
                              <Button
                                key={preset.id}
                                variant="outline"
                                size="sm"
                                className="h-12 bg-transparent"
                                onClick={() => handleReplaceBackground(preset.id)}
                                style={{
                                  backgroundColor: preset.color === "transparent" ? "transparent" : preset.color,
                                  backgroundImage:
                                    preset.color === "linear-gradient"
                                      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                                      : "none",
                                }}
                              >
                                <span className="text-xs">{preset.name}</span>
                              </Button>
                            ))}
                          </div>

                          <div className="flex gap-2">
                            <Input
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
                      )}

                      <div className="flex items-center justify-between">
                        <Label htmlFor="blur-bg">Flouter l'arrière-plan</Label>
                        <Switch id="blur-bg" checked={blurBackground} onCheckedChange={setBlurBackground} />
                      </div>

                      {blurBackground && (
                        <div className="space-y-2">
                          <Label>Intensité du flou: {blurIntensity[0]}%</Label>
                          <Slider value={blurIntensity} onValueChange={setBlurIntensity} min={0} max={100} />
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="export-format">Format d'export</Label>
                        <select
                          id="export-format"
                          onChange={(e) => handleDownload(e.target.value)}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                          <option value="">Sélectionner un format</option>
                          <option value="png">PNG (avec transparence)</option>
                          <option value="jpg">JPG (sans transparence)</option>
                          <option value="webp">WebP (optimisé)</option>
                        </select>
                      </div>
                    </div>
                  )}
                </Card>
              </div>

              {/* Right Panel - Before/After Preview */}
              <div className="flex-1 flex items-center justify-center bg-muted/20 rounded-lg p-4">
                {processedImage ? (
                  <div className="w-full max-w-4xl space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="p-4">
                        <Label className="text-xs text-muted-foreground mb-2 block">Avant</Label>
                        <div className="aspect-video bg-muted/50 rounded-lg flex items-center justify-center">
                          <ImageIcon className="w-16 h-16 opacity-30" />
                        </div>
                      </Card>
                      <Card className="p-4">
                        <Label className="text-xs text-muted-foreground mb-2 block">Après</Label>
                        <div
                          className="aspect-video rounded-lg flex items-center justify-center"
                          style={{
                            backgroundColor: replaceBackground ? backgroundColor : "transparent",
                            backgroundImage: replaceBackground
                              ? "none"
                              : "repeating-conic-gradient(#e5e7eb 0% 25%, transparent 0% 50%) 50% / 20px 20px",
                            filter: blurBackground ? `blur(${blurIntensity[0] / 10}px)` : "none",
                          }}
                        >
                          <ImageIcon className="w-16 h-16 opacity-30" />
                        </div>
                      </Card>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground p-8">
                    <Eraser className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="text-lg font-medium">Votre image traitée apparaîtra ici</p>
                    <p className="text-sm mt-2">Importez une image pour commencer</p>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="flex items-center justify-between p-4 border-t bg-background">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleUndo} disabled={!processedImage}>
                  <Undo className="w-4 h-4 mr-2" />
                  Annuler
                </Button>
                <Button variant="outline" size="sm" onClick={handleRedo} disabled={!processedImage}>
                  <Redo className="w-4 h-4 mr-2" />
                  Rétablir
                </Button>
              </div>
              <div className="flex gap-2">
                <Button size="sm" disabled={!processedImage} onClick={() => handleDownload("png")}>
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger PNG
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
