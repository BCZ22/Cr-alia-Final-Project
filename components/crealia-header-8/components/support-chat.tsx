"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const SendIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
)

const CloseIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const BotIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
)

interface Message {
  id: number
  text: string
  isBot: boolean
  timestamp: Date
}

interface SupportChatProps {
  isOpen: boolean
  onClose: () => void
}

export function SupportChat({ isOpen, onClose }: SupportChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Bonjour ! Je suis l'assistant IA de Créalia. Comment puis-je vous aider aujourd'hui ?",
      isBot: true,
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")

  const quickReplies = [
    "Comment commencer ?",
    "Tarifs et abonnements",
    "Problème technique",
    "Fonctionnalités disponibles",
  ]

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      isBot: false,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: getBotResponse(inputValue),
        isBot: true,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botResponse])
    }, 1000)
  }

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()

    if (input.includes("commencer") || input.includes("débuter")) {
      return "Pour commencer avec Créalia, cliquez sur 'Commencer gratuitement' et créez votre compte. Vous aurez accès à 14 jours d'essai gratuit avec toutes les fonctionnalités premium !"
    }

    if (input.includes("tarif") || input.includes("prix") || input.includes("abonnement")) {
      return "Nous proposons plusieurs formules adaptées à vos besoins. L'essai gratuit de 14 jours inclut toutes les fonctionnalités. Souhaitez-vous que je vous mette en contact avec notre équipe commerciale ?"
    }

    if (input.includes("problème") || input.includes("bug") || input.includes("erreur")) {
      return "Je suis désolé d'apprendre que vous rencontrez un problème. Pouvez-vous me décrire plus précisément ce qui ne fonctionne pas ? Notre équipe technique pourra vous aider rapidement."
    }

    if (input.includes("fonctionnalité") || input.includes("feature")) {
      return "Créalia offre la génération de scripts IA, création visuelle automatique, analytics avancées, publication multi-plateformes, suivi des tendances et optimisation SEO. Quelle fonctionnalité vous intéresse le plus ?"
    }

    return "Merci pour votre message ! Notre équipe va vous répondre dans les plus brefs délais. En attendant, n'hésitez pas à explorer notre FAQ ou à essayer notre plateforme gratuitement."
  }

  const handleQuickReply = (reply: string) => {
    setInputValue(reply)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-end p-4">
      <Card className="w-full max-w-md h-[600px] glass-card flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
              <BotIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Assistant Créalia</h3>
              <p className="text-sm text-muted-foreground">En ligne</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <CloseIcon className="w-4 h-4" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}>
              <div
                className={`max-w-[80%] p-3 rounded-2xl ${
                  message.isBot
                    ? "bg-card border border-border/50 text-foreground"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.text}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Replies */}
        {messages.length === 1 && (
          <div className="p-4 border-t border-border/50">
            <p className="text-sm text-muted-foreground mb-3">Réponses rapides :</p>
            <div className="grid grid-cols-2 gap-2">
              {quickReplies.map((reply, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs h-auto py-2 px-3 bg-transparent"
                  onClick={() => handleQuickReply(reply)}
                >
                  {reply}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-border/50">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Tapez votre message..."
              className="flex-1 px-3 py-2 bg-background border border-border/50 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <Button
              size="sm"
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="rounded-full w-10 h-10 p-0"
            >
              <SendIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
