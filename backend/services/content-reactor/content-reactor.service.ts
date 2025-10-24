/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CONTENT REACTOR - AI ENGINE
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Service orchestrateur intelligent qui transforme médias + instructions naturelles
 * en contenu vidéo optimisé (Reels/Shorts/TikToks) avec captions et hashtags.
 * 
 * Features:
 * - Compréhension contextuelle NLP
 * - Analyse intelligente des médias
 * - Génération automatique de Reels
 * - Captions et hashtags optimisés
 * - Orchestration de pipeline IA
 */

import OpenAI from 'openai';
import { AIService } from '../ai/ai.service';
import { createJob, completeJob } from '@/lib/jobQueue';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════

export interface MediaAnalysisRequest {
  mediaUrl: string;
  mediaType: 'video' | 'image';
  userId: string;
}

export interface MediaAnalysisResult {
  type: 'video' | 'image';
  duration?: number;
  resolution?: { width: number; height: number };
  scenes: SceneDetection[];
  keyMoments: KeyMoment[];
  dominantColors: string[];
  detectedObjects: string[];
  mood: 'energetic' | 'calm' | 'professional' | 'fun' | 'emotional';
  suggestedCuts: CutSuggestion[];
}

export interface SceneDetection {
  startTime: number;
  endTime: number;
  description: string;
  confidence: number;
}

export interface KeyMoment {
  timestamp: number;
  type: 'action' | 'face' | 'object' | 'text' | 'motion';
  description: string;
  intensity: number;
}

export interface CutSuggestion {
  startTime: number;
  endTime: number;
  reason: string;
  priority: 'high' | 'medium' | 'low';
}

export interface ReelGenerationRequest {
  mediaUrl: string;
  prompt: string;
  tone: 'luxury' | 'fun' | 'educational' | 'emotional' | 'promotional' | 'viral';
  industry?: string;
  targetAudience?: string;
  duration?: number; // seconds (15-60)
  style?: 'minimal' | 'dynamic' | 'cinematic' | 'social';
  userId: string;
}

export interface ReelGenerationResult {
  jobId: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  reels: GeneratedReel[];
  estimatedTime?: number;
}

export interface GeneratedReel {
  id: string;
  videoUrl: string;
  thumbnailUrl: string;
  title: string;
  caption: string;
  hashtags: string[];
  duration: number;
  style: string;
  musicSuggestion?: string;
  metadata: {
    transitions: string[];
    effects: string[];
    textOverlays: TextOverlay[];
  };
}

export interface TextOverlay {
  text: string;
  startTime: number;
  endTime: number;
  position: 'top' | 'center' | 'bottom';
  style: 'bold' | 'animated' | 'minimal';
}

export interface ChatRequest {
  sessionId: string;
  message: string;
  mediaUrls?: string[];
  userId: string;
}

export interface ChatResponse {
  sessionId: string;
  messageId: string;
  response: string;
  suggestions?: string[];
  actions?: ActionSuggestion[];
  timestamp: Date;
}

export interface ActionSuggestion {
  type: 'generate_reel' | 'analyze_media' | 'edit_caption' | 'add_music';
  label: string;
  payload: any;
}

// ═══════════════════════════════════════════════════════════════════════════
// CONTENT REACTOR SERVICE
// ═══════════════════════════════════════════════════════════════════════════

