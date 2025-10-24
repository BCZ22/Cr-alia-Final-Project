/**
 * Créalia Studio - Tools Configuration
 * Définit tous les outils disponibles avec leurs paramètres et presets
 */

import { Tool } from './types'

export const STUDIO_TOOLS: Tool[] = [
  // RECOMMANDÉ
  {
    id: 'reels-generator',
    name: 'Générateur de Reels IA',
    category: 'Recommandé',
    icon: '🎬',
    shortDescription: 'Créez 1-3 Reels optimisés automatiquement',
    description:
      'Transformez vos vidéos en Reels viraux optimisés pour Instagram, TikTok et YouTube Shorts. IA analyse votre contenu et génère automatiquement les meilleurs clips.',
    tag: 'Nouveau',
    endpoint: '/api/crealia/generate',
    params: [
      {
        name: 'aspect_ratio',
        type: 'select',
        label: 'Format',
        required: true,
        default: '9:16',
        options: [
          { value: '9:16', label: '9:16 (Stories/Reels)' },
          { value: '4:5', label: '4:5 (Feed Instagram)' },
          { value: '1:1', label: '1:1 (Carré)' },
        ],
      },
      {
        name: 'duration_target',
        type: 'range',
        label: 'Durée cible (secondes)',
        required: true,
        default: 30,
        min: 10,
        max: 60,
      },
      {
        name: 'tone',
        type: 'select',
        label: 'Tonalité',
        required: true,
        default: 'viral',
        options: [
          { value: 'sportif', label: 'Sportif / Dynamique' },
          { value: 'luxe', label: 'Luxe / Premium' },
          { value: 'fun', label: 'Fun / Amusant' },
          { value: 'éducatif', label: 'Éducatif' },
          { value: 'émotionnel', label: 'Émotionnel' },
          { value: 'promotionnel', label: 'Promotionnel' },
          { value: 'viral', label: 'Viral' },
        ],
      },
      {
        name: 'music_mode',
        type: 'select',
        label: 'Musique',
        required: true,
        default: 'auto',
        options: [
          { value: 'auto', label: 'Automatique' },
          { value: 'select', label: 'Choisir manuellement' },
          { value: 'none', label: 'Aucune' },
        ],
      },
      {
        name: 'subtitles',
        type: 'boolean',
        label: 'Sous-titres automatiques',
        required: false,
        default: true,
      },
      {
        name: 'brand_overlay',
        type: 'boolean',
        label: 'Logo/Branding',
        required: false,
        default: false,
      },
      {
        name: 'color_grade',
        type: 'select',
        label: 'Étalonnage couleur',
        required: true,
        default: 'auto',
        options: [
          { value: 'auto', label: 'Automatique' },
          { value: 'cinematic', label: 'Cinématique' },
          { value: 'vibrant', label: 'Vibrant' },
          { value: 'natural', label: 'Naturel' },
        ],
      },
      {
        name: 'hooks',
        type: 'textarea',
        label: 'Phrase d\'accroche (optionnel)',
        required: false,
        placeholder: 'Ex: Découvrez le secret pour...',
      },
    ],
    presets: [
      {
        id: 'marketing-auto',
        name: 'Marketing Auto - Sportif',
        description: 'Parfait pour agences de location de voiture',
        params: {
          aspect_ratio: '9:16',
          duration_target: 30,
          tone: 'sportif',
          music_mode: 'auto',
          subtitles: true,
          brand_overlay: true,
          color_grade: 'vibrant',
        },
      },
      {
        id: 'luxe-lifestyle',
        name: 'Luxe & Lifestyle',
        description: 'Pour produits premium et haut de gamme',
        params: {
          aspect_ratio: '4:5',
          duration_target: 25,
          tone: 'luxe',
          music_mode: 'auto',
          subtitles: false,
          brand_overlay: true,
          color_grade: 'cinematic',
        },
      },
      {
        id: 'viral-fun',
        name: 'Viral & Fun',
        description: 'Maximiser l\'engagement et les partages',
        params: {
          aspect_ratio: '9:16',
          duration_target: 15,
          tone: 'fun',
          music_mode: 'auto',
          subtitles: true,
          brand_overlay: false,
          color_grade: 'vibrant',
        },
      },
    ],
  },
  {
    id: 'text-to-speech',
    name: 'Texte en discours',
    category: 'Recommandé',
    icon: '🎙️',
    shortDescription: 'Voix off IA naturelle et professionnelle',
    description:
      'Générez des voix off ultra-réalistes à partir de texte. Plusieurs voix et langues disponibles.',
    tag: 'Nouveau',
    endpoint: '/api/crealia/tts',
    params: [
      {
        name: 'text',
        type: 'textarea',
        label: 'Texte',
        required: true,
        placeholder: 'Entrez votre texte à convertir en voix...',
      },
      {
        name: 'voice',
        type: 'select',
        label: 'Voix',
        required: true,
        default: 'fr-FR-Neural2-A',
        options: [
          { value: 'fr-FR-Neural2-A', label: 'Française (Femme)' },
          { value: 'fr-FR-Neural2-B', label: 'Français (Homme)' },
          { value: 'en-US-Neural2-C', label: 'Anglaise (Femme)' },
          { value: 'en-US-Neural2-D', label: 'Anglais (Homme)' },
        ],
      },
      {
        name: 'speed',
        type: 'range',
        label: 'Vitesse',
        required: false,
        default: 1.0,
        min: 0.5,
        max: 2.0,
      },
    ],
  },
  {
    id: 'voice-changer',
    name: 'Outil de modification de la voix',
    category: 'Recommandé',
    icon: '🎤',
    shortDescription: 'Clonez ou modifiez n\'importe quelle voix',
    description:
      'Clonez une voix ou transformez votre voix en celle d\'un autre. Parfait pour le contenu créatif.',
    tag: 'Nouveau',
    endpoint: '/api/crealia/voice-change',
    params: [
      {
        name: 'audio_file',
        type: 'file',
        label: 'Fichier audio source',
        required: true,
        accept: 'audio/*',
      },
      {
        name: 'target_voice',
        type: 'select',
        label: 'Voix cible',
        required: true,
        options: [
          { value: 'celebrity-1', label: 'Célébrité 1' },
          { value: 'cartoon', label: 'Cartoon' },
          { value: 'robot', label: 'Robot' },
          { value: 'child', label: 'Enfant' },
        ],
      },
    ],
  },
  {
    id: 'product-ads',
    name: 'URL de produit en publicités',
    category: 'Recommandé',
    icon: '🛍️',
    shortDescription: 'Générez des pubs vidéo depuis une URL produit',
    description:
      'Entrez l\'URL d\'un produit Amazon/Shopify et générez automatiquement une publicité vidéo optimisée.',
    tag: 'Nouveau',
    endpoint: '/api/crealia/product-ads',
    params: [
      {
        name: 'product_url',
        type: 'text',
        label: 'URL du produit',
        required: true,
        placeholder: 'https://...',
      },
      {
        name: 'duration',
        type: 'range',
        label: 'Durée (secondes)',
        required: true,
        default: 15,
        min: 6,
        max: 30,
      },
    ],
  },
  {
    id: 'background-remover',
    name: 'Supprimer l\'arrière-plan',
    category: 'Recommandé',
    icon: '🖼️',
    shortDescription: 'Suppression d\'arrière-plan ultra-précise',
    description:
      'Retirez automatiquement l\'arrière-plan de vos images ou vidéos avec une précision professionnelle.',
    tag: 'Nouveau',
    endpoint: '/api/crealia/bg-remove',
    params: [
      {
        name: 'media_type',
        type: 'select',
        label: 'Type de média',
        required: true,
        default: 'image',
        options: [
          { value: 'image', label: 'Image' },
          { value: 'video', label: 'Vidéo' },
        ],
      },
    ],
  },
  {
    id: 'video-splitter',
    name: 'Vidéo longue en vidéos courtes',
    category: 'Recommandé',
    icon: '✂️',
    shortDescription: 'Découpez intelligemment vos vidéos longues',
    description:
      'L\'IA analyse votre vidéo longue et la découpe automatiquement en plusieurs clips courts optimisés.',
    tag: 'Nouveau',
    endpoint: '/api/crealia/split',
    params: [
      {
        name: 'target_duration',
        type: 'range',
        label: 'Durée cible par clip',
        required: true,
        default: 30,
        min: 10,
        max: 60,
      },
      {
        name: 'min_clips',
        type: 'number',
        label: 'Nombre minimum de clips',
        required: true,
        default: 3,
        min: 1,
        max: 10,
      },
    ],
  },
  {
    id: 'avatar-creator',
    name: 'Créateur d\'Avatar IA',
    category: 'Recommandé',
    icon: '👤',
    shortDescription: 'Avatar parlant ultra-réaliste',
    description: 'Créez un avatar IA qui parle à partir d\'une photo et d\'un texte.',
    endpoint: '/api/crealia/avatar',
    params: [
      {
        name: 'photo_file',
        type: 'file',
        label: 'Photo du visage',
        required: true,
        accept: 'image/*',
      },
      {
        name: 'text',
        type: 'textarea',
        label: 'Texte à faire dire',
        required: true,
      },
    ],
  },
  {
    id: 'auto-subtitles',
    name: 'Sous-titres automatiques',
    category: 'Recommandé',
    icon: '💬',
    shortDescription: 'Sous-titres IA synchronisés',
    description: 'Générez automatiquement des sous-titres synchronisés pour vos vidéos.',
    endpoint: '/api/crealia/captions',
    params: [
      {
        name: 'language',
        type: 'select',
        label: 'Langue',
        required: true,
        default: 'fr',
        options: [
          { value: 'fr', label: 'Français' },
          { value: 'en', label: 'Anglais' },
          { value: 'es', label: 'Espagnol' },
          { value: 'de', label: 'Allemand' },
        ],
      },
      {
        name: 'style',
        type: 'select',
        label: 'Style de sous-titres',
        required: true,
        default: 'modern',
        options: [
          { value: 'modern', label: 'Moderne' },
          { value: 'classic', label: 'Classique' },
          { value: 'bold', label: 'Gras' },
          { value: 'minimal', label: 'Minimal' },
        ],
      },
    ],
  },

  // VIDÉO
  {
    id: 'video-resizer',
    name: 'Redimensionner la vidéo',
    category: 'Vidéo',
    icon: '📐',
    shortDescription: 'Changez le format de vos vidéos',
    description: 'Redimensionnez vos vidéos pour tous les formats sociaux.',
    endpoint: '/api/crealia/resize',
    params: [
      {
        name: 'target_ratio',
        type: 'select',
        label: 'Format cible',
        required: true,
        options: [
          { value: '9:16', label: '9:16 (Stories)' },
          { value: '16:9', label: '16:9 (YouTube)' },
          { value: '1:1', label: '1:1 (Carré)' },
          { value: '4:5', label: '4:5 (Feed)' },
        ],
      },
    ],
  },
  {
    id: 'video-enhancer',
    name: 'Améliorateur de vidéos',
    category: 'Vidéo',
    icon: '✨',
    shortDescription: 'Améliorez la qualité vidéo avec l\'IA',
    description: 'Stabilisation, amélioration des couleurs, réduction du bruit.',
    endpoint: '/api/crealia/enhance',
    params: [
      {
        name: 'upscale',
        type: 'boolean',
        label: 'Upscale 4K',
        default: false,
      },
      {
        name: 'stabilize',
        type: 'boolean',
        label: 'Stabilisation',
        default: true,
      },
      {
        name: 'denoise',
        type: 'boolean',
        label: 'Réduction du bruit',
        default: true,
      },
    ],
  },
  {
    id: 'transitions-ai',
    name: 'Transitions IA',
    category: 'Vidéo',
    icon: '🎞️',
    shortDescription: 'Transitions automatiques intelligentes',
    description: 'Ajoutez des transitions fluides entre vos clips vidéo.',
    endpoint: '/api/crealia/transitions',
    params: [
      {
        name: 'style',
        type: 'select',
        label: 'Style de transition',
        required: true,
        default: 'smooth',
        options: [
          { value: 'smooth', label: 'Fluide' },
          { value: 'dynamic', label: 'Dynamique' },
          { value: 'cinematic', label: 'Cinématique' },
        ],
      },
    ],
  },

  // IMAGE
  {
    id: 'text-to-image',
    name: 'Texte en image',
    category: 'Image',
    icon: '🎨',
    shortDescription: 'Génération d\'images IA depuis texte',
    description: 'Créez des images uniques à partir d\'une description textuelle.',
    endpoint: '/api/crealia/text-to-image',
    params: [
      {
        name: 'prompt',
        type: 'textarea',
        label: 'Description',
        required: true,
        placeholder: 'Décrivez l\'image que vous voulez créer...',
      },
      {
        name: 'style',
        type: 'select',
        label: 'Style',
        required: true,
        default: 'realistic',
        options: [
          { value: 'realistic', label: 'Réaliste' },
          { value: 'artistic', label: 'Artistique' },
          { value: 'cartoon', label: 'Cartoon' },
          { value: '3d', label: '3D' },
        ],
      },
      {
        name: 'aspect_ratio',
        type: 'select',
        label: 'Format',
        required: true,
        default: '1:1',
        options: [
          { value: '1:1', label: 'Carré' },
          { value: '16:9', label: 'Paysage' },
          { value: '9:16', label: 'Portrait' },
        ],
      },
    ],
  },

  // AUDIO
  {
    id: 'music-library',
    name: 'Bibliothèque musicale',
    category: 'Contenu Audio',
    icon: '🎵',
    shortDescription: 'Musiques libres de droits',
    description: 'Parcourez et utilisez notre bibliothèque de musiques libres de droits.',
    endpoint: '/api/crealia/music',
    params: [
      {
        name: 'mood',
        type: 'select',
        label: 'Ambiance',
        required: true,
        options: [
          { value: 'energetic', label: 'Énergique' },
          { value: 'calm', label: 'Calme' },
          { value: 'happy', label: 'Joyeux' },
          { value: 'dramatic', label: 'Dramatique' },
        ],
      },
      {
        name: 'duration',
        type: 'range',
        label: 'Durée max (secondes)',
        required: true,
        default: 30,
        min: 10,
        max: 180,
      },
    ],
  },
]

/**
 * Get tool by ID
 */
export function getToolById(toolId: string): Tool | undefined {
  return STUDIO_TOOLS.find((tool) => tool.id === toolId)
}

/**
 * Get tools by category
 */
export function getToolsByCategory(category: string): Tool[] {
  return STUDIO_TOOLS.filter((tool) => tool.category === category)
}

/**
 * Get all categories
 */
export function getAllCategories(): string[] {
  const categories = new Set(STUDIO_TOOLS.map((tool) => tool.category))
  return ['Recommandé', ...Array.from(categories).filter((c) => c !== 'Recommandé')]
}

