"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const backgroundOptions = [
  { id: "transparent", name: "Transparent", preview: "checkered", color: "from-gray-500/20 to-gray-600/10" },
  { id: "white", name: "Blanc", preview: "#FFFFFF", color: "from-white to-gray-100" },
  { id: "gradient1", name: "Dégradé Bleu", preview: "linear-gradient", color: "from-blue-500 to-purple-500" },
  { id: "gradient2", name: "Dégradé Rose", preview: "linear-gradient", color: "from-pink-500 to-orange-500" },
  { id: "gradient3", name: "Dégradé Vert", preview: "linear-gradient", color: "from-green-500 to-teal-500" },
  { id: "blur", name: "Flou Artistique", preview: "blur", color: "from-purple-500/50 to-pink-500/50" },
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

const ImageIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      x="3"
      y="3"
      width="18"
      height="18"
      rx="2"
      ry="2"
    />
    <circle strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} cx="9" cy="9" r="2" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
  </svg>
)

const DownloadIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} points="7 10 12 15 17 10" />
    <line strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} x1="12" y1="15" x2="12" y2="3" />
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

const EraserIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
)

const MagicWandIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
    />
  </svg>
)

interface BackgroundRemoverInterfaceProps {
  isOpen: boolean
  onClose: () => void
}

