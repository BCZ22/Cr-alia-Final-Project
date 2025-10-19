/**
 * AI Module - Public API
 * Exports AI utilities
 */

export { openai, default as openaiClient } from './openai-client'

export {
  createChatSession,
  sendChatMessage,
  getChatHistory,
  getUserChatSessions,
  endChatSession,
  sendMockChatMessage,
} from './chat-service'

export type { CreateChatParams, SendMessageParams, ChatResponse } from './chat-service'

