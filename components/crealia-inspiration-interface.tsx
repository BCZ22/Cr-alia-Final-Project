"use client"

import { useState } from "react"
import {
  X,
  Lightbulb,
  Send,
  Sparkles,
  Zap,
  Target,
  Calendar,
  Hash,
  Users,
  Wand2,
  ChevronRight,
  Play,
  Layers,
  ImageIcon,
  BarChart3,
  Palette,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"

interface CrealiaInspirationInterfaceProps {
  isOpen: boolean
  onClose: () => void
}

const inspirationCategories = [
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: "💼",
    color: "#0A66C2",
    description: "Contenu professionnel",
    suggestions: [
      {
        title: "Posts personal branding",
        description: "Développez votre marque personnelle",
        type: "Posts",
        prompt: "Génère 10 idées de posts LinkedIn pour développer mon personal branding dans [SECTEUR]",
      },
      {
        title: "Carrousels éducatifs",
        description: "Formats visuels engageants",
        type: "Carrousels",
        prompt: "Crée 5 carrousels LinkedIn éducatifs sur [SUJET] avec titres accrocheurs et call-to-action",
      },
      {
        title: "Thought leadership",
        description: "Positionnement d'expert",
        type: "Leadership",
        prompt: "Rédige 3 posts thought leadership sur les tendances de [SECTEUR] pour 2024",
      },
      {
        title: "Storytelling professionnel",
        description: "Histoires qui inspirent",
        type: "Stories",
        prompt: "Crée 5 histoires professionnelles inspirantes pour LinkedIn avec structure narrative",
      },
    ],
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: "🎵",
    color: "#000000",
    description: "Contenu viral",
    suggestions: [
      {
        title: "Scripts viraux 30s",
        description: "Structures qui captent l'attention",
        type: "Scripts",
        prompt: "Écris 5 scripts TikTok de 30 secondes sur [SUJET] avec hooks puissants et transitions",
      },
      {
        title: "Défis créatifs",
        description: "Challenges participatifs",
        type: "Défis",
        prompt: "Crée 3 défis TikTok originaux pour [MARQUE] avec hashtags personnalisés et règles",
      },
      {
        title: "Trends adaptation",
        description: "Adaptation des tendances",
        type: "Trends",
        prompt: "Adapte 5 trends TikTok actuels pour [SECTEUR] avec angles originaux",
      },
      {
        title: "Hooks accrocheurs",
        description: "Débuts qui stoppent le scroll",
        type: "Hooks",
        prompt: "Génère 15 hooks TikTok irrésistibles pour [NICHE] qui arrêtent le scroll",
      },
    ],
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: "📷",
    color: "#E4405F",
    description: "Contenu visuel",
    suggestions: [
      {
        title: "Captions engageantes",
        description: "Légendes qui génèrent des interactions",
        type: "Captions",
        prompt: "Rédige 10 captions Instagram engageantes pour [TYPE DE POST] avec questions et CTA",
      },
      {
        title: "Stories interactives",
        description: "Formats avec sondages et questions",
        type: "Stories",
        prompt: "Conçois 7 concepts de Stories Instagram interactives pour [SECTEUR] avec stickers",
      },
      {
        title: "Reels créatifs",
        description: "Vidéos courtes engageantes",
        type: "Reels",
        prompt: "Crée 5 concepts de Reels Instagram créatifs sur [SUJET] avec musiques tendance",
      },
      {
        title: "Carrousels informatifs",
        description: "Contenus éducatifs multi-slides",
        type: "Carrousels",
        prompt: "Développe 3 carrousels Instagram informatifs sur [SUJET] avec design cohérent",
      },
    ],
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: "📺",
    color: "#FF0000",
    description: "Contenu long-form",
    suggestions: [
      {
        title: "Hooks accrocheurs",
        description: "Débuts qui retiennent l'attention",
        type: "Hooks",
        prompt: "Génère 10 hooks YouTube puissants pour une vidéo sur [SUJET] avec rétention élevée",
      },
      {
        title: "Structures optimisées",
        description: "Framework pour tutoriels",
        type: "Structure",
        prompt: "Crée une structure détaillée pour une vidéo YouTube de [DURÉE] sur [SUJET]",
      },
      {
        title: "Titres clickbait éthiques",
        description: "Titres qui attirent sans tromper",
        type: "Titres",
        prompt: "Propose 10 titres YouTube accrocheurs et éthiques pour [SUJET DE VIDÉO]",
      },
      {
        title: "Scripts complets",
        description: "Scénarios détaillés avec timing",
        type: "Scripts",
        prompt: "Écris un script YouTube complet de [DURÉE] sur [SUJET] avec timestamps",
      },
    ],
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: "👥",
    color: "#1877F2",
    description: "Communauté & partage",
    suggestions: [
      {
        title: "Posts communautaires",
        description: "Contenu qui fédère",
        type: "Community",
        prompt: "Crée 5 posts Facebook qui créent de l'engagement communautaire pour [SECTEUR]",
      },
      {
        title: "Événements promotionnels",
        description: "Annonces d'événements",
        type: "Events",
        prompt: "Rédige 3 posts Facebook pour promouvoir [TYPE D'ÉVÉNEMENT] avec call-to-action",
      },
      {
        title: "Contenu viral",
        description: "Posts qui se partagent",
        type: "Viral",
        prompt: "Génère 5 idées de posts Facebook viraux pour [SECTEUR] avec potentiel de partage",
      },
    ],
  },
  {
    id: "twitter",
    name: "X (Twitter)",
    icon: "🐦",
    color: "#000000",
    description: "Actualités & opinions",
    suggestions: [
      {
        title: "Threads éducatifs",
        description: "Fils informatifs structurés",
        type: "Threads",
        prompt: "Crée un thread X de 10 tweets sur [SUJET] avec structure claire et engagement",
      },
      {
        title: "Tweets d'opinion",
        description: "Prises de position réfléchies",
        type: "Opinion",
        prompt: "Rédige 5 tweets d'opinion nuancés sur [SUJET D'ACTUALITÉ] avec arguments",
      },
      {
        title: "Live-tweeting",
        description: "Couverture en temps réel",
        type: "Live",
        prompt: "Prépare une stratégie de live-tweeting pour [ÉVÉNEMENT] avec 15 tweets types",
      },
    ],
  },
  {
    id: "pinterest",
    name: "Pinterest",
    icon: "📌",
    color: "#E60023",
    description: "Inspiration visuelle",
    suggestions: [
      {
        title: "Épingles optimisées",
        description: "Visuels qui performent",
        type: "Pins",
        prompt: "Conçoit 10 concepts d'épingles Pinterest optimisées pour [NICHE] avec descriptions SEO",
      },
      {
        title: "Tableaux thématiques",
        description: "Collections organisées",
        type: "Boards",
        prompt: "Crée 5 tableaux Pinterest thématiques pour [SECTEUR] avec stratégie de contenu",
      },
      {
        title: "Infographies créatives",
        description: "Données visualisées",
        type: "Infographics",
        prompt: "Développe 3 concepts d'infographies Pinterest sur [SUJET] avec données clés",
      },
    ],
  },
  {
    id: "snapchat",
    name: "Snapchat",
    icon: "👻",
    color: "#FFFC00",
    description: "Contenu éphémère",
    suggestions: [
      {
        title: "Stories créatives",
        description: "Contenus éphémères engageants",
        type: "Stories",
        prompt: "Crée 7 concepts de Stories Snapchat créatives pour [MARQUE] avec filtres",
      },
      {
        title: "Snaps authentiques",
        description: "Moments spontanés",
        type: "Snaps",
        prompt: "Génère 10 idées de Snaps authentiques pour [SECTEUR] avec ton décontracté",
      },
      {
        title: "Campagnes AR",
        description: "Expériences en réalité augmentée",
        type: "AR",
        prompt: "Conçoit 3 concepts de filtres AR Snapchat pour [MARQUE] avec interactions",
      },
    ],
  },
]

