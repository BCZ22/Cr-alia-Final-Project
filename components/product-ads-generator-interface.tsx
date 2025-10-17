"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const adTemplates = [
  { id: "modern", name: "Moderne", style: "Minimaliste et élégant", color: "from-blue-500/20 to-blue-600/10" },
  { id: "dynamic", name: "Dynamique", style: "Énergique et coloré", color: "from-orange-500/20 to-orange-600/10" },
  { id: "luxury", name: "Luxe", style: "Premium et sophistiqué", color: "from-purple-500/20 to-purple-600/10" },
  { id: "playful", name: "Ludique", style: "Amusant et créatif", color: "from-pink-500/20 to-pink-600/10" },
  {
    id: "professional",
    name: "Professionnel",
    style: "Sérieux et corporate",
    color: "from-gray-500/20 to-gray-600/10",
  },
  { id: "eco", name: "Écologique", style: "Naturel et durable", color: "from-green-500/20 to-green-600/10" },
]

const platforms = [
  { id: "instagram", name: "Instagram", format: "1080x1080", icon: "📷" },
  { id: "facebook", name: "Facebook", format: "1200x628", icon: "👥" },
  { id: "tiktok", name: "TikTok", format: "1080x1920", icon: "🎵" },
  { id: "youtube", name: "YouTube", format: "1920x1080", icon: "▶️" },
  { id: "linkedin", name: "LinkedIn", format: "1200x627", icon: "💼" },
  { id: "twitter", name: "Twitter/X", format: "1200x675", icon: "🐦" },
]

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 6 6 18" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m6 6 12 12" />
  </svg>
)

const LinkIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
    />
  </svg>
)

const SparklesIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
    />
  </svg>
)

const DownloadIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} points="7 10 12 15 17 10" />
    <line strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} x1="12" y1="15" x2="12" y2="3" />
  </svg>
)

const RefreshIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    />
  </svg>
)

interface ProductAdsGeneratorInterfaceProps {
  isOpen: boolean
  onClose: () => void
}

