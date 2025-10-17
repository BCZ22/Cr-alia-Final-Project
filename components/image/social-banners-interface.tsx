"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NativeSelect, NativeSelectItem } from "@/components/ui/native-select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Download, Upload, Sparkles, AlertCircle, CheckCircle2, Maximize2, Package, X } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"

interface BannerConfig {
  platform: string
  title: string
  subtitle: string
  textColor: string
  overlayOpacity: number
  hasBackgroundImage: boolean
  hasLogo: boolean
}

interface ValidationError {
  field: string
  message: string
}

interface PlatformExport {
  id: string
  name: string
  size: string
  width: number
  height: number
  selected: boolean
  status: "pending" | "generating" | "complete"
}

function validateBannerConfig(config: BannerConfig): ValidationError[] {
  const errors: ValidationError[] = []

  if (!config.title || config.title.trim().length === 0) {
    errors.push({ field: "title", message: "Le titre est requis" })
  }

  if (config.title.length > 80) {
    errors.push({ field: "title", message: "Le titre ne peut pas dépasser 80 caractères" })
  }

  if (config.subtitle.length > 150) {
    errors.push({ field: "subtitle", message: "Le sous-titre ne peut pas dépasser 150 caractères" })
  }

  if (config.overlayOpacity < 0 || config.overlayOpacity > 100) {
    errors.push({ field: "overlayOpacity", message: "L'opacité doit être entre 0 et 100" })
  }

  return errors
}

interface SocialBannersInterfaceProps {
  isOpen: boolean
  onClose: () => void
}

