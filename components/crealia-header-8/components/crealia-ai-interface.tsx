"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const SendIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m5 12 7-7 7 7M12 19V5" />
  </svg>
)

const PaperclipIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.64 16.2a2 2 0 0 1-2.83-2.83l8.49-8.48"
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

const VideoIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polygon strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} points="23 7 16 12 23 17 23 7" />
    <rect
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      x="1"
      y="5"
      width="15"
      height="14"
      rx="2"
      ry="2"
    />
  </svg>
)

const SparklesIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456z"
    />
  </svg>
)

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 6 6 18" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m6 6 12 12" />
  </svg>
)

const MicrophoneIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} x1="12" y1="19" x2="12" y2="23" />
    <line strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} x1="8" y1="23" x2="16" y2="23" />
  </svg>
)

const StopIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} x="6" y="6" width="12" height="12" rx="2" />
  </svg>
)

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

interface CrealiaAIInterfaceProps {
  isOpen: boolean
  onClose: () => void
}

const suggestions = [
  "Créer un Reel tendance pour Instagram",
  "Analyser les performances de mes vidéos",
  "Générer des idées de contenu viral",
  "Optimiser mes hashtags",
  "Créer une story engageante",
  "Adapter mon contenu pour TikTok",
]

export function CrealiaAIInterface({ isOpen, onClose }: CrealiaAIInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Bonjour ! Je suis l'IA de Créalia. Comment puis-je vous aider à créer du contenu viral aujourd'hui ?",
      isUser: false,
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const audioChunks: BlobPart[] = []

      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data)
      }

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" })
        // Simulate speech-to-text conversion
        const transcribedText = "Créer un Reel viral sur les tendances mode automne avec une musique entraînante"
        setInputValue(transcribedText)

        // Stop all tracks to release microphone
        stream.getTracks().forEach((track) => track.stop())
      }

      recorder.start()
      setMediaRecorder(recorder)
      setIsRecording(true)
    } catch (error) {
      console.error("Erreur lors de l'accès au microphone:", error)
      alert("Impossible d'accéder au microphone. Veuillez vérifier vos permissions.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop()
      setMediaRecorder(null)
      setIsRecording(false)
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "Excellente idée ! Je vais vous aider à créer du contenu viral. Pouvez-vous me donner plus de détails sur votre projet ?",
        isUser: false,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
  }

  const handleFileUpload = (type: "image" | "video") => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = type === "image" ? "image/*" : "video/*"
      fileInputRef.current.click()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-4xl h-[80vh] mx-4 bg-background/95 backdrop-blur-xl border border-border/50 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <SparklesIcon className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Créalia AI</h2>
              <p className="text-sm text-muted-foreground">Assistant IA pour contenu viral</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full">
            <XIcon className="w-5 h-5" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn("flex gap-3 max-w-[80%]", message.isUser ? "ml-auto flex-row-reverse" : "")}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                  message.isUser
                    ? "bg-primary text-primary-foreground"
                    : "bg-gradient-to-br from-primary to-primary/60 text-primary-foreground",
                )}
              >
                {message.isUser ? "U" : <SparklesIcon className="w-4 h-4" />}
              </div>
              <div
                className={cn(
                  "rounded-2xl px-4 py-3 text-sm",
                  message.isUser ? "bg-primary text-primary-foreground ml-2" : "bg-secondary/50 text-foreground mr-2",
                )}
              >
                {message.content}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <SparklesIcon className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="bg-secondary/50 rounded-2xl px-4 py-3 text-sm">
                <div className="flex gap-1">
                  <div
                    className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <div
                    className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <div
                    className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Suggestions */}
        {messages.length === 1 && (
          <div className="px-6 pb-4">
            <p className="text-sm text-muted-foreground mb-3">Suggestions :</p>
            <div className="grid grid-cols-2 gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-left p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 text-sm transition-colors border border-border/30 hover:border-border/50"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-6 border-t border-border/50">
          <div className="flex items-end gap-3">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleFileUpload("image")}
                className="rounded-full p-2 h-10 w-10"
              >
                <ImageIcon className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleFileUpload("video")}
                className="rounded-full p-2 h-10 w-10"
              >
                <VideoIcon className="w-4 h-4" />
              </Button>
              <Button
                variant={isRecording ? "destructive" : "outline"}
                size="sm"
                onClick={isRecording ? stopRecording : startRecording}
                className={cn("rounded-full p-2 h-10 w-10 transition-all", isRecording && "animate-pulse")}
              >
                {isRecording ? <StopIcon className="w-4 h-4" /> : <MicrophoneIcon className="w-4 h-4" />}
              </Button>
            </div>

            <div className="flex-1 relative">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                placeholder={
                  isRecording
                    ? "🎤 Enregistrement en cours..."
                    : "Décrivez votre projet de contenu ou dictez vos instructions..."
                }
                className="w-full resize-none rounded-2xl border border-border/50 bg-secondary/30 px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 min-h-[44px] max-h-32"
                rows={1}
                disabled={isRecording}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isRecording}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 h-8 w-8"
                size="sm"
              >
                <SendIcon className="w-4 h-4 rotate-90" />
              </Button>
            </div>
          </div>

          {isRecording && (
            <div className="mt-3 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              Enregistrement en cours... Cliquez sur stop pour terminer
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                const message: Message = {
                  id: Date.now().toString(),
                  content: `📎 Fichier téléversé: ${file.name}`,
                  isUser: true,
                  timestamp: new Date(),
                }
                setMessages((prev) => [...prev, message])
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}
