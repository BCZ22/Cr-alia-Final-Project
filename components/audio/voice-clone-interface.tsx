"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Upload, Play, Pause, AlertTriangle, CheckCircle2 } from "lucide-react"

interface VoiceCloneInterfaceProps {
  isOpen: boolean
  onClose: () => void
}

export function VoiceCloneInterface({ isOpen, onClose }: VoiceCloneInterfaceProps) {
  // Panel state following panelStateExample
  const [uploads, setUploads] = useState<Array<{ id: string; name: string; duration: number; quality: number }>>([])
  const [consent, setConsent] = useState(false)
  const [testText, setTestText] = useState("Bonjour")
  const [limits, setLimits] = useState({ usageLimit: 1000 })
  const [isCloning, setIsCloning] = useState(false)
  const [cloneProgress, setCloneProgress] = useState(0)
  const [testPreview, setTestPreview] = useState({ isPlaying: false })

  if (!isOpen) return null

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newUploads = files.map((file, idx) => ({
      id: `upload-${Date.now()}-${idx}`,
      name: file.name,
      duration: Math.random() * 30 + 10, // Mock duration
      quality: Math.random() * 30 + 70, // Mock quality score
    }))
    setUploads([...uploads, ...newUploads])
    // Emit event: voiceClone.upload
    console.log("[v0] voiceClone.upload", { files: newUploads })
  }

  const handleClone = () => {
    if (!consent || uploads.length === 0) return
    setIsCloning(true)
    setCloneProgress(0)
    const interval = setInterval(() => {
      setCloneProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsCloning(false)
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  const handleTestSynth = () => {
    setTestPreview({ isPlaying: !testPreview.isPlaying })
    // Emit event: voiceClone.test.request
    console.log("[v0] voiceClone.test.request", { text: testText })
  }

  const totalDuration = uploads.reduce((sum, u) => sum + u.duration, 0)
  const avgQuality = uploads.length > 0 ? uploads.reduce((sum, u) => sum + u.quality, 0) / uploads.length : 0

  return (
    <div className="fixed inset-0 z-[110] bg-black/50 backdrop-blur-sm">
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-[700px] bg-background rounded-2xl shadow-2xl border border-border overflow-hidden">
          {/* Header */}
          <div className="bg-background border-b border-border p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Clonage de voix</h2>
              <Button variant="ghost" size="sm" onClick={onClose}>
                ✕
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 max-h-[600px] overflow-y-auto">
            {/* ReferenceUpload */}
            <Card id="voice-clone-upload">
              <CardHeader>
                <CardTitle className="text-sm">Échantillons de référence</CardTitle>
                <p className="text-xs text-muted-foreground">
                  Téléchargez au moins 10 secondes d'audio de haute qualité
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 cursor-pointer hover:border-primary transition-colors">
                  <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                  <span className="text-sm font-medium">Télécharger des échantillons audio</span>
                  <span className="text-xs text-muted-foreground mt-1">WAV, MP3, OGG (min 10s)</span>
                  <input
                    type="file"
                    accept="audio/*"
                    multiple
                    onChange={handleUpload}
                    className="hidden"
                    aria-label="Télécharger des échantillons de voix"
                  />
                </label>

                {uploads.length > 0 && (
                  <div className="space-y-2">
                    {uploads.map((upload) => (
                      <div
                        key={upload.id}
                        className="flex items-center justify-between p-2 rounded-lg border border-border"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium">{upload.name}</p>
                          <p className="text-xs text-muted-foreground">{upload.duration.toFixed(1)}s</p>
                        </div>
                        <Badge variant={upload.quality > 80 ? "default" : "secondary"}>
                          Qualité: {upload.quality.toFixed(0)}%
                        </Badge>
                      </div>
                    ))}
                    <div className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Total: {totalDuration.toFixed(1)}s</p>
                        <p className="text-xs text-muted-foreground">Qualité moyenne: {avgQuality.toFixed(0)}%</p>
                      </div>
                      {totalDuration >= 10 ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-yellow-500" />
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Consent */}
            <Card id="voice-clone-consent">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="consent-checkbox"
                    checked={consent}
                    onChange={(e) => {
                      setConsent(e.target.checked)
                      // Emit event: voiceClone.consent.toggle
                      console.log("[v0] voiceClone.consent.toggle", { consent: e.target.checked })
                    }}
                    className="mt-1 rounded"
                    aria-label="Consentement pour le clonage de voix"
                  />
                  <div className="flex-1">
                    <Label htmlFor="consent-checkbox" className="text-sm font-medium cursor-pointer">
                      Consentement et politique d'utilisation
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Je confirme que j'ai le droit d'utiliser cette voix et que je respecte les conditions
                      d'utilisation. Le clonage de voix de personnalités publiques sans autorisation est interdit.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CloneTester */}
            <Card id="voice-clone-tester">
              <CardHeader>
                <CardTitle className="text-sm">Testeur de clone</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-xs">Texte de test</Label>
                  <Textarea
                    value={testText}
                    onChange={(e) => setTestText(e.target.value)}
                    placeholder="Entrez un texte pour tester la voix clonée..."
                    className="mt-2 min-h-[80px]"
                    aria-label="Texte de test pour la synthèse vocale"
                  />
                </div>
                <Button onClick={handleTestSynth} variant="secondary" className="w-full" disabled={!consent}>
                  {testPreview.isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Arrêter
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Tester la synthèse
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* PermissionsAndLimits */}
            <Card id="voice-clone-limits">
              <CardHeader>
                <CardTitle className="text-sm">Limites d'utilisation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Limite d'utilisation mensuelle</span>
                    <Badge>{limits.usageLimit} générations</Badge>
                  </div>
                  <Progress value={0} className="h-2" />
                  <p className="text-xs text-muted-foreground">0 / {limits.usageLimit} utilisées ce mois</p>
                </div>
              </CardContent>
            </Card>

            {/* Clone Progress */}
            {isCloning && (
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Clonage en cours...</span>
                      <span className="text-sm text-muted-foreground">{cloneProgress}%</span>
                    </div>
                    <Progress value={cloneProgress} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={handleClone}
                disabled={!consent || uploads.length === 0 || totalDuration < 10 || isCloning}
                className="flex-1"
              >
                {isCloning ? "Clonage..." : "Créer le clone vocal"}
              </Button>
              <Button variant="outline" onClick={onClose}>
                Annuler
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
