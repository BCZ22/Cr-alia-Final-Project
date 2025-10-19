import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ajouter de la Musique | Créalia Studio',
  description: 'Ajoutez de la musique à vos vidéos. Bibliothèque de musiques libres de droits et synchronisation automatique.',
}

export default function AddMusicPage() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center p-10 text-center bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 border border-primary/20 rounded-full mb-8">
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
          <span className="text-sm font-medium text-primary">Ajouter de la Musique</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6">
          Musiques <br />
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            pour vos vidéos
          </span>
        </h1>

        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Accédez à une bibliothèque de milliers de musiques libres de droits. 
          Synchronisez automatiquement avec vos vidéos et ajustez le volume en temps réel.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <button className="btn-gradient text-white font-semibold px-8 py-4 rounded-full text-lg">
            Explorer la bibliothèque
          </button>
          <button className="border-2 border-border hover:border-primary/40 px-8 py-4 rounded-full text-lg transition-all">
            Importer ma musique
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16">
          {[
            { icon: '🎵', title: '10,000+ titres', desc: 'Musiques libres de droits' },
            { icon: '🎚️', title: 'Contrôle avancé', desc: 'Volume, fade in/out, timing' },
            { icon: '🎼', title: 'Genres variés', desc: 'Pop, rock, électro, classique...' },
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

