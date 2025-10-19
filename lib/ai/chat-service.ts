/**
 * Chat Service
 * AI-powered chat functionality using OpenAI
 */

import { openai } from './openai-client'
import { ChatRepository, UserRepository } from '@/lib/db/repositories'
import type { ChatMessageRole } from '@prisma/client'

export interface CreateChatParams {
  userId?: string
  initialMessage?: string
}

export interface SendMessageParams {
  sessionId: string
  message: string
  userId?: string
}

export interface ChatResponse {
  sessionId: string
  messageId: string
  content: string
  role: ChatMessageRole
}

/**
 * System prompt for Créalia AI assistant
 */
const SYSTEM_PROMPT = `Tu es l'assistant IA de Créalia, une plateforme de création de contenu viral.

**Ton rôle :**
- Aider les créateurs à générer des idées de contenu viral
- Conseiller sur les meilleures pratiques pour Instagram, TikTok, YouTube
- Répondre aux questions sur l'utilisation de Créalia
- Être créatif, enthousiaste et professionnel

**Ce que tu peux faire :**
- Générer des idées de Reels/Shorts viraux
- Suggérer des hooks accrocheurs
- Conseiller sur les tendances actuelles
- Aider avec la création de scripts
- Expliquer les fonctionnalités de Créalia

**Ton style :**
- Amical et accessible
- Créatif et inspirant
- Concis mais informatif
- Utilise des emojis avec modération 🎬✨
- Réponds toujours en français

**Limites :**
- Tu ne peux pas créer de contenu directement (mais tu guides l'utilisateur)
- Tu ne peux pas accéder aux données privées des utilisateurs
- Tu ne donnes pas de conseils financiers ou juridiques

Si l'utilisateur demande quelque chose hors de ton domaine, redirige-le poliment vers le support client.`

/**
 * Create a new chat session
 */
export async function createChatSession(
  params: CreateChatParams
): Promise<ChatResponse | null> {
  try {
    // Create session in database
    const session = await ChatRepository.createSession({
      userId: params.userId,
      sessionToken: crypto.randomUUID(),
      context: {
        createdAt: new Date().toISOString(),
        initialMessage: params.initialMessage,
      },
    })

    // Add system message
    await ChatRepository.createMessage({
      chatSessionId: session.id,
      role: 'SYSTEM',
      content: SYSTEM_PROMPT,
    })

    // If initial message provided, process it
    if (params.initialMessage) {
      return await sendChatMessage({
        sessionId: session.id,
        message: params.initialMessage,
        userId: params.userId,
      })
    }

    // Return welcome message
    const welcomeMessage = await ChatRepository.createMessage({
      chatSessionId: session.id,
      role: 'ASSISTANT',
      content:
        "Bonjour ! 👋 Je suis l'assistant IA de Créalia. Comment puis-je vous aider aujourd'hui ? Je peux vous aider à générer des idées de contenu viral, des scripts, ou répondre à vos questions sur Créalia.",
    })

    return {
      sessionId: session.id,
      messageId: welcomeMessage.id,
      content: welcomeMessage.content,
      role: welcomeMessage.role,
    }
  } catch (error) {
    console.error('Failed to create chat session:', error)
    return null
  }
}

/**
 * Send a message and get AI response
 */
