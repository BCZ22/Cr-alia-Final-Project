import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Générateur de Memes IA | Créalia',
  description: 'Créez des memes viraux et humoristiques en quelques secondes avec l\'intelligence artificielle.',
}

export default function MemesGeneratorPage() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center p-10 text-center bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 border border-primary/20 rounded-full mb-8">
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium text-primary">Générateur de Memes IA</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6">
          Des memes viraux <br />
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            créés par l'IA
          </span>
        </h1>

        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Générez des memes hilarants et tendances en quelques secondes. 
          Notre IA connaît tous les formats populaires et crée du contenu viral.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <button className="btn-gradient text-white font-semibold px-8 py-4 rounded-full text-lg">
            Créer un meme
          </button>
          <button className="border-2 border-border hover:border-primary/40 px-8 py-4 rounded-full text-lg transition-all">
            Voir la galerie
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16">
          {[
            { icon: '🔥', title: 'Formats tendances', desc: 'Tous les templates populaires' },
            { icon: '😂', title: 'Humour IA', desc: 'Textes drôles générés automatiquement' },
            { icon: '⚡', title: 'Création rapide', desc: 'Meme prêt en 10 secondes' },
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

