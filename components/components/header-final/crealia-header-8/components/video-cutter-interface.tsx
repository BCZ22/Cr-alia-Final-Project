"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

const aspectRatios = [
  { id: "16:9", name: "16:9", desc: "YouTube, Paysage", icon: "🖥️" },
  { id: "9:16", name: "9:16", desc: "TikTok, Stories", icon: "📱" },
  { id: "1:1", name: "1:1", desc: "Instagram Post", icon: "⬜" },
  { id: "4:5", name: "4:5", desc: "Instagram Portrait", icon: "📐" },
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

const PauseIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
  </svg>
)

const ScissorsIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} cx="6" cy="6" r="3" />
    <circle strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} cx="6" cy="18" r="3" />
    <line strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} x1="20" y1="4" x2="8.12" y2="15.88" />
    <line strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} x1="14.47" y1="14.48" x2="20" y2="20" />
    <line strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} x1="8.12" y1="8.12" x2="12" y2="12" />
  </svg>
)

const DownloadIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} points="7 10 12 15 17 10" />
    <line strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} x1="12" y1="15" x2="12" y2="3" />
  </svg>
)

const CropIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M23 19a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8H3m18 13V6a2 2 0 0 0-2-2H8"
    />
  </svg>
)

const SplitIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <line strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} x1="12" y1="2" x2="12" y2="22" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
    />
  </svg>
)

interface VideoCutterInterfaceProps {
  isOpen: boolean
  onClose: () => void
}

