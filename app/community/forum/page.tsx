/**
 * Forum Page
 * Community discussions and topics
 */

'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Topic {
  id: string
  title: string
  content: string
  category: string | null
  isPinned: boolean
  views: number | null
  commentCount: number
  createdAt: string
  user: {
    id: string
    name: string | null
    avatar: string | null
  }
}

export default function ForumPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session } = useSession()

  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  // Load topics
  useEffect(() => {
    const category = searchParams.get('category') || ''
    setSelectedCategory(category)

    const query = new URLSearchParams()
    if (category) query.set('category', category)

    fetch(`/api/forum/topics?${query}`)
      .then((res) => res.json())
      .then((data) => {
        setTopics(data.topics || [])
      })
      .catch((error) => console.error('Failed to load topics:', error))
      .finally(() => setLoading(false))
  }, [searchParams])

  const handleCreateTopic = () => {
    if (!session?.user) {
      router.push('/auth/signin?callbackUrl=/community/forum')
      return
    }
    router.push('/community/forum/new')
  }

  const handleTopicClick = (topicId: string) => {
    router.push(`/community/forum/${topicId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-4">
      <div className="max-w-6xl mx-auto py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Forum Créalia
              {selectedCategory && (
                <span className="text-2xl text-muted-foreground ml-3">
                  → {selectedCategory}
                </span>
              )}
            </h1>
            <p className="text-muted-foreground">
              Échangez avec la communauté des créateurs
            </p>
          </div>

          <Button className="btn-gradient" onClick={handleCreateTopic}>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nouveau topic
          </Button>
        </div>

        {/* Topics List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        ) : topics.length === 0 ? (
          <Card className="glass-card p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold mb-2">Aucun topic trouvé</h3>
            <p className="text-muted-foreground mb-6">
              Soyez le premier à créer un topic dans cette catégorie !
            </p>
            <Button onClick={handleCreateTopic}>Créer un topic</Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {topics.map((topic) => (
              <Card
                key={topic.id}
                className="glass-card p-6 hover:border-primary/40 transition-colors cursor-pointer"
                onClick={() => handleTopicClick(topic.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {topic.isPinned && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
                          📌 Épinglé
                        </span>
                      )}
                      {topic.category && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary">
                          {topic.category}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold mb-2 hover:text-primary transition-colors">
                      {topic.title}
                    </h3>

                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {topic.content}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">
                          {topic.user.name?.[0] || '?'}
                        </div>
                        <span>{topic.user.name || 'Anonyme'}</span>
                      </div>

                      <span>•</span>

                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        <span>{topic.commentCount} réponses</span>
                      </div>

                      {topic.views !== null && (
                        <>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span>{topic.views} vues</span>
                          </div>
                        </>
                      )}

                      <span>•</span>

                      <span>
                        {new Date(topic.createdAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

