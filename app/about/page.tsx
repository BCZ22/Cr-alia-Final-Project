import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'À propos | Créalia',
  description: 'Découvrez Créalia, la plateforme de création de contenu viral propulsée par l\'intelligence artificielle.',
}

export default function AboutPage() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center p-10 text-center bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 border border-primary/20 rounded-full mb-8">
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium text-primary">À propos</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6">
          Nous rendons la création <br />
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            accessible à tous
          </span>
        </h1>

        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Créalia est née d'une vision simple : démocratiser la création de contenu viral 
          grâce à l'intelligence artificielle. Notre mission est d'offrir aux créateurs, 
          entrepreneurs et artistes les outils les plus puissants pour donner vie à leurs idées.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16">
          {[
            {
              icon: '🎯',
              title: 'Notre mission',
              desc: 'Rendre la création de contenu viral accessible à tous les créateurs'
            },
            {
              icon: '💡',
              title: 'Notre vision',
              desc: 'Devenir la plateforme #1 pour la création assistée par IA'
            },
            {
              icon: '❤️',
              title: 'Nos valeurs',
              desc: 'Innovation, simplicité et respect de la créativité'
            }
          ].map((item, i) => (
            <div key={i} className="glass-card p-8 rounded-2xl">
              <div className="text-5xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="pt-16">
          <h2 className="text-3xl font-bold mb-8">L'équipe Créalia</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Nous sommes une équipe passionnée d'ingénieurs, designers et créateurs 
            dédiés à construire les meilleurs outils de création de contenu.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12">
          {[
            { metric: '10K+', label: 'Créateurs actifs' },
            { metric: '500M+', label: 'Vues générées' },
            { metric: '95%', label: 'Satisfaction' },
            { metric: '24/7', label: 'Support' }
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">{stat.metric}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

