import { apiClient } from '../api/client'

export interface AIGenerateRequest {
  prompt: string
  options?: {
    model?: string
    maxTokens?: number
    temperature?: number
    stream?: boolean
  }
}

export interface AIGenerateResponse {
  result: string
  meta?: {
    model: string
    tokens: number
    duration: number
  }
}

export interface AIHistoryItem {
  id: string
  prompt: string
  result: string
  createdAt: string
  model: string
}

export class AIClient {
  private static readonly MOCK_MODE = process.env.NEXT_PUBLIC_MOCK_AI === 'true'

  // Generate content with AI
  static async generate(request: AIGenerateRequest): Promise<AIGenerateResponse> {
    if (this.MOCK_MODE) {
      return this.mockGenerate(request)
    }

    const response = await apiClient.post<AIGenerateResponse>('/ai/generate', request)
    
    if (!response.ok || !response.data) {
      throw new Error(response.error || 'Erreur lors de la génération de contenu')
    }

    return response.data
  }

  // Get AI generation history
  static async getHistory(limit = 10, offset = 0): Promise<AIHistoryItem[]> {
    if (this.MOCK_MODE) {
      return this.mockGetHistory(limit, offset)
    }

    const response = await apiClient.get<AIHistoryItem[]>(`/ai/history?limit=${limit}&offset=${offset}`)
    
    if (!response.ok || !response.data) {
      throw new Error(response.error || 'Erreur lors de la récupération de l\'historique')
    }

    return response.data
  }

  // Generate with streaming (for real-time responses)
  static async generateStream(
    request: AIGenerateRequest,
    onChunk: (chunk: string) => void,
    onComplete: (result: AIGenerateResponse) => void,
    onError: (error: Error) => void
  ): Promise<void> {
    if (this.MOCK_MODE) {
      return this.mockGenerateStream(request, onChunk, onComplete, onError)
    }

    try {
      const response = await fetch('/api/ai/generate-stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({ ...request, options: { ...request.options, stream: true } }),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la génération en streaming')
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('Streaming non supporté')
      }

      let result = ''
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              if (data.content) {
                result += data.content
                onChunk(data.content)
              }
              if (data.done) {
                onComplete({
                  result,
                  meta: data.meta,
                })
                return
              }
            } catch (e) {
              // Ignore malformed JSON
            }
          }
        }
      }
    } catch (error) {
      onError(error as Error)
    }
  }

  // Mock implementation for development
  private static async mockGenerate(request: AIGenerateRequest): Promise<AIGenerateResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

    const mockResponses = [
      "Voici un contenu généré par l'IA basé sur votre prompt : " + request.prompt,
      "L'IA a créé du contenu viral pour vous : " + request.prompt,
      "Contenu optimisé pour les réseaux sociaux : " + request.prompt,
      "Génération de contenu créatif : " + request.prompt,
    ]

    const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)]

    return {
      result: randomResponse,
      meta: {
        model: 'mock-model-v1',
        tokens: Math.floor(Math.random() * 1000) + 100,
        duration: Math.floor(Math.random() * 2000) + 1000,
      },
    }
  }

  private static async mockGetHistory(limit: number, offset: number): Promise<AIHistoryItem[]> {
    const mockHistory: AIHistoryItem[] = [
      {
        id: '1',
        prompt: 'Créer un Reel viral sur la mode',
        result: 'Voici un concept de Reel viral pour la mode...',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        model: 'mock-model-v1',
      },
      {
        id: '2',
        prompt: 'Générer du contenu pour TikTok',
        result: 'Contenu optimisé pour TikTok...',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        model: 'mock-model-v1',
      },
    ]

    return mockHistory.slice(offset, offset + limit)
  }

  private static async mockGenerateStream(
    request: AIGenerateRequest,
    onChunk: (chunk: string) => void,
    onComplete: (result: AIGenerateResponse) => void,
    onError: (error: Error) => void
  ): Promise<void> {
    try {
      const mockText = "Voici un contenu généré en streaming : " + request.prompt
      const words = mockText.split(' ')
      
      let result = ''
      for (let i = 0; i < words.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200))
        const chunk = words[i] + (i < words.length - 1 ? ' ' : '')
        result += chunk
        onChunk(chunk)
      }

      onComplete({
        result,
        meta: {
          model: 'mock-model-v1',
          tokens: words.length,
          duration: 2000,
        },
      })
    } catch (error) {
      onError(error as Error)
    }
  }
}

export default AIClient