export function BackgroundRemoverInterface({ isOpen, onClose }: BackgroundRemoverInterfaceProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedBackground, setSelectedBackground] = useState<string>("transparent")
  const [edgeSmoothing, setEdgeSmoothing] = useState([0.5])
  const [featherRadius, setFeatherRadius] = useState([0.3])
  const [isProcessing, setIsProcessing] = useState(false)
  const [hasProcessed, setHasProcessed] = useState(false)
  const [showComparison, setShowComparison] = useState(false)
  const [comparisonSlider, setComparisonSlider] = useState([50])
  const [editMode, setEditMode] = useState<"auto" | "manual">("auto")

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setHasProcessed(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file)
      setHasProcessed(false)
    }
  }

  const handleProcess = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setHasProcessed(true)
      setShowComparison(true)
    }, 2500)
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
                  Suppresseur d'arrière-plan IA
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Supprimez et remplacez les arrière-plans en un clic
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full hover:bg-secondary/80">
                <XIcon className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              {/* Upload Zone */}
              {!selectedFile ? (
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="border-2 border-dashed border-border rounded-2xl p-12 text-center hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => document.getElementById("image-upload")?.click()}
                >
                  <UploadIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Importer une image</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Glissez-déposez votre image ou cliquez pour parcourir
                  </p>
                  <p className="text-xs text-muted-foreground">Formats supportés: JPG, PNG, WEBP (max 10MB)</p>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Panel - Preview */}
                  <div className="lg:col-span-2 space-y-4">
                    {/* File Info */}
                    <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">{selectedFile.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedFile(null)
                          setHasProcessed(false)
                          setShowComparison(false)
                        }}
                      >
                        Changer
                      </Button>
                    </div>

                    {/* Edit Mode Tabs */}
                    <Tabs value={editMode} onValueChange={(v) => setEditMode(v as "auto" | "manual")}>
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="auto">
                          <SparklesIcon className="w-4 h-4 mr-2" />
                          Automatique
                        </TabsTrigger>
                        <TabsTrigger value="manual">
                          <EraserIcon className="w-4 h-4 mr-2" />
                          Manuel
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="auto" className="mt-4">
                        {/* Image Preview */}
                        <div className="relative aspect-video bg-secondary/20 rounded-xl overflow-hidden">
                          {!hasProcessed ? (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center">
                                <ImageIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">Aperçu de l'image originale</p>
                              </div>
                            </div>
                          ) : (
                            <>
                              {/* Comparison Slider */}
                              <div className="absolute inset-0 flex">
                                <div
                                  className="bg-blue-500/10 border-r-2 border-primary flex items-center justify-center relative overflow-hidden"
                                  style={{ width: `${comparisonSlider[0]}%` }}
                                >
                                  <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300" />
                                  <span className="relative text-sm font-medium">Original</span>
                                </div>
                                <div className="flex-1 bg-green-500/10 flex items-center justify-center relative overflow-hidden">
                                  <div
                                    className="absolute inset-0"
                                    style={{
                                      backgroundImage:
                                        "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)",
                                      backgroundSize: "20px 20px",
                                      backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
                                    }}
                                  />
                                  <span className="relative text-sm font-medium">Sans arrière-plan</span>
                                </div>
                              </div>
                              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-64">
                                <Slider
                                  value={comparisonSlider}
                                  onValueChange={setComparisonSlider}
                                  min={0}
                                  max={100}
                                  step={1}
                                />
                              </div>
                            </>
                          )}
                        </div>
                      </TabsContent>

                      <TabsContent value="manual" className="mt-4">
                        <div className="space-y-4">
                          {/* Manual Edit Canvas */}
                          <div className="relative aspect-video bg-secondary/20 rounded-xl overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center">
                                <MagicWandIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">
                                  Utilisez les outils pour affiner la sélection
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Manual Tools */}
                          <div className="flex items-center gap-2 p-3 bg-secondary/20 rounded-xl">
                            <Button variant="outline" size="sm">
                              <EraserIcon className="w-4 h-4 mr-2" />
                              Gomme
                            </Button>
                            <Button variant="outline" size="sm">
                              <MagicWandIcon className="w-4 h-4 mr-2" />
                              Baguette magique
                            </Button>
                            <div className="flex-1" />
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">Taille:</span>
                              <Slider defaultValue={[50]} max={100} step={1} className="w-24" />
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>

                    {/* Process Button */}
                    {!hasProcessed && (
                      <Button className="w-full" size="lg" onClick={handleProcess} disabled={isProcessing}>
                        {isProcessing ? (
                          <>
                            <SparklesIcon className="w-4 h-4 mr-2 animate-pulse" />
                            Suppression en cours...
                          </>
                        ) : (
                          <>
                            <SparklesIcon className="w-4 h-4 mr-2" />
                            Supprimer l'arrière-plan
                          </>
                        )}
                      </Button>
                    )}
                  </div>

                  {/* Right Panel - Options */}
                  <div className="space-y-4">
                    {/* Background Options */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium">Nouvel arrière-plan</label>
                      <div className="grid grid-cols-2 gap-2">
                        {backgroundOptions.map((bg) => (
                          <Card
                            key={bg.id}
                            className={`cursor-pointer transition-all duration-200 ${
                              selectedBackground === bg.id
                                ? "border-primary bg-primary/5 shadow-md"
                                : "hover:border-primary/50"
                            }`}
                            onClick={() => setSelectedBackground(bg.id)}
                          >
                            <CardContent className="p-3">
                              <div
                                className={`w-full h-16 rounded-lg mb-2 bg-gradient-to-br ${bg.color}`}
                                style={
                                  bg.id === "transparent"
                                    ? {
                                        backgroundImage:
                                          "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)",
                                        backgroundSize: "20px 20px",
                                        backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
                                      }
                                    : undefined
                                }
                              />
                              <p className="text-xs font-medium text-center">{bg.name}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      {/* Custom Color */}
                      <Button variant="outline" className="w-full bg-transparent" size="sm">
                        <ImageIcon className="w-4 h-4 mr-2" />
                        Couleur personnalisée
                      </Button>
                    </div>

                    {/* Advanced Settings */}
                    {hasProcessed && (
                      <div className="space-y-4 p-4 bg-secondary/20 rounded-xl">
                        <h4 className="text-sm font-semibold">Réglages avancés</h4>

                        {/* Edge Smoothing */}
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <label className="text-sm">Lissage des bords</label>
                            <span className="text-sm text-muted-foreground">{Math.round(edgeSmoothing[0] * 100)}%</span>
                          </div>
                          <Slider value={edgeSmoothing} onValueChange={setEdgeSmoothing} min={0} max={1} step={0.01} />
                        </div>

                        {/* Feather Radius */}
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <label className="text-sm">Contour progressif</label>
                            <span className="text-sm text-muted-foreground">{Math.round(featherRadius[0] * 100)}%</span>
                          </div>
                          <Slider value={featherRadius} onValueChange={setFeatherRadius} min={0} max={1} step={0.01} />
                        </div>
                      </div>
                    )}

                    {/* Export Options */}
                    {hasProcessed && (
                      <div className="space-y-3">
                        <Badge
                          variant="secondary"
                          className="w-full justify-center bg-green-100 text-green-700 border-green-200"
                        >
                          Traitement terminé
                        </Badge>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Format d'export</label>
                          <div className="grid grid-cols-2 gap-2">
                            <Button variant="outline" size="sm" className="bg-transparent">
                              <DownloadIcon className="w-4 h-4 mr-2" />
                              PNG
                            </Button>
                            <Button variant="outline" size="sm" className="bg-transparent">
                              <DownloadIcon className="w-4 h-4 mr-2" />
                              WEBP
                            </Button>
                          </div>
                        </div>

                        <Button className="w-full">Ajouter au projet</Button>
                      </div>
                    )}

                    {/* Tips */}
                    <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                      <h4 className="text-sm font-semibold mb-2">Conseils</h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• Utilisez des images haute résolution</li>
                        <li>• Évitez les arrière-plans complexes</li>
                        <li>• Le mode manuel permet plus de précision</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
