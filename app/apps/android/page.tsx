import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Application Android | Créalia',
  description: 'Téléchargez l\'application Créalia pour Android. Créez du contenu viral depuis votre smartphone ou tablette Android.',
}

export default function AndroidAppPage() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center p-10 text-center bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 border border-primary/20 rounded-full mb-8">
          <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.6 10.5l-.1-.1-1.4-2.4c.1-.2.1-.4 0-.6l-.1-.1c-.1-.1-.4-.1-.5 0l-.1.1c-.1.1-.1.4 0 .5l1.3 2.3H7.3l1.3-2.3c.1-.1.1-.4 0-.5l-.1-.1c-.1-.1-.4-.1-.5 0l-.1.1c-.1.2-.1.4 0 .6l-1.4 2.4-.1.1c-1.1 0-2 .9-2 2v5c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2v-5c0-1.1-.9-2-2-2zm-1 7H7.4v-5h9.2v5zM16 20l1-1.5h2L16 22l-3-3.5h2l1 1.5zm-8 0l-1-1.5H5L8 22l3-3.5H9l-1 1.5z"/>
          </svg>
          <span className="text-sm font-medium text-primary">Application Android</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6">
          Créalia sur <br />
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Android
          </span>
        </h1>

        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Créez, éditez et publiez du contenu viral directement depuis votre appareil Android. 
          Performance et simplicité réunies.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <button className="btn-gradient text-white font-semibold px-8 py-4 rounded-full text-lg flex items-center justify-center gap-2">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
            </svg>
            Télécharger sur Google Play
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16">
          {[
            { icon: '🤖', title: 'Compatible Android 8+', desc: 'Fonctionne sur tous les appareils' },
            { icon: '⚡', title: 'Performance optimale', desc: 'Rapide et fluide' },
            { icon: '🔄', title: 'Synchronisation', desc: 'Cloud sync automatique' },
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

