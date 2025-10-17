"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
    />
  </svg>
)

const LayersIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polygon strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} points="12 2 2 7 12 12 22 7 12 2" />
    <polyline strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} points="2 17 12 22 22 17" />
    <polyline strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} points="2 12 12 17 22 12" />
  </svg>
)

interface PictureInPictureInterfaceProps {
  isOpen: boolean
  onClose: () => void
}

type Layer = {
  id: string
  file: File
  position: string
  size: number
  opacity: number
  rotation: number
  borderRadius: number
  shadow: number
  animation: string
  mask: string
  effect: string
}

type Keyframe = {
  time: number
  x: number
  y: number
  scale: number
  rotation: number
  opacity: number
}

export function PictureInPictureInterface({ isOpen, onClose }: PictureInPictureInterfaceProps) {
  const [mainVideo, setMainVideo] = useState<File | null>(null)
  const [layers, setLayers] = useState<Layer[]>([])
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null)
  const [overlayPosition, setOverlayPosition] = useState("bottom-right")
  const [overlaySize, setOverlaySize] = useState([25])
  const [overlayOpacity, setOverlayOpacity] = useState([100])
  const [borderRadius, setBorderRadius] = useState([12])
  const [shadowIntensity, setShadowIntensity] = useState([50])
  const [rotation, setRotation] = useState([0])
  const [selectedAnimation, setSelectedAnimation] = useState("none")
  const [selectedMask, setSelectedMask] = useState("none")
  const [selectedEffect, setSelectedEffect] = useState("none")
  const [keyframes, setKeyframes] = useState<Keyframe[]>([])
  const [currentTime, setCurrentTime] = useState(0)
  const [audioSync, setAudioSync] = useState(false)
  const [borderGlow, setBorderGlow] = useState(false)
  const [glowColor, setGlowColor] = useState("#3b82f6")

  if (!isOpen) return null

  const positions = [
    { id: "top-left", label: "Haut gauche", icon: "↖" },
    { id: "top-right", label: "Haut droite", icon: "↗" },
    { id: "bottom-left", label: "Bas gauche", icon: "↙" },
    { id: "bottom-right", label: "Bas droite", icon: "↘" },
    { id: "center", label: "Centre", icon: "⊙" },
  ]

  const animations = [
    { id: "none", label: "Aucune", icon: "—" },
    { id: "fade-in", label: "Apparition", icon: "↗" },
    { id: "zoom-in", label: "Zoom", icon: "⊕" },
    { id: "slide-in", label: "Glissement", icon: "→" },
    { id: "bounce", label: "Rebond", icon: "↕" },
  ]

  const masks = [
    { id: "none", label: "Aucun", icon: "□" },
    { id: "circle", label: "Cercle", icon: "○" },
    { id: "heart", label: "Coeur", icon: "♥" },
    { id: "star", label: "Étoile", icon: "★" },
    { id: "bubble", label: "Bulle", icon: "💬" },
  ]

  const effects = [
    { id: "none", label: "Aucun" },
    { id: "glow", label: "Contour lumineux" },
    { id: "shadow", label: "Ombre portée" },
    { id: "gradient", label: "Dégradé transparent" },
    { id: "blur", label: "Flou arrière-plan" },
  ]

  const handleMainVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setMainVideo(file)
    }
  }

  const handleOverlayVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const newLayer: Layer = {
        id: `layer-${Date.now()}`,
        file,
        position: overlayPosition,
        size: overlaySize[0],
        opacity: overlayOpacity[0],
        rotation: rotation[0],
        borderRadius: borderRadius[0],
        shadow: shadowIntensity[0],
        animation: selectedAnimation,
        mask: selectedMask,
        effect: selectedEffect,
      }
      setLayers([...layers, newLayer])
      setSelectedLayer(newLayer.id)
    }
  }

  const addKeyframe = () => {
    if (!selectedLayer) return
    const layer = layers.find((l) => l.id === selectedLayer)
    if (!layer) return

    setKeyframes([
      ...keyframes,
      {
        time: currentTime,
        x: 0,
        y: 0,
        scale: layer.size,
        rotation: layer.rotation,
        opacity: layer.opacity,
      },
    ])
  }

  const removeLayer = (layerId: string) => {
    setLayers(layers.filter((l) => l.id !== layerId))
    if (selectedLayer === layerId) {
      setSelectedLayer(null)
    }
  }

  const getPositionStyle = () => {
    const size = overlaySize[0]
    switch (overlayPosition) {
      case "top-left":
        return { top: "5%", left: "5%" }
      case "top-right":
        return { top: "5%", right: "5%" }
      case "bottom-left":
        return { bottom: "5%", left: "5%" }
      case "bottom-right":
        return { bottom: "5%", right: "5%" }
      case "center":
        return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" }
      default:
        return { bottom: "5%", right: "5%" }
    }
  }

  return (
    <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="w-full max-w-7xl bg-background rounded-3xl shadow-2xl animate-scale-up border border-border/50">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/50">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Image en image
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Superposez une vidéo sur une autre pour créer des réactions et tutoriels
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full hover:bg-secondary/80">
                <XIcon className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              {/* Upload Section */}
              {!mainVideo ? (
                <div className="border-2 border-dashed border-border rounded-2xl p-12 text-center hover:border-primary/50 transition-colors">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleMainVideoUpload}
                    className="hidden"
                    id="main-video-upload"
                  />
                  <label htmlFor="main-video-upload" className="cursor-pointer">
                    <UploadIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Importer la vidéo principale</h3>
                    <p className="text-muted-foreground text-sm">Glissez-déposez ou cliquez pour sélectionner</p>
                    <p className="text-muted-foreground text-xs mt-2">MP4, MOV, AVI jusqu'à 500MB</p>
                  </label>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Preview Section */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Aperçu</h3>
                      <Badge variant="secondary" className="text-xs">
                        <LayersIcon className="w-3 h-3 mr-1" />
                        {layers.length} couche{layers.length > 1 ? "s" : ""}
                      </Badge>
                    </div>
                    <div className="relative aspect-video bg-secondary/20 rounded-xl overflow-hidden border border-border/50">
                      {/* Main video preview */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                        <span className="text-sm text-muted-foreground">Vidéo principale</span>
                      </div>

                      {layers.map((layer, index) => (
                        <div
                          key={layer.id}
                          className={`absolute bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center transition-all duration-300 cursor-pointer ${
                            selectedLayer === layer.id ? "ring-2 ring-primary" : ""
                          }`}
                          onClick={() => setSelectedLayer(layer.id)}
                          style={{
                            ...getPositionStyle(),
                            width: `${layer.size}%`,
                            aspectRatio: "16/9",
                            opacity: layer.opacity / 100,
                            borderRadius:
                              layer.mask === "circle"
                                ? "50%"
                                : layer.mask === "heart"
                                  ? "50% 50% 0 0"
                                  : `${layer.borderRadius}px`,
                            transform: `rotate(${layer.rotation}deg)`,
                            boxShadow:
                              layer.effect === "glow" && borderGlow
                                ? `0 0 ${layer.shadow}px ${glowColor}`
                                : `0 ${layer.shadow / 10}px ${layer.shadow / 5}px rgba(0,0,0,${layer.shadow / 100})`,
                            zIndex: 10 + index,
                          }}
                        >
                          <span className="text-xs text-muted-foreground">
                            {layer.mask !== "none" ? masks.find((m) => m.id === layer.mask)?.icon : "Couche"}{" "}
                            {index + 1}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">Timeline multipistes</h4>
                        <Button size="sm" variant="outline" onClick={addKeyframe} className="text-xs bg-transparent">
                          + Ajouter keyframe
                        </Button>
                      </div>
                      <div className="relative h-24 bg-secondary/30 rounded-lg overflow-hidden">
                        {/* Timeline tracks */}
                        <div className="space-y-1 p-2">
                          <div className="h-6 bg-primary/20 rounded flex items-center px-2 text-xs">
                            Vidéo principale
                          </div>
                          {layers.map((layer, i) => (
                            <div key={layer.id} className="h-6 bg-secondary/50 rounded flex items-center px-2 text-xs">
                              Couche {i + 1}
                            </div>
                          ))}
                        </div>
                        {/* Keyframe markers */}
                        {keyframes.map((kf, i) => (
                          <div
                            key={i}
                            className="absolute top-0 bottom-0 w-1 bg-primary"
                            style={{ left: `${kf.time}%` }}
                          >
                            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rounded-full" />
                          </div>
                        ))}
                        {/* Playhead */}
                        <div className="absolute top-0 bottom-0 w-0.5 bg-white" style={{ left: `${currentTime}%` }}>
                          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full" />
                        </div>
                      </div>
                      <Slider
                        value={[currentTime]}
                        onValueChange={(v) => setCurrentTime(v[0])}
                        min={0}
                        max={100}
                        step={1}
                      />
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Couches</h4>
                      <div className="space-y-2">
                        {layers.map((layer, i) => (
                          <div
                            key={layer.id}
                            className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors ${
                              selectedLayer === layer.id ? "bg-primary/10 border border-primary" : "bg-secondary/30"
                            }`}
                            onClick={() => setSelectedLayer(layer.id)}
                          >
                            <LayersIcon className="w-4 h-4 text-primary" />
                            <div className="flex-1">
                              <p className="text-sm font-medium">Couche {i + 1}</p>
                              <p className="text-xs text-muted-foreground">{layer.file.name}</p>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                removeLayer(layer.id)
                              }}
                              className="rounded-full"
                            >
                              <XIcon className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        {/* Add new layer button */}
                        <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
                          <input
                            type="file"
                            accept="video/*,image/*"
                            onChange={handleOverlayVideoUpload}
                            className="hidden"
                            id="overlay-video-upload"
                          />
                          <label htmlFor="overlay-video-upload" className="cursor-pointer">
                            <LayersIcon className="w-8 h-8 mx-auto text-muted-foreground mb-1" />
                            <p className="text-xs font-medium">Ajouter une couche</p>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Settings Section */}
                  <div className="space-y-6">
                    <Tabs defaultValue="position" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="position">Position</TabsTrigger>
                        <TabsTrigger value="style">Style</TabsTrigger>
                        <TabsTrigger value="effects">Effets</TabsTrigger>
                      </TabsList>

                      <TabsContent value="position" className="space-y-4">
                        {/* Position Presets */}
                        <div>
                          <h3 className="font-semibold mb-3 text-sm">Position</h3>
                          <div className="grid grid-cols-3 gap-2">
                            {positions.map((pos) => (
                              <Card
                                key={pos.id}
                                className={`p-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                                  overlayPosition === pos.id
                                    ? "border-primary bg-primary/5"
                                    : "border-border/50 hover:border-primary/30"
                                }`}
                                onClick={() => setOverlayPosition(pos.id)}
                              >
                                <div className="flex flex-col items-center gap-1">
                                  <span className="text-xl">{pos.icon}</span>
                                  <p className="text-xs font-medium text-center">{pos.label}</p>
                                </div>
                              </Card>
                            ))}
                          </div>
                        </div>

                        {/* Size Control */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium">Taille</label>
                            <span className="text-sm text-muted-foreground">{overlaySize[0]}%</span>
                          </div>
                          <Slider value={overlaySize} onValueChange={setOverlaySize} min={10} max={50} step={1} />
                        </div>

                        {/* Rotation Control */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium">Rotation</label>
                            <span className="text-sm text-muted-foreground">{rotation[0]}°</span>
                          </div>
                          <Slider value={rotation} onValueChange={setRotation} min={-180} max={180} step={5} />
                        </div>
                      </TabsContent>

                      <TabsContent value="style" className="space-y-4">
                        {/* Opacity Control */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium">Opacité</label>
                            <span className="text-sm text-muted-foreground">{overlayOpacity[0]}%</span>
                          </div>
                          <Slider value={overlayOpacity} onValueChange={setOverlayOpacity} min={0} max={100} step={5} />
                        </div>

                        {/* Border Radius */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium">Bordures arrondies</label>
                            <span className="text-sm text-muted-foreground">{borderRadius[0]}px</span>
                          </div>
                          <Slider value={borderRadius} onValueChange={setBorderRadius} min={0} max={50} step={2} />
                        </div>

                        {/* Masks */}
                        <div>
                          <h3 className="font-semibold mb-3 text-sm">Masques</h3>
                          <div className="grid grid-cols-3 gap-2">
                            {masks.map((mask) => (
                              <Card
                                key={mask.id}
                                className={`p-2 cursor-pointer transition-all ${
                                  selectedMask === mask.id
                                    ? "border-primary bg-primary/5"
                                    : "border-border/50 hover:border-primary/30"
                                }`}
                                onClick={() => setSelectedMask(mask.id)}
                              >
                                <div className="flex flex-col items-center gap-1">
                                  <span className="text-xl">{mask.icon}</span>
                                  <p className="text-xs font-medium">{mask.label}</p>
                                </div>
                              </Card>
                            ))}
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="effects" className="space-y-4">
                        {/* Animations */}
                        <div>
                          <h3 className="font-semibold mb-3 text-sm">Animations</h3>
                          <div className="grid grid-cols-2 gap-2">
                            {animations.map((anim) => (
                              <Card
                                key={anim.id}
                                className={`p-2 cursor-pointer transition-all ${
                                  selectedAnimation === anim.id
                                    ? "border-primary bg-primary/5"
                                    : "border-border/50 hover:border-primary/30"
                                }`}
                                onClick={() => setSelectedAnimation(anim.id)}
                              >
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">{anim.icon}</span>
                                  <p className="text-xs font-medium">{anim.label}</p>
                                </div>
                              </Card>
                            ))}
                          </div>
                        </div>

                        {/* Visual Effects */}
                        <div>
                          <h3 className="font-semibold mb-3 text-sm">Effets visuels</h3>
                          <div className="space-y-2">
                            {effects.map((effect) => (
                              <Card
                                key={effect.id}
                                className={`p-3 cursor-pointer transition-all ${
                                  selectedEffect === effect.id
                                    ? "border-primary bg-primary/5"
                                    : "border-border/50 hover:border-primary/30"
                                }`}
                                onClick={() => setSelectedEffect(effect.id)}
                              >
                                <p className="text-sm font-medium">{effect.label}</p>
                              </Card>
                            ))}
                          </div>
                        </div>

                        {/* Shadow Intensity */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium">Ombre portée</label>
                            <span className="text-sm text-muted-foreground">{shadowIntensity[0]}%</span>
                          </div>
                          <Slider
                            value={shadowIntensity}
                            onValueChange={setShadowIntensity}
                            min={0}
                            max={100}
                            step={5}
                          />
                        </div>

                        {/* Border Glow */}
                        <div className="flex items-center gap-2">
                          <Switch checked={borderGlow} onCheckedChange={setBorderGlow} />
                          <div className="flex-1">
                            <p className="text-sm font-medium">Contour lumineux</p>
                            <p className="text-xs text-muted-foreground">Ajouter un effet de lueur</p>
                          </div>
                        </div>

                        {/* Audio Sync */}
                        <div className="flex items-center gap-2">
                          <Switch checked={audioSync} onCheckedChange={setAudioSync} />
                          <div className="flex-1">
                            <p className="text-sm font-medium">Synchronisation audio</p>
                            <p className="text-xs text-muted-foreground">Calage auto avec le son</p>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>

                    {/* Export Options */}
                    <div className="pt-4 border-t border-border/50">
                      <h3 className="font-semibold mb-3">Export</h3>
                      <div className="space-y-2">
                        <Button className="w-full" size="lg" disabled={layers.length === 0}>
                          Exporter la vidéo
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full bg-transparent"
                          size="lg"
                          disabled={layers.length === 0}
                        >
                          Ajouter au projet
                        </Button>
                      </div>
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
