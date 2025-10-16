"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"

const avatarStyles = [
  { id: "realistic", name: "Réaliste", desc: "Photo réaliste", gradient: "from-blue-500 to-purple-500" },
  { id: "anime", name: "Anime", desc: "Style manga", gradient: "from-pink-500 to-red-500" },
  { id: "cartoon", name: "Cartoon", desc: "Dessin animé", gradient: "from-yellow-500 to-orange-500" },
  { id: "3d", name: "3D", desc: "Rendu 3D", gradient: "from-cyan-500 to-blue-500" },
  { id: "pixel", name: "Pixel Art", desc: "Style rétro", gradient: "from-green-500 to-teal-500" },
  { id: "watercolor", name: "Aquarelle", desc: "Peinture douce", gradient: "from-purple-500 to-pink-500" },
]

const genderOptions = [
  { id: "male", name: "Homme" },
  { id: "female", name: "Femme" },
  { id: "neutral", name: "Neutre" },
]

const ageRanges = [
  { id: "child", name: "Enfant", range: "5-12 ans" },
  { id: "teen", name: "Adolescent", range: "13-19 ans" },
  { id: "young", name: "Jeune adulte", range: "20-35 ans" },
  { id: "adult", name: "Adulte", range: "36-55 ans" },
  { id: "senior", name: "Senior", range: "56+ ans" },
]

const ethnicities = [
  { id: "caucasian", name: "Caucasien" },
  { id: "african", name: "Africain" },
  { id: "asian", name: "Asiatique" },
  { id: "hispanic", name: "Hispanique" },
  { id: "middle-eastern", name: "Moyen-Orient" },
  { id: "mixed", name: "Mixte" },
]

const expressions = [
  { id: "neutral", name: "Neutre", emoji: "😐" },
  { id: "smile", name: "Sourire", emoji: "😊" },
  { id: "laugh", name: "Rire", emoji: "😄" },
  { id: "serious", name: "Sérieux", emoji: "😑" },
  { id: "confident", name: "Confiant", emoji: "😎" },
  { id: "friendly", name: "Amical", emoji: "🙂" },
]

const backgrounds = [
  { id: "solid", name: "Uni", desc: "Couleur unie" },
  { id: "gradient", name: "Dégradé", desc: "Dégradé coloré" },
  { id: "studio", name: "Studio", desc: "Fond professionnel" },
  { id: "nature", name: "Nature", desc: "Paysage naturel" },
  { id: "urban", name: "Urbain", desc: "Ville moderne" },
  { id: "abstract", name: "Abstrait", desc: "Formes abstraites" },
]

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 6 6 18" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m6 6 12 12" />
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

const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z"
    />
  </svg>
)

const UploadIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 16a4 4 0 0 1-.88-7.903A5 5 0 1 1 15.9 6L16 6a5 5 0 0 1 1 9.9M15 13l-3-3m0 0-3 3m3-3v12"
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

interface AIAvatarCreatorInterfaceProps {
  isOpen: boolean
  onClose: () => void
}

