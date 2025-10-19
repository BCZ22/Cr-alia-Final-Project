import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Éditeur Vidéo en Ligne | Créalia Studio',
  description: 'Éditeur vidéo professionnel en ligne. Montez vos vidéos directement dans votre navigateur sans installation.',
}

export default function VideoEditorPage() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center p-10 text-center bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 border border-primary/20 rounded-full mb-8">
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span className="text-sm font-medium text-primary">Éditeur Vidéo en Ligne</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6">
          Montage vidéo <br />
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            professionnel en ligne
          </span>
        </h1>

        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Créez des vidéos professionnelles directement dans votre navigateur. 
          Timeline avancée, effets, transitions et bien plus encore.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <button className="btn-gradient text-white font-semibold px-8 py-4 rounded-full text-lg">
            Commencer le montage
          </button>
          <button className="border-2 border-border hover:border-primary/40 px-8 py-4 rounded-full text-lg transition-all">
            Voir un tutoriel
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16">
          {[
            { icon: '✂️', title: 'Montage précis', desc: 'Timeline professionnelle' },
            { icon: '🎨', title: 'Effets & Transitions', desc: 'Bibliothèque complète' },
            { icon: '🎵', title: 'Audio avancé', desc: 'Mixage et synchronisation' },
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