export async function sendChatMessage(
  params: SendMessageParams
): Promise<ChatResponse> {
  const { sessionId, message, userId } = params

  try {
    // Track usage if user is authenticated
    if (userId) {
      await UserRepository.incrementChatMessages(userId)
    }

    // Save user message
    const userMessage = await ChatRepository.createMessage({
      chatSessionId: sessionId,
      role: 'USER',
      content: message,
    })

    // Get conversation history (last 20 messages)
    const history = await ChatRepository.getMessages(sessionId, 20)

    // Build messages for OpenAI
    const messages: Array<{ role: string; content: string }> = history.map(
      (msg) => ({
        role: msg.role.toLowerCase(),
        content: msg.content,
      })
    )

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: messages as any,
      temperature: 0.7,
      max_tokens: 800,
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
    })

    const aiResponse = completion.choices[0].message.content || "Désolé, je n'ai pas pu générer une réponse."

    // Save AI response
    const assistantMessage = await ChatRepository.createMessage({
      chatSessionId: sessionId,
      role: 'ASSISTANT',
      content: aiResponse,
      metadata: {
        model: completion.model,
        tokens: completion.usage?.total_tokens,
        finishReason: completion.choices[0].finish_reason,
      },
    })

    return {
      sessionId,
      messageId: assistantMessage.id,
      content: aiResponse,
      role: 'ASSISTANT',
    }
  } catch (error) {
    console.error('Failed to send chat message:', error)

    // Save error message
    const errorMessage = await ChatRepository.createMessage({
      chatSessionId: sessionId,
      role: 'ASSISTANT',
      content:
        "Désolé, j'ai rencontré une erreur. Veuillez réessayer dans un instant ou contacter le support si le problème persiste.",
    })

    return {
      sessionId,
      messageId: errorMessage.id,
      content: errorMessage.content,
      role: 'ASSISTANT',
    }
  }
}

/**
 * Get chat history
 */
export async function getChatHistory(sessionId: string, limit = 50) {
  try {
    const messages = await ChatRepository.getMessages(sessionId, limit)

    // Filter out system messages for display
    return messages
      .filter((msg) => msg.role !== 'SYSTEM')
      .map((msg) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        createdAt: msg.createdAt,
      }))
  } catch (error) {
    console.error('Failed to get chat history:', error)
    return []
  }
}

/**
 * Get user's chat sessions
 */
export async function getUserChatSessions(userId: string) {
  try {
    return await ChatRepository.getChatHistory(userId, 10)
  } catch (error) {
    console.error('Failed to get user chat sessions:', error)
    return []
  }
}

/**
 * End chat session
 */
export async function endChatSession(sessionId: string) {
  try {
    await ChatRepository.endSession(sessionId)
    return { success: true }
  } catch (error) {
    console.error('Failed to end chat session:', error)
    return { success: false }
  }
}

/**
 * Mock mode for development/testing without OpenAI key
 */
export async function sendMockChatMessage(
  params: SendMessageParams
): Promise<ChatResponse> {
  const { sessionId, message, userId } = params

  // Save user message
  await ChatRepository.createMessage({
    chatSessionId: sessionId,
    role: 'USER',
    content: message,
  })

  // Track usage
  if (userId) {
    await UserRepository.incrementChatMessages(userId)
  }

  // Generate mock response based on message
  let mockResponse = "Ceci est une réponse simulée (mode MOCK activé). "

  if (message.toLowerCase().includes('reel') || message.toLowerCase().includes('vidéo')) {
    mockResponse +=
      "Pour créer un Reel viral, je vous suggère : 1) Commencer par un hook accrocheur dans les 3 premières secondes, 2) Utiliser des sous-titres, 3) Ajouter une musique tendance. Utilisez notre générateur de Reels IA pour des idées personnalisées ! 🎬"
  } else if (message.toLowerCase().includes('idée') || message.toLowerCase().includes('inspiration')) {
    mockResponse +=
      "Voici quelques idées de contenu viral : 1) Tutoriel rapide (15-30s), 2) Avant/Après transformation, 3) Top 5 conseils, 4) Réaction à une tendance, 5) Behind the scenes. Quelle niche vous intéresse ? 💡"
  } else {
    mockResponse +=
      "Je peux vous aider avec des idées de contenu, des scripts, ou répondre à vos questions sur Créalia. Comment puis-je vous aider ? ✨"
  }

  // Save mock response
  const assistantMessage = await ChatRepository.createMessage({
    chatSessionId: sessionId,
    role: 'ASSISTANT',
    content: mockResponse,
    metadata: { mode: 'mock' },
  })

  return {
    sessionId,
    messageId: assistantMessage.id,
    content: mockResponse,
    role: 'ASSISTANT',
  }
}

