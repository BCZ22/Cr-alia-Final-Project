"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { X } from "lucide-react"
import {
  Sparkles,
  Download,
  FileCode,
  Square,
  Pen,
  Type,
  Move,
  ZoomIn,
  ZoomOut,
  Layers,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  AlignLeft,
  AlignCenter,
  AlignRight,
  FlipHorizontal,
  FlipVertical,
  RotateCw,
} from "lucide-react"

interface VectorLayer {
  id: string
  name: string
  type: "shape" | "path" | "text"
  visible: boolean
  locked: boolean
  opacity: number
}

interface AIIllustrationsInterfaceProps {
  isOpen: boolean
  onClose: () => void
}

export function AiIllustrationsInterface({ isOpen, onClose }: AIIllustrationsInterfaceProps) {
  const [prompt, setPrompt] = useState("")
  const [style, setStyle] = useState("flat")
  const [detailLevel, setDetailLevel] = useState([50])
  const [iterations, setIterations] = useState([3])
  const [generating, setGenerating] = useState(false)
  const [hasIllustration, setHasIllustration] = useState(false)
  const [vectorLayers, setVectorLayers] = useState<VectorLayer[]>([])
  const [activeLayer, setActiveLayer] = useState<string | null>(null)
  const [tool, setTool] = useState<"select" | "pen" | "shape" | "text">("select")
  const [zoom, setZoom] = useState([100])
  const [fillColor, setFillColor] = useState("#3b82f6")
  const [strokeColor, setStrokeColor] = useState("#1e293b")
  const [strokeWidth, setStrokeWidth] = useState([2])
  const [colorPalette, setColorPalette] = useState("auto")

  const handleGenerate = () => {
    if (!prompt) return

    setGenerating(true)
    console.log("[v0] Generating illustration:", { prompt, style, detailLevel: detailLevel[0] })

    window.dispatchEvent(
      new CustomEvent("illustrations:generation-start", {
        detail: { prompt, style, detailLevel: detailLevel[0], iterations: iterations[0] },
      }),
    )

    setTimeout(() => {
      setGenerating(false)
      setHasIllustration(true)

      // Create initial layers
      const initialLayers: VectorLayer[] = [
        { id: "bg", name: "Arrière-plan", type: "shape", visible: true, locked: false, opacity: 100 },
        { id: "main", name: "Élément principal", type: "path", visible: true, locked: false, opacity: 100 },
        { id: "details", name: "Détails", type: "path", visible: true, locked: false, opacity: 100 },
      ]
      setVectorLayers(initialLayers)
      setActiveLayer(initialLayers[1].id)

      window.dispatchEvent(
        new CustomEvent("illustrations:generation-complete", {
          detail: { success: true, layers: initialLayers },
        }),
      )
      console.log("[v0] Illustration generated")
    }, 2500)
  }

  const handleAddLayer = (type: "shape" | "path" | "text") => {
    const newLayer: VectorLayer = {
      id: `layer-${Date.now()}`,
      name: `${type === "shape" ? "Forme" : type === "path" ? "Tracé" : "Texte"} ${vectorLayers.length + 1}`,
      type,
      visible: true,
      locked: false,
      opacity: 100,
    }
    setVectorLayers([...vectorLayers, newLayer])
    setActiveLayer(newLayer.id)
    console.log("[v0] Layer added:", newLayer)
    window.dispatchEvent(new CustomEvent("illustrations:layer-added", { detail: newLayer }))
  }

  const handleDeleteLayer = (id: string) => {
    setVectorLayers(vectorLayers.filter((l) => l.id !== id))
    if (activeLayer === id) setActiveLayer(null)
    console.log("[v0] Layer deleted:", id)
  }

  const handleDuplicateLayer = (id: string) => {
    const layer = vectorLayers.find((l) => l.id === id)
    if (!layer) return

    const duplicated: VectorLayer = {
      ...layer,
      id: `layer-${Date.now()}`,
      name: `${layer.name} copie`,
    }
    setVectorLayers([...vectorLayers, duplicated])
    console.log("[v0] Layer duplicated:", duplicated)
  }

  const handleToggleLayerVisibility = (id: string) => {
    setVectorLayers(vectorLayers.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l)))
  }

  const handleToggleLayerLock = (id: string) => {
    setVectorLayers(vectorLayers.map((l) => (l.id === id ? { ...l, locked: !l.locked } : l)))
  }

  const handleExportSVG = () => {
    console.log("[v0] Exporting as SVG")
    window.dispatchEvent(
      new CustomEvent("illustrations:export-svg", {
        detail: { layers: vectorLayers, format: "svg" },
      }),
    )
  }

  const handleExportPNG = () => {
    console.log("[v0] Exporting as PNG")
    window.dispatchEvent(
      new CustomEvent("illustrations:export-png", {
        detail: { layers: vectorLayers, format: "png" },
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
              <h2 className="text-2xl font-bold">Illustrations IA</h2>
              <p className="text-sm text-muted-foreground mt-1">Générez des illustrations vectorielles avec l'IA</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full">
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex-1 flex gap-4 overflow-hidden p-6">
            {/* Left Panel - Generation Controls */}
            <div className="w-80 space-y-4 overflow-y-auto">
              <Card className="p-4 space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Illustrations IA</h3>
                  <p className="text-sm text-muted-foreground">Générez des illustrations vectorielles avec l'IA</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prompt">Description</Label>
                  <Textarea
                    id="prompt"
                    placeholder="Décrivez l'illustration souhaitée..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="style">Style</Label>
                  <select
                    id="style"
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="flat">Flat Design</option>
                    <option value="vector">Vectoriel</option>
                    <option value="hand-drawn">Dessiné à la main</option>
                    <option value="isometric">Isométrique</option>
                    <option value="line-art">Line Art</option>
                    <option value="minimalist">Minimaliste</option>
                    <option value="geometric">Géométrique</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Niveau de détail: {detailLevel[0]}</Label>
                  <Slider value={detailLevel} onValueChange={setDetailLevel} min={0} max={100} />
                </div>

                <div className="space-y-2">
                  <Label>Nombre de variantes: {iterations[0]}</Label>
                  <Slider value={iterations} onValueChange={setIterations} min={1} max={6} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color-palette">Palette de couleurs</Label>
                  <select
                    id="color-palette"
                    value={colorPalette}
                    onChange={(e) => setColorPalette(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="auto">Automatique</option>
                    <option value="vibrant">Vibrante</option>
                    <option value="pastel">Pastel</option>
                    <option value="monochrome">Monochrome</option>
                    <option value="warm">Tons chauds</option>
                    <option value="cool">Tons froids</option>
                    <option value="custom">Personnalisée</option>
                  </select>
                </div>

                <Button className="w-full" onClick={handleGenerate} disabled={!prompt || generating}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  {generating ? "Génération..." : "Générer"}
                </Button>
              </Card>

              {/* Vector Editor Tools */}
              {hasIllustration && (
                <Card className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Éditeur vectoriel</h3>
                    <Badge variant="secondary">SVG</Badge>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-muted-foreground mb-2 block">Outils</Label>
                      <div className="grid grid-cols-4 gap-2">
                        <Button
                          variant={tool === "select" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setTool("select")}
                          className="aspect-square p-0"
                        >
                          <Move className="w-4 h-4" />
                        </Button>
                        <Button
                          variant={tool === "pen" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setTool("pen")}
                          className="aspect-square p-0"
                        >
                          <Pen className="w-4 h-4" />
                        </Button>
                        <Button
                          variant={tool === "shape" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setTool("shape")}
                          className="aspect-square p-0"
                        >
                          <Square className="w-4 h-4" />
                        </Button>
                        <Button
                          variant={tool === "text" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setTool("text")}
                          className="aspect-square p-0"
                        >
                          <Type className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Couleur de remplissage</Label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={fillColor}
                          onChange={(e) => setFillColor(e.target.value)}
                          className="w-12 h-10 rounded border cursor-pointer"
                        />
                        <input
                          type="text"
                          value={fillColor}
                          onChange={(e) => setFillColor(e.target.value)}
                          className="flex-1 px-3 py-2 text-sm border rounded"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Couleur de contour</Label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={strokeColor}
                          onChange={(e) => setStrokeColor(e.target.value)}
                          className="w-12 h-10 rounded border cursor-pointer"
                        />
                        <input
                          type="text"
                          value={strokeColor}
                          onChange={(e) => setStrokeColor(e.target.value)}
                          className="flex-1 px-3 py-2 text-sm border rounded"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Épaisseur du contour: {strokeWidth[0]}px</Label>
                      <Slider value={strokeWidth} onValueChange={setStrokeWidth} min={0} max={20} />
                    </div>

                    <Separator />

                    <div>
                      <Label className="text-xs text-muted-foreground mb-2 block">Alignement</Label>
                      <div className="grid grid-cols-3 gap-2">
                        <Button variant="outline" size="sm" className="aspect-square p-0 bg-transparent">
                          <AlignLeft className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="aspect-square p-0 bg-transparent">
                          <AlignCenter className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="aspect-square p-0 bg-transparent">
                          <AlignRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs text-muted-foreground mb-2 block">Transformation</Label>
                      <div className="grid grid-cols-3 gap-2">
                        <Button variant="outline" size="sm" className="aspect-square p-0 bg-transparent">
                          <FlipHorizontal className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="aspect-square p-0 bg-transparent">
                          <FlipVertical className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="aspect-square p-0 bg-transparent">
                          <RotateCw className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {/* Layers Panel */}
              {hasIllustration && (
                <Card className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Calques</h3>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" onClick={() => handleAddLayer("shape")}>
                        <Square className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleAddLayer("path")}>
                        <Pen className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleAddLayer("text")}>
                        <Type className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {vectorLayers.map((layer) => (
                      <Card
                        key={layer.id}
                        className={`p-3 cursor-pointer transition-colors ${
                          activeLayer === layer.id ? "border-primary" : ""
                        }`}
                        onClick={() => !layer.locked && setActiveLayer(layer.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <Layers className="w-4 h-4 flex-shrink-0" />
                            <span className="text-sm font-medium truncate">{layer.name}</span>
                            <Badge variant="outline" className="text-xs flex-shrink-0">
                              {layer.type === "shape" ? "Forme" : layer.type === "path" ? "Tracé" : "Texte"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleToggleLayerVisibility(layer.id)
                              }}
                            >
                              {layer.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleToggleLayerLock(layer.id)
                              }}
                            >
                              {layer.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDuplicateLayer(layer.id)
                              }}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteLayer(layer.id)
                              }}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </Card>
              )}
            </div>

            {/* Center - Canvas */}
            <div className="flex-1 flex flex-col gap-4">
              {/* Toolbar */}
              {hasIllustration && (
                <Card className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <ZoomOut className="w-4 h-4" />
                      </Button>
                      <span className="text-sm font-medium min-w-16 text-center">{zoom[0]}%</span>
                      <Button variant="outline" size="sm">
                        <ZoomIn className="w-4 h-4" />
                      </Button>
                      <Separator orientation="vertical" className="h-6 mx-2" />
                      <Slider value={zoom} onValueChange={setZoom} min={25} max={400} className="w-32" />
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleExportSVG}>
                        <FileCode className="w-4 h-4 mr-2" />
                        SVG
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleExportPNG}>
                        <Download className="w-4 h-4 mr-2" />
                        PNG
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              {/* Canvas Area */}
              <div className="flex-1 flex items-center justify-center bg-muted/20 rounded-lg relative overflow-hidden">
                {hasIllustration ? (
                  <div className="relative" style={{ transform: `scale(${zoom[0] / 100})` }}>
                    <div className="w-96 h-96 bg-background rounded-lg shadow-lg border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                      <div className="text-center">
                        <Sparkles className="w-16 h-16 mx-auto mb-4 text-primary" />
                        <p className="text-sm text-muted-foreground">Zone de travail vectorielle</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {vectorLayers.filter((l) => l.visible).length} calques visibles
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">Générez une illustration pour commencer</p>
                    <p className="text-sm mt-2">Utilisez l'éditeur vectoriel pour personnaliser</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export { AiIllustrationsInterface as AIIllustrationsInterface }
