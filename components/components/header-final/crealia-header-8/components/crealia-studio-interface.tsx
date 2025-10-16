"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BackgroundRemoverInterface } from "@/components/background-remover-interface"
import { VideoCutterInterface } from "@/components/video-cutter-interface"
import { AIReelsGeneratorInterface } from "@/components/ai-reels-generator-interface"
import { AIAvatarCreatorInterface } from "@/components/ai-avatar-creator-interface"
import { AutoSubtitlesInterface } from "@/components/auto-subtitles-interface"
import { VideoResizerInterface } from "@/components/video-resizer-interface"
import { PictureInPictureInterface } from "@/components/picture-in-picture-interface"
import { VideoEnhancerInterface } from "@/components/video-enhancer-interface"
import { InstagramReelsGeneratorInterface } from "@/components/instagram-reels-generator-interface"
import { TikTokCreatorInterface } from "@/components/tiktok-creator-interface"
import { YouTubeShortsCreatorInterface } from "@/components/youtube-shorts-creator-interface"
import { AnimatedStoriesInterface } from "@/components/animated-stories-interface"
import { AutoEditingInterface } from "@/components/auto-editing-interface"
import { AITransitionsInterface } from "@/components/ai-transitions-interface"
import { VisualFXInterface } from "@/components/visual-fx-interface"
import { TextToImageInterface } from "@/components/image/text-to-image-interface"
import { ImageEnhancerInterface } from "@/components/image/image-enhancer-interface"
import { YouTubeThumbnailsInterface } from "@/components/image/youtube-thumbnails-interface"
import { AIIllustrationsInterface } from "@/components/image/ai-illustrations-interface"
import { CustomLogosInterface } from "@/components/image/custom-logos-interface"
import { SocialBannersInterface } from "@/components/image/social-banners-interface"
import { TTSInterface } from "@/components/audio/tts-interface"
import { SFXInterface } from "@/components/audio/sfx-interface"
import { MusicLibraryInterface } from "@/components/audio/music-library-interface"
import { VoiceCloneInterface } from "@/components/audio/voice-clone-interface"
import { AutoNarrationInterface } from "@/components/audio/auto-narration-interface"
import { PodcastIAInterface } from "@/components/audio/podcast-ia-interface"
import { VoiceTranslationInterface } from "@/components/audio/voice-translation-interface"
import { CoverImagesInterface } from "@/components/image/cover-images-interface"
import { MemeGeneratorInterface } from "@/components/image/meme-generator-interface"

// const CoverImagesInterface = lazy(() =>
//   import("@/components/image/cover-images-interface").then((mod) => ({ default: mod.CoverImagesInterface })),
// )
// const MemeGeneratorInterface = lazy(() =>
//   import("@/components/image/meme-generator-interface").then((mod) => ({ default: mod.MemeGeneratorInterface })),
// )

