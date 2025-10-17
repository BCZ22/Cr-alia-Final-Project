"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Sparkles, Package, FileText, Palette, Type, ImageIcon, CheckCircle2, Circle, X } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface LogoVariant {
  id: string
  name: string
  selected: boolean
}

interface BrandColor {
  name: string
  hex: string
  rgb: string
  cmyk: string
}

interface BrandFont {
  name: string
  category: string
  usage: string
}

interface CustomLogosInterfaceProps {
  isOpen: boolean
  onClose: () => void
}

export function CustomLogosInterface({ isOpen, onClose }: CustomLogosInterfaceProps) {
  const [companyName, setCompanyName] = useState("")
  const [tagline, setTagline] = useState("")
  const [industry, setIndustry] = useState("")
  const [variants, setVariants] = useState([4])
  const [generating, setGenerating] = useState(false)
  const [hasLogos, setHasLogos] = useState(false)
  const [logoVariants, setLogoVariants] = useState<LogoVariant[]>([])
  const [selectedVariants, setSelectedVariants] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<"logos" | "colors" | "fonts" | "guidelines">("logos")
  const [preferredShape, setPreferredShape] = useState("any")
  const [brandColors, setBrandColors] = useState<BrandColor[]>([])
  const [brandFonts, setBrandFonts] = useState<BrandFont[]>([])
  const [brandGuidelines, setBrandGuidelines] = useState("")
  const [exportFormats, setExportFormats] = useState({
    png: true,
    svg: true,
    pdf: true,
    eps: false,
  })
  const [exportSizes, setExportSizes] = useState({
    small: true,
    medium: true,
    large: true,
    social: true,
  })
  const [includeBrandKit, setIncludeBrandKit] = useState(true)
  const [includeStyleGuide, setIncludeStyleGuide] = useState(true)
  const [includeUsageExamples, setIncludeUsageExamples] = useState(true)

  if (!isOpen) return null

  const handleGenerate = () => {
    if (!companyName) return

    setGenerating(true)
    console.log("[v0] Generating logos:", { companyName, industry, variants: variants[0] })

    window.dispatchEvent(
      new CustomEvent("logos:generation-start", {
        detail: { companyName, tagline, industry, variants: variants[0] },
      }),
    )

    setTimeout(() => {
      setGenerating(false)
      setHasLogos(true)

      // Generate logo variants
      const newVariants: LogoVariant[] = Array.from({ length: variants[0] }, (_, i) => ({
        id: `logo-${i + 1}`,
        name: `Variante ${i + 1}`,
        selected: i === 0,
      }))
      setLogoVariants(newVariants)
      setSelectedVariants([newVariants[0].id])

      // Generate brand colors
      const colors: BrandColor[] = [
        { name: "Primaire", hex: "#3b82f6", rgb: "59, 130, 246", cmyk: "76, 47, 0, 4" },
        { name: "Secondaire", hex: "#8b5cf6", rgb: "139, 92, 246", cmyk: "43, 63, 0, 4" },
        { name: "Accent", hex: "#f59e0b", rgb: "245, 158, 11", cmyk: "0, 36, 96, 4" },
        { name: "Neutre", hex: "#64748b", rgb: "100, 116, 139", cmyk: "28, 17, 0, 45" },
      ]
      setBrandColors(colors)

      // Generate brand fonts
      const fonts: BrandFont[] = [
        { name: "Inter", category: "Sans-serif", usage: "Titres et en-têtes" },
        { name: "Roboto", category: "Sans-serif", usage: "Corps de texte" },
      ]
      setBrandFonts(fonts)

      setBrandGuidelines(
        `Guide de style pour ${companyName}\n\nUtilisation du logo:\n- Espace minimum autour du logo: 20px\n- Taille minimale: 32px de hauteur\n- Ne pas déformer ou modifier les proportions\n\nCouleurs:\n- Utiliser les couleurs primaires pour les éléments principaux\n- Les couleurs secondaires pour les accents\n\nTypographie:\n- Titres: ${fonts[0].name}\n- Corps: ${fonts[1].name}`,
      )

      window.dispatchEvent(
        new CustomEvent("logos:generation-complete", {
          detail: { success: true, variants: newVariants, colors, fonts },
        }),
      )
      console.log("[v0] Logos generated")
    }, 2500)
  }

  const handleToggleVariant = (id: string) => {
    setSelectedVariants((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]))
  }

  const handleExportBrandKit = () => {
    const exportData = {
      logos: selectedVariants,
      formats: Object.entries(exportFormats)
        .filter(([_, v]) => v)
        .map(([k]) => k),
      sizes: Object.entries(exportSizes)
        .filter(([_, v]) => v)
        .map(([k]) => k),
      includeBrandKit,
      includeStyleGuide,
      includeUsageExamples,
      colors: brandColors,
      fonts: brandFonts,
      guidelines: brandGuidelines,
    }

    console.log("[v0] Exporting brand kit:", exportData)
    window.dispatchEvent(new CustomEvent("logos:brand-kit-export", { detail: exportData }))
  }

  return (
    <div className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-md">
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Card className="w-full max-w-7xl h-[90vh] flex flex-col bg-background rounded-3xl shadow-2xl border border-border/50">
          <div className="flex items-center justify-between p-6 border-b border-border/50">
            <div>
              <h2 className="text-2xl font-bold">Logos Personnalisés</h2>
              <p className="text-sm text-muted-foreground mt-1">Créez des logos professionnels avec l'IA</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full">
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex-1 flex gap-4 overflow-hidden p-6">
            {/* Left Panel - Controls */}
            <div className="w-80 space-y-4 overflow-y-auto">
              <Card className="p-4 space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Logos Personnalisés</h3>
                  <p className="text-sm text-muted-foreground">Créez des logos professionnels avec l'IA</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Nom de l'entreprise</Label>
                  <Input
                    id="company"
                    placeholder="Votre entreprise"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tagline">Slogan (optionnel)</Label>
                  <Input
                    id="tagline"
                    placeholder="Votre slogan"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry">Secteur d'activité</Label>
                  <select
                    id="industry"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">Sélectionnez...</option>
                    <option value="tech">Technologie</option>
                    <option value="finance">Finance</option>
                    <option value="health">Santé</option>
                    <option value="education">Éducation</option>
                    <option value="retail">Commerce</option>
                    <option value="food">Alimentation</option>
                    <option value="creative">Créatif</option>
                    <option value="sports">Sport</option>
                    <option value="real-estate">Immobilier</option>
                    <option value="other">Autre</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="style-adj">Style souhaité</Label>
                  <Textarea id="style-adj" placeholder="Ex: moderne, minimaliste, élégant..." rows={3} />
                </div>

                <div className="space-y-2">
                  <Label>Nombre de variantes: {variants[0]}</Label>
                  <Slider value={variants} onValueChange={setVariants} min={1} max={8} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shape">Forme préférée</Label>
                  <select
                    id="shape"
                    value={preferredShape}
                    onChange={(e) => setPreferredShape(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="any">Toutes</option>
                    <option value="circle">Cercle</option>
                    <option value="square">Carré</option>
                    <option value="shield">Bouclier</option>
                    <option value="hexagon">Hexagone</option>
                    <option value="abstract">Abstrait</option>
                    <option value="lettermark">Monogramme</option>
                  </select>
                </div>

                <Button className="w-full" onClick={handleGenerate} disabled={!companyName || generating}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  {generating ? "Génération..." : "Générer des logos"}
                </Button>
              </Card>

              {hasLogos && (
                <Card className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Kit de marque</h3>
                    <Badge variant="secondary">{selectedVariants.length} logos</Badge>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Formats d'export</Label>
                      <div className="space-y-2">
                        {Object.entries(exportFormats).map(([format, checked]) => (
                          <div key={format} className="flex items-center space-x-2">
                            <Checkbox
                              id={`format-${format}`}
                              checked={checked}
                              onCheckedChange={(checked) =>
                                setExportFormats({ ...exportFormats, [format]: checked as boolean })
                              }
                            />
                            <Label htmlFor={`format-${format}`} className="text-sm font-normal cursor-pointer">
                              {format.toUpperCase()}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <Label className="text-sm font-medium mb-2 block">Tailles</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="size-small"
                            checked={exportSizes.small}
                            onCheckedChange={(checked) => setExportSizes({ ...exportSizes, small: checked as boolean })}
                          />
                          <Label htmlFor="size-small" className="text-sm font-normal cursor-pointer">
                            Petit (512px)
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="size-medium"
                            checked={exportSizes.medium}
                            onCheckedChange={(checked) =>
                              setExportSizes({ ...exportSizes, medium: checked as boolean })
                            }
                          />
                          <Label htmlFor="size-medium" className="text-sm font-normal cursor-pointer">
                            Moyen (1024px)
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="size-large"
                            checked={exportSizes.large}
                            onCheckedChange={(checked) => setExportSizes({ ...exportSizes, large: checked as boolean })}
                          />
                          <Label htmlFor="size-large" className="text-sm font-normal cursor-pointer">
                            Grand (2048px)
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="size-social"
                            checked={exportSizes.social}
                            onCheckedChange={(checked) =>
                              setExportSizes({ ...exportSizes, social: checked as boolean })
                            }
                          />
                          <Label htmlFor="size-social" className="text-sm font-normal cursor-pointer">
                            Réseaux sociaux (multiples)
                          </Label>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <Label className="text-sm font-medium mb-2 block">Inclure</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="include-brand-kit"
                            checked={includeBrandKit}
                            onCheckedChange={(checked) => setIncludeBrandKit(checked as boolean)}
                          />
                          <Label htmlFor="include-brand-kit" className="text-sm font-normal cursor-pointer">
                            Palette de couleurs
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="include-style-guide"
                            checked={includeStyleGuide}
                            onCheckedChange={(checked) => setIncludeStyleGuide(checked as boolean)}
                          />
                          <Label htmlFor="include-style-guide" className="text-sm font-normal cursor-pointer">
                            Guide de style
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="include-usage"
                            checked={includeUsageExamples}
                            onCheckedChange={(checked) => setIncludeUsageExamples(checked as boolean)}
                          />
                          <Label htmlFor="include-usage" className="text-sm font-normal cursor-pointer">
                            Exemples d'utilisation
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full" onClick={handleExportBrandKit} disabled={selectedVariants.length === 0}>
                    <Package className="w-4 h-4 mr-2" />
                    Télécharger le kit de marque
                  </Button>
                </Card>
              )}
            </div>

            {/* Right Panel - Preview and Brand Kit */}
            <div className="flex-1 flex flex-col gap-4 overflow-hidden">
              {hasLogos ? (
                <div className="flex-1 flex flex-col">
                  <div className="flex gap-2 border-b">
                    <button
                      onClick={() => setActiveTab("logos")}
                      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                        activeTab === "logos"
                          ? "border-b-2 border-primary text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <ImageIcon className="w-4 h-4" />
                      Logos
                    </button>
                    <button
                      onClick={() => setActiveTab("colors")}
                      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                        activeTab === "colors"
                          ? "border-b-2 border-primary text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Palette className="w-4 h-4" />
                      Couleurs
                    </button>
                    <button
                      onClick={() => setActiveTab("fonts")}
                      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                        activeTab === "fonts"
                          ? "border-b-2 border-primary text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Type className="w-4 h-4" />
                      Typographie
                    </button>
                    <button
                      onClick={() => setActiveTab("guidelines")}
                      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                        activeTab === "guidelines"
                          ? "border-b-2 border-primary text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <FileText className="w-4 h-4" />
                      Guide
                    </button>
                  </div>

                  {/* Logos Tab */}
                  {activeTab === "logos" && (
                    <div className="flex-1 overflow-y-auto mt-4 p-4">
                      <div className="grid grid-cols-2 gap-4">
                        {logoVariants.map((variant) => (
                          <Card
                            key={variant.id}
                            className={`p-8 flex flex-col items-center justify-center aspect-square cursor-pointer transition-all ${
                              selectedVariants.includes(variant.id) ? "border-primary border-2" : ""
                            }`}
                            onClick={() => handleToggleVariant(variant.id)}
                          >
                            <div className="flex-1 flex items-center justify-center text-center text-muted-foreground mb-4">
                              <div>
                                <Sparkles className="w-12 h-12 mx-auto mb-2 text-primary" />
                                <p className="text-sm font-medium">{companyName}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {selectedVariants.includes(variant.id) ? (
                                <CheckCircle2 className="w-5 h-5 text-primary" />
                              ) : (
                                <Circle className="w-5 h-5 text-muted-foreground" />
                              )}
                              <span className="text-sm font-medium">{variant.name}</span>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Colors Tab */}
                  {activeTab === "colors" && (
                    <div className="flex-1 overflow-y-auto mt-4 p-4">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold mb-4">Palette de couleurs</h3>
                          <div className="grid grid-cols-2 gap-4">
                            {brandColors.map((color) => (
                              <Card key={color.name} className="p-4">
                                <div className="w-full h-24 rounded-lg mb-3" style={{ backgroundColor: color.hex }} />
                                <div className="space-y-2">
                                  <p className="font-medium">{color.name}</p>
                                  <div className="text-xs space-y-1 text-muted-foreground">
                                    <p>HEX: {color.hex}</p>
                                    <p>RGB: {color.rgb}</p>
                                    <p>CMYK: {color.cmyk}</p>
                                  </div>
                                </div>
                              </Card>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Fonts Tab */}
                  {activeTab === "fonts" && (
                    <div className="flex-1 overflow-y-auto mt-4 p-4">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold mb-4">Typographie</h3>
                          <div className="space-y-4">
                            {brandFonts.map((font) => (
                              <Card key={font.name} className="p-6">
                                <div className="space-y-3">
                                  <div>
                                    <p className="text-3xl font-bold mb-2" style={{ fontFamily: font.name }}>
                                      {font.name}
                                    </p>
                                    <Badge variant="outline">{font.category}</Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground">{font.usage}</p>
                                  <div className="pt-3 border-t">
                                    <p className="text-lg" style={{ fontFamily: font.name }}>
                                      Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm
                                    </p>
                                    <p className="text-lg" style={{ fontFamily: font.name }}>
                                      Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz
                                    </p>
                                    <p className="text-lg" style={{ fontFamily: font.name }}>
                                      0 1 2 3 4 5 6 7 8 9
                                    </p>
                                  </div>
                                </div>
                              </Card>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Guidelines Tab */}
                  {activeTab === "guidelines" && (
                    <div className="flex-1 overflow-y-auto mt-4 p-4">
                      <Card className="p-6">
                        <h3 className="font-semibold mb-4">Guide de style</h3>
                        <div className="prose prose-sm max-w-none">
                          <pre className="whitespace-pre-wrap text-sm text-muted-foreground font-sans">
                            {brandGuidelines}
                          </pre>
                        </div>
                      </Card>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-muted/20 rounded-lg">
                  <div className="text-center text-muted-foreground">
                    <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">Générez des logos pour commencer</p>
                    <p className="text-sm mt-2">Votre kit de marque complet sera créé automatiquement</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
