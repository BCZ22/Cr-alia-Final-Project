"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"

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

interface VideoEnhancerInterfaceProps {
  isOpen: boolean
  onClose: () => void
}

export function VideoEnhancerInterface({ isOpen, onClose }: VideoEnhancerInterfaceProps) {
  const [video, setVideo] = useState<File | null>(null)
  const [sharpness, setSharpness] = useState([50])
  const [noiseReduction, setNoiseReduction] = useState([60])
  const [colorCorrection, setColorCorrection] = useState([50])
  const [brightness, setBrightness] = useState([50])
  const [contrast, setContrast] = useState([50])
  const [saturation, setSaturation] = useState([50])
  const [upscale, setUpscale] = useState(false)
  const [targetResolution, setTargetResolution] = useState("1080p")
  const [showComparison, setShowComparison] = useState(false)
  const [comparisonPosition, setComparisonPosition] = useState(50)

  if (!isOpen) return null

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setVideo(file)
    }
  }

  const resolutions = [
    { id: "720p", label: "HD 720p", pixels: "1280×720" },
    { id: "1080p", label: "Full HD 1080p", pixels: "1920×1080" },
    { id: "1440p", label: "2K 1440p", pixels: "2560×1440" },
    { id: "4k", label: "4K UHD", pixels: "3840×2160" },
  ]

  return (
    <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="w-full max-w-7xl bg-background rounded-3xl shadow-2xl animate-scale-up border border-border/50">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/50">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Améliorateur Vidéo
                </h2>
                <p className="text-muted-foreground text-sm mt-1">Améliorez la qualité de vos vidéos avec l'IA</p>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full hover:bg-secondary/80">
                <XIcon className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-6">
              {!video ? (
                <div className="border-2 border-dashed border-border rounded-2xl p-16 text-center hover:border-primary/50 transition-colors">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                    id="video-upload"
                  />
                  <label htmlFor="video-upload" className="cursor-pointer">
                    <UploadIcon className="w-20 h-20 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Importer une vidéo</h3>
                    <p className="text-muted-foreground text-sm mb-2">Glissez-déposez ou cliquez pour sélectionner</p>
                    <p className="text-muted-foreground text-xs">MP4, MOV, AVI jusqu'à 1GB</p>
                  </label>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Preview Section */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Aperçu</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          <SparklesIcon className="w-3 h-3 mr-1" />
                          IA activée
                        </Badge>
                        <Button
                          size="sm"
                          variant={showComparison ? "default" : "outline"}
                          onClick={() => setShowComparison(!showComparison)}
                          className="text-xs"
                        >
                          {showComparison ? "Masquer" : "Comparer"}
                        </Button>
                      </div>
                    </div>

                    {/* Video Preview with Comparison */}
                    <div className="relative aspect-video bg-secondary/20 rounded-xl overflow-hidden border border-border/50">
                      {!showComparison ? (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                          <div className="text-center">
                            <SparklesIcon className="w-12 h-12 mx-auto text-primary mb-2" />
                            <span className="text-sm text-muted-foreground">Vidéo améliorée</span>
                          </div>
                        </div>
                      ) : (
                        <div className="relative w-full h-full">
                          {/* Before (left side) */}
                          <div
                            className="absolute inset-0 bg-gradient-to-br from-secondary/30 to-secondary/10 flex items-center justify-center"
                            style={{ clipPath: `inset(0 ${100 - comparisonPosition}% 0 0)` }}
                          >
                            <span className="text-sm text-muted-foreground">Avant</span>
                          </div>

                          {/* After (right side) */}
                          <div
                            className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center"
                            style={{ clipPath: `inset(0 0 0 ${comparisonPosition}%)` }}
                          >
                            <span className="text-sm text-muted-foreground">Après</span>
                          </div>

                          {/* Comparison Slider */}
                          <div
                            className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize"
                            style={{ left: `${comparisonPosition}%` }}
                            onMouseDown={(e) => {
                              const handleMouseMove = (moveEvent: MouseEvent) => {
                                const rect = e.currentTarget.parentElement?.getBoundingClientRect()
                                if (rect) {
                                  const x = moveEvent.clientX - rect.left
                                  const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
                                  setComparisonPosition(percentage)
                                }
                              }
                              const handleMouseUp = () => {
                                document.removeEventListener("mousemove", handleMouseMove)
                                document.removeEventListener("mouseup", handleMouseUp)
                              }
                              document.addEventListener("mousemove", handleMouseMove)
                              document.addEventListener("mouseup", handleMouseUp)
                            }}
                          >
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Video Info */}
                    <div className="flex items-center gap-2 p-3 bg-secondary/30 rounded-lg">
                      <SparklesIcon className="w-5 h-5 text-primary" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{video.name}</p>
                        <p className="text-xs text-muted-foreground">{(video.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => setVideo(null)} className="rounded-full">
                        <XIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Settings Section */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-4">Paramètres d'amélioration</h3>

                      {/* Sharpness */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium">Netteté</label>
                          <span className="text-sm text-muted-foreground">{sharpness[0]}%</span>
                        </div>
                        <Slider value={sharpness} onValueChange={setSharpness} min={0} max={100} step={5} />
                      </div>

                      {/* Noise Reduction */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium">Réduction du bruit</label>
                          <span className="text-sm text-muted-foreground">{noiseReduction[0]}%</span>
                        </div>
                        <Slider value={noiseReduction} onValueChange={setNoiseReduction} min={0} max={100} step={5} />
                      </div>

                      {/* Color Correction */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium">Correction des couleurs</label>
                          <span className="text-sm text-muted-foreground">{colorCorrection[0]}%</span>
                        </div>
                        <Slider value={colorCorrection} onValueChange={setColorCorrection} min={0} max={100} step={5} />
                      </div>

                      {/* Brightness */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium">Luminosité</label>
                          <span className="text-sm text-muted-foreground">{brightness[0]}%</span>
                        </div>
                        <Slider value={brightness} onValueChange={setBrightness} min={0} max={100} step={5} />
                      </div>

                      {/* Contrast */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium">Contraste</label>
                          <span className="text-sm text-muted-foreground">{contrast[0]}%</span>
                        </div>
                        <Slider value={contrast} onValueChange={setContrast} min={0} max={100} step={5} />
                      </div>

                      {/* Saturation */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium">Saturation</label>
                          <span className="text-sm text-muted-foreground">{saturation[0]}%</span>
                        </div>
                        <Slider value={saturation} onValueChange={setSaturation} min={0} max={100} step={5} />
                      </div>
                    </div>

                    {/* Upscaling Section */}
                    <div className="pt-4 border-t border-border/50">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-sm">Upscale IA</h3>
                          <p className="text-xs text-muted-foreground">Augmenter la résolution</p>
                        </div>
                        <Switch checked={upscale} onCheckedChange={setUpscale} />
                      </div>

                      {upscale && (
                        <div className="space-y-2">
                          {resolutions.map((res) => (
                            <Card
                              key={res.id}
                              className={`p-3 cursor-pointer transition-all duration-200 ${
                                targetResolution === res.id
                                  ? "border-primary bg-primary/5"
                                  : "border-border/50 hover:border-primary/30"
                              }`}
                              onClick={() => setTargetResolution(res.id)}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium">{res.label}</p>
                                  <p className="text-xs text-muted-foreground">{res.pixels}</p>
                                </div>
                                {res.id === "4k" && (
                                  <Badge variant="secondary" className="text-xs">
                                    Premium
                                  </Badge>
                                )}
                              </div>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Export */}
                    <div className="pt-4 border-t border-border/50">
                      <Button className="w-full" size="lg">
                        <SparklesIcon className="w-4 h-4 mr-2" />
                        Améliorer la vidéo
                      </Button>
                      <p className="text-xs text-muted-foreground text-center mt-2">Temps estimé: 2-5 minutes</p>
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
