/**
 * Route Configuration System
 * Centralizes all route definitions, button mappings, and navigation logic
 */

export type RouteGuard = 'auth' | 'subscription' | 'auth_optional' | 'admin'

export interface ButtonAction {
  id: string
  label: string
  type: 'modal' | 'route' | 'external' | 'api'
  target?: string
  handler?: string
  requiresAuth?: boolean
}

export interface RouteConfig {
  path: string
  component: string
  public: boolean
  guards: RouteGuard[]
  buttons?: ButtonAction[]
  targetEndpoints?: string[]
  metadata?: {
    title?: string
    description?: string
    requiresSubscription?: boolean
  }
}

export interface ApiEndpointConfig {
  path: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  auth: boolean
  description: string
  body?: Record<string, string>
  query?: Record<string, string>
  events?: string[]
}

/**
 * CENTRALIZED ROUTE DEFINITIONS
 * Single source of truth for all application routes
 */
export const ROUTES: Record<string, RouteConfig> = {
  // ==================== PUBLIC ROUTES ====================
  HOME: {
    path: '/',
    component: 'HomePage',
    public: true,
    guards: [],
    buttons: [
      {
        id: 'btn-home-start-free',
        label: 'Essayer Gratuitement',
        type: 'modal',
        target: 'signup-dark',
      },
      {
        id: 'btn-home-demo',
        label: 'Voir la démo',
        type: 'modal',
        target: 'demo',
      },
      {
        id: 'btn-home-contact-support',
        label: 'Contacter le support',
        type: 'modal',
        target: 'chat',
      },
    ],
    metadata: {
      title: 'Créalia - Créez du contenu viral avec l\'IA',
      description: 'Plateforme #1 pour créateurs de contenu',
    },
  },

  PRICING: {
    path: '/pricing',
    component: 'PricingPage',
    public: true,
    guards: [],
    buttons: [
      {
        id: 'btn-pricing-creator-start',
        label: 'Commencer',
        type: 'api',
        target: '/api/checkout/create-session',
        requiresAuth: true,
      },
      {
        id: 'btn-pricing-viral-start',
        label: 'Commencer',
        type: 'api',
        target: '/api/checkout/create-session',
        requiresAuth: true,
      },
      {
        id: 'btn-pricing-pro-start',
        label: 'Commencer',
        type: 'api',
        target: '/api/checkout/create-session',
        requiresAuth: true,
      },
    ],
    targetEndpoints: ['/api/checkout/create-session'],
    metadata: {
      title: 'Tarifs | Créalia',
      description: 'Plans et prix pour tous les créateurs',
    },
  },

  PRICING_SUCCESS: {
    path: '/pricing/success',
    component: 'CheckoutSuccessPage',
    public: false,
    guards: ['auth'],
    targetEndpoints: ['/api/checkout/session-info'],
    metadata: {
      title: 'Paiement réussi | Créalia',
      description: 'Votre abonnement a été activé',
    },
  },

  PRICING_CANCEL: {
    path: '/pricing/cancel',
    component: 'CheckoutCancelPage',
    public: true,
    guards: [],
    metadata: {
      title: 'Paiement annulé | Créalia',
    },
  },

  // ==================== SUPPORT & CHAT ====================
  SUPPORT_CHAT: {
    path: '/support/chat',
    component: 'ChatHubPage',
    public: true,
    guards: ['auth_optional'],
    buttons: [
      {
        id: 'btn-start-conversation',
        label: 'Démarrer une conversation',
        type: 'api',
        target: '/api/chat/create-session',
        handler: 'openChatWindow',
      },
      {
        id: 'btn-view-faq',
        label: 'Consulter la FAQ',
        type: 'route',
        target: '/faq',
      },
    ],
    targetEndpoints: [
      '/api/chat/create-session',
      '/api/chat/message',
      '/api/chat/history',
    ],
    metadata: {
      title: 'Chat en direct 24/7 | Créalia',
      description: 'Support client disponible 24/7',
    },
  },

  SUPPORT_CONTACT: {
    path: '/support/contact',
    component: 'ContactPage',
    public: true,
    guards: [],
    targetEndpoints: ['/api/contact/send'],
  },

  // ==================== COMMUNITY ====================
  COMMUNITY: {
    path: '/community',
    component: 'CommunityPage',
    public: true,
    guards: [],
    buttons: [
      {
        id: 'btn-join-discord',
        label: 'Rejoindre Discord',
        type: 'external',
        target: process.env.NEXT_PUBLIC_DISCORD_INVITE_URL || 'https://discord.gg/crealia',
      },
      {
        id: 'btn-view-forum',
        label: 'Voir le forum',
        type: 'route',
        target: '/community/forum',
      },
    ],
  },

  COMMUNITY_FORUM: {
    path: '/community/forum',
    component: 'ForumPage',
    public: true,
    guards: ['auth_optional'],
    targetEndpoints: ['/api/forum/topics', '/api/forum/comments'],
  },

  // ==================== AI TOOLS ====================
  AI_REELS: {
    path: '/ai/reels',
    component: 'ReelsGeneratorPage',
    public: false,
    guards: ['auth', 'subscription'],
    buttons: [
      {
        id: 'btn-generate-reel',
        label: 'Commencer maintenant',
        type: 'api',
        target: '/api/ai/reels/generate',
        requiresAuth: true,
      },
      {
        id: 'btn-view-examples',
        label: 'Voir des exemples',
        type: 'route',
        target: '/ai/reels/examples',
      },
    ],
    targetEndpoints: ['/api/ai/reels/generate', '/api/jobs/:id'],
    metadata: {
      title: 'Générateur de Reels IA | Créalia',
      requiresSubscription: true,
    },
  },

  AI_AVATAR: {
    path: '/ai/avatar',
    component: 'AvatarCreatorPage',
    public: false,
    guards: ['auth', 'subscription'],
    targetEndpoints: ['/api/ai/avatar/generate'],
    metadata: {
      title: 'Créateur d\'Avatar IA | Créalia',
      requiresSubscription: true,
    },
  },

  AI_IMAGES: {
    path: '/ai/images',
    component: 'ImageGeneratorPage',
    public: false,
    guards: ['auth', 'subscription'],
    targetEndpoints: ['/api/ai/images/generate'],
    metadata: {
      title: 'Générateur d\'Images IA | Créalia',
      requiresSubscription: true,
    },
  },

  AI_VOICEOVER: {
    path: '/ai/voiceover',
    component: 'VoiceoverGeneratorPage',
    public: false,
    guards: ['auth', 'subscription'],
    targetEndpoints: ['/api/ai/voiceover/generate'],
    metadata: {
      title: 'Générateur de Voix Off IA | Créalia',
      requiresSubscription: true,
    },
  },

  AI_SUBTITLES: {
    path: '/ai/subtitles',
    component: 'SubtitlesGeneratorPage',
    public: false,
    guards: ['auth', 'subscription'],
    targetEndpoints: ['/api/ai/subtitles/generate'],
    metadata: {
      title: 'Générateur de Sous-titres IA | Créalia',
      requiresSubscription: true,
    },
  },

  AI_MEMES: {
    path: '/ai/memes',
    component: 'MemesGeneratorPage',
    public: false,
    guards: ['auth', 'subscription'],
    targetEndpoints: ['/api/ai/memes/generate'],
    metadata: {
      title: 'Générateur de Memes IA | Créalia',
      requiresSubscription: true,
    },
  },

  // ==================== STUDIO TOOLS ====================
  STUDIO_VIDEO_EDITOR: {
    path: '/studio/video-editor',
    component: 'VideoEditorPage',
    public: false,
    guards: ['auth', 'subscription'],
    buttons: [
      {
        id: 'btn-start-editing',
        label: 'Commencer le montage',
        type: 'api',
        target: '/api/studio/video/compose',
        requiresAuth: true,
      },
      {
        id: 'btn-view-tutorial',
        label: 'Voir un tutoriel',
        type: 'route',
        target: '/studio/video-editor/tutorial',
      },
    ],
    targetEndpoints: [
      '/api/studio/upload',
      '/api/studio/video/compose',
      '/api/jobs/:id',
    ],
    metadata: {
      title: 'Éditeur Vidéo | Créalia Studio',
      requiresSubscription: true,
    },
  },

  STUDIO_COLLAGE: {
    path: '/studio/collage',
    component: 'CollageCreatorPage',
    public: false,
    guards: ['auth', 'subscription'],
    targetEndpoints: ['/api/studio/collage/create'],
  },

  STUDIO_INSTAGRAM: {
    path: '/studio/instagram',
    component: 'InstagramEditorPage',
    public: false,
    guards: ['auth', 'subscription'],
    targetEndpoints: ['/api/studio/instagram/optimize'],
  },

  STUDIO_FACEBOOK: {
    path: '/studio/facebook',
    component: 'FacebookEditorPage',
    public: false,
    guards: ['auth', 'subscription'],
    targetEndpoints: ['/api/studio/facebook/optimize'],
  },

  STUDIO_ADD_MUSIC: {
    path: '/studio/add-music',
    component: 'AddMusicPage',
    public: false,
    guards: ['auth', 'subscription'],
    targetEndpoints: ['/api/studio/music/library', '/api/studio/music/upload'],
  },

  STUDIO_ADD_TEXT: {
    path: '/studio/add-text',
    component: 'AddTextPage',
    public: false,
    guards: ['auth', 'subscription'],
    targetEndpoints: ['/api/studio/text/render'],
  },

  // ==================== USER DASHBOARD ====================
  DASHBOARD: {
    path: '/dashboard',
    component: 'DashboardPage',
    public: false,
    guards: ['auth'],
    targetEndpoints: ['/api/user/profile', '/api/user/usage'],
    metadata: {
      title: 'Tableau de bord | Créalia',
    },
  },

  ACCOUNT: {
    path: '/account',
    component: 'AccountPage',
    public: false,
    guards: ['auth'],
    targetEndpoints: ['/api/user/update', '/api/user/delete'],
    metadata: {
      title: 'Mon compte | Créalia',
    },
  },

  // ==================== AFFILIATE ====================
  AFFILIATE: {
    path: '/affiliate',
    component: 'AffiliatePage',
    public: true,
    guards: ['auth_optional'],
    buttons: [
      {
        id: 'btn-become-affiliate',
        label: 'Devenir affilié',
        type: 'api',
        target: '/api/affiliate/register',
        requiresAuth: true,
      },
    ],
    targetEndpoints: ['/api/affiliate/register'],
    metadata: {
      title: 'Programme d\'affiliation | Créalia',
    },
  },

  // ==================== LEGAL ====================
  PRIVACY: {
    path: '/privacy',
    component: 'PrivacyPage',
    public: true,
    guards: [],
  },

  TERMS: {
    path: '/terms',
    component: 'TermsPage',
    public: true,
    guards: [],
  },

  ABOUT: {
    path: '/about',
    component: 'AboutPage',
    public: true,
    guards: [],
  },
}