export function SocialBannersInterface({ isOpen, onClose }: SocialBannersInterfaceProps) {
  const [platform, setPlatform] = useState("facebook")
  const [title, setTitle] = useState("")
  const [subtitle, setSubtitle] = useState("")
  const [textColor, setTextColor] = useState("#FFFFFF")
  const [overlayOpacity, setOverlayOpacity] = useState([50])
  const [hasBackgroundImage, setHasBackgroundImage] = useState(false)
  const [hasLogo, setHasLogo] = useState(false)
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])
  const [generating, setGenerating] = useState(false)
  const [exporting, setExporting] = useState(false)

  const [platformExports, setPlatformExports] = useState<PlatformExport[]>([
    {
      id: "facebook-cover",
      name: "Facebook Couverture",
      size: "820x312",
      width: 820,
      height: 312,
      selected: true,
      status: "pending",
    },
    {
      id: "facebook-post",
      name: "Facebook Post",
      size: "1200x630",
      width: 1200,
      height: 630,
      selected: true,
      status: "pending",
    },
    {
      id: "twitter-header",
      name: "Twitter/X En-tête",
      size: "1500x500",
      width: 1500,
      height: 500,
      selected: true,
      status: "pending",
    },
    {
      id: "twitter-post",
      name: "Twitter/X Post",
      size: "1200x675",
      width: 1200,
      height: 675,
      selected: false,
      status: "pending",
    },
    {
      id: "linkedin-cover",
      name: "LinkedIn Couverture",
      size: "1584x396",
      width: 1584,
      height: 396,
      selected: true,
      status: "pending",
    },
    {
      id: "linkedin-post",
      name: "LinkedIn Post",
      size: "1200x627",
      width: 1200,
      height: 627,
      selected: false,
      status: "pending",
    },
    {
      id: "youtube-banner",
      name: "YouTube Bannière",
      size: "2560x1440",
      width: 2560,
      height: 1440,
      selected: true,
      status: "pending",
    },
    {
      id: "youtube-thumbnail",
      name: "YouTube Miniature",
      size: "1280x720",
      width: 1280,
      height: 720,
      selected: false,
      status: "pending",
    },
    {
      id: "instagram-post",
      name: "Instagram Post",
      size: "1080x1080",
      width: 1080,
      height: 1080,
      selected: false,
      status: "pending",
    },
    {
      id: "instagram-story",
      name: "Instagram Story",
      size: "1080x1920",
      width: 1080,
      height: 1920,
      selected: false,
      status: "pending",
    },
    {
      id: "pinterest-pin",
      name: "Pinterest Pin",
      size: "1000x1500",
      width: 1000,
      height: 1500,
      selected: false,
      status: "pending",
    },
    {
      id: "tiktok-video",
      name: "TikTok Couverture",
      size: "1080x1920",
      width: 1080,
      height: 1920,
      selected: false,
      status: "pending",
    },
  ])

  const platforms = [
    { id: "facebook", name: "Facebook", size: "820x312" },
    { id: "twitter", name: "Twitter/X", size: "1500x500" },
    { id: "linkedin", name: "LinkedIn", size: "1584x396" },
    { id: "youtube", name: "YouTube", size: "2560x1440" },
    { id: "instagram", name: "Instagram", size: "1080x1080" },
  ]

  const handleImageUpload = (type: "background" | "logo") => {
    if (type === "background") {
      setHasBackgroundImage(true)
      console.log("[v0] Background image uploaded")
      window.dispatchEvent(new CustomEvent("social-banner:background-uploaded"))
    } else {
      setHasLogo(true)
      console.log("[v0] Logo uploaded")
      window.dispatchEvent(new CustomEvent("social-banner:logo-uploaded"))
    }
  }

  const handleAutoResize = (targetPlatform: string) => {
    const platformData = platforms.find((p) => p.id === targetPlatform)
    console.log("[v0] Auto-resizing for platform:", platformData)

    window.dispatchEvent(
      new CustomEvent("social-banner:auto-resize", {
        detail: { platform: targetPlatform, dimensions: platformData?.size },
      }),
    )
  }

  const handleTogglePlatform = (id: string) => {
    setPlatformExports((prev) => prev.map((p) => (p.id === id ? { ...p, selected: !p.selected } : p)))
  }

  const handleSelectAll = () => {
    setPlatformExports((prev) => prev.map((p) => ({ ...p, selected: true })))
  }

  const handleDeselectAll = () => {
    setPlatformExports((prev) => prev.map((p) => ({ ...p, selected: false })))
  }

  const handleExportSelected = () => {
    const config: BannerConfig = {
      platform,
      title,
      subtitle,
      textColor,
      overlayOpacity: overlayOpacity[0],
      hasBackgroundImage,
      hasLogo,
    }

    const errors = validateBannerConfig(config)
    setValidationErrors(errors)

    if (errors.length > 0) {
      console.log("[v0] Validation failed:", errors)
      return
    }

    const selectedPlatforms = platformExports.filter((p) => p.selected)
    if (selectedPlatforms.length === 0) {
      setValidationErrors([{ field: "platforms", message: "Sélectionnez au moins une plateforme" }])
      return
    }

    setExporting(true)
    console.log("[v0] Exporting selected banners:", selectedPlatforms.length)

    window.dispatchEvent(
      new CustomEvent("social-banner:export-start", {
        detail: { platforms: selectedPlatforms, config },
      }),
    )

    // Simulate export process for each platform
    selectedPlatforms.forEach((platform, index) => {
      setTimeout(() => {
        setPlatformExports((prev) =>
          prev.map((p) => (p.id === platform.id ? { ...p, status: "generating" as const } : p)),
        )

        setTimeout(() => {
          setPlatformExports((prev) =>
            prev.map((p) => (p.id === platform.id ? { ...p, status: "complete" as const } : p)),
          )

          if (index === selectedPlatforms.length - 1) {
            setExporting(false)
            console.log("[v0] Export complete for all platforms")
            window.dispatchEvent(
              new CustomEvent("social-banner:export-complete", {
                detail: { platforms: selectedPlatforms, config },
              }),
            )
          }
        }, 1500)
      }, index * 1800)
    })
  }

  const handleExportAll = () => {
    const config: BannerConfig = {
      platform,
      title,
      subtitle,
      textColor,
      overlayOpacity: overlayOpacity[0],
      hasBackgroundImage,
      hasLogo,
    }

    const errors = validateBannerConfig(config)
    setValidationErrors(errors)

    if (errors.length > 0) {
      console.log("[v0] Validation failed:", errors)
      return
    }

    setGenerating(true)
    console.log("[v0] Exporting all banners:", config)

    window.dispatchEvent(new CustomEvent("social-banner:export-all-start", { detail: config }))

    setTimeout(() => {
      const exports = platforms.map((p) => ({
        platform: p.id,
        dimensions: p.size,
        url: `/exports/${p.id}-banner.png`,
      }))

      setGenerating(false)
      window.dispatchEvent(
        new CustomEvent("social-banner:export-all-complete", {
          detail: { exports, config },
        }),
      )
      console.log("[v0] Exported", exports.length, "banners")
    }, 2000)
  }

  const handleAIOptimize = () => {
    console.log("[v0] Requesting AI optimization")
    window.dispatchEvent(new CustomEvent("social-banner:ai-optimize-start"))

    setTimeout(() => {
      const suggestions = {
        title: "Découvrez Notre Nouvelle Collection",
        subtitle: "Des designs uniques pour votre marque",
        textColor: "#FFFFFF",
        overlayOpacity: 60,
      }

      setTitle(suggestions.title)
      setSubtitle(suggestions.subtitle)
      setTextColor(suggestions.textColor)
      setOverlayOpacity([suggestions.overlayOpacity])

      window.dispatchEvent(
        new CustomEvent("social-banner:ai-optimize-complete", {
          detail: suggestions,
        }),
      )
      console.log("[v0] AI optimization applied:", suggestions)
    }, 1500)
  }

  const selectedCount = platformExports.filter((p) => p.selected).length
  const completeCount = platformExports.filter((p) => p.status === "complete").length

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-md">
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Card className="w-full max-w-7xl h-[90vh] flex flex-col bg-background rounded-3xl shadow-2xl border border-border/50">
          {/* Header with close button */}
          <div className="flex items-center justify-between p-6 border-b border-border/50">
            <div>
              <h2 className="text-2xl font-bold">Bannières Sociales</h2>
              <p className="text-sm text-muted-foreground mt-1">Créez des bannières pour tous vos réseaux sociaux</p>
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
                  <h3 className="font-semibold mb-2">Bannières Sociales</h3>
                  <p className="text-sm text-muted-foreground">Créez des bannières pour tous vos réseaux sociaux</p>
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
                  <Label htmlFor="platform">Plateforme de prévisualisation</Label>
                  <NativeSelect value={platform} onChange={(e) => setPlatform(e.target.value)}>
                    {platforms.map((p) => (
                      <NativeSelectItem key={p.id} value={p.id}>
                        {p.name} ({p.size})
                      </NativeSelectItem>
                    ))}
                  </NativeSelect>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Titre *</Label>
                  <Input
                    id="title"
                    placeholder="Votre titre"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={validationErrors.some((e) => e.field === "title") ? "border-destructive" : ""}
                  />
                  <p className="text-xs text-muted-foreground">{title.length}/80 caractères</p>
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
                  <p className="text-xs text-muted-foreground">{subtitle.length}/150 caractères</p>
                </div>

                <div className="space-y-2">
                  <Label>Image de fond</Label>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => handleImageUpload("background")}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {hasBackgroundImage ? "Changer l'image" : "Importer une image"}
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Logo</Label>
                  <Button variant="outline" className="w-full bg-transparent" onClick={() => handleImageUpload("logo")}>
                    <Upload className="w-4 h-4 mr-2" />
                    {hasLogo ? "Changer le logo" : "Importer un logo"}
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="text-color">Couleur du texte</Label>
                  <div className="flex gap-2">
                    <Input
                      id="text-color"
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-20 h-10"
                    />
                    <Input value={textColor} onChange={(e) => setTextColor(e.target.value)} className="flex-1" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Opacité de l'overlay: {overlayOpacity[0]}%</Label>
                  <Slider value={overlayOpacity} onValueChange={setOverlayOpacity} min={0} max={100} />
                </div>

                <Button className="w-full bg-transparent" variant="outline" onClick={handleAIOptimize}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Optimiser avec l'IA
                </Button>
              </Card>

              <Card className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Export multi-plateformes</h3>
                  <Badge variant="secondary">{selectedCount} sélectionnées</Badge>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleSelectAll} className="flex-1 bg-transparent">
                    Tout sélectionner
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDeselectAll} className="flex-1 bg-transparent">
                    Tout désélectionner
                  </Button>
                </div>

                <Separator />

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {platformExports.map((platform) => (
                    <Card
                      key={platform.id}
                      className={`p-3 cursor-pointer transition-colors ${platform.selected ? "border-primary" : ""}`}
                      onClick={() => handleTogglePlatform(platform.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <Checkbox
                            checked={platform.selected}
                            onCheckedChange={() => handleTogglePlatform(platform.id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{platform.name}</p>
                            <p className="text-xs text-muted-foreground">{platform.size}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {platform.status === "complete" && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                          {platform.status === "generating" && (
                            <Badge variant="secondary" className="text-xs">
                              En cours
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                <Button
                  className="w-full"
                  onClick={handleExportSelected}
                  disabled={!title || selectedCount === 0 || exporting}
                >
                  <Package className="w-4 h-4 mr-2" />
                  {exporting
                    ? `Export en cours... (${completeCount}/${selectedCount})`
                    : `Exporter ${selectedCount} bannières`}
                </Button>
              </Card>
            </div>

            {/* Right Panel - Preview */}
            <div className="flex-1 flex flex-col gap-4">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Maximize2 className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Aperçu: {platforms.find((p) => p.id === platform)?.name}
                    </span>
                  </div>
                  <Badge variant="outline">{platforms.find((p) => p.id === platform)?.size}</Badge>
                </div>
              </Card>

              <div className="flex-1 flex items-center justify-center bg-muted/20 rounded-lg p-8">
                <Card
                  className="w-full max-w-4xl aspect-[820/312] flex items-center justify-center relative overflow-hidden"
                  style={{
                    backgroundColor: `rgba(0, 0, 0, ${overlayOpacity[0] / 100})`,
                  }}
                >
                  <div className="text-center z-10 px-8" style={{ color: textColor }}>
                    {title ? (
                      <>
                        <h2 className="text-3xl font-bold mb-2">{title}</h2>
                        {subtitle && <p className="text-lg mt-2">{subtitle}</p>}
                        {hasLogo && (
                          <div className="mt-4">
                            <Badge variant="secondary">Logo</Badge>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-muted-foreground">Aperçu de votre bannière</p>
                    )}
                  </div>
                  {hasBackgroundImage && (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
                  )}
                </Card>
              </div>

              {/* Export status */}
              {completeCount > 0 && (
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <span className="text-sm font-medium">{completeCount} bannières exportées</span>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger tout
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
