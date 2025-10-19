import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Générateur de Voix Off IA | Créalia',
  description: 'Créez des voix off naturelles et professionnelles pour vos vidéos avec l\'intelligence artificielle.',
}

export default function VoiceoverGeneratorPage() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center p-10 text-center bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 border border-primary/20 rounded-full mb-8">
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
          <span className="text-sm font-medium text-primary">Générateur de Voix Off IA</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6">
          Des voix naturelles <br />
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            générées par l'IA
          </span>
        </h1>

        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Transformez votre texte en voix off professionnelle en quelques secondes. 
          Plus de 50 voix naturelles disponibles en français et dans 30+ langues.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <button className="btn-gradient text-white font-semibold px-8 py-4 rounded-full text-lg">
            Essayer maintenant
          </button>
          <button className="border-2 border-border hover:border-primary/40 px-8 py-4 rounded-full text-lg transition-all">
            Écouter des exemples
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16">
          {[
            { icon: '🎙️', title: '50+ voix', desc: 'Hommes, femmes, accents variés' },
            { icon: '🌍', title: 'Multilingue', desc: 'Support de 30+ langues' },
            { icon: '⚙️', title: 'Contrôle total', desc: 'Vitesse, ton, emphase...' },
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

