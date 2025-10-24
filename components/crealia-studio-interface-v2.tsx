"use client"

/**
 * Créalia Studio Interface V2
 * Interface complète orchestrée selon les spécifications
 */

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  STUDIO_TOOLS,
  getAllCategories,
  getToolsByCategory,
  getToolById,
} from "@/lib/studio/tools-config"
import {
  Tool,
  ToolParam,
  MediaUpload,
  AnalysisResult,
  GenerationJob,
  JobStatus,
  StudioEventType,
} from "@/lib/studio/types"
import { Upload, X, HelpCircle, Settings, Play, Download, AlertCircle, CheckCircle, Loader2 } from "lucide-react"

interface CrealiaStudioInterfaceV2Props {
  isOpen: boolean
  onClose: () => void
}

export function CrealiaStudioInterfaceV2({ isOpen, onClose }: CrealiaStudioInterfaceV2Props) {
  // State management
  const [selectedCategory, setSelectedCategory] = useState("Recommandé")
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null)
  const [uploadedMedia, setUploadedMedia] = useState<MediaUpload | null>(null)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [currentJob, setCurrentJob] = useState<GenerationJob | null>(null)
  const [formParams, setFormParams] = useState<Record<string, any>>({})
  const [isUploading, setIsUploading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [autoRun, setAutoRun] = useState(false)
  const [showHelp, setShowHelp] = useState(false)

  // Initialize form params when tool changes
  useEffect(() => {
    if (selectedTool) {
      const defaults: Record<string, any> = {}
      selectedTool.params.forEach((param) => {
        if (param.default !== undefined) {
          defaults[param.name] = param.default
        }
      })
      setFormParams(defaults)
      trackEvent("tool_opened", { tool_id: selectedTool.id })
    }
  }, [selectedTool])

  // Auto-run logic
  useEffect(() => {
    if (autoRun && uploadedMedia && selectedTool && validateForm()) {
      handleGenerate()
    }
  }, [autoRun, uploadedMedia, selectedTool])

  if (!isOpen) return null

  /**
   * Track analytics event
   */
  const trackEvent = async (type: StudioEventType, metadata?: any) => {
    try {
      await fetch("/api/analytics/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, metadata, timestamp: new Date().toISOString() }),
      })
    } catch (err) {
      console.error("Analytics error:", err)
    }
  }

  /**
   * Handle file upload
   */
  const handleFileUpload = async (file: File) => {
    setIsUploading(true)
    setError(null)
    trackEvent("upload_started")

    try {
      // Validate file
      const validFormats = ["video/mp4", "video/quicktime", "video/webm", "image/jpeg", "image/png", "image/webp"]
      if (!validFormats.includes(file.type)) {
        throw new Error(
          `Format non pris en charge : ${file.type}. Supportez mp4/mov/webm pour vidéos ou jpg/png/webp pour images.`
        )
      }

      const maxSize = 2 * 1024 * 1024 * 1024 // 2GB
      if (file.size > maxSize) {
        throw new Error(
          "Fichier trop volumineux (max 2GB). Astuce : convertissez via notre outil intégré 'Convertir' ou utilisez cloud upload."
        )
      }

      // Upload file
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/crealia/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erreur lors de l'upload")
      }

      const result: MediaUpload = await response.json()
      setUploadedMedia(result)
      trackEvent("upload_completed", { media_id: result.media_id })

      // Auto-analyze if video
      if (file.type.startsWith("video/")) {
        await handleAnalyze(result.media_url!)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur inconnue lors de l'upload"
      setError(errorMessage)
    } finally {
      setIsUploading(false)
    }
  }

  /**
   * Handle media analysis
   */
  const handleAnalyze = async (mediaUrl: string) => {
    setIsAnalyzing(true)
    setError(null)
    trackEvent("analyze_started")

    try {
      const response = await fetch("/api/crealia/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          media_url: mediaUrl,
          analyze_options: {
            detect_scenes: true,
            detect_objects: true,
            suggest_clips: true,
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de l'analyse")
      }

      const result: AnalysisResult = await response.json()
      setAnalysisResult(result)
      trackEvent("analyze_completed")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de l'analyse"
      setError(errorMessage)
    } finally {
      setIsAnalyzing(false)
    }
  }

  /**
   * Validate form parameters
   */
  const validateForm = (): boolean => {
    if (!selectedTool) return false

    for (const param of selectedTool.params) {
      if (param.required && !formParams[param.name]) {
        return false
      }
    }

    return true
  }

  /**
   * Handle generation
   */
  const handleGenerate = async () => {
    if (!selectedTool || !uploadedMedia) return

    setIsGenerating(true)
    setError(null)
    trackEvent("generate_started", { tool_id: selectedTool.id })

    try {
      const response = await fetch("/api/crealia/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          media_id: uploadedMedia.media_id,
          tool: selectedTool.id,
          params: formParams,
          auto_branding: formParams.brand_overlay || false,
        }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la génération")
      }

      const job: GenerationJob = await response.json()
      setCurrentJob(job)

      // Poll job status
      pollJobStatus(job.job_id)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la génération"
      setError(errorMessage)
      trackEvent("generate_failed", { tool_id: selectedTool.id, error: errorMessage })
      setIsGenerating(false)
    }
  }

  /**
   * Poll job status
   */
  const pollJobStatus = async (jobId: string) => {
    const poll = async () => {
      try {
        const response = await fetch(`/api/crealia/jobs/${jobId}`)
        const job: GenerationJob = await response.json()
        setCurrentJob(job)

        if (job.status === "success") {
          setIsGenerating(false)
          trackEvent("generate_completed", { job_id: jobId })
        } else if (job.status === "failed") {
          setIsGenerating(false)
          setError(job.error || "La génération a échoué")
          trackEvent("generate_failed", { job_id: jobId, error: job.error })
        } else {
          // Continue polling
          setTimeout(poll, 2000)
        }
      } catch (err) {
        setIsGenerating(false)
        setError("Erreur lors de la vérification du statut")
      }
    }

    poll()
  }

  /**
   * Apply preset
   */
  const applyPreset = (presetParams: Record<string, any>, presetId: string) => {
    setFormParams({ ...formParams, ...presetParams })
    trackEvent("preset_applied", { preset_id: presetId })
  }

  /**
   * Handle download
   */
  const handleDownload = (outputUrl: string, outputId: string) => {
    trackEvent("download_clicked", { output_id: outputId })
    window.open(outputUrl, "_blank")
  }

  /**
   * Render form field based on param type
   */
  const renderFormField = (param: ToolParam) => {
    const value = formParams[param.name]

    switch (param.type) {
      case "text":
        return (
          <Input
            value={value || ""}
            onChange={(e) => setFormParams({ ...formParams, [param.name]: e.target.value })}
            placeholder={param.placeholder}
            required={param.required}
          />
        )

      case "textarea":
        return (
          <Textarea
            value={value || ""}
            onChange={(e) => setFormParams({ ...formParams, [param.name]: e.target.value })}
            placeholder={param.placeholder}
            required={param.required}
            rows={4}
          />
        )

      case "number":
        return (
          <Input
            type="number"
            value={value || ""}
            onChange={(e) => setFormParams({ ...formParams, [param.name]: parseInt(e.target.value) })}
            min={param.min}
            max={param.max}
            required={param.required}
          />
        )

      case "range":
        return (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{param.min}</span>
              <span className="font-semibold">{value || param.default}</span>
              <span>{param.max}</span>
            </div>
            <Slider
              value={[value || param.default || 0]}
              onValueChange={(vals) => setFormParams({ ...formParams, [param.name]: vals[0] })}
              min={param.min}
              max={param.max}
              step={1}
            />
          </div>
        )

      case "select":
        return (
          <Select
            value={value || param.default}
            onValueChange={(val) => setFormParams({ ...formParams, [param.name]: val })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {param.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case "boolean":
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={value || false}
              onCheckedChange={(checked) => setFormParams({ ...formParams, [param.name]: checked })}
            />
            <span className="text-sm">{value ? "Activé" : "Désactivé"}</span>
          </div>
        )

      case "file":
        return (
          <Input
            type="file"
            accept={param.accept}
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                setFormParams({ ...formParams, [param.name]: file })
              }
            }}
            required={param.required}
          />
        )

      default:
        return <Input value={value || ""} onChange={(e) => setFormParams({ ...formParams, [param.name]: e.target.value })} />
    }
  }

  const categories = getAllCategories()
  const toolsInCategory = getToolsByCategory(selectedCategory)

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md">
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-[1400px] h-[90vh] bg-background rounded-3xl shadow-2xl border border-border/50 flex flex-col">
          {/* HEADER */}
          <div className="flex items-center justify-between p-6 border-b border-border/50">
            <div className="flex items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  🎬 Créalia Studio
                </h2>
                <p className="text-muted-foreground text-sm mt-1">Votre studio de création IA tout-en-un</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHelp(!showHelp)}
                className="rounded-full"
              >
                <HelpCircle className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full">
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* SIDEBAR */}
            <div className="w-64 border-r border-border/50 p-4 overflow-y-auto">
              <div className="space-y-1">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category)
                      setSelectedTool(null)
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all text-sm ${
                      selectedCategory === category
                        ? "bg-primary/10 text-primary border border-primary/20 font-medium"
                        : "hover:bg-secondary/50 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span>{category}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* PANNEAU CENTRAL - GRILLE D'OUTILS */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">{selectedCategory}</h3>
                <p className="text-muted-foreground text-sm">
                  {selectedCategory === "Recommandé" && "Nos outils les plus populaires et récents"}
                  {selectedCategory === "Vidéo" && "Créez des vidéos IA professionnelles"}
                  {selectedCategory === "Image" && "Générez des images IA créatives"}
                  {selectedCategory === "Contenu Audio" && "Créez du contenu audio avec l'IA"}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {toolsInCategory.map((tool) => (
                  <Card
                    key={tool.id}
                    className={`relative group cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] ${
                      selectedTool?.id === tool.id
                        ? "border-primary/50 shadow-md ring-2 ring-primary/20"
                        : "border-border/50 hover:border-primary/30"
                    }`}
                    onClick={() => setSelectedTool(tool)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-2xl">{tool.icon}</span>
                        {tool.tag && (
                          <Badge variant="secondary" className="text-xs">
                            {tool.tag}
                          </Badge>
                        )}
                      </div>
                      <h4 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                        {tool.name}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">{tool.shortDescription}</p>
                      <div className="mt-3 flex gap-2">
                        <Button size="sm" className="flex-1" onClick={(e) => {
                          e.stopPropagation()
                          setSelectedTool(tool)
                        }}>
                          Ouvrir
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* PANNEAU DROIT - DÉTAILS OUTIL */}
            <div className="w-96 border-l border-border/50 p-4 overflow-y-auto bg-secondary/20">
              {!selectedTool ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                  <Settings className="w-12 h-12 mb-4 opacity-50" />
                  <p className="text-sm">Sélectionnez un outil pour voir ses options</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Tool Header */}
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{selectedTool.icon}</span>
                      <div>
                        <h3 className="font-bold">{selectedTool.name}</h3>
                        {selectedTool.tag && <Badge variant="secondary" className="text-xs mt-1">{selectedTool.tag}</Badge>}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{selectedTool.description}</p>
                  </div>

                  <Separator />

                  {/* Uploader */}
                  <div>
                    <Label className="mb-2 block font-semibold">📤 Média source</Label>
                    <div
                      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                        isUploading
                          ? "border-primary/50 bg-primary/5"
                          : "border-border hover:border-primary/50 hover:bg-secondary/50"
                      }`}
                      onDrop={(e) => {
                        e.preventDefault()
                        const file = e.dataTransfer.files[0]
                        if (file) handleFileUpload(file)
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      onClick={() => {
                        const input = document.createElement("input")
                        input.type = "file"
                        input.accept = "video/*,image/*"
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0]
                          if (file) handleFileUpload(file)
                        }
                        input.click()
                      }}
                    >
                      {isUploading ? (
                        <div className="space-y-2">
                          <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary" />
                          <p className="text-sm">Upload en cours...</p>
                        </div>
                      ) : uploadedMedia ? (
                        <div className="space-y-2">
                          <CheckCircle className="w-8 h-8 mx-auto text-green-500" />
                          <p className="text-sm font-medium">Fichier uploadé ✅</p>
                          {uploadedMedia.metadata && (
                            <p className="text-xs text-muted-foreground">
                              {uploadedMedia.metadata.format} · {(uploadedMedia.metadata.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                          <p className="text-sm">Glissez un fichier ou cliquez</p>
                          <p className="text-xs text-muted-foreground">MP4, MOV, WEBM, JPG, PNG (max 2GB)</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Analysis Results */}
                  {isAnalyzing && (
                    <Alert>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <AlertDescription>J'analyse maintenant la vidéo pour détecter les meilleurs plans...</AlertDescription>
                    </Alert>
                  )}

                  {analysisResult && analysisResult.scenes && (
                    <div>
                      <Label className="mb-2 block font-semibold">🎞️ Scènes détectées</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {analysisResult.scenes.slice(0, 6).map((scene, i) => (
                          <div key={i} className="aspect-video bg-secondary rounded-lg overflow-hidden">
                            <img src={scene.thumbnail} alt={`Scene ${i + 1}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Presets */}
                  {selectedTool.presets && selectedTool.presets.length > 0 && (
                    <div>
                      <Label className="mb-2 block font-semibold">⚡ Exemples rapides (presets)</Label>
                      <div className="space-y-2">
                        {selectedTool.presets.map((preset) => (
                          <Button
                            key={preset.id}
                            variant="outline"
                            size="sm"
                            className="w-full justify-start text-left"
                            onClick={() => applyPreset(preset.params, preset.id)}
                          >
                            <div>
                              <div className="font-medium text-sm">{preset.name}</div>
                              <div className="text-xs text-muted-foreground">{preset.description}</div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  <Separator />

                  {/* Form Parameters */}
                  <div className="space-y-4">
                    <Label className="font-semibold">⚙️ Paramètres</Label>
                    {selectedTool.params.map((param) => (
                      <div key={param.name} className="space-y-1.5">
                        <Label htmlFor={param.name} className="text-sm">
                          {param.label}
                          {param.required && <span className="text-destructive ml-1">*</span>}
                        </Label>
                        {param.description && (
                          <p className="text-xs text-muted-foreground">{param.description}</p>
                        )}
                        {renderFormField(param)}
                      </div>
                    ))}
                  </div>

                  {/* Auto-run Toggle */}
                  <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium">Auto-run</Label>
                      <p className="text-xs text-muted-foreground">Lancer automatiquement</p>
                    </div>
                    <Switch checked={autoRun} onCheckedChange={setAutoRun} />
                  </div>

                  {/* Error Display */}
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="w-4 h-4" />
                      <AlertDescription>
                        <strong>Erreur :</strong> {error}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Generate Button */}
                  <Button
                    size="lg"
                    className="w-full"
                    disabled={!validateForm() || !uploadedMedia || isGenerating}
                    onClick={handleGenerate}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Génération en cours...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Générer
                      </>
                    )}
                  </Button>

                  {/* Job Progress */}
                  {currentJob && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">
                          Job #{currentJob.job_id.slice(0, 8)}
                        </span>
                        <Badge
                          variant={
                            currentJob.status === "success"
                              ? "default"
                              : currentJob.status === "failed"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {currentJob.status}
                        </Badge>
                      </div>
                      {currentJob.progress !== undefined && (
                        <Progress value={currentJob.progress} className="h-2" />
                      )}
                      {currentJob.estimated_time_sec && (
                        <p className="text-xs text-muted-foreground">
                          Estimation : {currentJob.estimated_time_sec}s
                        </p>
                      )}
                    </div>
                  )}

                  {/* Outputs */}
                  {currentJob?.outputs && currentJob.outputs.length > 0 && (
                    <div className="space-y-2">
                      <Label className="font-semibold">✨ Résultats</Label>
                      {currentJob.outputs.map((output) => (
                        <Card key={output.id} className="p-4">
                          <div className="flex gap-3">
                            {output.thumbnail && (
                              <img
                                src={output.thumbnail}
                                alt="Output"
                                className="w-20 h-20 object-cover rounded-lg"
                              />
                            )}
                            <div className="flex-1">
                              {output.caption && (
                                <div className="mb-2">
                                  <p className="font-medium text-sm">{output.caption.title}</p>
                                  <p className="text-xs text-muted-foreground">{output.caption.text}</p>
                                  {output.caption.hashtags && (
                                    <p className="text-xs text-primary mt-1">
                                      {output.caption.hashtags.join(" ")}
                                    </p>
                                  )}
                                </div>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                className="w-full"
                                onClick={() => handleDownload(output.url, output.id)}
                              >
                                <Download className="w-3 h-3 mr-2" />
                                Télécharger
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-border/50 px-6 py-3 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex gap-4">
              <button className="hover:text-foreground transition-colors">Conditions</button>
              <button className="hover:text-foreground transition-colors">Aide</button>
            </div>
            <div>Créalia Studio v2.0</div>
          </div>
        </div>
      </div>

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5" />
                Aide rapide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="font-medium mb-1">💡 Astuce</p>
                <p className="text-muted-foreground">
                  Pour des Reels viraux, choisissez 9:16 et 15-25s, activez sous-titres et musique automatique.
                </p>
              </div>
              <div>
                <p className="font-medium mb-1">🎬 Formats acceptés</p>
                <p className="text-muted-foreground">
                  Vidéo : MP4, MOV, WEBM · Image : JPG, PNG, WEBP · Max : 2GB
                </p>
              </div>
              <div>
                <p className="font-medium mb-1">⚡ Auto-run</p>
                <p className="text-muted-foreground">
                  Activez pour lancer automatiquement la génération dès que le média et les paramètres sont prêts.
                </p>
              </div>
              <Button variant="outline" className="w-full" onClick={() => setShowHelp(false)}>
                Fermer
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