const studioFeatures = [
  {
    category: "Recommandé",
    features: [
      { name: "Texte en discours", url: "#", tag: "Nouveau" },
      { name: "Outil de modification de la voix", url: "#", tag: "Nouveau" },
      { name: "URL de produit en publicités", url: "#", tag: "Nouveau" },
      { name: "Supprimer l'arrière-plan", url: "#", tag: "Nouveau" },
      { name: "Vidéo longue en vidéos courtes", url: "#", tag: "Nouveau" },
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
      { name: "Texte en image", url: "#" },
      { name: "Améliorateur d'images", url: "#" },
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

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 6 6 18" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m6 6 12 12" />
  </svg>
)

interface CrealiaStudioInterfaceProps {
  isOpen: boolean
  onClose: () => void
}

export function CrealiaStudioInterface({ isOpen, onClose }: CrealiaStudioInterfaceProps) {
  const [selectedCategory, setSelectedCategory] = useState("Recommandé")
  const [showTextToSpeech, setShowTextToSpeech] = useState(false)
  const [showVoiceChanger, setShowVoiceChanger] = useState(false)
  const [showProductAds, setShowProductAds] = useState(false)
  const [showBackgroundRemover, setShowBackgroundRemover] = useState(false)
  const [showVideoCutter, setShowVideoCutter] = useState(false)
  const [showAIReels, setShowAIReels] = useState(false)
  const [showAIAvatar, setShowAIAvatar] = useState(false)
  const [showAutoSubtitles, setShowAutoSubtitles] = useState(false)
  const [showVideoResizer, setShowVideoResizer] = useState(false)
  const [showPictureInPicture, setShowPictureInPicture] = useState(false)
  const [showVideoEnhancer, setShowVideoEnhancer] = useState(false)
  const [showInstagramReels, setShowInstagramReels] = useState(false)
  const [showTikTokCreator, setShowTikTokCreator] = useState(false)
  const [showYouTubeShorts, setShowYouTubeShorts] = useState(false)
  const [showAnimatedStories, setShowAnimatedStories] = useState(false)
  const [showAutoEditing, setShowAutoEditing] = useState(false)
  const [showAITransitions, setShowAITransitions] = useState(false)
  const [showVisualFX, setShowVisualFX] = useState(false)
  const [showTextToImage, setShowTextToImage] = useState(false)
  const [showImageEnhancer, setShowImageEnhancer] = useState(false)
  const [showCoverImages, setShowCoverImages] = useState(false)
  const [showYouTubeThumbnails, setShowYouTubeThumbnails] = useState(false)
  const [showAIIllustrations, setShowAIIllustrations] = useState(false)
  const [showCustomLogos, setShowCustomLogos] = useState(false)
  const [showSocialBanners, setShowSocialBanners] = useState(false)
  const [showMemeGenerator, setShowMemeGenerator] = useState(false)
  const [showTTS, setShowTTS] = useState(false)
  const [showSFX, setShowSFX] = useState(false)
  const [showMusicLibrary, setShowMusicLibrary] = useState(false)
  const [showVoiceClone, setShowVoiceClone] = useState(false)
  const [showAutoNarration, setShowAutoNarration] = useState(false)
  const [showPodcastIA, setShowPodcastIA] = useState(false)
  const [showVoiceTranslation, setShowVoiceTranslation] = useState(false)

  if (!isOpen) return null

  const selectedFeatures = studioFeatures.find((cat) => cat.category === selectedCategory)?.features || []

  console.log("[v0] CrealiaStudio state:", { showTextToImage, showImageEnhancer })

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md">
      <div className="fixed inset-0">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="w-full max-w-7xl bg-background rounded-3xl shadow-2xl border border-border/50">
            <div className="flex items-center justify-between p-6 border-b border-border/50">
              <div>
                <h2 className="text-2xl font-bold">Créalia Studio</h2>
                <p className="text-muted-foreground text-sm mt-1">Votre studio de création IA tout-en-un</p>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full">
                <XIcon className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex h-[600px]">
              {/* Sidebar */}
              <div className="w-64 border-r border-border/50 p-4">
                <div className="space-y-2">
                  {studioFeatures.map((category) => {
                    return (
                      <button
                        key={category.category}
                        onClick={() => setSelectedCategory(category.category)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                          selectedCategory === category.category
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : "hover:bg-secondary/50 text-muted-foreground hover:text-foreground"
                        }`}
                      >
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
                      className="relative group cursor-pointer transition-all hover:shadow-md hover:scale-[1.02] border-border/50 hover:border-primary/30"
                      onClick={() => {
                        console.log("[v0] Feature clicked:", feature.name)

                        if (feature.name === "Texte en image") {
                          console.log("[v0] Setting showTextToImage to true")
                          setShowTextToImage(true)
                        } else if (feature.name === "Améliorateur d'images") {
                          console.log("[v0] Setting showImageEnhancer to true")
                          setShowImageEnhancer(true)
                        } else if (feature.name === "Générateur d'avatars") {
                          setShowAIAvatar(true)
                        } else if (feature.name === "Images de couverture") {
                          setShowCoverImages(true)
                        } else if (feature.name === "Miniatures YouTube") {
                          setShowYouTubeThumbnails(true)
                        } else if (feature.name === "Illustrations IA") {
                          setShowAIIllustrations(true)
                        } else if (feature.name === "Logos personnalisés") {
                          setShowCustomLogos(true)
                        } else if (feature.name === "Bannières sociales") {
                          setShowSocialBanners(true)
                        } else if (feature.name === "Memes générés") {
                          setShowMemeGenerator(true)
                        } else if (feature.name === "Redimensionner la vidéo") {
                          setShowVideoResizer(true)
                        } else if (feature.name === "Image en image") {
                          setShowPictureInPicture(true)
                        } else if (feature.name === "Texte en discours") {
                          setShowTextToSpeech(true)
                        } else if (feature.name === "Outil de modification de la voix") {
                          setShowVoiceChanger(true)
                        } else if (feature.name === "URL de produit en publicités") {
                          setShowProductAds(true)
                        } else if (feature.name === "Supprimer l'arrière-plan") {
                          setShowBackgroundRemover(true)
                        } else if (feature.name === "Vidéo longue en vidéos courtes") {
                          setShowVideoCutter(true)
                        } else if (feature.name === "Générateur de Reels IA") {
                          setShowAIReels(true)
                        } else if (feature.name === "Créateur d'Avatar IA") {
                          setShowAIAvatar(true)
                        } else if (feature.name === "Sous-titres automatiques") {
                          setShowAutoSubtitles(true)
                        } else if (feature.name === "Améliorateur de vidéos") {
                          setShowVideoEnhancer(true)
                        } else if (feature.name === "Générateur de Reels Instagram") {
                          setShowInstagramReels(true)
                        } else if (feature.name === "Créateur de TikTok") {
                          setShowTikTokCreator(true)
                        } else if (feature.name === "YouTube Shorts") {
                          setShowYouTubeShorts(true)
                        } else if (feature.name === "Stories animées") {
                          setShowAnimatedStories(true)
                        } else if (feature.name === "Montage automatique") {
                          setShowAutoEditing(true)
                        } else if (feature.name === "Transitions IA") {
                          setShowAITransitions(true)
                        } else if (feature.name === "Effets visuels") {
                          setShowVisualFX(true)
                        } else if (feature.name === "Voix Off IA") {
                          setShowTTS(true)
                        } else if (feature.name === "Effets sonores") {
                          setShowSFX(true)
                        } else if (feature.name === "Musique de fond") {
                          setShowMusicLibrary(true)
                        } else if (feature.name === "Clonage de voix") {
                          setShowVoiceClone(true)
                        } else if (feature.name === "Narration automatique") {
                          setShowAutoNarration(true)
                        } else if (feature.name === "Podcast IA") {
                          setShowPodcastIA(true)
                        } else if (feature.name === "Traduction vocale") {
                          setShowVoiceTranslation(true)
                        }
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm group-hover:text-primary transition-colors">
                            {feature.name}
                          </h4>
                          {feature.tag && (
                            <Badge variant="secondary" className="text-xs px-2 py-1">
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
          </div>
        </div>
      </div>

      {/* Existing code for interfaces */}
      {console.log("[v0] Rendering TextToImageInterface with isOpen:", showTextToImage)}
      {console.log("[v0] Rendering ImageEnhancerInterface with isOpen:", showImageEnhancer)}

      <TextToImageInterface isOpen={showTextToImage} onClose={() => setShowTextToImage(false)} />
      <ImageEnhancerInterface isOpen={showImageEnhancer} onClose={() => setShowImageEnhancer(false)} />
      <BackgroundRemoverInterface isOpen={showBackgroundRemover} onClose={() => setShowBackgroundRemover(false)} />
      <VideoCutterInterface isOpen={showVideoCutter} onClose={() => setShowVideoCutter(false)} />
      <AIReelsGeneratorInterface isOpen={showAIReels} onClose={() => setShowAIReels(false)} />
      <AIAvatarCreatorInterface isOpen={showAIAvatar} onClose={() => setShowAIAvatar(false)} />
      <AutoSubtitlesInterface isOpen={showAutoSubtitles} onClose={() => setShowAutoSubtitles(false)} />
      <VideoResizerInterface isOpen={showVideoResizer} onClose={() => setShowVideoResizer(false)} />
      <PictureInPictureInterface isOpen={showPictureInPicture} onClose={() => setShowPictureInPicture(false)} />
      <VideoEnhancerInterface isOpen={showVideoEnhancer} onClose={() => setShowVideoEnhancer(false)} />
      <InstagramReelsGeneratorInterface isOpen={showInstagramReels} onClose={() => setShowInstagramReels(false)} />
      <TikTokCreatorInterface isOpen={showTikTokCreator} onClose={() => setShowTikTokCreator(false)} />
      <YouTubeShortsCreatorInterface isOpen={showYouTubeShorts} onClose={() => setShowYouTubeShorts(false)} />
      <AnimatedStoriesInterface isOpen={showAnimatedStories} onClose={() => setShowAnimatedStories(false)} />
      <AutoEditingInterface isOpen={showAutoEditing} onClose={() => setShowAutoEditing(false)} />
      <AITransitionsInterface isOpen={showAITransitions} onClose={() => setShowAITransitions(false)} />
      <VisualFXInterface isOpen={showVisualFX} onClose={() => setShowVisualFX(false)} />
      <CoverImagesInterface isOpen={showCoverImages} onClose={() => setShowCoverImages(false)} />
      <YouTubeThumbnailsInterface isOpen={showYouTubeThumbnails} onClose={() => setShowYouTubeThumbnails(false)} />
      <AIIllustrationsInterface isOpen={showAIIllustrations} onClose={() => setShowAIIllustrations(false)} />
      <CustomLogosInterface isOpen={showCustomLogos} onClose={() => setShowCustomLogos(false)} />
      <SocialBannersInterface isOpen={showSocialBanners} onClose={() => setShowSocialBanners(false)} />
      <MemeGeneratorInterface isOpen={showMemeGenerator} onClose={() => setShowMemeGenerator(false)} />
      <TTSInterface isOpen={showTTS} onClose={() => setShowTTS(false)} />
      <SFXInterface isOpen={showSFX} onClose={() => setShowSFX(false)} />
      <MusicLibraryInterface isOpen={showMusicLibrary} onClose={() => setShowMusicLibrary(false)} />
      <VoiceCloneInterface isOpen={showVoiceClone} onClose={() => setShowVoiceClone(false)} />
      <AutoNarrationInterface isOpen={showAutoNarration} onClose={() => setShowAutoNarration(false)} />
      <PodcastIAInterface isOpen={showPodcastIA} onClose={() => setShowPodcastIA(false)} />
      <VoiceTranslationInterface isOpen={showVoiceTranslation} onClose={() => setShowVoiceTranslation(false)} />
    </div>
  )
}
