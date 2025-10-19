/**
 * Reels Generator Page
 * AI-powered Reels creation
 */

'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function ReelsPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleGenerate = async () => {
    if (!session?.user) {
      router.push('/auth/signin?callbackUrl=/reels')
      return
    }

    if (!prompt.trim()) return

    setLoading(true)

    try {
      const response = await fetch('/api/studio/video/compose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clips: [{ type: 'ai', prompt: prompt.trim() }],
          duration: 60,
        }),
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Generate error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 border border-primary/20 rounded-full mb-4">
            <span className="text-3xl">🎬</span>
            <span className="text-sm font-medium text-primary">Générateur de Reels IA</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Créez des Reels <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              viraux en IA
            </span>
          </h1>

          <p className="text-xl text-muted-foreground">
            Décrivez votre idée, notre IA crée le Reel parfait
          </p>
        </div>

        <Card className="glass-card p-8 mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Décrivez votre Reel
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ex: Un Reel sur les 5 meilleurs conseils pour créer du contenu viral sur Instagram..."
                className="w-full h-32 p-4 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                disabled={loading}
              />
            </div>

            <Button
              className="w-full btn-gradient"
              onClick={handleGenerate}
              disabled={!prompt.trim() || loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Générer mon Reel
                </>
              )}
            </Button>
          </div>
        </Card>

        {result && (
          <Card className="glass-card p-8">
            <h3 className="text-2xl font-bold mb-4">✅ Reel généré !</h3>
            <div className="space-y-4">
              <div className="bg-secondary/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-2">Job ID</p>
                <p className="font-mono text-sm">{result.jobId}</p>
              </div>

              <div className="bg-secondary/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-2">Statut</p>
                <p className="font-semibold">{result.status}</p>
              </div>

              {result.output && (
                <div className="bg-secondary/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-2">Résultat</p>
                  <p className="text-sm">Vidéo: {result.output.videoUrl}</p>
                  <p className="text-sm">Durée: {result.output.duration}s</p>
                </div>
              )}

              <p className="text-sm text-muted-foreground">
                💡 Mode mock activé. En production, ceci générerait un vrai Reel avec IA.
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