export function VideoCutterInterface({ isOpen, onClose }: VideoCutterInterfaceProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration] = useState(120) // 2 minutes example
  const [trimStart, setTrimStart] = useState([0])
  const [trimEnd, setTrimEnd] = useState([120])
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<string | null>(null)
  const [splitPoints, setSplitPoints] = useState<number[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [hasProcessed, setHasProcessed] = useState(false)

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
    if (file && file.type.startsWith("video/")) {
      setSelectedFile(file)
      setHasProcessed(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const addSplitPoint = () => {
    if (!splitPoints.includes(currentTime)) {
      setSplitPoints([...splitPoints, currentTime].sort((a, b) => a - b))
    }
  }

  const removeSplitPoint = (point: number) => {
    setSplitPoints(splitPoints.filter((p) => p !== point))
  }

  const handleProcess = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setHasProcessed(true)
    }, 3000)
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
                  Éditeur vidéo intelligent
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Coupez, divisez et redimensionnez vos vidéos facilement
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
                  onClick={() => document.getElementById("video-upload")?.click()}
                >
                  <UploadIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Importer une vidéo</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Glissez-déposez votre vidéo ou cliquez pour parcourir
                  </p>
                  <p className="text-xs text-muted-foreground">Formats supportés: MP4, MOV, AVI, WEBM (max 500MB)</p>
                  <input
                    id="video-upload"
                    type="file"
                    accept="video/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Panel - Video Preview */}
                  <div className="lg:col-span-2 space-y-4">
                    {/* File Info */}
                    <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <PlayIcon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">{selectedFile.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • {formatTime(duration)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedFile(null)
                          setHasProcessed(false)
                          setSplitPoints([])
                        }}
                      >
                        Changer
                      </Button>
                    </div>

                    {/* Video Player */}
                    <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <PlayIcon className="w-20 h-20 mx-auto mb-4 text-white/50" />
                          <p className="text-white/70 text-sm">Aperçu vidéo</p>
                        </div>
                      </div>

                      {/* Crop Overlay */}
                      {selectedAspectRatio && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="border-2 border-primary border-dashed bg-primary/5">
                            <div className="w-64 h-48 flex items-center justify-center">
                              <CropIcon className="w-12 h-12 text-primary" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Video Controls */}
                    <div className="space-y-4 p-4 bg-secondary/20 rounded-xl">
                      {/* Play Controls */}
                      <div className="flex items-center gap-4">
                        <Button
                          size="sm"
                          className="rounded-full w-10 h-10 p-0"
                          onClick={() => setIsPlaying(!isPlaying)}
                        >
                          {isPlaying ? <PauseIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4" />}
                        </Button>
                        <div className="flex-1">
                          <Slider
                            value={[currentTime]}
                            onValueChange={(v) => setCurrentTime(v[0])}
                            min={0}
                            max={duration}
                            step={0.1}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground min-w-[80px] text-right">
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                      </div>

                      {/* Timeline with Split Points */}
                      <div className="relative h-16 bg-background rounded-lg overflow-hidden">
                        {/* Thumbnail Timeline */}
                        <div className="absolute inset-0 flex">
                          {Array.from({ length: 10 }).map((_, i) => (
                            <div
                              key={i}
                              className="flex-1 border-r border-border/50 bg-gradient-to-b from-primary/10 to-primary/5"
                            />
                          ))}
                        </div>

                        {/* Trim Markers */}
                        <div
                          className="absolute top-0 bottom-0 bg-primary/20 border-l-2 border-r-2 border-primary"
                          style={{
                            left: `${(trimStart[0] / duration) * 100}%`,
                            right: `${100 - (trimEnd[0] / duration) * 100}%`,
                          }}
                        />

                        {/* Split Points */}
                        {splitPoints.map((point, i) => (
                          <div
                            key={i}
                            className="absolute top-0 bottom-0 w-0.5 bg-red-500 cursor-pointer group"
                            style={{ left: `${(point / duration) * 100}%` }}
                            onClick={() => removeSplitPoint(point)}
                          >
                            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        ))}

                        {/* Current Time Indicator */}
                        <div
                          className="absolute top-0 bottom-0 w-0.5 bg-white"
                          style={{ left: `${(currentTime / duration) * 100}%` }}
                        >
                          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full" />
                        </div>
                      </div>

                      {/* Trim Controls */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Début</label>
                          <div className="flex gap-2">
                            <Input value={formatTime(trimStart[0])} readOnly className="text-center" />
                            <Button variant="outline" size="sm" onClick={() => setTrimStart([currentTime])}>
                              Définir
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Fin</label>
                          <div className="flex gap-2">
                            <Input value={formatTime(trimEnd[0])} readOnly className="text-center" />
                            <Button variant="outline" size="sm" onClick={() => setTrimEnd([currentTime])}>
                              Définir
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={addSplitPoint} className="flex-1 bg-transparent">
                          <SplitIcon className="w-4 h-4 mr-2" />
                          Diviser ici
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                          <ScissorsIcon className="w-4 h-4 mr-2" />
                          Couper la sélection
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Right Panel - Options */}
                  <div className="space-y-4">
                    {/* Aspect Ratio */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium">Format de sortie</label>
                      <div className="grid grid-cols-2 gap-2">
                        {aspectRatios.map((ratio) => (
                          <Card
                            key={ratio.id}
                            className={`cursor-pointer transition-all duration-200 ${
                              selectedAspectRatio === ratio.id
                                ? "border-primary bg-primary/5 shadow-md"
                                : "hover:border-primary/50"
                            }`}
                            onClick={() => setSelectedAspectRatio(ratio.id)}
                          >
                            <CardContent className="p-3 text-center">
                              <div className="text-2xl mb-2">{ratio.icon}</div>
                              <div className="text-sm font-medium mb-1">{ratio.name}</div>
                              <div className="text-xs text-muted-foreground">{ratio.desc}</div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* Split Segments */}
                    {splitPoints.length > 0 && (
                      <div className="space-y-3 p-4 bg-secondary/20 rounded-xl">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-semibold">Segments ({splitPoints.length + 1})</h4>
                          <Button variant="ghost" size="sm" onClick={() => setSplitPoints([])}>
                            Réinitialiser
                          </Button>
                        </div>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {[0, ...splitPoints, duration].map((point, i, arr) => {
                            if (i === arr.length - 1) return null
                            return (
                              <div
                                key={i}
                                className="flex items-center justify-between p-2 bg-background rounded-lg text-sm"
                              >
                                <span>Segment {i + 1}</span>
                                <span className="text-muted-foreground">
                                  {formatTime(point)} - {formatTime(arr[i + 1])}
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* Video Info */}
                    <div className="space-y-2 p-4 bg-secondary/20 rounded-xl">
                      <h4 className="text-sm font-semibold">Informations</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Durée originale:</span>
                          <span>{formatTime(duration)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Durée finale:</span>
                          <span className="text-primary font-medium">{formatTime(trimEnd[0] - trimStart[0])}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Segments:</span>
                          <span>{splitPoints.length + 1}</span>
                        </div>
                      </div>
                    </div>

                    {/* Export Options */}
                    {hasProcessed ? (
                      <div className="space-y-3">
                        <Badge
                          variant="secondary"
                          className="w-full justify-center bg-green-100 text-green-700 border-green-200"
                        >
                          Traitement terminé
                        </Badge>
                        <div className="space-y-2">
                          <Button variant="outline" className="w-full bg-transparent">
                            <DownloadIcon className="w-4 h-4 mr-2" />
                            Télécharger MP4
                          </Button>
                          <Button variant="outline" className="w-full bg-transparent">
                            <DownloadIcon className="w-4 h-4 mr-2" />
                            Télécharger tous les segments
                          </Button>
                        </div>
                        <Button className="w-full">Ajouter au projet</Button>
                      </div>
                    ) : (
                      <Button className="w-full" size="lg" onClick={handleProcess} disabled={isProcessing}>
                        {isProcessing ? (
                          <>
                            <ScissorsIcon className="w-4 h-4 mr-2 animate-pulse" />
                            Traitement en cours...
                          </>
                        ) : (
                          <>
                            <ScissorsIcon className="w-4 h-4 mr-2" />
                            Traiter la vidéo
                          </>
                        )}
                      </Button>
                    )}

                    {/* Tips */}
                    <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                      <h4 className="text-sm font-semibold mb-2">Astuces</h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• Utilisez les marqueurs pour définir les zones</li>
                        <li>• Divisez pour créer plusieurs clips</li>
                        <li>• Changez le format pour les réseaux sociaux</li>
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
