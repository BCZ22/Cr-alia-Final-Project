"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Sparkles, Download, Edit, AlertCircle, ArrowUpCircle, Layers, X } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface TextToImageConfig {
  prompt: string
  style: string
  aspect: string
  custom?: { w: number; h: number }
  n: number
  seed: number | null
  safety: boolean
  negativePrompt?: string
}

interface GeneratedVariant {
  index: number
  assetId: string
  url: string
  thumbnailUrl: string
  width: number
  height: number
  meta: {
    prompt: string
    style: string
    seed: number
    modelVersion: string
    safety: string
  }
}

interface TaskStatus {
  taskId: string
  status: "queued" | "running" | "completed" | "failed"
  progress: number
  outputs: GeneratedVariant[]
  error: { code: string; message: string; suggestion?: string } | null
}

interface ValidationError {
  field: string
  message: string
}

function validateConfig(config: TextToImageConfig): ValidationError[] {
  const errors: ValidationError[] = []

  if (!config.prompt || config.prompt.trim().length === 0) {
    errors.push({ field: "prompt", message: "ERR_PROMPT_EMPTY: La description est requise" })
  }

  if (config.prompt.length > 2500) {
    errors.push({ field: "prompt", message: "La description ne peut pas dépasser 2500 caractères" })
  }

  if (config.n < 1 || config.n > 8) {
    errors.push({ field: "n", message: "Le nombre de variantes doit être entre 1 et 8" })
  }

  if (config.custom) {
    if (config.custom.w < 64 || config.custom.w > 8192) {
      errors.push({ field: "width", message: "ERR_INVALID_DIMENSIONS: Largeur doit être entre 64 et 8192" })
    }
    if (config.custom.h < 64 || config.custom.h > 8192) {
      errors.push({ field: "height", message: "ERR_INVALID_DIMENSIONS: Hauteur doit être entre 64 et 8192" })
    }
  }

  return errors
}

interface TextToImageInterfaceProps {
  isOpen: boolean
  onClose: () => void
}