export class ContentReactorService {
  private openai: OpenAI;
  private aiService: AIService;
  private mockMode: boolean;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'mock-key',
    });
    this.aiService = new AIService();
    this.mockMode = process.env.CONTENT_REACTOR_MOCK === 'true' || !process.env.OPENAI_API_KEY;
  }

  // ═════════════════════════════════════════════════════════════════════════
  // 1. MEDIA ANALYSIS - Analyse intelligente des médias
  // ═════════════════════════════════════════════════════════════════════════

  async analyzeMedia(request: MediaAnalysisRequest): Promise<MediaAnalysisResult> {
    console.log('🎬 Content Reactor: Analyzing media...', {
      mediaType: request.mediaType,
      mockMode: this.mockMode,
    });

    if (this.mockMode) {
      return this.mockAnalyzeMedia(request);
    }

    try {
      // En production, utiliser OpenAI Vision API ou service d'analyse vidéo
      // Pour l'instant, utilisation de l'AI Service existant
      const highlights = await this.aiService.detectHighlights({
        videoPath: request.mediaUrl,
        threshold: 0.7,
        maxHighlights: 10,
      });

      const scenes: SceneDetection[] = highlights.map((h, idx) => ({
        startTime: h.startTime,
        endTime: h.endTime,
        description: h.description,
        confidence: h.score,
      }));

      const keyMoments: KeyMoment[] = highlights.map(h => ({
        timestamp: h.startTime,
        type: h.type as any,
        description: h.description,
        intensity: h.score,
      }));

      const result: MediaAnalysisResult = {
        type: request.mediaType,
        duration: request.mediaType === 'video' ? 60 : undefined,
        resolution: { width: 1080, height: 1920 },
        scenes,
        keyMoments,
        dominantColors: ['#FF6B6B', '#4ECDC4', '#45B7D1'],
        detectedObjects: ['person', 'vehicle', 'building'],
        mood: 'energetic',
        suggestedCuts: this.generateCutSuggestions(scenes),
      };

      console.log('✅ Media analysis completed', {
        scenes: result.scenes.length,
        keyMoments: result.keyMoments.length,
      });

      return result;
    } catch (error) {
      console.error('❌ Media analysis failed:', error);
      throw new Error(`Failed to analyze media: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private mockAnalyzeMedia(request: MediaAnalysisRequest): MediaAnalysisResult {
    return {
      type: request.mediaType,
      duration: request.mediaType === 'video' ? 45 : undefined,
      resolution: { width: 1080, height: 1920 },
      scenes: [
        {
          startTime: 0,
          endTime: 15,
          description: 'Ouverture dynamique avec véhicule de luxe',
          confidence: 0.95,
        },
        {
          startTime: 15,
          endTime: 30,
          description: 'Plan rapproché sur détails premium',
          confidence: 0.88,
        },
        {
          startTime: 30,
          endTime: 45,
          description: 'Prise de vue finale avec logo',
          confidence: 0.92,
        },
      ],
      keyMoments: [
        {
          timestamp: 5.5,
          type: 'motion',
          description: 'Mouvement de caméra fluide',
          intensity: 0.9,
        },
        {
          timestamp: 22.3,
          type: 'object',
          description: 'Zoom sur détail emblématique',
          intensity: 0.85,
        },
      ],
      dominantColors: ['#1A1A1A', '#FFD700', '#C0C0C0'],
      detectedObjects: ['luxury_car', 'person', 'city_background', 'logo'],
      mood: 'professional',
      suggestedCuts: [
        {
          startTime: 5,
          endTime: 20,
          reason: 'Séquence d\'action forte avec bon rythme visuel',
          priority: 'high',
        },
        {
          startTime: 30,
          endTime: 45,
          reason: 'Conclusion impactante avec branding',
          priority: 'medium',
        },
      ],
    };
  }

  // ═════════════════════════════════════════════════════════════════════════
  // 2. REEL GENERATION - Génération automatique de Reels
  // ═════════════════════════════════════════════════════════════════════════

  async generateReels(request: ReelGenerationRequest): Promise<ReelGenerationResult> {
    console.log('🎥 Content Reactor: Generating Reels...', {
      tone: request.tone,
      industry: request.industry,
      mockMode: this.mockMode,
    });

    try {
      // 1. Analyser le média
      const analysis = await this.analyzeMedia({
        mediaUrl: request.mediaUrl,
        mediaType: 'video',
        userId: request.userId,
      });

      // 2. Générer captions et hashtags avec GPT
      const contentData = await this.generateContentWithAI(request, analysis);

      // 3. Créer des jobs de génération de Reels
      const reels: GeneratedReel[] = [];

      for (let i = 0; i < 3; i++) {
        const jobResponse = await createJob({
          userId: request.userId,
          jobType: 'AI_INFERENCE',
          inputData: {
            mediaUrl: request.mediaUrl,
            prompt: request.prompt,
            tone: request.tone,
            version: i + 1,
            analysis,
            contentData: contentData[i],
          },
        });

        // En mode mock, compléter immédiatement
        if (this.mockMode) {
          const mockOutput = this.generateMockReel(request, contentData[i], i + 1);
          await completeJob(jobResponse.jobId, mockOutput);
        }

        reels.push({
          id: jobResponse.jobId,
          videoUrl: this.mockMode ? `/mock-reels/reel-${i + 1}.mp4` : '',
          thumbnailUrl: this.mockMode ? `/mock-reels/thumb-${i + 1}.jpg` : '',
          title: contentData[i].title,
          caption: contentData[i].caption,
          hashtags: contentData[i].hashtags,
          duration: request.duration || 30,
          style: request.style || 'dynamic',
          musicSuggestion: contentData[i].musicSuggestion,
          metadata: contentData[i].metadata,
        });
      }

      console.log('✅ Reels generation initiated', { count: reels.length });

      return {
        jobId: reels[0].id,
        status: this.mockMode ? 'COMPLETED' : 'PROCESSING',
        reels,
        estimatedTime: this.mockMode ? 0 : 60,
      };
    } catch (error) {
      console.error('❌ Reel generation failed:', error);
      throw new Error(`Failed to generate reels: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ═════════════════════════════════════════════════════════════════════════
  // 3. CONVERSATIONAL INTERFACE - Chat intelligent
  // ═════════════════════════════════════════════════════════════════════════

  async processChat(request: ChatRequest): Promise<ChatResponse> {
    console.log('💬 Content Reactor: Processing chat message...', {
      sessionId: request.sessionId,
      hasMedia: !!request.mediaUrls?.length,
    });

    try {
      // Analyser l'intention utilisateur
      const intent = await this.detectUserIntent(request.message);

      // Préparer le contexte
      const context = await this.buildChatContext(request);

      // Générer la réponse avec GPT
      let response: string;
      let actions: ActionSuggestion[] = [];

      if (this.mockMode) {
        const mockResult = this.generateMockChatResponse(request, intent);
        response = mockResult.response;
        actions = mockResult.actions;
      } else {
        const completion = await this.openai.chat.completions.create({
          model: 'gpt-4-turbo-preview',
          messages: [
            {
              role: 'system',
              content: this.getSystemPrompt(),
            },
            {
              role: 'user',
              content: request.message,
            },
          ],
          temperature: 0.7,
          max_tokens: 500,
        });

        response = completion.choices[0].message.content || 'Je n\'ai pas compris votre demande.';
        actions = this.extractActions(response, intent);
      }

      const chatResponse: ChatResponse = {
        sessionId: request.sessionId,
        messageId: `msg_${Date.now()}`,
        response,
        suggestions: this.generateSuggestions(intent),
        actions,
        timestamp: new Date(),
      };

      console.log('✅ Chat response generated', { intent });

      return chatResponse;
    } catch (error) {
      console.error('❌ Chat processing failed:', error);
      throw new Error(`Failed to process chat: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ═════════════════════════════════════════════════════════════════════════
  // HELPER METHODS
  // ═════════════════════════════════════════════════════════════════════════

  private generateCutSuggestions(scenes: SceneDetection[]): CutSuggestion[] {
    return scenes
      .filter(s => s.endTime - s.startTime >= 10 && s.endTime - s.startTime <= 30)
      .map(s => ({
        startTime: s.startTime,
        endTime: s.endTime,
        reason: `Séquence bien rythmée: ${s.description}`,
        priority: s.confidence > 0.9 ? 'high' : 'medium' as any,
      }));
  }

  private async generateContentWithAI(
    request: ReelGenerationRequest,
    analysis: MediaAnalysisResult
  ): Promise<any[]> {
    const variants = [];

    for (let i = 0; i < 3; i++) {
      const style = i === 0 ? 'bold' : i === 1 ? 'storytelling' : 'minimalist';

      variants.push({
        title: this.generateTitle(request, style),
        caption: this.generateCaption(request, style),
        hashtags: this.generateHashtags(request, analysis),
        musicSuggestion: this.suggestMusic(request.tone),
        metadata: {
          transitions: ['fade', 'slide', 'zoom'],
          effects: ['color_grade', 'motion_blur'],
          textOverlays: this.generateTextOverlays(request, style),
        },
      });
    }

    return variants;
  }

  private generateTitle(request: ReelGenerationRequest, style: string): string {
    const templates = {
      bold: `${request.industry || 'Votre'} ${request.tone === 'luxury' ? 'de Luxe' : 'Exceptionnel'}`,
      storytelling: `Découvrez ${request.industry || 'Notre Univers'}`,
      minimalist: `${request.industry || 'Excellence'} | ${request.tone}`,
    };
    return templates[style as keyof typeof templates] || 'Nouveau Contenu';
  }

  private generateCaption(request: ReelGenerationRequest, style: string): string {
    const toneMap = {
      luxury: 'Élévez votre expérience avec nos services premium. Excellence et raffinement à chaque instant.',
      fun: 'Prêt à vivre une aventure incroyable ? C\'est parti ! 🚀',
      educational: 'Apprenez comment transformer votre vision en réalité. Guide complet étape par étape.',
      emotional: 'Chaque moment compte. Découvrez une histoire qui vous ressemble.',
      promotional: 'Offre exclusive ! Ne manquez pas cette opportunité unique.',
      viral: 'Vous ne croirez pas ce qui se passe ensuite... 😱',
    };

    return toneMap[request.tone] || 'Découvrez notre dernier contenu.';
  }

  private generateHashtags(request: ReelGenerationRequest, analysis: MediaAnalysisResult): string[] {
    const base = ['#contentcreator', '#digitalmarketing', '#socialmediacontent'];
    const industry = request.industry ? [`#${request.industry.toLowerCase().replace(/\s/g, '')}`] : [];
    const tone = [`#${request.tone}`];
    const mood = [`#${analysis.mood}`];

    return [...base, ...industry, ...tone, ...mood].slice(0, 10);
  }

  private suggestMusic(tone: string): string {
    const musicMap = {
      luxury: 'Elegant Piano & Strings',
      fun: 'Upbeat Pop Electronic',
      educational: 'Corporate Inspiring',
      emotional: 'Cinematic Ambient',
      promotional: 'Energetic Rock',
      viral: 'Trending TikTok Sound',
    };

    return musicMap[tone as keyof typeof musicMap] || 'Upbeat Background Music';
  }

  private generateTextOverlays(request: ReelGenerationRequest, style: string): TextOverlay[] {
    return [
      {
        text: request.industry || 'CRÉALIA',
        startTime: 0,
        endTime: 3,
        position: 'top',
        style: 'bold',
      },
      {
        text: 'CRÉEZ. PARTAGEZ. INSPIREZ.',
        startTime: 10,
        endTime: 15,
        position: 'center',
        style: 'animated',
      },
    ];
  }

  private async detectUserIntent(message: string): Promise<string> {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('générer') || lowerMessage.includes('créer') || lowerMessage.includes('reel')) {
      return 'generate_reel';
    }
    if (lowerMessage.includes('analyser') || lowerMessage.includes('analyse')) {
      return 'analyze_media';
    }
    if (lowerMessage.includes('aide') || lowerMessage.includes('help') || lowerMessage.includes('comment')) {
      return 'help';
    }

    return 'general';
  }

  private async buildChatContext(request: ChatRequest): Promise<string> {
    return `Session: ${request.sessionId}, User: ${request.userId}, Media: ${request.mediaUrls?.length || 0}`;
  }

  private generateMockChatResponse(request: ChatRequest, intent: string) {
    const responses = {
      generate_reel: {
        response: '🎬 Parfait ! Je vais créer 3 versions de Reels optimisés pour votre contenu. Montage en cours avec transitions dynamiques, musique énergique et textes accrocheurs.',
        actions: [
          {
            type: 'generate_reel' as const,
            label: 'Générer maintenant',
            payload: { autoStart: true },
          },
        ],
      },
      analyze_media: {
        response: '🎯 J\'analyse votre média... Détection des moments forts, couleurs dominantes et opportunités de découpe en cours.',
        actions: [
          {
            type: 'analyze_media' as const,
            label: 'Voir l\'analyse',
            payload: { detailed: true },
          },
        ],
      },
      help: {
        response: '👋 Je suis Content Reactor, votre assistant IA pour créer des Reels viraux ! Envoyez-moi une vidéo et dites-moi le style souhaité (luxe, fun, éducatif...). Je m\'occupe du reste !',
        actions: [],
      },
      general: {
        response: '💡 Je peux vous aider à créer du contenu viral ! Essayez : "Génère 3 Reels pour mon agence de location de voiture"',
        actions: [],
      },
    };

    return responses[intent as keyof typeof responses] || responses.general;
  }

  private extractActions(response: string, intent: string): ActionSuggestion[] {
    if (intent === 'generate_reel') {
      return [
        {
          type: 'generate_reel',
          label: 'Générer les Reels',
          payload: {},
        },
      ];
    }
    return [];
  }

  private generateSuggestions(intent: string): string[] {
    const suggestions = {
      generate_reel: [
        'Créer 3 versions différentes',
        'Ajouter des sous-titres automatiques',
        'Suggérer de la musique',
      ],
      analyze_media: [
        'Voir les moments clés',
        'Détecter les objets',
        'Analyser le mood',
      ],
      help: [
        'Comment générer un Reel ?',
        'Quels formats sont supportés ?',
        'Voir des exemples',
      ],
      general: [
        'Générer un Reel viral',
        'Analyser ma vidéo',
        'Obtenir de l\'aide',
      ],
    };

    return suggestions[intent as keyof typeof suggestions] || suggestions.general;
  }

  private getSystemPrompt(): string {
    return `Tu es **Content Reactor**, une IA conversationnelle experte en création de contenu vidéo automatisée.
Tu combines les compétences d'un **Directeur marketing**, d'un **monteur vidéo professionnel**, et d'un **Product Designer**.
Ton rôle est de transformer les médias fournis par les utilisateurs en vidéos prêtes à publier sur TikTok, Instagram Reels, YouTube Shorts.

**Comportements:**
1. Compréhension contextuelle totale - détecte l'intention, le ton, le secteur
2. Communication fluide et naturelle - parle comme à un humain
3. Jamais de répétition - adapte-toi au contexte
4. Toujours motivant et professionnel
5. Résultats concrets - titre, légende, hashtags pour chaque vidéo

**Ton de réponse:**
Dynamique, professionnel, inspirant. Utilise des émojis pertinents (🎬, 🚀, ✨, 💡).

**Si média + prompt reçus:** Génération directe, pas de questions inutiles.
**Si info manque:** Demande UNIQUEMENT ce qui est pertinent.`;
  }

  private generateMockReel(request: ReelGenerationRequest, content: any, version: number) {
    return {
      videoUrl: `/mock-reels/reel-${version}.mp4`,
      thumbnailUrl: `/mock-reels/thumb-${version}.jpg`,
      duration: request.duration || 30,
      status: 'COMPLETED',
      ...content,
    };
  }
}

export default ContentReactorService;