const quickPrompts = [
  {
    icon: Calendar,
    title: "Plan de contenu mensuel",
    description: "Calendrier éditorial complet multi-plateformes",
    category: "Planning",
    prompt: "Crée un calendrier éditorial de 30 jours avec 3 posts par semaine pour [SECTEUR] sur [PLATEFORMES]",
  },
  {
    icon: Zap,
    title: "Contenu viral",
    description: "Idées tendance qui performent",
    category: "Viral",
    prompt: "Génère 10 idées de contenu viral pour [PLATEFORME] dans [SECTEUR] avec hooks puissants",
  },
  {
    icon: Hash,
    title: "Hashtags optimisés",
    description: "Recherche intelligente par plateforme",
    category: "SEO",
    prompt: "Trouve 30 hashtags optimisés pour [SUJET] sur [PLATEFORME] avec analyse de performance",
  },
  {
    icon: Target,
    title: "Hooks qui convertissent",
    description: "Accroches psychologiques",
    category: "Conversion",
    prompt: "Crée 15 hooks puissants pour [OBJECTIF] sur [PLATEFORME] avec techniques de persuasion",
  },
  {
    icon: ImageIcon,
    title: "Concepts visuels",
    description: "Idées créatives pour images et vidéos",
    category: "Visuel",
    prompt: "Génère 8 concepts visuels créatifs pour [SUJET] sur [PLATEFORME] avec descriptions détaillées",
  },
  {
    icon: BarChart3,
    title: "Stratégie de croissance",
    description: "Plan d'acquisition d'audience",
    category: "Growth",
    prompt: "Développe une stratégie de croissance sur [PLATEFORME] pour [SECTEUR] avec KPIs",
  },
  {
    icon: Palette,
    title: "Identité visuelle",
    description: "Cohérence graphique multi-plateformes",
    category: "Branding",
    prompt: "Crée une charte graphique pour [MARQUE] adaptée à toutes les plateformes sociales",
  },
  {
    icon: Users,
    title: "Engagement communautaire",
    description: "Stratégies d'interaction avec l'audience",
    category: "Community",
    prompt: "Développe 10 stratégies d'engagement communautaire pour [SECTEUR] sur [PLATEFORME]",
  },
]

