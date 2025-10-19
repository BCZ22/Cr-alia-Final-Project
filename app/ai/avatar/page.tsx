import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Créateur d\'Avatar IA | Créalia',
  description: 'Créez des avatars personnalisés et professionnels avec l\'intelligence artificielle en quelques clics.',
}

export default function AvatarCreatorPage() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center p-10 text-center bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 border border-primary/20 rounded-full mb-8">
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-sm font-medium text-primary">Créateur d'Avatar IA</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6">
          Votre avatar unique <br />
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            créé par l'IA
          </span>
        </h1>

        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Générez des avatars professionnels et personnalisés pour vos réseaux sociaux, 
          sites web et contenus créatifs. Des centaines de styles disponibles.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <button className="btn-gradient text-white font-semibold px-8 py-4 rounded-full text-lg">
            Créer mon avatar
          </button>
          <button className="border-2 border-border hover:border-primary/40 px-8 py-4 rounded-full text-lg transition-all">
            Voir la galerie
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16">
          {[
            { icon: '🎭', title: 'Styles variés', desc: 'Réaliste, cartoon, artistic...' },
            { icon: '⚡', title: 'Génération rapide', desc: 'Résultats en moins de 30 secondes' },
            { icon: '🎨', title: 'Personnalisation', desc: 'Ajustez tous les détails' },
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

