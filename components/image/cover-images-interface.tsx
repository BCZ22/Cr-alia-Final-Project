"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NativeSelect, NativeSelectItem } from "@/components/ui/native-select"
import { NativeTabs, NativeTabsList, NativeTabsTrigger, NativeTabsContent } from "@/components/ui/native-tabs"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import {
  Sparkles,
  Upload,
  Download,
  AlertCircle,
  Layout,
  Wand2,
  Grid3x3,
  CheckCircle2,
  ImageIcon,
  Type,
  Palette,
  X,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"

interface CoverImageConfig {
  title: string
  subtitle: string
  template: string
  platform: string
  autoLayout: boolean
  layoutStyle: string
  colorScheme: string
  mainImage?: File
  logo?: File
}

interface ValidationError {
  field: string
  message: string
}

interface LayoutVariant {
  id: string
  name: string
  description: string
  selected: boolean
}

function validateCoverConfig(config: CoverImageConfig): ValidationError[] {
  const errors: ValidationError[] = []

  if (!config.title || config.title.trim().length === 0) {
    errors.push({ field: "title", message: "Le titre est requis" })
  }

  if (config.title.length > 100) {
    errors.push({ field: "title", message: "Le titre ne peut pas dépasser 100 caractères" })
  }

  if (config.subtitle.length > 200) {
    errors.push({ field: "subtitle", message: "Le sous-titre ne peut pas dépasser 200 caractères" })
  }

  return errors
}

interface CoverImagesInterfaceProps {
  isOpen: boolean
  onClose: () => void
}

export function CoverImagesInterface({ isOpen, onClose }: CoverImagesInterfaceProps) {
  const [title, setTitle] = useState("")
  const [subtitle, setSubtitle] = useState("")
  const [template, setTemplate] = useState("modern")
  const [platform, setPlatform] = useState("twitter")
  const [autoLayout, setAutoLayout] = useState(true)
  const [layoutStyle, setLayoutStyle] = useState("balanced")
  const [colorScheme, setColorScheme] = useState("vibrant")
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])
  const [generating, setGenerating] = useState(false)
  const [hasMainImage, setHasMainImage] = useState(false)
  const [hasLogo, setHasLogo] = useState(false)
  const [layoutVariants, setLayoutVariants] = useState<LayoutVariant[]>([])
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null)
  const [textAlignment, setTextAlignment] = useState("center")
  const [imageOpacity, setImageOpacity] = useState([80])

  if (!isOpen) return null

  const templates = [
    { id: "modern", name: "Moderne", description: "Design épuré et contemporain" },
    { id: "minimal", name: "Minimaliste", description: "Simplicité et élégance" },
    { id: "bold", name: "Audacieux", description: "Couleurs vives et contrastes forts" },
    { id: "professional", name: "Professionnel", description: "Sobre et corporate" },
    { id: "creative", name: "Créatif", description: "Artistique et original" },
    { id: "elegant", name: "Élégant", description: "Raffiné et sophistiqué" },
  ]

  const platforms = [
    { id: "twitter", name: "Twitter", dimensions: "1200x675", ratio: "16:9" },
    { id: "linkedin", name: "LinkedIn", dimensions: "1200x627", ratio: "1.91:1" },
    { id: "facebook", name: "Facebook", dimensions: "1200x630", ratio: "1.91:1" },
    { id: "youtube", name: "YouTube", dimensions: "2560x1440", ratio: "16:9" },
    { id: "instagram", name: "Instagram", dimensions: "1080x1080", ratio: "1:1" },
    { id: "pinterest", name: "Pinterest", dimensions: "1000x1500", ratio: "2:3" },
  ]

  const layoutStyles = [
    { id: "balanced", name: "Équilibré", description: "Texte et image harmonieux" },
    { id: "text-focused", name: "Texte dominant", description: "Mise en avant du texte" },
    { id: "image-focused", name: "Image dominante", description: "Mise en avant de l'image" },
    { id: "split", name: "Divisé", description: "Séparation nette texte/image" },
    { id: "overlay", name: "Superposition", description: "Texte sur l'image" },
  ]

  const colorSchemes = [
    { id: "vibrant", name: "Vibrant", colors: ["#3b82f6", "#8b5cf6", "#ec4899"] },
    { id: "professional", name: "Professionnel", colors: ["#1e40af", "#64748b", "#0f172a"] },
    { id: "warm", name: "Chaleureux", colors: ["#f59e0b", "#ef4444", "#dc2626"] },
    { id: "cool", name: "Frais", colors: ["#06b6d4", "#0ea5e9", "#3b82f6"] },
    { id: "nature", name: "Nature", colors: ["#10b981", "#059669", "#047857"] },
    { id: "monochrome", name: "Monochrome", colors: ["#000000", "#64748b", "#ffffff"] },
  ]

  const handleGenerateVariants = () => {
    const config: CoverImageConfig = {
      title,
      subtitle,
      template,
      platform,
      autoLayout,
      layoutStyle,
      colorScheme,
    }

    const errors = validateCoverConfig(config)
    setValidationErrors(errors)

    if (errors.length > 0) {
      console.log("[v0] Validation failed:", errors)
      return
    }

    setGenerating(true)
    console.log("[v0] Generating cover variants with auto-layout:", config)

    window.dispatchEvent(new CustomEvent("cover-images:generation-start", { detail: config }))

    setTimeout(() => {
      const variants: LayoutVariant[] = [
        {
          id: "variant-1",
          name: "Mise en page 1",
          description: "Texte centré avec image de fond",
          selected: true,
        },
        {
          id: "variant-2",
          name: "Mise en page 2",
          description: "Texte à gauche, image à droite",
          selected: false,
        },
        {
          id: "variant-3",
          name: "Mise en page 3",
          description: "Texte en haut, image en bas",
          selected: false,
        },
        {
          id: "variant-4",
          name: "Mise en page 4",
          description: "Superposition avec gradient",
          selected: false,
        },
        {
          id: "variant-5",
          name: "Mise en page 5",
          description: "Grille asymétrique",
          selected: false,
        },
        {
          id: "variant-6",
          name: "Mise en page 6",
          description: "Cadre avec bordure",
          selected: false,
        },
      ]

      setLayoutVariants(variants)
      setSelectedVariant(variants[0].id)
      setGenerating(false)

      window.dispatchEvent(
        new CustomEvent("cover-images:generation-complete", {
          detail: { variants, config },
        }),
      )
      console.log("[v0] Generated", variants.length, "layout variants")
    }, 2500)
  }

  const handleSelectVariant = (variantId: string) => {
    setSelectedVariant(variantId)
    setLayoutVariants((prev) => prev.map((v) => ({ ...v, selected: v.id === variantId })))
    console.log("[v0] Selected layout variant:", variantId)
  }

  const handleAutoOptimize = () => {
    console.log("[v0] Auto-optimizing layout for platform:", platform)
    window.dispatchEvent(
      new CustomEvent("cover-images:auto-optimize", {
        detail: { platform, title, subtitle },
      }),
    )

    setTimeout(() => {
      const optimizations = {
        textAlignment: "left",
        imageOpacity: 75,
        layoutStyle: "balanced",
      }

      setTextAlignment(optimizations.textAlignment)
      setImageOpacity([optimizations.imageOpacity])
      setLayoutStyle(optimizations.layoutStyle)

      console.log("[v0] Auto-optimization applied:", optimizations)
    }, 1000)
  }

  const handleExportForPlatform = (platformId: string) => {
    const platformData = platforms.find((p) => p.id === platformId)
    console.log("[v0] Exporting for platform:", platformData)

    window.dispatchEvent(
      new CustomEvent("cover-images:export", {
        detail: { platform: platformId, dimensions: platformData?.dimensions, variant: selectedVariant },
      }),
    )
  }

  const handleExportAll = () => {
    console.log("[v0] Exporting for all platforms")
    window.dispatchEvent(
      new CustomEvent("cover-images:export-all", {
        detail: { platforms, variant: selectedVariant, config: { title, subtitle, template } },
      }),
    )
  }

  const handleImageUpload = (type: "main" | "logo") => {
    if (type === "main") {
      setHasMainImage(true)
      console.log("[v0] Main image uploaded")
      window.dispatchEvent(new CustomEvent("cover-images:main-image-uploaded"))
    } else {
      setHasLogo(true)
      console.log("[v0] Logo uploaded")
      window.dispatchEvent(new CustomEvent("cover-images:logo-uploaded"))
    }
  }

  const selectedPlatform = platforms.find((p) => p.id === platform)
  const selectedColorScheme = colorSchemes.find((c) => c.id === colorScheme)

  return (
    <div className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-md">
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="w-full max-w-7xl bg-background rounded-3xl shadow-2xl border border-border/50">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/50">
              <div>
                <h2 className="text-2xl font-bold">Images de Couverture</h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Créez des images de couverture avec mise en page automatique
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full">
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="h-[600px]">
              <div className="flex h-full gap-4 p-6 overflow-hidden">
                {/* Left Panel - Controls */}
                <div className="w-80 space-y-4 overflow-y-auto">
                  <Card className="p-4 space-y-4">
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

                    <div className="space-y-2">
                      <Label htmlFor="platform">Plateforme cible</Label>
                      <NativeSelect value={platform} onValueChange={setPlatform}>
                        {platforms.map((p) => (
                          <NativeSelectItem key={p.id} value={p.id}>
                            <div className="flex items-center justify-between w-full">
                              <span>{p.name}</span>
                              <Badge variant="outline" className="ml-2 text-xs">
                                {p.ratio}
                              </Badge>
                            </div>
                          </NativeSelectItem>
                        ))}
                      </NativeSelect>
                      {selectedPlatform && (
                        <p className="text-xs text-muted-foreground">Dimensions: {selectedPlatform.dimensions}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="template">Style de design</Label>
                      <NativeSelect value={template} onValueChange={setTemplate}>
                        {templates.map((t) => (
                          <NativeSelectItem key={t.id} value={t.id}>
                            <div>
                              <div className="font-medium">{t.name}</div>
                              <div className="text-xs text-muted-foreground">{t.description}</div>
                            </div>
                          </NativeSelectItem>
                        ))}
                      </NativeSelect>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label htmlFor="title">Titre *</Label>
                      <Input
                        id="title"
                        placeholder="Votre titre principal"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={validationErrors.some((e) => e.field === "title") ? "border-destructive" : ""}
                      />
                      <p className="text-xs text-muted-foreground">{title.length}/100 caractères</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subtitle">Sous-titre</Label>
                      <Input
                        id="subtitle"
                        placeholder="Votre sous-titre"
                        value={subtitle}
                        onChange={(e) => setSubtitle(e.target.value)}
                        className={validationErrors.some((e) => e.field === "subtitle") ? "border-destructive" : ""}
                      />
                      <p className="text-xs text-muted-foreground">{subtitle.length}/200 caractères</p>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label>Image principale</Label>
                      <Button
                        variant="outline"
                        className="w-full bg-transparent"
                        onClick={() => handleImageUpload("main")}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {hasMainImage ? "Changer l'image" : "Importer une image"}
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label>Logo / Branding</Label>
                      <Button
                        variant="outline"
                        className="w-full bg-transparent"
                        onClick={() => handleImageUpload("logo")}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {hasLogo ? "Changer le logo" : "Importer un logo"}
                      </Button>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="auto-layout">Mise en page automatique</Label>
                        <p className="text-xs text-muted-foreground">IA optimise la disposition</p>
                      </div>
                      <Switch id="auto-layout" checked={autoLayout} onCheckedChange={setAutoLayout} />
                    </div>

                    {autoLayout && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="layout-style">Style de mise en page</Label>
                          <NativeSelect value={layoutStyle} onValueChange={setLayoutStyle}>
                            {layoutStyles.map((style) => (
                              <NativeSelectItem key={style.id} value={style.id}>
                                <div>
                                  <div className="font-medium">{style.name}</div>
                                  <div className="text-xs text-muted-foreground">{style.description}</div>
                                </div>
                              </NativeSelectItem>
                            ))}
                          </NativeSelect>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="color-scheme">Palette de couleurs</Label>
                          <NativeSelect value={colorScheme} onValueChange={setColorScheme}>
                            {colorSchemes.map((scheme) => (
                              <NativeSelectItem key={scheme.id} value={scheme.id}>
                                <div className="flex items-center gap-2">
                                  <div className="flex gap-1">
                                    {scheme.colors.map((color, idx) => (
                                      <div
                                        key={idx}
                                        className="w-4 h-4 rounded-full border"
                                        style={{ backgroundColor: color }}
                                      />
                                    ))}
                                  </div>
                                  <span>{scheme.name}</span>
                                </div>
                              </NativeSelectItem>
                            ))}
                          </NativeSelect>
                        </div>

                        <Button
                          className="w-full bg-transparent"
                          variant="outline"
                          onClick={handleAutoOptimize}
                          disabled={!title}
                        >
                          <Wand2 className="w-4 h-4 mr-2" />
                          Optimiser automatiquement
                        </Button>

                        <Button className="w-full" onClick={handleGenerateVariants} disabled={generating || !title}>
                          <Sparkles className="w-4 h-4 mr-2" />
                          {generating ? "Génération..." : "Générer des variantes"}
                        </Button>
                      </>
                    )}
                  </Card>

                  {layoutVariants.length > 0 && (
                    <Card className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Export</h3>
                        <Badge variant="secondary">{layoutVariants.length} variantes</Badge>
                      </div>

                      <div className="space-y-2">
                        <Label>Exporter pour une plateforme</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {platforms.slice(0, 4).map((p) => (
                            <Button
                              key={p.id}
                              variant="outline"
                              size="sm"
                              onClick={() => handleExportForPlatform(p.id)}
                              disabled={!title || !selectedVariant}
                              className="bg-transparent"
                            >
                              {p.name}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <Button className="w-full" onClick={handleExportAll} disabled={!title || !selectedVariant}>
                        <Download className="w-4 h-4 mr-2" />
                        Exporter toutes les plateformes
                      </Button>
                    </Card>
                  )}
                </div>

                {/* Right Panel - Preview and Variants */}
                <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                  {layoutVariants.length > 0 ? (
                    <NativeTabs defaultValue="preview" className="flex-1 flex flex-col">
                      <NativeTabsList>
                        <NativeTabsTrigger value="preview">
                          <ImageIcon className="w-4 h-4 mr-2" />
                          Aperçu
                        </NativeTabsTrigger>
                        <NativeTabsTrigger value="variants">
                          <Grid3x3 className="w-4 h-4 mr-2" />
                          Variantes ({layoutVariants.length})
                        </NativeTabsTrigger>
                        <NativeTabsTrigger value="customize">
                          <Layout className="w-4 h-4 mr-2" />
                          Personnaliser
                        </NativeTabsTrigger>
                      </NativeTabsList>

                      {/* Preview Tab */}
                      <NativeTabsContent value="preview" className="flex-1 flex flex-col gap-4 mt-4">
                        <Card className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                              <span className="text-sm font-medium">
                                {layoutVariants.find((v) => v.id === selectedVariant)?.name ||
                                  "Aucune variante sélectionnée"}
                              </span>
                            </div>
                            <Badge variant="outline">{selectedPlatform?.dimensions}</Badge>
                          </div>
                        </Card>

                        <div className="flex-1 flex items-center justify-center bg-muted/20 rounded-lg p-8">
                          <Card
                            className="w-full max-w-4xl flex items-center justify-center relative overflow-hidden"
                            style={{
                              aspectRatio: selectedPlatform?.ratio.replace(":", "/") || "16/9",
                              background: `linear-gradient(135deg, ${selectedColorScheme?.colors[0]} 0%, ${selectedColorScheme?.colors[1]} 100%)`,
                            }}
                          >
                            <div
                              className="absolute inset-0 bg-black"
                              style={{ opacity: (100 - imageOpacity[0]) / 100 }}
                            />
                            <div
                              className="relative z-10 text-center text-white p-8"
                              style={{ textAlign: textAlignment as any }}
                            >
                              {hasLogo && (
                                <div className="mb-4">
                                  <Badge variant="secondary">Logo</Badge>
                                </div>
                              )}
                              {title && <h2 className="text-4xl font-bold mb-4">{title}</h2>}
                              {subtitle && <p className="text-xl opacity-90">{subtitle}</p>}
                              {hasMainImage && (
                                <div className="mt-4">
                                  <Badge variant="outline">Image principale</Badge>
                                </div>
                              )}
                            </div>
                          </Card>
                        </div>
                      </NativeTabsContent>

                      {/* Variants Tab */}
                      <NativeTabsContent value="variants" className="flex-1 overflow-y-auto mt-4">
                        <div className="grid grid-cols-2 gap-4">
                          {layoutVariants.map((variant) => (
                            <Card
                              key={variant.id}
                              className={`p-4 cursor-pointer transition-all ${
                                selectedVariant === variant.id ? "border-primary border-2" : ""
                              }`}
                              onClick={() => handleSelectVariant(variant.id)}
                            >
                              <div className="w-full aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg mb-3 flex items-center justify-center">
                                <Layout className="w-8 h-8 text-muted-foreground" />
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                  <p className="font-medium text-sm">{variant.name}</p>
                                  {selectedVariant === variant.id && <CheckCircle2 className="w-4 h-4 text-primary" />}
                                </div>
                                <p className="text-xs text-muted-foreground">{variant.description}</p>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </NativeTabsContent>

                      {/* Customize Tab */}
                      <NativeTabsContent value="customize" className="flex-1 overflow-y-auto mt-4">
                        <div className="space-y-4">
                          <Card className="p-4 space-y-4">
                            <div className="flex items-center gap-2">
                              <Type className="w-4 h-4" />
                              <h3 className="font-semibold">Texte</h3>
                            </div>

                            <div className="space-y-2">
                              <Label>Alignement du texte</Label>
                              <div className="grid grid-cols-3 gap-2">
                                {["left", "center", "right"].map((align) => (
                                  <Button
                                    key={align}
                                    variant={textAlignment === align ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setTextAlignment(align)}
                                    className={textAlignment !== align ? "bg-transparent" : ""}
                                  >
                                    {align === "left" && "Gauche"}
                                    {align === "center" && "Centre"}
                                    {align === "right" && "Droite"}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          </Card>

                          <Card className="p-4 space-y-4">
                            <div className="flex items-center gap-2">
                              <ImageIcon className="w-4 h-4" />
                              <h3 className="font-semibold">Image</h3>
                            </div>

                            <div className="space-y-2">
                              <Label>Opacité de l'image: {imageOpacity[0]}%</Label>
                              <Slider value={imageOpacity} onValueChange={setImageOpacity} min={0} max={100} />
                            </div>
                          </Card>

                          <Card className="p-4 space-y-4">
                            <div className="flex items-center gap-2">
                              <Palette className="w-4 h-4" />
                              <h3 className="font-semibold">Couleurs</h3>
                            </div>

                            <div className="space-y-2">
                              <Label>Palette actuelle: {selectedColorScheme?.name}</Label>
                              <div className="flex gap-2">
                                {selectedColorScheme?.colors.map((color, idx) => (
                                  <div
                                    key={idx}
                                    className="w-12 h-12 rounded-lg border-2"
                                    style={{ backgroundColor: color }}
                                  />
                                ))}
                              </div>
                            </div>
                          </Card>
                        </div>
                      </NativeTabsContent>
                    </NativeTabs>
                  ) : (
                    <div className="flex-1 flex items-center justify-center bg-muted/20 rounded-lg">
                      <div className="text-center text-muted-foreground max-w-md">
                        <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium mb-2">Générez des variantes de mise en page</p>
                        <p className="text-sm">
                          Activez la mise en page automatique et générez plusieurs variantes optimisées pour votre
                          contenu
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