export function AIAvatarCreatorInterface({ isOpen, onClose }: AIAvatarCreatorInterfaceProps) {
  const [creationMode, setCreationMode] = useState<"text" | "photo">("text")
  const [description, setDescription] = useState("")
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null)
  const [selectedGender, setSelectedGender] = useState<string | null>(null)
  const [selectedAge, setSelectedAge] = useState<string | null>(null)
  const [selectedEthnicity, setSelectedEthnicity] = useState<string | null>(null)
  const [selectedExpression, setSelectedExpression] = useState<string | null>(null)
  const [selectedBackground, setSelectedBackground] = useState<string | null>(null)
  const [uploadedPhoto, setUploadedPhoto] = useState<File | null>(null)
  const [creativity, setCreativity] = useState([50])
  const [isGenerating, setIsGenerating] = useState(false)
  const [hasGenerated, setHasGenerated] = useState(false)
  const [generatedVariants, setGeneratedVariants] = useState<number>(4)

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedPhoto(file)
    }
  }

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      setHasGenerated(true)
    }, 4000)
  }

  const handleRegenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
    }, 3000)
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
                  Créateur d'Avatar IA
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Créez des avatars uniques avec l'intelligence artificielle
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full hover:bg-secondary/80">
                <XIcon className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Panel - Configuration */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Creation Mode */}
                  <div className="flex gap-3">
                    <Button
                      variant={creationMode === "text" ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => setCreationMode("text")}
                    >
                      <SparklesIcon className="w-4 h-4 mr-2" />
                      Depuis une description
                    </Button>
                    <Button
                      variant={creationMode === "photo" ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => setCreationMode("photo")}
                    >
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Depuis une photo
                    </Button>
                  </div>

                  {/* Text Mode */}
                  {creationMode === "text" && (
                    <>
                      {/* Description */}
                      <div className="space-y-3">
                        <label className="text-sm font-medium">Description de l'avatar</label>
                        <Textarea
                          placeholder="Ex: Une femme d'affaires confiante avec des lunettes, cheveux courts, sourire professionnel..."
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="min-h-[100px] resize-none"
                        />
                        <p className="text-xs text-muted-foreground">
                          Décrivez l'apparence, le style et l'attitude de votre avatar
                        </p>
                      </div>

                      {/* Gender */}
                      <div className="space-y-3">
                        <label className="text-sm font-medium">Genre</label>
                        <div className="grid grid-cols-3 gap-3">
                          {genderOptions.map((gender) => (
                            <Button
                              key={gender.id}
                              variant={selectedGender === gender.id ? "default" : "outline"}
                              onClick={() => setSelectedGender(gender.id)}
                              className="bg-transparent"
                            >
                              {gender.name}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Age Range */}
                      <div className="space-y-3">
                        <label className="text-sm font-medium">Tranche d'âge</label>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                          {ageRanges.map((age) => (
                            <Card
                              key={age.id}
                              className={`cursor-pointer transition-all duration-200 ${
                                selectedAge === age.id
                                  ? "border-primary bg-primary/5 shadow-md"
                                  : "hover:border-primary/50"
                              }`}
                              onClick={() => setSelectedAge(age.id)}
                            >
                              <CardContent className="p-3 text-center">
                                <div className="text-sm font-medium mb-1">{age.name}</div>
                                <div className="text-xs text-muted-foreground">{age.range}</div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>

                      {/* Ethnicity */}
                      <div className="space-y-3">
                        <label className="text-sm font-medium">Origine ethnique</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {ethnicities.map((ethnicity) => (
                            <Button
                              key={ethnicity.id}
                              variant={selectedEthnicity === ethnicity.id ? "default" : "outline"}
                              size="sm"
                              onClick={() => setSelectedEthnicity(ethnicity.id)}
                              className="bg-transparent"
                            >
                              {ethnicity.name}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Expression */}
                      <div className="space-y-3">
                        <label className="text-sm font-medium">Expression</label>
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                          {expressions.map((expression) => (
                            <Button
                              key={expression.id}
                              variant={selectedExpression === expression.id ? "default" : "outline"}
                              className="h-auto py-3 flex flex-col items-center gap-1"
                              onClick={() => setSelectedExpression(expression.id)}
                            >
                              <span className="text-xl">{expression.emoji}</span>
                              <span className="text-xs">{expression.name}</span>
                            </Button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Photo Mode */}
                  {creationMode === "photo" && (
                    <div className="space-y-4">
                      {!uploadedPhoto ? (
                        <div
                          className="border-2 border-dashed border-border rounded-2xl p-12 text-center hover:border-primary/50 transition-colors cursor-pointer"
                          onClick={() => document.getElementById("avatar-photo-upload")?.click()}
                        >
                          <UploadIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                          <h3 className="text-lg font-semibold mb-2">Importer une photo</h3>
                          <p className="text-muted-foreground text-sm mb-4">
                            Glissez-déposez votre photo ou cliquez pour parcourir
                          </p>
                          <p className="text-xs text-muted-foreground">Formats supportés: JPG, PNG (max 10MB)</p>
                          <input
                            id="avatar-photo-upload"
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="hidden"
                          />
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-xl">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                <ImageIcon className="w-6 h-6 text-primary" />
                              </div>
                              <div>
                                <h4 className="font-medium">{uploadedPhoto.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {(uploadedPhoto.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setUploadedPhoto(null)}>
                              Changer
                            </Button>
                          </div>

                          <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                            <h4 className="text-sm font-semibold mb-2">Conseils pour de meilleurs résultats</h4>
                            <ul className="text-xs text-muted-foreground space-y-1">
                              <li>• Utilisez une photo de face bien éclairée</li>
                              <li>• Évitez les lunettes de soleil ou accessoires cachant le visage</li>
                              <li>• Préférez un fond uni ou simple</li>
                              <li>• La photo doit être nette et de bonne qualité</li>
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Style Selection */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Style artistique</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {avatarStyles.map((style) => (
                        <Card
                          key={style.id}
                          className={`cursor-pointer transition-all duration-200 ${
                            selectedStyle === style.id
                              ? "border-primary bg-primary/5 shadow-md"
                              : "hover:border-primary/50"
                          }`}
                          onClick={() => setSelectedStyle(style.id)}
                        >
                          <CardContent className="p-4">
                            <div className={`w-full h-2 rounded-full bg-gradient-to-r ${style.gradient} mb-3`} />
                            <h4 className="font-medium text-sm mb-1">{style.name}</h4>
                            <p className="text-xs text-muted-foreground">{style.desc}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Background */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Arrière-plan</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {backgrounds.map((bg) => (
                        <Card
                          key={bg.id}
                          className={`cursor-pointer transition-all duration-200 ${
                            selectedBackground === bg.id
                              ? "border-primary bg-primary/5 shadow-md"
                              : "hover:border-primary/50"
                          }`}
                          onClick={() => setSelectedBackground(bg.id)}
                        >
                          <CardContent className="p-3 text-center">
                            <h4 className="font-medium text-sm mb-1">{bg.name}</h4>
                            <p className="text-xs text-muted-foreground">{bg.desc}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Creativity Slider */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Niveau de créativité</label>
                      <span className="text-sm text-primary font-medium">{creativity[0]}%</span>
                    </div>
                    <Slider value={creativity} onValueChange={setCreativity} min={0} max={100} step={10} />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Fidèle</span>
                      <span>Créatif</span>
                    </div>
                  </div>

                  {/* Number of Variants */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Nombre de variantes</label>
                    <div className="flex gap-2">
                      {[1, 2, 4, 6].map((num) => (
                        <Button
                          key={num}
                          variant={generatedVariants === num ? "default" : "outline"}
                          size="sm"
                          onClick={() => setGeneratedVariants(num)}
                          className="flex-1 bg-transparent"
                        >
                          {num}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Generate Button */}
                  {!hasGenerated ? (
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleGenerate}
                      disabled={
                        !selectedStyle ||
                        (creationMode === "text" && !description && !selectedGender) ||
                        (creationMode === "photo" && !uploadedPhoto) ||
                        isGenerating
                      }
                    >
                      {isGenerating ? (
                        <>
                          <SparklesIcon className="w-5 h-5 mr-2 animate-pulse" />
                          Génération en cours...
                        </>
                      ) : (
                        <>
                          <SparklesIcon className="w-5 h-5 mr-2" />
                          Générer les avatars
                        </>
                      )}
                    </Button>
                  ) : (
                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1 bg-transparent" onClick={handleRegenerate}>
                        <RefreshIcon className="w-4 h-4 mr-2" />
                        Régénérer
                      </Button>
                      <Button className="flex-1">
                        <DownloadIcon className="w-4 h-4 mr-2" />
                        Tout télécharger
                      </Button>
                    </div>
                  )}
                </div>

                {/* Right Panel - Preview & Results */}
                <div className="space-y-4">
                  {/* Preview */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Aperçu</label>
                    {hasGenerated ? (
                      <div className="grid grid-cols-2 gap-3">
                        {Array.from({ length: generatedVariants }).map((_, i) => (
                          <div
                            key={i}
                            className="relative aspect-square bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl overflow-hidden border border-border/50 group cursor-pointer hover:border-primary/50 transition-all"
                          >
                            <div className="absolute inset-0 flex items-center justify-center">
                              <UserIcon className="w-12 h-12 text-primary" />
                            </div>
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Button size="sm" variant="secondary">
                                <DownloadIcon className="w-4 h-4 mr-2" />
                                Télécharger
                              </Button>
                            </div>
                            <Badge className="absolute top-2 right-2 text-xs">#{i + 1}</Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="relative aspect-square bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl overflow-hidden border border-border/50">
                        <div className="absolute inset-0 flex items-center justify-center p-6">
                          <div className="text-center">
                            <UserIcon className="w-16 h-16 mx-auto mb-3 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">Vos avatars apparaîtront ici</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Settings Summary */}
                  <div className="space-y-2 p-4 bg-secondary/20 rounded-xl">
                    <h4 className="text-sm font-semibold">Paramètres</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Mode:</span>
                        <span className="font-medium">{creationMode === "text" ? "Description" : "Photo"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Style:</span>
                        <span className="font-medium">
                          {selectedStyle ? avatarStyles.find((s) => s.id === selectedStyle)?.name : "Non sélectionné"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Arrière-plan:</span>
                        <span className="font-medium">
                          {selectedBackground
                            ? backgrounds.find((b) => b.id === selectedBackground)?.name
                            : "Non sélectionné"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Variantes:</span>
                        <span className="font-medium">{generatedVariants}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Créativité:</span>
                        <span className="font-medium">{creativity[0]}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Export Options */}
                  {hasGenerated && (
                    <div className="space-y-3 p-4 bg-secondary/20 rounded-xl">
                      <h4 className="text-sm font-semibold">Options d'export</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Format:</span>
                          <select className="bg-background border border-border rounded px-2 py-1 text-xs">
                            <option>PNG</option>
                            <option>JPG</option>
                            <option>WEBP</option>
                          </select>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Résolution:</span>
                          <select className="bg-background border border-border rounded px-2 py-1 text-xs">
                            <option>512x512</option>
                            <option>1024x1024</option>
                            <option>2048x2048</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tips */}
                  <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                    <h4 className="text-sm font-semibold mb-2">Conseils</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Soyez précis dans votre description</li>
                      <li>• Testez différents styles artistiques</li>
                      <li>• Générez plusieurs variantes</li>
                      <li>• Ajustez la créativité selon vos besoins</li>
                    </ul>
                  </div>

                  {/* Quick Actions */}
                  {hasGenerated && (
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full bg-transparent" size="sm">
                        Ajouter au projet
                      </Button>
                      <Button variant="outline" className="w-full bg-transparent" size="sm">
                        Partager
                      </Button>
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

export { AIAvatarCreatorInterface as AiAvatarCreatorInterface }