export function TextToImageInterface({ isOpen, onClose }: TextToImageInterfaceProps) {
  console.log("[v0] TextToImageInterface rendered with isOpen:", isOpen)

  const [config, setConfig] = useState<TextToImageConfig>({
    prompt: "",
    style: "photorealistic",
    aspect: "9:16",
    custom: undefined,
    n: 4,
    seed: null,
    safety: true,
    negativePrompt: "",
  })

  const [quality, setQuality] = useState([75])
  const [options, setOptions] = useState({
    shadow: false,
    photorealistic: false,
    flatVector: false,
  })

  const [taskStatus, setTaskStatus] = useState<TaskStatus | null>(null)
  const [variants, setVariants] = useState<GeneratedVariant[]>([])
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])
  const [selectedVariant, setSelectedVariant] = useState<GeneratedVariant | null>(null)

  const handleGenerate = async () => {
    const errors = validateConfig(config)
    setValidationErrors(errors)

    if (errors.length > 0) {
      console.log("[v0] text2img validation failed:", errors)
      window.dispatchEvent(
        new CustomEvent("ui.text2img.generate.validation_failed", {
          detail: { errors },
        }),
      )
      return
    }

    // Emit analytics event
    window.dispatchEvent(
      new CustomEvent("ui.text2img.generate.request", {
        detail: { config, timestamp: Date.now() },
      }),
    )

    console.log("[v0] Creating text2img task:", config)

    // Create task via TaskQueue API
    const taskPayload = {
      taskType: "ai:text2image",
      payload: {
        projectId: "p_123",
        userId: "u_1",
        prompt: config.prompt,
        style: config.style,
        aspect: config.aspect,
        custom: config.custom,
        n: config.n,
        seed: config.seed,
        safety: config.safety,
        metadata: { source: "crealia.ui.text2img.v1" },
      },
    }

    console.log("[v0] POST /api/task/create payload:", taskPayload)

    // Simulate task creation
    const mockTaskId = "t_" + Date.now()
    setTaskStatus({
      taskId: mockTaskId,
      status: "queued",
      progress: 0,
      outputs: [],
      error: null,
    })

    // Simulate task polling
    pollTaskStatus(mockTaskId)
  }

  const pollTaskStatus = (taskId: string) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += 5

      if (progress >= 100) {
        clearInterval(interval)

        // Mock generated variants
        const mockVariants: GeneratedVariant[] = Array.from({ length: config.n }, (_, i) => ({
          index: i,
          assetId: `a_${taskId}_${i}`,
          url: `/ai-generated-image-${(i % 4) + 1}.jpg`,
          thumbnailUrl: `/ai-generated-image-${(i % 4) + 1}.jpg`,
          width: 1080,
          height: 1920,
          meta: {
            prompt: config.prompt,
            style: config.style,
            seed: config.seed || Math.floor(Math.random() * 1000000),
            modelVersion: "v1.2",
            safety: "pass",
          },
        }))

        setTaskStatus({
          taskId,
          status: "completed",
          progress: 100,
          outputs: mockVariants,
          error: null,
        })

        setVariants(mockVariants)

        console.log("[v0] text2img task completed:", mockVariants)

        window.dispatchEvent(
          new CustomEvent("ui.text2img.generate.complete", {
            detail: {
              taskId,
              variants: mockVariants,
              config,
            },
          }),
        )

        window.dispatchEvent(
          new CustomEvent("analytics.cost.estimated", {
            detail: {
              taskId,
              costEstimate: config.n * 0.02,
              modelVersion: "v1.2",
            },
          }),
        )
      } else {
        setTaskStatus((prev) =>
          prev
            ? {
                ...prev,
                status: "running",
                progress,
              }
            : null,
        )
      }
    }, 200)
  }

  const handleUpscale = async (variant: GeneratedVariant, scale: number) => {
    console.log("[v0] Upscaling variant:", variant.assetId, "scale:", scale)

    const upscalePayload = {
      taskType: "ai:upscale",
      payload: {
        assetId: variant.assetId,
        scale,
        preset: "photoshop_like",
      },
    }

    console.log("[v0] POST /api/task/create (upscale):", upscalePayload)

    window.dispatchEvent(
      new CustomEvent("ui.text2img.variant.upscale", {
        detail: { assetId: variant.assetId, scale },
      }),
    )

    // Simulate upscale task
    alert(`Upscaling image ${variant.index + 1} by ${scale}x...`)
  }

  const handleVariantAction = (action: string, variant: GeneratedVariant) => {
    console.log("[v0] Variant action:", action, variant.assetId)

    switch (action) {
      case "select":
        setSelectedVariant(variant)
        window.dispatchEvent(
          new CustomEvent("ui.text2img.variant.select", {
            detail: { assetId: variant.assetId },
          }),
        )
        break
      case "edit":
        window.dispatchEvent(
          new CustomEvent("ui.text2img.variant.edit", {
            detail: { assetId: variant.assetId },
          }),
        )
        alert(`Opening Image Editor for variant ${variant.index + 1}`)
        break
      case "download":
        window.dispatchEvent(
          new CustomEvent("ui.text2img.variant.download", {
            detail: { assetId: variant.assetId },
          }),
        )
        alert(`Downloading variant ${variant.index + 1}`)
        break
      case "useAsLayer":
        window.dispatchEvent(
          new CustomEvent("command", {
            detail: {
              type: "asset.import",
              payload: {
                assetId: variant.assetId,
                targetTrack: "V1",
                startTime: 0,
              },
              undo: {
                op: "asset.remove",
                payload: { assetId: variant.assetId, track: "V1" },
              },
            },
          }),
        )
        alert(`Adding variant ${variant.index + 1} to project as layer`)
        break
    }
  }

  const applyPromptHelper = (helper: { id: string; label: string; suffix: string }) => {
    setConfig((prev) => ({
      ...prev,
      prompt: prev.prompt + helper.suffix,
    }))

    window.dispatchEvent(
      new CustomEvent("ui.text2img.helper.apply", {
        detail: { helperId: helper.id },
      }),
    )
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
                <h2 className="text-2xl font-bold">Texte en Image</h2>
                <p className="text-muted-foreground text-sm mt-1">Générer des images à partir de prompts textuels</p>
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
                    <div className="space-y-2">
                      <Label htmlFor="prompt">Description *</Label>
                      <Textarea
                        id="prompt"
                        placeholder="Décrivez l'image que vous souhaitez générer..."
                        value={config.prompt}
                        onChange={(e) => setConfig((prev) => ({ ...prev, prompt: e.target.value }))}
                        rows={4}
                        maxLength={2500}
                        className={validationErrors.some((e) => e.field === "prompt") ? "border-destructive" : ""}
                      />
                      <p className="text-xs text-muted-foreground">{config.prompt.length}/2500 caractères</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="style">Style</Label>
                      <select
                        id="style"
                        value={config.style}
                        onChange={(e) => setConfig((prev) => ({ ...prev, style: e.target.value }))}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="photorealistic">Photoréaliste</option>
                        <option value="vector">Vectoriel</option>
                        <option value="flat">Flat Design</option>
                        <option value="watercolor">Aquarelle</option>
                        <option value="anime">Anime</option>
                        <option value="cartoon">Cartoon</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="format">Format</Label>
                      <select
                        id="format"
                        value={config.aspect}
                        onChange={(e) => setConfig((prev) => ({ ...prev, aspect: e.target.value }))}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="1:1">Carré (1:1)</option>
                        <option value="16:9">Paysage (16:9)</option>
                        <option value="9:16">Portrait (9:16)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label>Qualité: {quality[0]}%</Label>
                      <Slider value={quality} onValueChange={setQuality} min={0} max={100} />
                    </div>

                    <div className="space-y-3 pt-2 border-t">
                      <Label>Options</Label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={options.shadow}
                            onChange={(e) => setOptions((prev) => ({ ...prev, shadow: e.target.checked }))}
                            className="w-4 h-4 rounded border-input"
                          />
                          <span className="text-sm">Ombre</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={options.photorealistic}
                            onChange={(e) => setOptions((prev) => ({ ...prev, photorealistic: e.target.checked }))}
                            className="w-4 h-4 rounded border-input"
                          />
                          <span className="text-sm">Photoréaliste</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={options.flatVector}
                            onChange={(e) => setOptions((prev) => ({ ...prev, flatVector: e.target.checked }))}
                            className="w-4 h-4 rounded border-input"
                          />
                          <span className="text-sm">Flat Vector</span>
                        </label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="variants">Nombre de variantes (1-8)</Label>
                      <select
                        id="variants"
                        value={config.n}
                        onChange={(e) => setConfig((prev) => ({ ...prev, n: Number.parseInt(e.target.value) }))}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                          <option key={n} value={n}>
                            {n} variante{n > 1 ? "s" : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  </Card>
                </div>

                {/* Center Panel - Preview */}
                <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
                  {taskStatus && taskStatus.status !== "completed" && (
                    <Card className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {taskStatus.status === "queued" && "En file d'attente..."}
                            {taskStatus.status === "running" && "Génération en cours..."}
                          </span>
                          <span className="font-medium">{taskStatus.progress}%</span>
                        </div>
                        <Progress value={taskStatus.progress} />
                        <p className="text-xs text-muted-foreground">
                          Coût estimé: {(config.n * 0.02).toFixed(2)}€ | Modèle: v1.2
                        </p>
                      </div>
                    </Card>
                  )}

                  {variants.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                      {variants.map((variant) => (
                        <Card
                          key={variant.assetId}
                          className={`overflow-hidden group relative cursor-pointer ${
                            selectedVariant?.assetId === variant.assetId ? "ring-2 ring-primary" : ""
                          }`}
                          onClick={() => handleVariantAction("select", variant)}
                        >
                          <img
                            src={variant.url || "/placeholder.svg"}
                            alt={`Variant ${variant.index + 1}`}
                            className="w-full"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4">
                            <div className="flex gap-2">
                              <Button size="sm" variant="secondary" onClick={() => handleUpscale(variant, 2)}>
                                <ArrowUpCircle className="w-4 h-4 mr-1" />
                                Upscale 2x
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handleVariantAction("edit", variant)}
                              >
                                <Edit className="w-4 h-4 mr-1" />
                                Éditer
                              </Button>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handleVariantAction("download", variant)}
                              >
                                <Download className="w-4 h-4 mr-1" />
                                Télécharger
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handleVariantAction("useAsLayer", variant)}
                              >
                                <Layers className="w-4 h-4 mr-1" />
                                Utiliser
                              </Button>
                            </div>
                            <div className="text-xs text-white/80 mt-2">
                              Seed: {variant.meta.seed} | {variant.width}x{variant.height}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center bg-muted/20 rounded-lg">
                      <div className="text-center text-muted-foreground">
                        <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-30" />
                        <p className="text-lg font-medium">Aucune image générée</p>
                        <p className="text-sm mt-2">Remplissez le prompt et cliquez sur Générer</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Panel - Actions */}
                <div className="w-80 space-y-4 overflow-y-auto">
                  <Card className="p-4 space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Actions</h3>
                      {taskStatus && (
                        <Badge variant={taskStatus.status === "completed" ? "default" : "secondary"}>
                          {taskStatus.status}
                        </Badge>
                      )}
                    </div>

                    <Button
                      className="w-full"
                      onClick={handleGenerate}
                      disabled={!config.prompt || taskStatus?.status === "running"}
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      {taskStatus?.status === "running" ? "Génération..." : "Générer"}
                    </Button>

                    {variants.length > 0 && (
                      <>
                        <div className="pt-4 border-t">
                          <Label className="mb-3 block">Variantes générées ({variants.length})</Label>
                          <div className="space-y-2">
                            {variants.map((variant) => (
                              <Card
                                key={variant.assetId}
                                className={`p-3 cursor-pointer transition-colors ${
                                  selectedVariant?.assetId === variant.assetId ? "border-primary" : ""
                                }`}
                                onClick={() => setSelectedVariant(variant)}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium">Variante {variant.index + 1}</span>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleVariantAction("download", variant)
                                    }}
                                  >
                                    <Download className="w-4 h-4" />
                                  </Button>
                                </div>
                              </Card>
                            ))}
                          </div>
                        </div>

                        <div className="pt-4 border-t">
                          <Label className="mb-3 block">Export</Label>
                          <div className="space-y-2">
                            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                              <option value="png">PNG</option>
                              <option value="jpg">JPG</option>
                              <option value="webp">WEBP</option>
                            </select>
                            <Button variant="outline" className="w-full bg-transparent" disabled={!selectedVariant}>
                              <Download className="w-4 h-4 mr-2" />
                              Télécharger sélection
                            </Button>
                            <Button variant="outline" className="w-full bg-transparent">
                              <Download className="w-4 h-4 mr-2" />
                              Télécharger tout (ZIP)
                            </Button>
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          className="w-full bg-transparent"
                          onClick={() => {
                            setVariants([])
                            setSelectedVariant(null)
                          }}
                        >
                          <X className="w-4 h-4 mr-2" />
                          Effacer tout
                        </Button>
                      </>
                    )}
                  </Card>

                  <div className="text-xs text-muted-foreground space-y-1 p-4">
                    <p>• Validation: prompt requis (max 2500)</p>
                    <p>• Variantes: 1-8</p>
                    <p>• Qualité: 0-100%</p>
                    <p>• Raccourcis: Ctrl+Enter générer</p>
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
