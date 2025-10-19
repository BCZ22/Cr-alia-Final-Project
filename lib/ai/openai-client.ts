/**
 * OpenAI Client
 * Singleton instance for OpenAI API
 */

import OpenAI from 'openai'

if (!process.env.OPENAI_API_KEY) {
  console.warn('OPENAI_API_KEY is not defined. Chat features will not work.')
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-mock-key',
})

export default openai

