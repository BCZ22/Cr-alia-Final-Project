import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Chat en direct 24/7 | Support Créalia',
  description: 'Besoin d\'aide ? Notre équipe support est disponible 24h/24 et 7j/7 pour répondre à toutes vos questions.',
}

export default function LiveChatPage() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center p-10 text-center bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 border border-primary/20 rounded-full mb-8">
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="text-sm font-medium text-primary">Chat en direct 24/7</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6">
          Support disponible <br />
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            24h/24 et 7j/7
          </span>
        </h1>

        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Notre équipe d'experts est toujours là pour vous aider. 
          Posez vos questions et obtenez des réponses instantanées par chat en direct.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <button className="btn-gradient text-white font-semibold px-8 py-4 rounded-full text-lg">
            Démarrer une conversation
          </button>
          <button className="border-2 border-border hover:border-primary/40 px-8 py-4 rounded-full text-lg transition-all">
            Consulter la FAQ
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16">
          {[
            { icon: '⚡', title: 'Réponses rapides', desc: 'Temps de réponse < 2 minutes' },
            { icon: '👥', title: 'Équipe experte', desc: 'Support qualifié et sympathique' },
            { icon: '🌍', title: 'Multilingue', desc: 'Support en français et anglais' },
          ].map((feature, i) => (
            <div key={i} className="glass-card p-6 rounded-2xl">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

