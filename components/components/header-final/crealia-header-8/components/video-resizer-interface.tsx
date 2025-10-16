"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 6 6 18" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m6 6 12 12" />
  </svg>
)

interface ResizerPanelState {
  preview: {
    interactiveQuality: "low" | "medium" | "high"
    showGrid: boolean
    safeZones: boolean
    ruleOfThirds: boolean
  }
  format: {
    selected: string
    custom: {
      width: number
      height: number
    }
  }
  multiFormat: {
    selected: string[]
  }
  crop: {
    x: number
    y: number
    w: number
    h: number
    lockAspect: boolean
    keyframes: Array<{
      time: number
      x: number
      y: number
      w: number
      h: number
      easing: string
    }>
  }
  cutstitch: {
    in: number
    out: number
  }
  export: {
    codec: string
    container: string
    preset: string
  }
  warnings: string[]
}

interface VideoResizerInterfaceProps {
  isOpen: boolean
  onClose: () => void
}

export function VideoResizerInterface({ isOpen, onClose }: VideoResizerInterfaceProps) {
  const [panelState, setPanelState] = useState<ResizerPanelState>({
    preview: { interactiveQuality: "low", showGrid: true, safeZones: true, ruleOfThirds: true },
    format: { selected: "9:16", custom: { width: 1080, height: 1920 } },
    multiFormat: { selected: ["9:16"] },
    crop: { x: 0, y: 0, w: 1080, h: 1920, lockAspect: true, keyframes: [] },
    cutstitch: { in: 0, out: 10 },
    export: { codec: "h264", container: "mp4", preset: "social_pack" },
    warnings: [],
  })

  const [playheadTime, setPlayheadTime] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isAutoCropping, setIsAutoCropping] = useState(false)

  const formatPresets = [
    { value: "16:9", label: "16:9 (YouTube)", width: 1920, height: 1080 },
    { value: "9:16", label: "9:16 (TikTok/Reels)", width: 1080, height: 1920 },
    { value: "1:1", label: "1:1 (Instagram)", width: 1080, height: 1080 },
    { value: "4:5", label: "4:5 (Facebook)", width: 1080, height: 1350 },
    { value: "21:9", label: "21:9 (Cinéma)", width: 2560, height: 1080 },
    { value: "custom", label: "Personnalisé", width: 1080, height: 1920 },
  ]

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // K - Add keyframe
      if (e.key === "k" || e.key === "K") {
        e.preventDefault()
        handleAddKeyframe()
        console.log("[v0] Keyboard shortcut: K - Add keyframe")
      }
      // L - Toggle lock aspect
      else if (e.key === "l" || e.key === "L") {
        e.preventDefault()
        setPanelState((prev) => ({
          ...prev,
          crop: { ...prev.crop, lockAspect: !prev.crop.lockAspect },
        }))
        emitEvent("resizer.lockAspect.toggle", { locked: !panelState.crop.lockAspect })
        console.log("[v0] Keyboard shortcut: L - Toggle lock aspect")
      }
      // A - Run auto-crop
      else if (e.key === "a" || e.key === "A") {
        e.preventDefault()
        handleAutoCrop()
        console.log("[v0] Keyboard shortcut: A - Run auto-crop")
      }
      // Arrow keys + Shift - Nudge crop by 10px
      else if (e.shiftKey && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault()
        const nudgeAmount = 10
        setPanelState((prev) => {
          const newCrop = { ...prev.crop }
          if (e.key === "ArrowUp") newCrop.y = Math.max(0, newCrop.y - nudgeAmount)
          if (e.key === "ArrowDown") newCrop.y = Math.min(100, newCrop.y + nudgeAmount)
          if (e.key === "ArrowLeft") newCrop.x = Math.max(0, newCrop.x - nudgeAmount)
          if (e.key === "ArrowRight") newCrop.x = Math.min(100, newCrop.x + nudgeAmount)
          return { ...prev, crop: newCrop }
        })
        console.log("[v0] Keyboard shortcut: Arrow+Shift - Nudge crop")
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, panelState.crop.lockAspect])

  const emitEvent = useCallback((eventName: string, payload: any) => {
    console.log(`[v0] Event: ${eventName}`, payload)
    // In production: window.dispatchEvent(new CustomEvent(eventName, { detail: payload }))
    // Analytics: analytics.track(eventName, { projectId, userId, clipId, toolId: 'resizer', ...payload })
  }, [])

  const handleFormatChange = (format: string) => {
    const preset = formatPresets.find((f) => f.value === format)
    if (!preset) return

    setPanelState((prev) => ({
      ...prev,
      format: {
        selected: format,
        custom: format === "custom" ? prev.format.custom : { width: preset.width, height: preset.height },
      },
      crop: {
        ...prev.crop,
        w: preset.width,
        h: preset.height,
      },
    }))

    emitEvent("resizer.format.change", { format })
  }

  const handleCustomDimensionChange = (dimension: "width" | "height", value: number) => {
    const clampedValue = Math.max(64, Math.min(8192, value))

    setPanelState((prev) => ({
      ...prev,
      format: {
        ...prev.format,
        custom: {
          ...prev.format.custom,
          [dimension]: clampedValue,
        },
      },
    }))

    emitEvent("resizer.format.custom.update", {
      width: dimension === "width" ? clampedValue : panelState.format.custom.width,
      height: dimension === "height" ? clampedValue : panelState.format.custom.height,
    })

    const upscaleFactor = Math.max(
      clampedValue / (dimension === "width" ? 1920 : 1080),
      (dimension === "width" ? panelState.format.custom.height : clampedValue) / 1080,
    )
    if (upscaleFactor > 2) {
      setPanelState((prev) => ({
        ...prev,
        warnings: [...prev.warnings.filter((w) => w !== "upscale"), "upscale"],
      }))
    } else {
      setPanelState((prev) => ({
        ...prev,
        warnings: prev.warnings.filter((w) => w !== "upscale"),
      }))
    }
  }

  const handleMultiFormatToggle = (format: string) => {
    setPanelState((prev) => {
      const currentSelected = prev.multiFormat.selected
      const newSelected = currentSelected.includes(format)
        ? currentSelected.filter((f) => f !== format)
        : currentSelected.length < 6
          ? [...currentSelected, format]
          : currentSelected

      emitEvent("resizer.multiformat.toggle", { formats: newSelected })
      return { ...prev, multiFormat: { selected: newSelected } }
    })
  }

  const handleCropDrag = (x: number, y: number) => {
    setPanelState((prev) => ({
      ...prev,
      crop: { ...prev.crop, x, y },
    }))

    if (isDragging) {
      emitEvent("resizer.crop.drag", {
        x,
        y,
        w: panelState.crop.w,
        h: panelState.crop.h,
        playheadTime,
      })
    }
  }

  const handleAddKeyframe = () => {
    const newKeyframe = {
      time: playheadTime,
      x: panelState.crop.x,
      y: panelState.crop.y,
      w: panelState.crop.w,
      h: panelState.crop.h,
      easing: "ease-in-out",
    }

    setPanelState((prev) => ({
      ...prev,
      crop: {
        ...prev.crop,
        keyframes: [...prev.crop.keyframes, newKeyframe],
      },
    }))

    emitEvent("resizer.keyframe.add", { time: playheadTime, transform: newKeyframe })
  }

  const handleAutoCrop = async () => {
    setIsAutoCropping(true)
    emitEvent("resizer.autocrop.request", {
      clipId: "clip_123",
      frameRange: { start: panelState.cutstitch.in, end: panelState.cutstitch.out },
    })

    // Simulate API call to /api/ai/autocrop
    setTimeout(() => {
      const mockKeyframes = [
        { time: 0, x: 10, y: 10, w: 1080, h: 1920, easing: "ease-in-out" },
        { time: 50, x: 20, y: 15, w: 1080, h: 1920, easing: "ease-in-out" },
        { time: 100, x: 5, y: 5, w: 1080, h: 1920, easing: "ease-in-out" },
      ]

      setPanelState((prev) => ({
        ...prev,
        crop: { ...prev.crop, keyframes: mockKeyframes },
      }))

      emitEvent("resizer.autocrop.received", { cropKeyframes: mockKeyframes })
      setIsAutoCropping(false)
    }, 2000)
  }

  const handleApply = () => {
    const command = {
      type: "command",
      op: "clip.update",
      payload: { panelState },
      undo: { panelState }, // Store current state for undo
    }

    emitEvent("resizer.apply", command)
    console.log("[v0] Apply command:", command)
  }

  const handleReset = () => {
    setPanelState({
      preview: { interactiveQuality: "low", showGrid: true, safeZones: true, ruleOfThirds: true },
      format: { selected: "9:16", custom: { width: 1080, height: 1920 } },
      multiFormat: { selected: ["9:16"] },
      crop: { x: 0, y: 0, w: 1080, h: 1920, lockAspect: true, keyframes: [] },
      cutstitch: { in: 0, out: 10 },
      export: { codec: "h264", container: "mp4", preset: "social_pack" },
      warnings: [],
    })
    emitEvent("resizer.reset", {})
  }

  if (!isOpen) return null

  return (
    <div
      id="panel-resizer"
      className="fixed inset-y-0 right-0 z-[60] w-[480px] bg-background border-l border-border shadow-2xl animate-slide-in-right"
      role="region"
      aria-label="Redimensionner la vidéo"
    >
      <div id="resizer-header" className="flex flex-col gap-2 p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 id="resizer-title" className="text-lg font-semibold">
              Redimensionner la vidéo
            </h2>
            <div id="resizer-breadcrumb" className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <span>Projet</span>
              <span>/</span>
              <span>Clip</span>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full" aria-label="Fermer le panneau">
            <XIcon className="w-4 h-4" />
          </Button>
        </div>
        <div id="resizer-actions" className="flex items-center gap-2">
          <Button id="resizer-action-apply" size="sm" onClick={handleApply} className="flex-1">
            Appliquer
          </Button>
          <Button id="resizer-action-reset" size="sm" variant="outline" onClick={handleReset}>
            Réinitialiser
          </Button>
          <Button id="resizer-action-cancel" size="sm" variant="ghost" onClick={onClose}>
            Annuler
          </Button>
        </div>
      </div>

      <div className="h-[calc(100vh-120px)] overflow-y-auto p-4 space-y-6">
        <div id="resizer-preview" className="space-y-2" role="region" aria-label="Aperçu de la vidéo">
          <Label>Aperçu</Label>
          <div className="relative aspect-video bg-secondary/20 rounded-lg overflow-hidden border border-border">
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/30 rounded-lg flex items-center justify-center transition-all"
                style={{
                  width: `${(panelState.crop.w / 1920) * 80}%`,
                  height: `${(panelState.crop.h / 1080) * 80}%`,
                  transform: `translate(${panelState.crop.x}px, ${panelState.crop.y}px)`,
                }}
                onMouseDown={() => {
                  setIsDragging(true)
                  emitEvent("resizer.crop.start", { playheadTime })
                }}
                onMouseUp={() => setIsDragging(false)}
              >
                <span className="text-xs text-muted-foreground">
                  {panelState.crop.w} × {panelState.crop.h}
                </span>
              </div>
            </div>

            {/* Grid overlay */}
            {panelState.preview.showGrid && (
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="border border-white/10" />
                ))}
              </div>
            )}

            {/* Safe zones */}
            {panelState.preview.safeZones && (
              <div className="absolute inset-0 border-4 border-yellow-500/30 pointer-events-none m-8" />
            )}

            {/* Rule of thirds */}
            {panelState.preview.ruleOfThirds && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/20" />
                <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/20" />
                <div className="absolute top-1/3 left-0 right-0 h-px bg-white/20" />
                <div className="absolute top-2/3 left-0 right-0 h-px bg-white/20" />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Checkbox
              id="resizer-preview-grid"
              checked={panelState.preview.showGrid}
              onCheckedChange={(checked) =>
                setPanelState((prev) => ({
                  ...prev,
                  preview: { ...prev.preview, showGrid: checked as boolean },
                }))
              }
            />
            <Label htmlFor="resizer-preview-grid" className="cursor-pointer">
              Grille
            </Label>
            <Checkbox
              id="resizer-preview-safezones"
              checked={panelState.preview.safeZones}
              onCheckedChange={(checked) =>
                setPanelState((prev) => ({
                  ...prev,
                  preview: { ...prev.preview, safeZones: checked as boolean },
                }))
              }
            />
            <Label htmlFor="resizer-preview-safezones" className="cursor-pointer">
              Zones sûres
            </Label>
          </div>
        </div>

        <div id="resizer-format-selector" className="space-y-2">
          <Label htmlFor="resizer-format-select">Format</Label>
          <Select value={panelState.format.selected} onValueChange={handleFormatChange}>
            <SelectTrigger id="resizer-format-select" aria-label="Sélectionner un format">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {formatPresets.map((preset) => (
                <SelectItem key={preset.value} value={preset.value}>
                  {preset.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {panelState.format.selected === "custom" && (
          <div id="resizer-custom-dimensions" className="space-y-3">
            <Label>Dimensions personnalisées</Label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="resizer-custom-width" className="text-xs">
                  Largeur (64-8192px)
                </Label>
                <Input
                  id="resizer-custom-width"
                  type="number"
                  min={64}
                  max={8192}
                  value={panelState.format.custom.width}
                  onChange={(e) => handleCustomDimensionChange("width", Number.parseInt(e.target.value) || 64)}
                  aria-label="Largeur personnalisée"
                />
              </div>
              <div>
                <Label htmlFor="resizer-custom-height" className="text-xs">
                  Hauteur (64-8192px)
                </Label>
                <Input
                  id="resizer-custom-height"
                  type="number"
                  min={64}
                  max={8192}
                  value={panelState.format.custom.height}
                  onChange={(e) => handleCustomDimensionChange("height", Number.parseInt(e.target.value) || 64)}
                  aria-label="Hauteur personnalisée"
                />
              </div>
            </div>
          </div>
        )}

        <div id="resizer-multiformat" className="space-y-2">
          <Label>Formats multiples (max 6)</Label>
          <div className="space-y-2">
            {formatPresets.slice(0, 5).map((preset) => (
              <div key={preset.value} className="flex items-center gap-2">
                <Checkbox
                  id={`resizer-multiformat-${preset.value}`}
                  checked={panelState.multiFormat.selected.includes(preset.value)}
                  onCheckedChange={() => handleMultiFormatToggle(preset.value)}
                  disabled={
                    !panelState.multiFormat.selected.includes(preset.value) &&
                    panelState.multiFormat.selected.length >= 6
                  }
                />
                <Label htmlFor={`resizer-multiformat-${preset.value}`} className="cursor-pointer text-sm">
                  {preset.label}
                </Label>
              </div>
            ))}
          </div>
          {panelState.multiFormat.selected.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {panelState.multiFormat.selected.length} format(s) sélectionné(s)
            </p>
          )}
        </div>

        <div id="resizer-crop-controls" className="space-y-3">
          <Label>Contrôles de recadrage</Label>
          <div className="flex items-center gap-2">
            <Switch
              id="resizer-lock-aspect"
              checked={panelState.crop.lockAspect}
              onCheckedChange={(checked) => {
                setPanelState((prev) => ({
                  ...prev,
                  crop: { ...prev.crop, lockAspect: checked },
                }))
                emitEvent("resizer.lockAspect.toggle", { locked: checked })
              }}
              aria-label="Verrouiller le ratio d'aspect"
            />
            <Label htmlFor="resizer-lock-aspect" className="cursor-pointer text-sm">
              Verrouiller le ratio d'aspect (L)
            </Label>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Position X: {panelState.crop.x}px</Label>
            <Slider
              value={[panelState.crop.x]}
              onValueChange={(v) => handleCropDrag(v[0], panelState.crop.y)}
              min={0}
              max={100}
              step={1}
              aria-label="Position X du recadrage"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Position Y: {panelState.crop.y}px</Label>
            <Slider
              value={[panelState.crop.y]}
              onValueChange={(v) => handleCropDrag(panelState.crop.x, v[0])}
              min={0}
              max={100}
              step={1}
              aria-label="Position Y du recadrage"
            />
          </div>
        </div>

        <div id="resizer-autocrop" className="space-y-2">
          <Button
            id="resizer-autocrop-button"
            variant="outline"
            className="w-full bg-transparent"
            onClick={handleAutoCrop}
            disabled={isAutoCropping}
            aria-label="Lancer le recadrage automatique IA"
          >
            {isAutoCropping ? "Analyse en cours..." : "Recadrage automatique IA (A)"}
          </Button>
          <p className="text-xs text-muted-foreground">Détecte et suit automatiquement le sujet principal</p>
        </div>

        <div id="resizer-keyframes" className="space-y-2" role="region" aria-label="Timeline des keyframes">
          <div className="flex items-center justify-between">
            <Label>Keyframes ({panelState.crop.keyframes.length}/100)</Label>
            <Button
              id="resizer-keyframe-add"
              size="sm"
              variant="outline"
              onClick={handleAddKeyframe}
              disabled={panelState.crop.keyframes.length >= 100}
              aria-label="Ajouter un keyframe"
            >
              + Keyframe (K)
            </Button>
          </div>

          <div className="relative h-16 bg-secondary/30 rounded-lg overflow-hidden">
            {/* Timeline background */}
            <div className="flex h-full">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 border-r border-border/30 bg-gradient-to-b from-secondary/50 to-secondary/20"
                />
              ))}
            </div>

            {/* Keyframe markers */}
            {panelState.crop.keyframes.map((kf, i) => (
              <div
                key={i}
                className="absolute top-0 bottom-0 w-1 bg-primary cursor-pointer hover:bg-primary/80"
                style={{ left: `${kf.time}%` }}
                title={`Keyframe at ${kf.time}%`}
              >
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary rounded-full border-2 border-background" />
              </div>
            ))}

            {/* Playhead */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white pointer-events-none"
              style={{ left: `${playheadTime}%` }}
            >
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full" />
            </div>
          </div>

          <Slider
            value={[playheadTime]}
            onValueChange={(v) => setPlayheadTime(v[0])}
            min={0}
            max={100}
            step={0.1}
            aria-label="Position de la tête de lecture"
          />
        </div>

        <div id="resizer-cutstitch" className="space-y-3">
          <Label>Découper et assembler</Label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="resizer-cutstitch-in" className="text-xs">
                Point d'entrée
              </Label>
              <Input
                id="resizer-cutstitch-in"
                type="number"
                min={0}
                value={panelState.cutstitch.in}
                onChange={(e) =>
                  setPanelState((prev) => ({
                    ...prev,
                    cutstitch: { ...prev.cutstitch, in: Number.parseInt(e.target.value) || 0 },
                  }))
                }
                aria-label="Point d'entrée"
              />
            </div>
            <div>
              <Label htmlFor="resizer-cutstitch-out" className="text-xs">
                Point de sortie
              </Label>
              <Input
                id="resizer-cutstitch-out"
                type="number"
                min={0}
                value={panelState.cutstitch.out}
                onChange={(e) =>
                  setPanelState((prev) => ({
                    ...prev,
                    cutstitch: { ...prev.cutstitch, out: Number.parseInt(e.target.value) || 0 },
                  }))
                }
                aria-label="Point de sortie"
              />
            </div>
          </div>
        </div>

        <div id="resizer-export" className="space-y-3">
          <Label>Options d'export</Label>
          <div className="space-y-2">
            <Select
              value={panelState.export.codec}
              onValueChange={(value) =>
                setPanelState((prev) => ({
                  ...prev,
                  export: { ...prev.export, codec: value },
                }))
              }
            >
              <SelectTrigger aria-label="Sélectionner un codec">
                <SelectValue placeholder="Codec" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="h264">H.264</SelectItem>
                <SelectItem value="h265">H.265 (HEVC)</SelectItem>
                <SelectItem value="vp9">VP9</SelectItem>
                <SelectItem value="av1">AV1</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={panelState.export.container}
              onValueChange={(value) =>
                setPanelState((prev) => ({
                  ...prev,
                  export: { ...prev.export, container: value },
                }))
              }
            >
              <SelectTrigger aria-label="Sélectionner un conteneur">
                <SelectValue placeholder="Conteneur" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mp4">MP4</SelectItem>
                <SelectItem value="mov">MOV</SelectItem>
                <SelectItem value="webm">WebM</SelectItem>
                <SelectItem value="mkv">MKV</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={panelState.export.preset}
              onValueChange={(value) =>
                setPanelState((prev) => ({
                  ...prev,
                  export: { ...prev.export, preset: value },
                }))
              }
            >
              <SelectTrigger aria-label="Sélectionner un preset">
                <SelectValue placeholder="Preset" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="social_pack">Pack Réseaux Sociaux</SelectItem>
                <SelectItem value="high_quality">Haute Qualité</SelectItem>
                <SelectItem value="web_optimized">Optimisé Web</SelectItem>
                <SelectItem value="mobile">Mobile</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {panelState.warnings.length > 0 && (
          <Card
            id="resizer-warnings"
            className="p-3 bg-yellow-500/10 border-yellow-500/30"
            role="alert"
            aria-label="Avertissements"
          >
            <div className="space-y-2">
              <Label className="text-yellow-600 dark:text-yellow-400 font-semibold">⚠️ Avertissements</Label>
              {panelState.warnings.includes("upscale") && (
                <p className="text-xs text-yellow-600 dark:text-yellow-400">
                  Attention : L'upscaling supérieur à 2x peut réduire la qualité de la vidéo.
                </p>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
