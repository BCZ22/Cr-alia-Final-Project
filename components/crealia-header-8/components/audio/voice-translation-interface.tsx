"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { NativeSelect, NativeSelectItem } from "@/components/ui/native-select"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, Languages, Play, Pause, Edit2, Check, AlertTriangle, Download } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

interface TranscriptSegment {
  id: string
  startTime: number
  endTime: number
  speaker?: string
  originalText: string
  translatedText: string
  confidence: number
  edited: boolean
}

interface VoiceTranslationState {
  clipId: string | null
  langs: {
    source: string
    target: string
    autoDetected?: string
  }
  alignment: string
  voiceStyle: string
  prosody: {
    speed: number
    pitch: number
  }
  transcriptSegments: TranscriptSegment[]
  translationOptions: {
    speedUp: boolean
    extendClip: boolean
    summarize: boolean
  }
  preview: any | null
  taskId: string | null
  phase: "idle" | "transcribing" | "transcribed" | "translating" | "synthesizing" | "complete"
}

interface ValidationError {
  field: string
  message: string
}

function validateVoiceTranslationConfig(state: VoiceTranslationState): ValidationError[] {
  const errors: ValidationError[] = []

  if (!state.clipId) {
    errors.push({ field: "clipId", message: "Veuillez sélectionner un clip source" })
  }

  const allowedAlignments = ["preserveTiming", "natural"]
  if (!allowedAlignments.includes(state.alignment)) {
    errors.push({ field: "alignment", message: "Mode d'alignement invalide" })
  }

  if (state.prosody.speed < 0.5 || state.prosody.speed > 2.0) {
    errors.push({ field: "speed", message: "La vitesse doit être entre 0.5x et 2.0x" })
  }

  return errors
}

interface VoiceTranslationInterfaceProps {
  isOpen: boolean
  onClose: () => void
}

