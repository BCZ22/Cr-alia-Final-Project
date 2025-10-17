"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Upload, Download, Undo, Redo, ArrowLeftRight, AlertCircle, X } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface EnhancementConfig {
  sharpness: number
  denoise: number
  exposure: number
  contrast: number
  saturation: number
  brightness: number
  colorCorrection: number
  upscaleFactor: string
  faceEnhance: boolean
}

interface ValidationError {
  field: string
  message: string
}

interface BatchImage {
  id: string
  name: string
  status: "pending" | "processing" | "complete" | "error"
  progress: number
}

interface SelectiveMask {
  id: string
  name: string
  type: "brush" | "lasso" | "auto"
  visible: boolean
  opacity: number
}

function validateEnhancementConfig(config: EnhancementConfig): ValidationError[] {
  const errors: ValidationError[] = []

  const validateRange = (value: number, field: string, min: number, max: number) => {
    if (value < min || value > max) {
      errors.push({
        field,
        message: `${field} doit être entre ${min} et ${max}`,
      })
    }
  }

  validateRange(config.sharpness, "sharpness", 0, 100)
  validateRange(config.denoise, "denoise", 0, 100)
  validateRange(config.exposure, "exposure", 0, 100)
  validateRange(config.contrast, "contrast", 0, 100)
  validateRange(config.saturation, "saturation", -100, 100)
  validateRange(config.brightness, "brightness", -100, 100)
  validateRange(config.colorCorrection, "colorCorrection", 0, 100)

  return errors
}

interface ImageEnhancerInterfaceProps {
  isOpen: boolean
  onClose: () => void
}

