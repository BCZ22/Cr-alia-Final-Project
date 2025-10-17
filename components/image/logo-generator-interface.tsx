"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NativeSelect, NativeSelectItem } from "@/components/ui/native-select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Sparkles, Download, RefreshCw, Grid3x3, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface LogoConfig {
  brandName: string
  industry: string
  style: string
  colorScheme: string
  includeIcon: boolean
  includeText: boolean
  complexity: number
}

interface ValidationError {
  field: string
  message: string
}

function validateLogoConfig(config: LogoConfig): ValidationError[] {
  const errors: ValidationError[] = []

  if (!config.brandName || config.brandName.trim().length === 0) {
    errors.push({ field: "brandName", message: "Le nom de marque est requis" })
  }

  if (config.brandName.length > 30) {
    errors.push({ field: "brandName", message: "Le nom de marque ne peut pas dépasser 30 caractères" })
  }

  if (!config.includeIcon && !config.includeText) {
    errors.push({ field: "general", message: "Le logo doit inclure au moins une icône ou du texte" })
  }

  if (config.complexity < 1 || config.complexity > 10) {
    errors.push({ field: "complexity", message: "La complexité doit être entre 1 et 10" })
  }

  return errors
}

export function LogoGeneratorInterface() {
  const [brandName, setBrandName] = useState("")
  const [industry, setIndustry] = useState("technology")
  const [style, setStyle] = useState("modern")
  const [colorScheme, setColorScheme] = useState("vibrant")
  const [includeIcon, setIncludeIcon] = useState(true)
  const [includeText, setIncludeText] = useState(true)
  const [complexity, setComplexity] = useState([5])
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])
  const [generating, setGenerating] = useState(false)
  const [variants, setVariants] = useState<any[]>([])

  const industries = [
    { id: "technology", name: "Technologie" },
    { id: "finance", name: "Finance" },
    { id: "health", name: "Santé" },
    { id: "education", name: "Éducation" },
    { id: "food", name: "Alimentation" },
    { id: "fashion", name: "Mode" },
    { id: "sports", name: "Sport" },
    { id: "entertainment", name: "Divertissement" },
    { id: "real-estate", name: "Immobilier" },
    { id: "automotive", name: "Automobile" },
  ]

  const styles = [
    { id: "modern", name: "Moderne", description: "Épuré et contemporain" },
    { id: "minimal", name: "Minimaliste", description: "Simple et élégant" },
    { id: "vintage", name: "Vintage", description: "Rétro et classique" },
    { id: "playful", name: "Ludique", description: "Amusant et créatif" },
    { id: "elegant", name: "Élégant", description: "Sophistiqué et raffiné" },
    { id: "bold", name: "Audacieux", description: "Fort et impactant" },
    { id: "geometric", name: "Géométrique", description: "Formes et lignes" },
    { id: "organic", name: "Organique", description: "Naturel et fluide" },
  ]

  const colorSchemes = [
    { id: "vibrant", name: "Vibrant", colors: ["#FF6B6B", "#4ECDC4", "#45B7D1"] },
    { id: "monochrome", name: "Monochrome", colors: ["#000000", "#FFFFFF", "#808080"] },
    { id: "pastel", name: "Pastel", colors: ["#FFB6C1", "#B0E0E6", "#DDA0DD"] },
    { id: "earth", name: "Terre", colors: ["#8B4513", "#D2691E", "#CD853F"] },
    { id: "ocean", name: "Océan", colors: ["#006994", "#0099CC", "#66CCFF"] },
    { id: "sunset", name: "Coucher de soleil", colors: ["#FF6B35", "#F7931E", "#FDC830"] },
    { id: "forest", name: "Forêt", colors: ["#2D5016", "#4A7C59", "#6B8E23"] },
  ]

  const handleGenerate = () => {
    const config: LogoConfig = {
      brandName,
      industry,
      style,
      colorScheme,
      includeIcon,
      includeText,
      complexity: complexity[0],
    }

    const errors = validateLogoConfig(config)
    setValidationErrors(errors)

    if (errors.length > 0) {
      console.log("[v0] Validation failed:", errors)
      return
    }

    setGenerating(true)
    console.log("[v0] Generating logo variants:", config)

    window.dispatchEvent(new CustomEvent("logo:generation-start", { detail: config }))

    setTimeout(() => {
      const newVariants = Array.from({ length: 6 }, (_, i) => ({
        id: `logo-${i}`,
        variant: i + 1,
        style: style,
        colorScheme: colorScheme,
      }))

      setVariants(newVariants)
      setGenerating(false)

      window.dispatchEvent(
        new CustomEvent("logo:generation-complete", {
          detail: { variants: newVariants, config },
        }),
      )
      console.log("[v0] Generated", newVariants.length, "logo variants")
    }, 3000)
  }

  const handleRegenerateVariant = (variantId: string) => {
    console.log("[v0] Regenerating variant:", variantId)
    window.dispatchEvent(
      new CustomEvent("logo:regenerate-variant", {
        detail: { variantId },
      }),
    )
  }

  const handleDownloadVariant = (variantId: string, format: string) => {
    console.log("[v0] Downloading variant:", variantId, "format:", format)
    window.dispatchEvent(
      new CustomEvent("logo:download-variant", {
        detail: { variantId, format },
      }),
    )
  }

  const handleExportAll = () => {
    if (variants.length === 0) return

    console.log("[v0] Exporting all logo variants")
    window.dispatchEvent(
      new CustomEvent("logo:export-all", {
        detail: { variants, formats: ["png", "svg", "pdf"] },
      }),
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* Left Panel - Controls */}
        <div className="w-80 space-y-4 overflow-y-auto">
          <Card className="p-4 space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Générateur de Logo</h3>
              <p className="text-sm text-muted-foreground">Créez des logos professionnels avec l'IA</p>
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

            <div className="space-y-2">
              <Label htmlFor="brand-name">Nom de la marque *</Label>
              <Input
                id="brand-name"
                placeholder="Votre marque"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className={validationErrors.some((e) => e.field === "brandName") ? "border-destructive" : ""}
              />
              <p className="text-xs text-muted-foreground">{brandName.length}/30 caractères</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Secteur d'activité</Label>
              <NativeSelect value={industry} onValueChange={setIndustry}>
                {industries.map((ind) => (
                  <NativeSelectItem key={ind.id} value={ind.id}>
                    {ind.name}
                  </NativeSelectItem>
                ))}
              </NativeSelect>
            </div>

            <div className="space-y-2">
              <Label htmlFor="style">Style</Label>
              <NativeSelect value={style} onValueChange={setStyle}>
                {styles.map((s) => (
                  <NativeSelectItem key={s.id} value={s.id}>
                    <div>
                      <div className="font-medium">{s.name}</div>
                      <div className="text-xs text-muted-foreground">{s.description}</div>
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
                          <div key={idx} className="w-4 h-4 rounded" style={{ backgroundColor: color }} />
                        ))}
                      </div>
                      <span>{scheme.name}</span>
                    </div>
                  </NativeSelectItem>
                ))}
              </NativeSelect>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="include-icon">Inclure une icône</Label>
                <Switch id="include-icon" checked={includeIcon} onCheckedChange={setIncludeIcon} />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="include-text">Inclure du texte</Label>
                <Switch id="include-text" checked={includeText} onCheckedChange={setIncludeText} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Complexité: {complexity[0]}/10</Label>
              <Slider value={complexity} onValueChange={setComplexity} min={1} max={10} />
              <p className="text-xs text-muted-foreground">
                {complexity[0] <= 3 ? "Simple" : complexity[0] <= 7 ? "Modéré" : "Complexe"}
              </p>
            </div>

            <Button className="w-full" onClick={handleGenerate} disabled={!brandName || generating}>
              <Sparkles className="w-4 h-4 mr-2" />
              {generating ? "Génération en cours..." : "Générer des logos"}
            </Button>

            {variants.length > 0 && (
              <Button className="w-full bg-transparent" variant="outline" onClick={handleExportAll}>
                <Download className="w-4 h-4 mr-2" />
                Exporter tout (PNG, SVG, PDF)
              </Button>
            )}
          </Card>
        </div>

        {/* Right Panel - Variants Grid */}
        <div className="flex-1 overflow-y-auto">
          {variants.length === 0 ? (
            <div className="h-full flex items-center justify-center bg-muted/20 rounded-lg">
              <div className="text-center text-muted-foreground p-8">
                <Grid3x3 className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium">Vos logos apparaîtront ici</p>
                <p className="text-sm mt-2">Configurez votre marque et générez des variantes</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 p-4">
              {variants.map((variant) => (
                <Card key={variant.id} className="p-4 space-y-3">
                  <div className="aspect-square bg-muted/20 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-bold mb-2">{brandName.charAt(0)}</div>
                      {includeText && <div className="text-lg font-semibold">{brandName}</div>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => handleRegenerateVariant(variant.id)}
                    >
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Régénérer
                    </Button>
                    <NativeSelect onValueChange={(format) => handleDownloadVariant(variant.id, format)}>
                      <NativeSelectItem value="png">PNG</NativeSelectItem>
                      <NativeSelectItem value="svg">SVG</NativeSelectItem>
                      <NativeSelectItem value="pdf">PDF</NativeSelectItem>
                    </NativeSelect>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
