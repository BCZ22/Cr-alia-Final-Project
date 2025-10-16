"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"

const voiceFilters = [
  { id: "grave", name: "Grave", icon: "🎵", color: "from-blue-500/20 to-blue-600/10" },
  { id: "aigu", name: "Aigu", icon: "🎶", color: "from-pink-500/20 to-pink-600/10" },
  { id: "robotic", name: "Robotique", icon: "🤖", color: "from-gray-500/20 to-gray-600/10" },
  { id: "echo", name: "Écho", icon: "🔊", color: "from-purple-500/20 to-purple-600/10" },
  { id: "cinematic", name: "Cinématique", icon: "🎬", color: "from-red-500/20 to-red-600/10" },
  { id: "radio", name: "Radio FM", icon: "📻", color: "from-orange-500/20 to-orange-600/10" },
  { id: "distortion", name: "Distorsion", icon: "⚡", color: "from-yellow-500/20 to-yellow-600/10" },
  { id: "studio", name: "Clair Studio", icon: "🎙️", color: "from-green-500/20 to-green-600/10" },
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

const PlayIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
)

const DownloadIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} points="7 10 12 15 17 10" />
    <line strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} x1="12" y1="15" x2="12" y2="3" />
  </svg>
)

interface VoiceChangerInterfaceProps {
  isOpen: boolean
  onClose: () => void
}

export function VoiceChangerInterface({ isOpen, onClose }: VoiceChangerInterfaceProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null)
  const [intensity, setIntensity] = useState([0.5])
  const [speed, setSpeed] = useState([1])
  const [reverb, setReverb] = useState([0.3])
  const [isProcessing, setIsProcessing] = useState(false)
  const [hasProcessed, setHasProcessed] = useState(false)
  const [showComparison, setShowComparison] = useState(false)
  const [comparisonSlider, setComparisonSlider] = useState([50])

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
    if (file && file.type.startsWith("audio/")) {
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
    }, 2000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="w-full max-w-6xl bg-background rounded-3xl shadow-2xl animate-scale-up border border-border/50">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/50">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Outil de modification de la voix
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Transformez votre voix avec des filtres IA professionnels
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
                  onClick={() => document.getElementById("audio-upload")?.click()}
                >
                  <UploadIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Importer un fichier audio</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Glissez-déposez votre fichier ou cliquez pour parcourir
                  </p>
                  <p className="text-xs text-muted-foreground">Formats supportés: MP3, WAV, OGG, M4A</p>
                  <input
                    id="audio-upload"
                    type="file"
                    accept="audio/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              ) : (
                <>
                  {/* File Info */}
                  <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="text-2xl">🎵</span>
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

                  {/* Audio Player */}
                  <div className="p-4 bg-secondary/20 rounded-xl">
                    <div className="flex items-center gap-4">
                      <Button size="sm" className="rounded-full w-10 h-10 p-0">
                        <PlayIcon className="w-4 h-4" />
                      </Button>
                      <div className="flex-1 h-12 bg-background rounded-lg relative overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center gap-1 px-2">
                          {Array.from({ length: 60 }).map((_, i) => (
                            <div
                              key={i}
                              className="flex-1 bg-primary/40 rounded-full"
                              style={{ height: `${Math.random() * 100}%` }}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">0:00 / 0:45</span>
                    </div>
                  </div>

                  {/* Voice Filters */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Filtres vocaux</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {voiceFilters.map((filter) => (
                        <Card
                          key={filter.id}
                          className={`cursor-pointer transition-all duration-200 ${
                            selectedFilter === filter.id
                              ? "border-primary bg-primary/5 shadow-md"
                              : "hover:border-primary/50 hover:bg-secondary/50"
                          }`}
                          onClick={() => setSelectedFilter(filter.id)}
                        >
                          <CardContent className="p-4 text-center">
                            <div
                              className={`w-12 h-12 mx-auto mb-2 rounded-xl bg-gradient-to-br ${filter.color} flex items-center justify-center text-2xl`}
                            >
                              {filter.icon}
                            </div>
                            <div className="text-sm font-medium">{filter.name}</div>
                            {selectedFilter === filter.id && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="mt-2 text-xs h-7"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  console.log("Preview", filter.id)
                                }}
                              >
                                Prévisualiser
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Advanced Controls */}
                  {selectedFilter && (
                    <div className="space-y-4 p-4 bg-secondary/20 rounded-xl">
                      <h3 className="text-sm font-semibold">Réglages avancés</h3>

                      <div className="space-y-4">
                        {/* Intensity */}
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <label className="text-sm">Intensité du filtre</label>
                            <span className="text-sm text-muted-foreground">{Math.round(intensity[0] * 100)}%</span>
                          </div>
                          <Slider value={intensity} onValueChange={setIntensity} min={0} max={1} step={0.01} />
                        </div>

                        {/* Speed */}
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <label className="text-sm">Vitesse de la voix</label>
                            <span className="text-sm text-muted-foreground">{speed[0]}x</span>
                          </div>
                          <Slider value={speed} onValueChange={setSpeed} min={0.5} max={2} step={0.1} />
                        </div>

                        {/* Reverb */}
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <label className="text-sm">Réverbération</label>
                            <span className="text-sm text-muted-foreground">{Math.round(reverb[0] * 100)}%</span>
                          </div>
                          <Slider value={reverb} onValueChange={setReverb} min={0} max={1} step={0.01} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Comparison View */}
                  {showComparison && hasProcessed && (
                    <div className="space-y-4 p-4 bg-primary/5 rounded-xl border border-primary/20">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold">Comparaison avant/après</h3>
                        <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                          Traité
                        </Badge>
                      </div>

                      {/* Comparison Slider */}
                      <div className="relative h-32 bg-background rounded-lg overflow-hidden">
                        <div className="absolute inset-0 flex">
                          <div
                            className="bg-blue-500/10 border-r-2 border-primary flex items-center justify-center"
                            style={{ width: `${comparisonSlider[0]}%` }}
                          >
                            <span className="text-sm font-medium">Original</span>
                          </div>
                          <div className="flex-1 bg-green-500/10 flex items-center justify-center">
                            <span className="text-sm font-medium">Modifié</span>
                          </div>
                        </div>
                      </div>

                      <Slider value={comparisonSlider} onValueChange={setComparisonSlider} min={0} max={100} step={1} />

                      {/* Export Options */}
                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1 bg-transparent">
                          <DownloadIcon className="w-4 h-4 mr-2" />
                          MP3
                        </Button>
                        <Button variant="outline" className="flex-1 bg-transparent">
                          <DownloadIcon className="w-4 h-4 mr-2" />
                          WAV
                        </Button>
                        <Button variant="outline" className="flex-1 bg-transparent">
                          <DownloadIcon className="w-4 h-4 mr-2" />
                          OGG
                        </Button>
                      </div>

                      <Button className="w-full">Ajouter au projet</Button>
                    </div>
                  )}

                  {/* Process Button */}
                  {!hasProcessed && selectedFilter && (
                    <Button className="w-full" size="lg" onClick={handleProcess} disabled={isProcessing}>
                      {isProcessing ? "Traitement en cours..." : "Appliquer le filtre"}
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