export function CrealiaInspirationInterface({ isOpen, onClose }: CrealiaInspirationInterfaceProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [chatMessage, setChatMessage] = useState("")
  const [chatHistory, setChatHistory] = useState<Array<{ type: "user" | "ai"; content: string; timestamp: Date }>>([])
  const [isGenerating, setIsGenerating] = useState(false)

  if (!isOpen) return null

  // Enhanced AI response simulation with more sophisticated content
  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return

    const userMessage = { type: "user" as const, content: chatMessage, timestamp: new Date() }
    setChatHistory((prev) => [...prev, userMessage])
    setChatMessage("")
    setIsGenerating(true)

    // Simulate AI response with more sophisticated content
    setTimeout(() => {
      const responses = [
        `✨ **Voici des idées créatives pour "${chatMessage}" :**

🎯 **3 Approches stratégiques :**

1. **Hook émotionnel** : "La chose que personne ne vous dit sur [sujet]..."
2. **Format question** : "Pourquoi [situation] ne fonctionne plus en 2024 ?"
3. **Storytelling** : "Il y a 2 ans, je pensais que [croyance]... J'avais tort."

📊 **Optimisation par plateforme :**
• LinkedIn : Focus sur l'expertise et le networking
• Instagram : Visuels impactants avec storytelling
• TikTok : Hooks dans les 3 premières secondes
• YouTube : Structure en 3 actes avec rétention

💡 **Voulez-vous que je développe l'une de ces approches spécifiquement ?**`,

        `🚀 **Stratégie de contenu personnalisée :**

📝 **Plan d'action immédiat :**
1. Analysez votre audience cible
2. Identifiez les pain points principaux
3. Créez du contenu qui apporte des solutions

🎨 **Formats recommandés :**
• Carrousels éducatifs (LinkedIn/Instagram)
• Vidéos courtes explicatives (TikTok/Reels)
• Threads informatifs (X/Twitter)
• Stories interactives (Instagram/Snapchat)

📈 **Métriques à suivre :**
• Taux d'engagement
• Portée organique
• Clics vers votre profil
• Conversions en followers

🔥 **Prêt à créer du contenu qui performe ?**`,
      ]

      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      const aiResponse = {
        type: "ai" as const,
        content: randomResponse,
        timestamp: new Date(),
      }
      setChatHistory((prev) => [...prev, aiResponse])
      setIsGenerating(false)
    }, 2000)
  }

  const handleQuickPrompt = (prompt: string) => {
    setChatMessage(prompt)
  }

  const handleSuggestionClick = (suggestion: any) => {
    setChatMessage(suggestion.prompt)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-[95vw] h-[95vh] mx-4 bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/30 bg-white/80">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center shadow-lg">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Créalia Inspiration</h2>
              <p className="text-sm text-gray-600">Assistant IA Copilote Créatif - Spécialisé Création de Contenu</p>
            </div>
          </div>
          <Button onClick={onClose} variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-gray-100">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-80 border-r border-gray-200/30 bg-gray-50/50 overflow-y-auto">
            <div className="p-4 space-y-6">
              {/* Quick Start */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Play className="w-4 h-4 text-purple-600" />
                  Démarrage Rapide
                </h3>
                <div className="space-y-2">
                  {quickPrompts.map((prompt, index) => (
                    <Card
                      key={index}
                      className="cursor-pointer hover:shadow-sm transition-all hover:bg-purple-50/50 border-gray-200/50"
                      onClick={() => handleQuickPrompt(prompt.prompt)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                            <prompt.icon className="w-4 h-4 text-purple-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm text-gray-900">{prompt.title}</div>
                            <div className="text-xs text-gray-500">{prompt.description}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Platforms */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-600" />
                  Plateformes Sociales
                </h3>
                <div className="space-y-2">
                  {inspirationCategories.map((category) => (
                    <Card
                      key={category.id}
                      className={`cursor-pointer transition-all border-gray-200/50 ${
                        selectedCategory === category.id
                          ? "ring-2 ring-purple-500 bg-purple-50"
                          : "hover:shadow-sm hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="text-lg">{category.icon}</div>
                          <div className="flex-1">
                            <div className="font-medium text-sm text-gray-900">{category.name}</div>
                            <div className="text-xs text-gray-500">{category.description}</div>
                          </div>
                          {selectedCategory === category.id && (
                            <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Chat Area - Premium Design Centered */}
            <div className="flex-1 p-6 overflow-y-auto">
              {chatHistory.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center space-y-8">
                  {/* Welcome Section */}
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center mx-auto">
                      <Wand2 className="w-10 h-10 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Créez du contenu exceptionnel</h3>
                      <p className="text-gray-600 max-w-md">
                        Utilisez l'IA pour générer du contenu créatif adapté à chaque plateforme sociale avec
                        suggestions automatiques
                      </p>
                    </div>
                  </div>

                  {/* Dynamic Suggestions */}
                  {!selectedCategory ? (
                    <div className="w-full max-w-4xl">
                      <h4 className="text-lg font-semibold text-gray-900 mb-6 text-center">
                        Suggestions Rapides Générées Automatiquement
                      </h4>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {quickPrompts.map((prompt, index) => (
                          <Card
                            key={index}
                            className="cursor-pointer hover:shadow-lg transition-all hover:bg-purple-50/50 border-gray-200/50 hover:scale-105"
                            onClick={() => handleQuickPrompt(prompt.prompt)}
                          >
                            <CardContent className="p-4">
                              <div className="text-center space-y-3">
                                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mx-auto">
                                  <prompt.icon className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                  <div className="font-semibold text-sm text-gray-900 mb-1">{prompt.title}</div>
                                  <div className="text-xs text-gray-500 mb-2">{prompt.description}</div>
                                  <Badge variant="outline" className="text-xs">
                                    {prompt.category}
                                  </Badge>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="w-full max-w-4xl">
                      <h4 className="text-lg font-semibold text-gray-900 mb-6 text-center">
                        Cartes Cliquables {inspirationCategories.find((c) => c.id === selectedCategory)?.name}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {inspirationCategories
                          .find((c) => c.id === selectedCategory)
                          ?.suggestions.map((suggestion, index) => (
                            <Card
                              key={index}
                              className="cursor-pointer hover:shadow-lg transition-all hover:bg-purple-50/50 border-gray-200/50 hover:scale-105"
                              onClick={() => handleSuggestionClick(suggestion)}
                            >
                              <CardContent className="p-5">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="font-semibold text-gray-900 mb-2">{suggestion.title}</div>
                                    <div className="text-sm text-gray-600 mb-3">{suggestion.description}</div>
                                    <Badge variant="outline" className="text-xs">
                                      {suggestion.type}
                                    </Badge>
                                  </div>
                                  <ChevronRight className="w-5 h-5 text-gray-400 ml-2" />
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6 max-w-4xl mx-auto">
                  {chatHistory.map((message, index) => (
                    <div
                      key={index}
                      className={`flex gap-4 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {message.type === "ai" && (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-purple-600" />
                        </div>
                      )}
                      <div
                        className={`max-w-[75%] p-5 rounded-2xl shadow-sm ${
                          message.type === "user"
                            ? "bg-gradient-to-br from-purple-600 to-purple-700 text-white"
                            : "bg-white border border-gray-200"
                        }`}
                      >
                        <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
                        <div className="text-xs opacity-70 mt-3">
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                      {message.type === "user" && (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <Users className="w-5 h-5 text-gray-600" />
                        </div>
                      )}
                    </div>
                  ))}
                  {isGenerating && (
                    <div className="flex gap-4 justify-start">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-purple-600 animate-pulse" />
                      </div>
                      <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100"></div>
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-gray-200/30 bg-white/80">
              <div className="flex gap-4 max-w-4xl mx-auto">
                <div className="flex-1">
                  <Textarea
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Décrivez le contenu que vous souhaitez créer... (ex: 'Crée 10 posts LinkedIn sur l'entrepreneuriat avec hooks accrocheurs')"
                    className="min-h-[60px] resize-none border-gray-300 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 rounded-xl"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                  />
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!chatMessage.trim() || isGenerating}
                  className="h-[60px] px-8 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg rounded-xl"
                >
                  {isGenerating ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Générer
                    </>
                  )}
                </Button>
              </div>
              <div className="text-center mt-4">
                <div className="text-xs text-gray-500">
                  💡 Prompts pré-formatés pour lancement rapide • Adaptation contextuelle selon le type de contenu
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