export function ImageEnhancerInterface({ isOpen, onClose }: ImageEnhancerInterfaceProps) {
  console.log("[v0] ImageEnhancerInterface rendered with isOpen:", isOpen)

  const [config, setConfig] = useState<EnhancementConfig>({
    sharpness: 50,
    denoise: 30,
    exposure: 50,
    contrast: 50,
    saturation: 0,
    brightness: 0,
    colorCorrection: 50,
    upscaleFactor: "1x",
    faceEnhance: false,
  })

  const [analyzing, setAnalyzing] = useState(false)
  const [showComparison, setShowComparison] = useState(false)
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])
  const [hasImage, setHasImage] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [batchImages, setBatchImages] = useState<BatchImage[]>([])
  const [batchProcessing, setBatchProcessing] = useState(false)
  const [masks, setMasks] = useState<SelectiveMask[]>([])
  const [activeMask, setActiveMask] = useState<string | null>(null)
  const [maskMode, setMaskMode] = useState<"brush" | "lasso" | "auto">("brush")
  const [brushSize, setBrushSize] = useState([20])
  const [activeTab, setActiveTab] = useState<"single" | "batch">("single")

  const handleAutoAnalyze = () => {
    if (!hasImage) {
      setValidationErrors([{ field: "image", message: "Veuillez d'abord importer une image" }])
      return
    }

    setAnalyzing(true)
    console.log("[v0] Starting auto-analysis")

    window.dispatchEvent(new CustomEvent("image-enhancer:analysis-start"))

    setTimeout(() => {
      const autoConfig = {
        sharpness: 65,
        denoise: 40,
        exposure: 55,
        contrast: 60,
        saturation: 52,
      }

      setConfig((prev) => ({
        ...prev,
        sharpness: autoConfig.sharpness,
        denoise: autoConfig.denoise,
        exposure: autoConfig.exposure,
        contrast: autoConfig.contrast,
        saturation: autoConfig.saturation,
      }))
      setAnalyzing(false)

      window.dispatchEvent(
        new CustomEvent("image-enhancer:analysis-complete", {
          detail: autoConfig,
        }),
      )
      console.log("[v0] Auto-analysis complete:", autoConfig)
    }, 1500)
  }

  const handleApplyEnhancement = () => {
    const errors = validateEnhancementConfig(config)
    setValidationErrors(errors)

    if (errors.length > 0) {
      console.log("[v0] Validation failed:", errors)
      return
    }

    setProcessing(true)
    console.log("[v0] Applying enhancement:", config)

    window.dispatchEvent(new CustomEvent("image-enhancer:enhancement-start", { detail: config }))

    setTimeout(() => {
      setProcessing(false)
      window.dispatchEvent(
        new CustomEvent("image-enhancer:enhancement-complete", {
          detail: { config, success: true },
        }),
      )
      console.log("[v0] Enhancement complete")
    }, 2000)
  }

  const handleImageUpload = () => {
    setHasImage(true)
    setValidationErrors([])
    console.log("[v0] Image uploaded")
    window.dispatchEvent(new CustomEvent("image-enhancer:image-uploaded"))
  }

  const handleSavePreset = () => {
    const preset = {
      name: `Preset ${new Date().toLocaleTimeString()}`,
      sharpness: config.sharpness,
      denoise: config.denoise,
      exposure: config.exposure,
      contrast: config.contrast,
      saturation: config.saturation,
      brightness: config.brightness,
      colorCorrection: config.colorCorrection,
    }
    console.log("[v0] Saving preset:", preset)
    window.dispatchEvent(new CustomEvent("image-enhancer:preset-saved", { detail: preset }))
  }

  const handleBatchUpload = () => {
    const newImages: BatchImage[] = [
      { id: "1", name: "image-1.jpg", status: "pending", progress: 0 },
      { id: "2", name: "image-2.jpg", status: "pending", progress: 0 },
      { id: "3", name: "image-3.jpg", status: "pending", progress: 0 },
    ]
    setBatchImages(newImages)
    console.log("[v0] Batch images uploaded:", newImages.length)
    window.dispatchEvent(new CustomEvent("image-enhancer:batch-uploaded", { detail: newImages }))
  }

  const handleBatchProcess = () => {
    setBatchProcessing(true)
    console.log("[v0] Starting batch processing")

    batchImages.forEach((img, index) => {
      setTimeout(() => {
        setBatchImages((prev) => prev.map((i) => (i.id === img.id ? { ...i, status: "processing" as const } : i)))

        const progressInterval = setInterval(() => {
          setBatchImages((prev) => {
            const current = prev.find((i) => i.id === img.id)
            if (current && current.progress < 100) {
              return prev.map((i) => (i.id === img.id ? { ...i, progress: Math.min(i.progress + 10, 100) } : i))
            }
            return prev
          })
        }, 200)

        setTimeout(() => {
          clearInterval(progressInterval)
          setBatchImages((prev) =>
            prev.map((i) => (i.id === img.id ? { ...i, status: "complete" as const, progress: 100 } : i)),
          )

          if (index === batchImages.length - 1) {
            setBatchProcessing(false)
            console.log("[v0] Batch processing complete")
            window.dispatchEvent(new CustomEvent("image-enhancer:batch-complete"))
          }
        }, 2000)
      }, index * 2500)
    })
  }

  const handleAddMask = () => {
    const newMask: SelectiveMask = {
      id: `mask-${Date.now()}`,
      name: `Masque ${masks.length + 1}`,
      type: maskMode,
      visible: true,
      opacity: 100,
    }
    setMasks([...masks, newMask])
    setActiveMask(newMask.id)
    console.log("[v0] Mask added:", newMask)
    window.dispatchEvent(new CustomEvent("image-enhancer:mask-added", { detail: newMask }))
  }

  const handleDeleteMask = (id: string) => {
    setMasks(masks.filter((m) => m.id !== id))
    if (activeMask === id) setActiveMask(null)
    console.log("[v0] Mask deleted:", id)
  }

  const handleToggleMaskVisibility = (id: string) => {
    setMasks(masks.map((m) => (m.id === id ? { ...m, visible: !m.visible } : m)))
  }

  const handleAutoDetect = () => {
    console.log("[v0] Auto-detecting regions")
    const autoMask: SelectiveMask = {
      id: `mask-auto-${Date.now()}`,
      name: "Détection auto",
      type: "auto",
      visible: true,
      opacity: 100,
    }
    setMasks([...masks, autoMask])
    setActiveMask(autoMask.id)
    window.dispatchEvent(new CustomEvent("image-enhancer:auto-detect", { detail: autoMask }))
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
                <h2 className="text-2xl font-bold">Améliorateur d'Images</h2>
                <p className="text-muted-foreground text-sm mt-1">Améliorez la qualité de vos images avec l'IA</p>
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

                  <Card className="p-4 space-y-4">
                    <Button className="w-full bg-transparent" variant="outline" onClick={handleImageUpload}>
                      <Upload className="w-4 h-4 mr-2" />
                      Importer une image
                    </Button>

                    <Button className="w-full" onClick={handleAutoAnalyze} disabled={analyzing || !hasImage}>
                      <Sparkles className="w-4 h-4 mr-2" />
                      {analyzing ? "Analyse..." : "Amélioration IA automatique"}
                    </Button>

                    <div className="space-y-4 pt-4 border-t">
                      <div className="space-y-2">
                        <Label>Netteté: {config.sharpness}</Label>
                        <Slider
                          value={[config.sharpness]}
                          onValueChange={(value) => setConfig((prev) => ({ ...prev, sharpness: value[0] }))}
                          min={0}
                          max={100}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Réduction du bruit: {config.denoise}</Label>
                        <Slider
                          value={[config.denoise]}
                          onValueChange={(value) => setConfig((prev) => ({ ...prev, denoise: value[0] }))}
                          min={0}
                          max={100}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Luminosité: {config.brightness}</Label>
                        <Slider
                          value={[config.brightness]}
                          onValueChange={(value) => setConfig((prev) => ({ ...prev, brightness: value[0] }))}
                          min={-100}
                          max={100}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Saturation: {config.saturation}</Label>
                        <Slider
                          value={[config.saturation]}
                          onValueChange={(value) => setConfig((prev) => ({ ...prev, saturation: value[0] }))}
                          min={-100}
                          max={100}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Exposition: {config.exposure}</Label>
                        <Slider
                          value={[config.exposure]}
                          onValueChange={(value) => setConfig((prev) => ({ ...prev, exposure: value[0] }))}
                          min={0}
                          max={100}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Contraste: {config.contrast}</Label>
                        <Slider
                          value={[config.contrast]}
                          onValueChange={(value) => setConfig((prev) => ({ ...prev, contrast: value[0] }))}
                          min={0}
                          max={100}
                        />
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Center Panel - Preview */}
                <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <Label>Afficher avant/après</Label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={showComparison}
                          onChange={(e) => setShowComparison(e.target.checked)}
                          disabled={!hasImage}
                          className="w-4 h-4 rounded border-input"
                        />
                      </label>
                    </div>
                  </Card>

                  <div className="flex-1 flex items-center justify-center bg-muted/20 rounded-lg relative p-4">
                    {showComparison && hasImage ? (
                      <div className="flex items-center gap-8 max-w-4xl w-full">
                        <div className="flex-1 text-center">
                          <p className="text-sm font-medium text-muted-foreground mb-3">Avant</p>
                          <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                            <Upload className="w-16 h-16 opacity-30" />
                          </div>
                        </div>
                        <ArrowLeftRight className="w-8 h-8 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1 text-center">
                          <p className="text-sm font-medium text-muted-foreground mb-3">Après</p>
                          <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                            <Sparkles className="w-16 h-16 opacity-30" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground">
                        <Upload className="w-16 h-16 mx-auto mb-4 opacity-30" />
                        <p className="text-lg font-medium">Importez une image pour commencer</p>
                        <p className="text-sm mt-2">Formats supportés: JPG, PNG, WebP</p>
                        <p className="text-sm mt-1">Taille maximale: 10 MB</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Panel - Actions */}
                <div className="w-80 space-y-4 overflow-y-auto">
                  <Card className="p-4 space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Actions</h3>
                      {processing && <Badge variant="secondary">Traitement...</Badge>}
                    </div>

                    <Button className="w-full" onClick={handleApplyEnhancement} disabled={!hasImage || processing}>
                      {processing ? "Traitement..." : "Appliquer les améliorations"}
                    </Button>

                    <div className="pt-4 border-t">
                      <Label className="mb-3 block">Export</Label>
                      <div className="space-y-2">
                        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                          <option value="jpg">JPG</option>
                          <option value="png">PNG</option>
                          <option value="webp">WEBP</option>
                        </select>
                        <Button variant="outline" className="w-full bg-transparent" disabled={!hasImage}>
                          <Download className="w-4 h-4 mr-2" />
                          Télécharger
                        </Button>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4 border-t">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <Undo className="w-4 h-4 mr-2" />
                        Annuler
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <Redo className="w-4 h-4 mr-2" />
                        Rétablir
                      </Button>
                    </div>
                  </Card>

                  <div className="text-xs text-muted-foreground space-y-1 p-4">
                    <p>• Netteté: 0-100</p>
                    <p>• Luminosité: -100 à 100</p>
                    <p>• Saturation: -100 à 100</p>
                    <p>• Formats: JPG, PNG, WEBP</p>
                    <p>• Exposition: 0-100</p>
                    <p>• Contraste: 0-100</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
