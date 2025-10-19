/**
 * AI Image Generator Page
 * DALL-E / Stable Diffusion integration
 */

'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function ImagesPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<any[]>([])

  const handleGenerate = async () => {
    if (!session?.user) {
      router.push('/auth/signin?callbackUrl=/images')
      return
    }

    if (!prompt.trim()) return

    setLoading(true)

    try {
      const response = await fetch('/api/ai/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          size: '1024x1024',
          n: 1,
        }),
      })

      const data = await response.json()
      if (data.images) {
        setImages(data.images)
      }
    } catch (error) {
      console.error('Generate error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-4">
      <div className="max-w-6xl mx-auto py-8">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 border border-primary/20 rounded-full mb-4">
            <span className="text-3xl">🎨</span>
            <span className="text-sm font-medium text-primary">Générateur d'Images IA</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Créez des images <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              uniques avec l'IA
            </span>
          </h1>

          <p className="text-xl text-muted-foreground">
            Décrivez votre image, l'IA la crée en quelques secondes
          </p>
        </div>

        <Card className="glass-card p-8 mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Décrivez votre image
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ex: Un créateur de contenu moderne travaillant sur son ordinateur dans un studio minimaliste avec des néons violets..."
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Générer l'image
                </>
              )}
            </Button>
          </div>
        </Card>

        {images.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {images.map((image, index) => (
              <Card key={index} className="glass-card p-4">
                <div className="relative w-full aspect-square mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={image.url}
                    alt={image.prompt}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {image.prompt}
                </p>
                <Button className="w-full" variant="outline">
                  Télécharger
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