/**
 * API ENDPOINT DEFINITIONS
 */
export const API_ENDPOINTS: Record<string, ApiEndpointConfig> = {
  // Health & Status
  HEALTH: {
    path: '/api/health',
    method: 'GET',
    auth: false,
    description: 'Health check endpoint',
  },

  // Stripe Checkout
  CREATE_CHECKOUT: {
    path: '/api/checkout/create-session',
    method: 'POST',
    auth: true,
    description: 'Create Stripe checkout session',
    body: {
      user_id: 'string',
      plan_id: 'string',
      billing_cycle: 'monthly|yearly',
      success_url: 'string',
      cancel_url: 'string',
    },
  },

  STRIPE_WEBHOOK: {
    path: '/api/stripe-webhook',
    method: 'POST',
    auth: false,
    description: 'Stripe webhook handler',
    events: [
      'checkout.session.completed',
      'invoice.payment_succeeded',
      'customer.subscription.updated',
      'customer.subscription.deleted',
    ],
  },

  CHECKOUT_SESSION_INFO: {
    path: '/api/checkout/session-info',
    method: 'GET',
    auth: true,
    description: 'Get checkout session details',
    query: {
      session_id: 'string',
    },
  },

  // Chat & Support
  CHAT_CREATE_SESSION: {
    path: '/api/chat/create-session',
    method: 'POST',
    auth: false,
    description: 'Create new chat session',
    body: {
      user_id: 'string|null',
    },
  },

  CHAT_MESSAGE: {
    path: '/api/chat/message',
    method: 'POST',
    auth: false,
    description: 'Send chat message',
    body: {
      chat_session_id: 'string',
      user_id: 'string|null',
      message: 'string',
    },
  },

  CHAT_HISTORY: {
    path: '/api/chat/history',
    method: 'GET',
    auth: false,
    description: 'Get chat history',
    query: {
      session_id: 'string',
    },
  },

  FAQ: {
    path: '/api/faq',
    method: 'GET',
    auth: false,
    description: 'Get FAQ items',
  },

  // AI Tools
  AI_GENERATE: {
    path: '/api/ai/:tool/generate',
    method: 'POST',
    auth: true,
    description: 'Generate AI content (reels, avatar, images, voiceover, subtitles, memes)',
    body: {
      prompt: 'string',
      options: 'object',
    },
  },

  JOB_STATUS: {
    path: '/api/jobs/:id',
    method: 'GET',
    auth: true,
    description: 'Get job status',
  },

  // Studio Tools
  STUDIO_UPLOAD: {
    path: '/api/studio/upload',
    method: 'POST',
    auth: true,
    description: 'Upload media file',
  },

  STUDIO_JOB: {
    path: '/api/studio/:tool/job',
    method: 'POST',
    auth: true,
    description: 'Create studio processing job',
  },

  // User Management
  USER_PROFILE: {
    path: '/api/user/profile',
    method: 'GET',
    auth: true,
    description: 'Get user profile',
  },

  USER_UPDATE: {
    path: '/api/user/update',
    method: 'PUT',
    auth: true,
    description: 'Update user profile',
  },

  USER_DELETE: {
    path: '/api/user/delete',
    method: 'DELETE',
    auth: true,
    description: 'Delete user account (GDPR)',
  },

  USER_USAGE: {
    path: '/api/user/usage',
    method: 'GET',
    auth: true,
    description: 'Get user usage statistics',
  },

  // Forum
  FORUM_TOPICS: {
    path: '/api/forum/topics',
    method: 'GET',
    auth: false,
    description: 'Get forum topics list',
  },

  FORUM_COMMENTS: {
    path: '/api/forum/topics/:id/comments',
    method: 'GET',
    auth: false,
    description: 'Get topic comments',
  },

  // Affiliate
  AFFILIATE_REGISTER: {
    path: '/api/affiliate/register',
    method: 'POST',
    auth: true,
    description: 'Register as affiliate',
  },
}

/**
 * BUTTON ID TO ROUTE/ACTION MAPPING
 */
export function getButtonAction(buttonId: string): ButtonAction | undefined {
  for (const route of Object.values(ROUTES)) {
    if (route.buttons) {
      const button = route.buttons.find(b => b.id === buttonId)
      if (button) return button
    }
  }
  return undefined
}

/**
 * GET ROUTE BY PATH
 */
export function getRoute(path: string): RouteConfig | undefined {
  return Object.values(ROUTES).find(r => r.path === path)
}

/**
 * CHECK IF ROUTE REQUIRES AUTH
 */
export function requiresAuth(path: string): boolean {
  const route = getRoute(path)
  return route ? !route.public : false
}

/**
 * CHECK IF ROUTE REQUIRES SUBSCRIPTION
 */
export function requiresSubscription(path: string): boolean {
  const route = getRoute(path)
  return route?.guards.includes('subscription') || false
}