export function ProductAdsGeneratorInterface({ isOpen, onClose }: ProductAdsGeneratorInterfaceProps) {
  const [productUrl, setProductUrl] = useState("")
  const [productName, setProductName] = useState("")
  const [productDescription, setProductDescription] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [hasGenerated, setHasGenerated] = useState(false)
  const [inputMethod, setInputMethod] = useState<"url" | "manual">("url")

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      setHasGenerated(true)
    }, 3000)
  }

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId) ? prev.filter((id) => id !== platformId) : [...prev, platformId],
    )
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
                  Générateur de publicités produit
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Créez des publicités professionnelles à partir d'une URL produit
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full hover:bg-secondary/80">
                <XIcon className="w-5 h-5" />
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
              {/* Left Panel - Input */}
              <div className="space-y-6">
                {/* Input Method Tabs */}
                <Tabs value={inputMethod} onValueChange={(v) => setInputMethod(v as "url" | "manual")}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="url">URL Produit</TabsTrigger>
                    <TabsTrigger value="manual">Saisie Manuelle</TabsTrigger>
                  </TabsList>

                  <TabsContent value="url" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">URL du produit</label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            placeholder="https://example.com/product"
                            value={productUrl}
                            onChange={(e) => setProductUrl(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                        <Button variant="outline">
                          <SparklesIcon className="w-4 h-4 mr-2" />
                          Analyser
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        L'IA extraira automatiquement les informations du produit
                      </p>
                    </div>

                    {/* Auto-extracted info preview */}
                    <div className="p-4 bg-secondary/20 rounded-xl space-y-3">
                      <h4 className="text-sm font-semibold">Informations extraites</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Nom du produit:</span>
                          <span className="font-medium">iPhone 15 Pro Max</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Prix:</span>
                          <span className="font-medium">1 229€</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Catégorie:</span>
                          <span className="font-medium">Smartphones</span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="manual" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nom du produit</label>
                      <Input
                        placeholder="Ex: iPhone 15 Pro Max"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Description du produit</label>
                      <Textarea
                        placeholder="Décrivez votre produit, ses caractéristiques principales et ses avantages..."
                        value={productDescription}
                        onChange={(e) => setProductDescription(e.target.value)}
                        rows={6}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Prix</label>
                        <Input placeholder="Ex: 1229€" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Catégorie</label>
                        <Input placeholder="Ex: Smartphones" />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Template Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Style de publicité</label>
                  <div className="grid grid-cols-2 gap-3">
                    {adTemplates.map((template) => (
                      <Card
                        key={template.id}
                        className={`cursor-pointer transition-all duration-200 ${
                          selectedTemplate === template.id
                            ? "border-primary bg-primary/5 shadow-md"
                            : "hover:border-primary/50 hover:bg-secondary/50"
                        }`}
                        onClick={() => setSelectedTemplate(template.id)}
                      >
                        <CardContent className="p-4">
                          <div
                            className={`w-full h-20 mb-3 rounded-lg bg-gradient-to-br ${template.color} flex items-center justify-center`}
                          >
                            <div className="text-2xl">✨</div>
                          </div>
                          <h4 className="font-medium text-sm mb-1">{template.name}</h4>
                          <p className="text-xs text-muted-foreground">{template.style}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Platform Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Plateformes cibles</label>
                  <div className="grid grid-cols-3 gap-2">
                    {platforms.map((platform) => (
                      <Button
                        key={platform.id}
                        variant={selectedPlatforms.includes(platform.id) ? "default" : "outline"}
                        size="sm"
                        onClick={() => togglePlatform(platform.id)}
                        className="h-auto py-3 flex flex-col items-center gap-1"
                      >
                        <span className="text-xl">{platform.icon}</span>
                        <span className="text-xs">{platform.name}</span>
                        <span className="text-[10px] opacity-70">{platform.format}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Generate Button */}
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleGenerate}
                  disabled={isGenerating || !selectedTemplate || selectedPlatforms.length === 0}
                >
                  {isGenerating ? (
                    <>
                      <RefreshIcon className="w-4 h-4 mr-2 animate-spin" />
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="w-4 h-4 mr-2" />
                      Générer les publicités
                    </>
                  )}
                </Button>
              </div>

              {/* Right Panel - Preview */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Aperçu des publicités</h3>
                  {hasGenerated && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                      {selectedPlatforms.length} publicités générées
                    </Badge>
                  )}
                </div>

                {!hasGenerated ? (
                  <div className="h-[600px] border-2 border-dashed border-border rounded-2xl flex items-center justify-center">
                    <div className="text-center p-8">
                      <SparklesIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                      <h4 className="text-lg font-medium mb-2">Vos publicités apparaîtront ici</h4>
                      <p className="text-muted-foreground text-sm">
                        Configurez votre produit et cliquez sur "Générer" pour créer vos publicités
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    {selectedPlatforms.map((platformId) => {
                      const platform = platforms.find((p) => p.id === platformId)
                      return (
                        <Card key={platformId} className="overflow-hidden">
                          <CardContent className="p-0">
                            {/* Ad Preview */}
                            <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                              <div className="text-center p-6">
                                <div className="text-4xl mb-4">{platform?.icon}</div>
                                <h4 className="text-xl font-bold mb-2">iPhone 15 Pro Max</h4>
                                <p className="text-sm text-muted-foreground mb-4">
                                  Le smartphone le plus puissant jamais créé
                                </p>
                                <Button size="sm">Acheter maintenant</Button>
                              </div>
                              <div className="absolute top-3 right-3">
                                <Badge variant="secondary">{platform?.name}</Badge>
                              </div>
                            </div>

                            {/* Ad Actions */}
                            <div className="p-4 bg-secondary/20 flex items-center justify-between">
                              <div className="text-sm">
                                <div className="font-medium">{platform?.name}</div>
                                <div className="text-muted-foreground text-xs">{platform?.format}</div>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  <RefreshIcon className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <DownloadIcon className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                )}

                {/* Bulk Actions */}
                {hasGenerated && (
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 bg-transparent">
                      <DownloadIcon className="w-4 h-4 mr-2" />
                      Tout télécharger
                    </Button>
                    <Button className="flex-1">Ajouter au projet</Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
