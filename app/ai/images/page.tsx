import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Générateur d\'Images IA | Créalia',
  description: 'Transformez vos idées en images époustouflantes avec notre générateur d\'images IA de pointe.',
}

export default function ImageGeneratorPage() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center p-10 text-center bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 border border-primary/20 rounded-full mb-8">
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-sm font-medium text-primary">Générateur d'Images IA</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6">
          De l'idée à l'image <br />
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            en quelques secondes
          </span>
        </h1>

        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Créez des images uniques et professionnelles simplement en décrivant ce que vous imaginez. 
          Parfait pour les posts, articles, présentations et plus encore.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <button className="btn-gradient text-white font-semibold px-8 py-4 rounded-full text-lg">
            Générer une image
          </button>
          <button className="border-2 border-border hover:border-primary/40 px-8 py-4 rounded-full text-lg transition-all">
            Explorer les exemples
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16">
          {[
            { icon: '🖼️', title: 'Haute qualité', desc: 'Résolution 4K et formats variés' },
            { icon: '🎨', title: 'Styles multiples', desc: 'Photo, illustration, 3D, art...' },
            { icon: '🔄', title: 'Variations infinies', desc: 'Générez autant que nécessaire' },
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

