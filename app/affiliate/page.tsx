import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Programme d\'affiliation | Créalia',
  description: 'Rejoignez le programme d\'affiliation Créalia et gagnez jusqu\'à 30% de commission sur chaque vente.',
}

export default function AffiliateProgramPage() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center p-10 text-center bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 border border-primary/20 rounded-full mb-8">
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium text-primary">Programme d'affiliation</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6">
          Gagnez jusqu'à <br />
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            30% de commission
          </span>
        </h1>

        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Rejoignez notre programme d'affiliation et gagnez des commissions récurrentes 
          en recommandant Créalia à votre audience.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <button className="btn-gradient text-white font-semibold px-8 py-4 rounded-full text-lg">
            Devenir affilié
          </button>
          <button className="border-2 border-border hover:border-primary/40 px-8 py-4 rounded-full text-lg transition-all">
            En savoir plus
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16">
          {[
            { icon: '💰', title: 'Jusqu\'à 30%', desc: 'Commission sur chaque vente' },
            { icon: '🔄', title: 'Commissions récurrentes', desc: 'Tant que le client est actif' },
            { icon: '📊', title: 'Dashboard dédié', desc: 'Suivez vos performances en temps réel' },
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