export function VoiceTranslationInterface({ isOpen, onClose }: VoiceTranslationInterfaceProps) {
  const [state, setState] = useState<VoiceTranslationState>({
    clipId: null,
    langs: {
      source: "auto",
      target: "fr",
    },
    alignment: "preserveTiming",
    voiceStyle: "neutral",
    prosody: {
      speed: 1.0,
      pitch: 1.0,
    },
    transcriptSegments: [],
    translationOptions: {
      speedUp: false,
      extendClip: false,
      summarize: false,
    },
    preview: null,
    taskId: null,
    phase: "idle",
  })

  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])
  const [progress, setProgress] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [editingSegmentId, setEditingSegmentId] = useState<string | null>(null)

  const languages = [
    { code: "auto", name: "Détection automatique", flag: "🌐" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "it", name: "Italiano", flag: "🇮🇹" },
    { code: "pt", name: "Português", flag: "🇵🇹" },
    { code: "ru", name: "Русский", flag: "🇷🇺" },
    { code: "zh", name: "中文", flag: "🇨🇳" },
    { code: "ja", name: "日本語", flag: "🇯🇵" },
    { code: "ar", name: "العربية", flag: "🇸🇦" },
  ]

  const availableClips = [
    { id: "clip-1", name: "Interview principale", duration: "5:32" },
    { id: "clip-2", name: "Voix off narration", duration: "2:15" },
    { id: "clip-3", name: "Dialogue scène 1", duration: "3:48" },
  ]

  const voiceStyles = [
    { id: "neutral", name: "Neutre" },
    { id: "professional", name: "Professionnel" },
    { id: "casual", name: "Décontracté" },
    { id: "energetic", name: "Énergique" },
    { id: "calm", name: "Calme" },
  ]

  const handleTranscribe = async () => {
    const errors = validateVoiceTranslationConfig(state)
    setValidationErrors(errors)

    if (errors.length > 0) {
      console.log("[v0] Voice translation validation failed:", errors)
      return
    }

    setState((prev) => ({ ...prev, phase: "transcribing" }))
    setProgress(0)

    const payload = {
      taskType: "ai:asr",
      payload: {
        clipId: state.clipId!,
        sourceLang: state.langs.source,
        diarization: true,
      },
    }

    console.log("[v0] ASR transcription request:", payload)

    window.dispatchEvent(
      new CustomEvent("ui.voiceTranslation.transcribe.request", {
        detail: payload,
      }),
    )

    // Simulate ASR progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)

          // Mock transcript segments with confidence scores
          const mockSegments: TranscriptSegment[] = [
            {
              id: "seg-1",
              startTime: 0,
              endTime: 3.5,
              speaker: "Speaker 1",
              originalText: "Hello, welcome to our presentation today.",
              translatedText: "",
              confidence: 0.95,
              edited: false,
            },
            {
              id: "seg-2",
              startTime: 3.5,
              endTime: 7.2,
              speaker: "Speaker 1",
              originalText: "We're going to discuss the latest developments.",
              translatedText: "",
              confidence: 0.88,
              edited: false,
            },
            {
              id: "seg-3",
              startTime: 7.2,
              endTime: 11.0,
              speaker: "Speaker 2",
              originalText: "That sounds great, I'm looking forward to it.",
              translatedText: "",
              confidence: 0.72,
              edited: false,
            },
          ]

          setState((prev) => ({
            ...prev,
            phase: "transcribed",
            transcriptSegments: mockSegments,
            langs: {
              ...prev.langs,
              autoDetected: "en",
            },
          }))

          console.log("[v0] ASR transcription complete:", mockSegments)

          window.dispatchEvent(
            new CustomEvent("ui.voiceTranslation.transcribe.complete", {
              detail: { segments: mockSegments, detectedLang: "en" },
            }),
          )

          return 100
        }
        return prev + 3
      })
    }, 100)
  }

  const handleTranslate = async () => {
    setState((prev) => ({ ...prev, phase: "translating" }))
    setProgress(0)

    const payload = {
      taskType: "ai:translate",
      payload: {
        segments: state.transcriptSegments.map((seg) => ({
          id: seg.id,
          text: seg.originalText,
        })),
        sourceLang: state.langs.autoDetected || state.langs.source,
        targetLang: state.langs.target,
      },
    }

    console.log("[v0] Translation request:", payload)

    window.dispatchEvent(
      new CustomEvent("ui.voiceTranslation.translate.request", {
        detail: payload,
      }),
    )

    // Simulate translation progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)

          // Mock translated segments
          const translatedSegments = state.transcriptSegments.map((seg) => ({
            ...seg,
            translatedText:
              state.langs.target === "fr"
                ? `Traduction française de: ${seg.originalText}`
                : `Traducción de: ${seg.originalText}`,
          }))

          setState((prev) => ({
            ...prev,
            phase: "translating",
            transcriptSegments: translatedSegments,
          }))

          console.log("[v0] Translation complete:", translatedSegments)

          window.dispatchEvent(
            new CustomEvent("ui.voiceTranslation.translate.complete", {
              detail: { segments: translatedSegments },
            }),
          )

          return 100
        }
        return prev + 4
      })
    }, 100)
  }

  const handleSynthesize = async () => {
    setState((prev) => ({ ...prev, phase: "synthesizing" }))
    setProgress(0)

    const payload = {
      taskType: "ai:tts",
      payload: {
        segments: state.transcriptSegments.map((seg) => ({
          id: seg.id,
          text: seg.translatedText,
          startTime: seg.startTime,
          endTime: seg.endTime,
        })),
        targetLang: state.langs.target,
        voiceStyle: state.voiceStyle,
        alignment: state.alignment,
        prosody: state.prosody,
        options: state.translationOptions,
      },
    }

    console.log("[v0] TTS synthesis request:", payload)

    window.dispatchEvent(
      new CustomEvent("ui.voiceTranslation.synthesize.request", {
        detail: payload,
      }),
    )

    window.dispatchEvent(
      new CustomEvent("command", {
        detail: {
          type: "voiceTranslation.synthesize",
          payload,
          timestamp: Date.now(),
        },
      }),
    )

    // Simulate synthesis progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)

          const preview = {
            id: "preview-" + Date.now(),
            clipId: state.clipId,
            targetLang: state.langs.target,
            url: "/translated-audio.mp3",
            srtUrl: "/translated-subtitles.srt",
          }

          setState((prev) => ({ ...prev, phase: "complete", preview }))

          console.log("[v0] Voice translation synthesis complete:", preview)

          window.dispatchEvent(
            new CustomEvent("ui.voiceTranslation.complete", {
              detail: { preview, config: payload },
            }),
          )

          return 100
        }
        return prev + 2
      })
    }, 100)
  }

  const handleEditSegment = (segmentId: string, newText: string) => {
    setState((prev) => ({
      ...prev,
      transcriptSegments: prev.transcriptSegments.map((seg) =>
        seg.id === segmentId ? { ...seg, translatedText: newText, edited: true } : seg,
      ),
    }))
    console.log("[v0] Segment edited:", segmentId, newText)
  }

  const handleClipSelect = (clipId: string) => {
    setState((prev) => ({ ...prev, clipId, phase: "idle", transcriptSegments: [] }))
    console.log("[v0] Voice translation clip selected:", clipId)
    window.dispatchEvent(
      new CustomEvent("ui.voiceTranslation.source.select", {
        detail: { clipId },
      }),
    )
  }

  const handleSourceLangChange = (source: string) => {
    setState((prev) => ({
      ...prev,
      langs: { ...prev.langs, source },
    }))
    console.log("[v0] Source language changed:", source)
  }

  const handleTargetLangChange = (target: string) => {
    setState((prev) => ({
      ...prev,
      langs: { ...prev.langs, target },
    }))
    console.log("[v0] Target language changed:", target)
  }

  const handleSwapLanguages = () => {
    if (state.langs.source === "auto") return
    setState((prev) => ({
      ...prev,
      langs: {
        ...prev.langs,
        source: prev.langs.target,
        target: prev.langs.source,
      },
    }))
  }

  const handleAlignmentChange = (alignment: string) => {
    setState((prev) => ({ ...prev, alignment }))
    console.log("[v0] Alignment mode changed:", alignment)
  }

  const handleVoiceStyleChange = (voiceStyle: string) => {
    setState((prev) => ({ ...prev, voiceStyle }))
    console.log("[v0] Voice style changed:", voiceStyle)
  }

  const handlePreviewPlay = () => {
    setIsPlaying(!isPlaying)
    console.log("[v0] Preview playback toggled:", !isPlaying)
  }

  const handleExport = () => {
    console.log("[v0] Exporting translated clip with SRT")
    window.dispatchEvent(
      new CustomEvent("ui.voiceTranslation.export", {
        detail: { preview: state.preview },
      }),
    )
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "bg-green-500"
    if (confidence >= 0.7) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle>Traduction vocale</DialogTitle>
          <DialogDescription>Transcription ASR → Traduction → Synthèse TTS avec alignement temporel</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col h-full overflow-hidden">
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-end">
                <Badge variant={state.phase === "complete" ? "default" : "secondary"}>{state.phase}</Badge>
              </div>

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

              <Card className="p-6 space-y-6">
                {/* SourceClipSelector */}
                <div className="space-y-2">
                  <Label htmlFor="source-clip">Clip source *</Label>
                  <NativeSelect
                    value={state.clipId || ""}
                    onValueChange={handleClipSelect}
                    disabled={state.phase !== "idle"}
                  >
                    {availableClips.map((clip) => (
                      <NativeSelectItem key={clip.id} value={clip.id}>
                        {clip.name} ({clip.duration})
                      </NativeSelectItem>
                    ))}
                  </NativeSelect>
                </div>

                {/* LanguageControls */}
                <div className="space-y-4">
                  <Label>Langues</Label>
                  <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-end">
                    <div className="space-y-2">
                      <Label htmlFor="source-lang" className="text-xs text-muted-foreground">
                        Langue source {state.langs.autoDetected && `(détectée: ${state.langs.autoDetected})`}
                      </Label>
                      <NativeSelect value={state.langs.source} onValueChange={handleSourceLangChange}>
                        {languages.map((lang) => (
                          <NativeSelectItem key={lang.code} value={lang.code}>
                            {lang.flag} {lang.name}
                          </NativeSelectItem>
                        ))}
                      </NativeSelect>
                    </div>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleSwapLanguages}
                      disabled={state.langs.source === "auto"}
                      className="mb-0 bg-transparent"
                    >
                      <Languages className="w-4 h-4" />
                    </Button>

                    <div className="space-y-2">
                      <Label htmlFor="target-lang" className="text-xs text-muted-foreground">
                        Langue cible
                      </Label>
                      <NativeSelect value={state.langs.target} onValueChange={handleTargetLangChange}>
                        {languages
                          .filter((l) => l.code !== "auto")
                          .map((lang) => (
                            <NativeSelectItem key={lang.code} value={lang.code}>
                              {lang.flag} {lang.name}
                            </NativeSelectItem>
                          ))}
                      </NativeSelect>
                    </div>
                  </div>
                </div>

                {state.transcriptSegments.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Transcription et traduction</Label>
                      <span className="text-xs text-muted-foreground">{state.transcriptSegments.length} segments</span>
                    </div>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {state.transcriptSegments.map((segment) => (
                        <Card key={segment.id} className="p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {segment.speaker}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {segment.startTime.toFixed(1)}s - {segment.endTime.toFixed(1)}s
                              </span>
                              <div className="flex items-center gap-1">
                                <div className={`w-2 h-2 rounded-full ${getConfidenceColor(segment.confidence)}`} />
                                <span className="text-xs text-muted-foreground">
                                  {(segment.confidence * 100).toFixed(0)}%
                                </span>
                              </div>
                              {segment.confidence < 0.8 && (
                                <AlertTriangle className="w-3 h-3 text-yellow-500" title="Faible confiance" />
                              )}
                            </div>
                            {segment.edited && <Badge variant="secondary">Édité</Badge>}
                          </div>
                          <div className="text-sm">{segment.originalText}</div>
                          {segment.translatedText && (
                            <div className="space-y-1">
                              {editingSegmentId === segment.id ? (
                                <div className="flex gap-2">
                                  <Textarea
                                    value={segment.translatedText}
                                    onChange={(e) => handleEditSegment(segment.id, e.target.value)}
                                    className="text-sm min-h-[60px]"
                                  />
                                  <Button size="icon" variant="outline" onClick={() => setEditingSegmentId(null)}>
                                    <Check className="w-4 h-4" />
                                  </Button>
                                </div>
                              ) : (
                                <div className="flex items-start justify-between gap-2">
                                  <div className="text-sm text-primary flex-1">{segment.translatedText}</div>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-6 w-6"
                                    onClick={() => setEditingSegmentId(segment.id)}
                                  >
                                    <Edit2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* AlignmentMode and VoiceStyleSelector */}
                {state.phase !== "idle" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="alignment">Mode d'alignement</Label>
                      <NativeSelect value={state.alignment} onValueChange={handleAlignmentChange}>
                        <NativeSelectItem value="preserveTiming">
                          <div>
                            <div className="font-medium">Préserver le timing</div>
                            <div className="text-xs text-muted-foreground">Garde la durée originale</div>
                          </div>
                        </NativeSelectItem>
                        <NativeSelectItem value="natural">
                          <div>
                            <div className="font-medium">Naturel</div>
                            <div className="text-xs text-muted-foreground">Ajuste la durée si nécessaire</div>
                          </div>
                        </NativeSelectItem>
                      </NativeSelect>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="voice-style">Style de voix</Label>
                      <NativeSelect value={state.voiceStyle} onValueChange={handleVoiceStyleChange}>
                        {voiceStyles.map((style) => (
                          <NativeSelectItem key={style.id} value={style.id}>
                            {style.name}
                          </NativeSelectItem>
                        ))}
                      </NativeSelect>
                    </div>
                  </div>
                )}

                {state.phase === "translating" && (
                  <div className="space-y-4">
                    <Label>Contrôles de prosodie</Label>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="speed" className="text-sm">
                            Vitesse
                          </Label>
                          <span className="text-sm text-muted-foreground">{state.prosody.speed.toFixed(1)}x</span>
                        </div>
                        <Slider
                          id="speed"
                          min={0.5}
                          max={2.0}
                          step={0.1}
                          value={[state.prosody.speed]}
                          onValueChange={([speed]) =>
                            setState((prev) => ({ ...prev, prosody: { ...prev.prosody, speed } }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="pitch" className="text-sm">
                            Tonalité
                          </Label>
                          <span className="text-sm text-muted-foreground">{state.prosody.pitch.toFixed(1)}x</span>
                        </div>
                        <Slider
                          id="pitch"
                          min={0.5}
                          max={2.0}
                          step={0.1}
                          value={[state.prosody.pitch]}
                          onValueChange={([pitch]) =>
                            setState((prev) => ({ ...prev, prosody: { ...prev.prosody, pitch } }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* PreviewPlayer */}
                {state.preview && (
                  <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                    <Label>Prévisualisation</Label>
                    <div className="flex items-center gap-4">
                      <Button variant="outline" size="icon" onClick={handlePreviewPlay}>
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                      <div className="flex-1">
                        <div className="h-2 bg-primary/20 rounded-full overflow-hidden">
                          <div className="h-full bg-primary w-1/3 transition-all" />
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">0:45 / 2:15</span>
                    </div>
                  </div>
                )}

                {/* Progress indicator */}
                {state.phase !== "idle" && state.phase !== "complete" && state.phase !== "transcribed" && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {state.phase === "transcribing" && "Transcription en cours..."}
                        {state.phase === "translating" && "Traduction en cours..."}
                        {state.phase === "synthesizing" && "Synthèse vocale en cours..."}
                      </span>
                      <span className="font-medium">{progress}%</span>
                    </div>
                    <Progress value={progress} />
                  </div>
                )}

                {/* Action buttons based on phase */}
                <div className="flex gap-3 pt-4">
                  {state.phase === "idle" && (
                    <Button className="flex-1" onClick={handleTranscribe} disabled={!state.clipId}>
                      Transcrire
                    </Button>
                  )}
                  {state.phase === "transcribed" && (
                    <Button className="flex-1" onClick={handleTranslate}>
                      Traduire
                    </Button>
                  )}
                  {state.phase === "translating" && progress === 100 && (
                    <Button className="flex-1" onClick={handleSynthesize}>
                      Synthétiser
                    </Button>
                  )}
                  {state.phase === "complete" && (
                    <>
                      <Button className="flex-1" onClick={handleExport}>
                        <Download className="w-4 h-4 mr-2" />
                        Exporter (Audio + SRT)
                      </Button>
                      <Button variant="outline" onClick={() => setState((prev) => ({ ...prev, phase: "idle" }))}>
                        Nouveau
                      </Button>
                    </>
                  )}
                </div>
              </Card>

              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Flow: ASR (transcription + diarization) → Traduction → TTS (synthèse)</p>
                <p>• Édition des segments avant synthèse</p>
                <p>• Scores de confiance par segment</p>
                <p>• Export: audio + SRT/VTT alignés</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
