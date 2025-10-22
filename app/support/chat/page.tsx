/**
 * Chat Support Page
 * 24/7 AI-powered chat support
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Message {
  id: string
  role: 'USER' | 'ASSISTANT'
  content: string
  createdAt?: Date
}

export default function ChatSupportPage() {
  const { data: session } = useSession()
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [initializing, setInitializing] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastMessageIdRef = useRef<string>('')

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Polling function to fetch new messages
  const pollMessages = async (currentSessionId: string) => {
    try {
      const response = await fetch(`/api/chat/history?session_id=${currentSessionId}&limit=50`)
      if (!response.ok) return

      const data = await response.json()
      
      if (data.messages && data.messages.length > 0) {
        const newMessages = data.messages.map((msg: any) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          createdAt: msg.createdAt ? new Date(msg.createdAt) : undefined,
        }))

        // Only update if there are new messages
        const latestMessageId = newMessages[newMessages.length - 1]?.id
        if (latestMessageId !== lastMessageIdRef.current) {
          setMessages(newMessages)
          lastMessageIdRef.current = latestMessageId
        }
      }
    } catch (error) {
      console.error('Failed to poll messages:', error)
    }
  }

  // Start polling when session is created
  useEffect(() => {
    if (!sessionId) return

    // Start polling every 2 seconds
    pollingIntervalRef.current = setInterval(() => {
      if (!loading) {
        pollMessages(sessionId)
      }
    }, 2000)

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
    }
  }, [sessionId, loading])

  // Initialize chat session
  useEffect(() => {
    const initChat = async () => {
      try {
        const response = await fetch('/api/chat/create-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        })

        const data = await response.json()

        if (data.sessionId) {
          setSessionId(data.sessionId)
          if (data.message) {
            setMessages([
              {
                id: data.message.id,
                role: data.message.role,
                content: data.message.content,
              },
            ])
          }
        }
      } catch (error) {
        console.error('Failed to initialize chat:', error)
      } finally {
        setInitializing(false)
      }
    }

    initChat()
  }, [])

  // Send message
  const handleSend = async () => {
    if (!input.trim() || !sessionId || loading) return

    const userMessage: Message = {
      id: `temp-${Date.now()}`,
      role: 'USER',
      content: input.trim(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          message: userMessage.content,
        }),
      })

      const data = await response.json()

      if (data.message) {
        const newMessage = {
          id: data.message.id,
          role: data.message.role,
          content: data.message.content,
        }
        setMessages((prev) => [...prev, newMessage])
        lastMessageIdRef.current = data.message.id
        
        // Force an immediate poll to get the assistant's response faster
        if (sessionId) {
          setTimeout(() => pollMessages(sessionId), 500)
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'ASSISTANT',
          content:
            "Désolé, une erreur s'est produite. Veuillez réessayer.",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Initialisation du chat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-4">
      <div className="max-w-4xl mx-auto py-8">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 border border-primary/20 rounded-full mb-4">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span className="text-sm font-medium text-primary">Chat en direct 24/7</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Comment pouvons-nous <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              vous aider ?
            </span>
          </h1>

          <p className="text-xl text-muted-foreground">
            Notre assistant IA est là pour répondre à toutes vos questions
          </p>
        </div>

        {/* Chat Container */}
        <Card className="glass-card overflow-hidden">
          {/* Messages */}
          <div className="h-[500px] overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === 'USER' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === 'USER'
                      ? 'bg-primary text-primary-foreground ml-auto'
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-secondary text-secondary-foreground rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-border p-4">
            <div className="flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Posez votre question..."
                className="flex-1 resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                rows={1}
                disabled={loading}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="btn-gradient px-6"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Appuyez sur Entrée pour envoyer, Shift+Entrée pour nouvelle ligne
            </p>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: 'Consulter la FAQ',
              description: 'Trouvez rapidement des réponses',
              href: '#',
              icon: '📚',
            },
            {
              title: 'Tutoriels vidéo',
              description: 'Apprenez à utiliser Créalia',
              href: '#',
              icon: '🎬',
            },
            {
              title: 'Communauté',
              description: 'Échangez avec d\'autres créateurs',
              href: '/community',
              icon: '👥',
            },
          ].map((action, index) => (
            <Card key={index} className="glass-card p-4 hover:border-primary/40 transition-colors cursor-pointer">
              <div className="text-3xl mb-2">{action.icon}</div>
              <h3 className="font-bold mb-1">{action.title}</h3>
              <p className="text-sm text-muted-foreground">{action.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
