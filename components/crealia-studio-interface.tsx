"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TextToImageGenerator } from './text-to-image-generator'; // Import the new component

const studioFeatures = [
  {
    category: "Recommandé",
    features: [
      { name: "Texte en discours", url: "#", tag: "Nouveau" },
      { name: "Outil de modification de la voix", url: "#", tag: "Nouveau" },
      { name: "URL de produit en publicités", url: "#" },
      { name: "Supprimer l'arrière-plan", url: "#" },
      { name: "Vidéo longue en vidéos courtes", url: "#" },
      { name: "Générateur de Reels IA", url: "#" },
      { name: "Créateur d'Avatar IA", url: "#" },
      { name: "Sous-titres automatiques", url: "#" },
    ],
  },
  {
    category: "Vidéo",
    features: [
      { name: "Redimensionner la vidéo", url: "#" },
      { name: "Image en image", url: "#" },
      { name: "Améliorateur de vidéos", url: "#" },
      { name: "Générateur de Reels Instagram", url: "#" },
      { name: "Créateur de TikTok", url: "#" },
      { name: "YouTube Shorts", url: "#" },
      { name: "Stories animées", url: "#" },
      { name: "Montage automatique", url: "#" },
      { name: "Transitions IA", url: "#" },
      { name: "Effets visuels", url: "#" },
    ],
  },
  {
    category: "Image",
    features: [
      { name: "Texte en image", action: "text-to-image" },
      { name: "Améliorateur d'images", action: "enhance-image" },
      { name: "Supprimer l'arrière-plan", url: "#" },
      { name: "Générateur d'avatars", url: "#" },
      { name: "Images de couverture", url: "#" },
      { name: "Miniatures YouTube", url: "#" },
      { name: "Illustrations IA", url: "#" },
      { name: "Logos personnalisés", url: "#" },
      { name: "Bannières sociales", url: "#" },
      { name: "Memes générés", url: "#" },
    ],
  },
  {
    category: "Contenu Audio",
    features: [
      { name: "Voix Off IA", url: "#" },
      { name: "Sous-titres automatiques", url: "#" },
      { name: "Musique de fond", url: "#" },
      { name: "Effets sonores", url: "#" },
      { name: "Traduction vocale", url: "#" },
      { name: "Clonage de voix", url: "#" },
      { name: "Podcast IA", url: "#" },
      { name: "Narration automatique", url: "#" },
    ],
  },
]

export const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 6 6 18" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m6 6 12 12" />
  </svg>
)

export const StarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
)

export const VideoIcon = ({ className }: { className?: string }) => (
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

export const ImageIcon = ({ className }: { className?: string }) => (
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

export const AudioIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 18V5l12-2v13" />
    <circle strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} cx="6" cy="18" r="3" />
    <circle strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} cx="18" cy="16" r="3" />
  </svg>
)

interface CrealiaStudioInterfaceProps {
  isOpen: boolean
  onClose: () => void
}

export function CrealiaStudioInterface({ isOpen, onClose }: CrealiaStudioInterfaceProps) {
  const [selectedCategory, setSelectedCategory] = useState("Recommandé")
  const [activeTool, setActiveTool] = useState<string | null>(null);


  if (!isOpen) return null

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Recommandé":
        return StarIcon
      case "Vidéo":
        return VideoIcon
      case "Image":
        return ImageIcon
      case "Contenu Audio":
        return AudioIcon
      default:
        return StarIcon
    }
  }

  const selectedFeatures = studioFeatures.find((cat) => cat.category === selectedCategory)?.features || []

  const handleFeatureClick = (feature: { name: string; action?: string; url?: string }) => {
    if (feature.action) {
      setActiveTool(feature.action);
    } else if (feature.url) {
      window.open(feature.url, "_blank");
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm animate-fade-in">
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="w-full max-w-7xl bg-background rounded-3xl shadow-2xl animate-scale-up border border-border/50">
              <div className="flex items-center justify-between p-6 border-b border-border/50">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Créalia Studio
                  </h2>
                  <p className="text-muted-foreground text-sm mt-1">Votre studio de création IA tout-en-un</p>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full hover:bg-secondary/80">
                  <XIcon className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex h-[600px]">
                {/* Sidebar */}
                <div className="w-64 border-r border-border/50 p-4">
                  <div className="space-y-2">
                    {studioFeatures.map((category) => {
                      const IconComponent = getCategoryIcon(category.category)
                      return (
                        <button
                          key={category.category}
                          onClick={() => setSelectedCategory(category.category)}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                            selectedCategory === category.category
                              ? "bg-primary/10 text-primary border border-primary/20"
                              : "hover:bg-secondary/50 text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <IconComponent className="w-5 h-5" />
                          <span className="font-medium">{category.category}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Main Content */}
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
                    {selectedFeatures.map((feature, index) => (
                      <Card
                        key={index}
                        className="group cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] border-border/50 hover:border-primary/30"
                        onClick={() => handleFeatureClick(feature)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                                <div className="w-5 h-5 rounded bg-primary/60" />
                              </div>
                              <div>
                                <h4 className="font-medium text-sm group-hover:text-primary transition-colors">
                                  {feature.name}
                                </h4>
                              </div>
                            </div>
                            {feature.tag && (
                              <Badge
                                variant="secondary"
                                className="text-xs px-2 py-1 bg-green-100 text-green-700 border-green-200"
                              >
                                {feature.tag}
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>

              {/* Major Features Section */}
              <div className="border-t border-border/50 p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Fonctionnalités Majeures</h3>
                  <p className="text-muted-foreground text-sm">
                    Accès direct aux outils les plus puissants de Créalia Studio
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-primary/5 hover:border-primary/30 transition-all duration-200 bg-transparent"
                    onClick={() => console.log("Générateur de Reels IA")}
                  >
                    <VideoIcon className="w-6 h-6 text-primary" />
                    <span className="text-xs font-medium text-center">Générateur de Reels IA</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-primary/5 hover:border-primary/30 transition-all duration-200 bg-transparent"
                    onClick={() => console.log("Créateur d'Avatar IA")}
                  >
                    <ImageIcon className="w-6 h-6 text-primary" />
                    <span className="text-xs font-medium text-center">Créateur d'Avatar IA</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-primary/5 hover:border-primary/30 transition-all duration-200 bg-transparent"
                    onClick={() => console.log("Voix Off IA")}
                  >
                    <AudioIcon className="w-6 h-6 text-primary" />
                    <span className="text-xs font-medium text-center">Voix Off IA</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-primary/5 hover:border-primary/30 transition-all duration-200 bg-transparent"
                    onClick={() => console.log("Sous-titres automatiques")}
                  >
                    <VideoIcon className="w-6 h-6 text-primary" />
                    <span className="text-xs font-medium text-center">Sous-titres automatiques</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-primary/5 hover:border-primary/30 transition-all duration-200 bg-transparent"
                    onClick={() => console.log("Supprimer l'arrière-plan")}
                  >
                    <ImageIcon className="w-6 h-6 text-primary" />
                    <span className="text-xs font-medium text-center">Supprimer l'arrière-plan</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-primary/5 hover:border-primary/30 transition-all duration-200 bg-transparent"
                    onClick={() => console.log("Montage automatique")}
                  >
                    <VideoIcon className="w-6 h-6 text-primary" />
                    <span className="text-xs font-medium text-center">Montage automatique</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <TextToImageGenerator 
        isOpen={activeTool === 'text-to-image'}
        onClose={() => setActiveTool(null)}
      />
      {/* Other tool modals will go here, e.g., ImageEnhancer */}
    </>
  )
}
