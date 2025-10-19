/**
 * Community Page
 * Discord and Forum integration
 */

'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function CommunityPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [discordInvite, setDiscordInvite] = useState<string>('')

  // Get Discord invite
  useEffect(() => {
    fetch('/api/discord/invite')
      .then((res) => res.json())
      .then((data) => setDiscordInvite(data.inviteUrl))
      .catch((error) => console.error('Failed to get Discord invite:', error))
  }, [])

  const handleJoinDiscord = () => {
    if (discordInvite) {
      window.open(discordInvite, '_blank', 'noopener,noreferrer')
    }
  }

  const handleViewForum = () => {
    router.push('/community/forum')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-4">
      <div className="max-w-6xl mx-auto py-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 border border-primary/20 rounded-full mb-8">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-sm font-medium text-primary">Communauté</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Rejoignez la <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              communauté Créalia
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Échangez avec 10,000+ créateurs, partagez vos réussites et apprenez des meilleurs
          </p>
        </div>

        {/* Main Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Discord Card */}
          <Card className="glass-card p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-[#5865F2] rounded-2xl flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold">Discord</h2>
                <p className="text-sm text-muted-foreground">10,000+ membres actifs</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">💬</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Discussions en temps réel</h3>
                  <p className="text-sm text-muted-foreground">
                    Échangez instantanément avec d'autres créateurs
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">🎓</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Formations exclusives</h3>
                  <p className="text-sm text-muted-foreground">
                    Webinaires et tutoriels réservés aux membres
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">🎁</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Événements & Giveaways</h3>
                  <p className="text-sm text-muted-foreground">
                    Concours, défis créatifs et cadeaux réguliers
                  </p>
                </div>
              </div>
            </div>

            <Button
              className="w-full btn-gradient"
              onClick={handleJoinDiscord}
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
              Rejoindre Discord
            </Button>
          </Card>

          {/* Forum Card */}
          <Card className="glass-card p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
                <svg className="w-10 h-10 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold">Forum</h2>
                <p className="text-sm text-muted-foreground">Discussions détaillées</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">📝</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Questions & Réponses</h3>
                  <p className="text-sm text-muted-foreground">
                    Posez vos questions et obtenez des réponses détaillées
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">🎨</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Showcase créatif</h3>
                  <p className="text-sm text-muted-foreground">
                    Partagez vos créations et recevez des feedbacks
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">💡</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Tutoriels & Guides</h3>
                  <p className="text-sm text-muted-foreground">
                    Ressources créées par la communauté
                  </p>
                </div>
              </div>
            </div>

            <Button
              className="w-full"
              variant="outline"
              onClick={handleViewForum}
            >
              Voir le forum
            </Button>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { value: '10K+', label: 'Membres' },
            { value: '50K+', label: 'Messages' },
            { value: '1,000+', label: 'Topics' },
            { value: '24/7', label: 'Support' },
          ].map((stat, index) => (
            <Card key={index} className="glass-card p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </Card>
          ))}
        </div>

        {/* Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Catégories populaires</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { name: 'Général', icon: '💬', count: 250 },
              { name: 'Reels & Shorts', icon: '🎬', count: 189 },
              { name: 'IA & Automatisation', icon: '🤖', count: 156 },
              { name: 'Monétisation', icon: '💰', count: 134 },
              { name: 'Showcase', icon: '🎨', count: 98 },
              { name: 'Feedback', icon: '💡', count: 76 },
            ].map((category, index) => (
              <Card
                key={index}
                className="glass-card p-4 hover:border-primary/40 transition-colors cursor-pointer"
                onClick={() => router.push(`/community/forum?category=${category.name}`)}
              >
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{category.icon}</div>
                  <div>
                    <h3 className="font-bold">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.count} topics</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
