"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { FeatureModules } from "@/components/feature-modules"
import { AIAssistant } from "@/components/ai-assistant"
import { SupportChat } from "@/components/support-chat"
import { SignupModal } from "@/components/signup-modal"
import { SignupModalDark } from "@/components/signup-modal-dark"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Footer } from "@/components/footer"

const SparklesIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
    />
  </svg>
)

const PlayIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m9 12 2 2 4-4" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
    />
  </svg>
)

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m12 5 7 7-7 7" />
  </svg>
)

const TrendingUpIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
)

export default function HomePage() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isSignupOpen, setIsSignupOpen] = useState(false)
  const [isSignupDarkOpen, setIsSignupDarkOpen] = useState(false)

  return (
    <div className="min-h-screen startup-gradient">
      <Navigation />

      <section className="section-padding pt-32">
        <div className="container-modern">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 border border-primary/20 rounded-full mb-12 animate-fade-in">
              <SparklesIcon className="w-4 h-4 text-primary animate-pulse-subtle" />
              <span className="text-sm font-medium text-primary">Plateforme #1 pour créateurs</span>
            </div>

            <h1 className="text-5xl md:text-8xl font-bold text-balance mb-8 animate-slide-up text-pretty">
              Créez du contenu
              <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">viral</span>
              <br />
              avec l'IA
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto text-balance mb-12 animate-slide-up leading-relaxed">
              Transformez vos idées en Reels viraux, analysez vos performances et générez des concepts créatifs
              illimités.
              <br />
              La suite complète pour dominer les réseaux sociaux.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-slide-up">
              <Button
                size="lg"
                className="btn-gradient text-white font-medium px-12 py-4 text-lg rounded-full"
                onClick={() => setIsSignupDarkOpen(true)}
              >
                Commencer gratuitement
                <SparklesIcon className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-border hover:border-primary/40 px-12 py-4 text-lg rounded-full transition-all duration-300 bg-transparent"
                onClick={() => setIsSignupDarkOpen(true)}
              >
                Voir la démo
                <PlayIcon className="w-5 h-5 ml-2" />
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center mt-20 animate-slide-up">
              {[
                { metric: "10K+", label: "Créateurs actifs" },
                { metric: "50M+", label: "Vues générées" },
                { metric: "95%", label: "Taux de satisfaction" },
                { metric: "24/7", label: "Support client" },
              ].map((stat, index) => (
                <div key={index} className="glass-card p-6 rounded-2xl card-hover">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.metric}</div>
                  <div className="text-muted-foreground font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-card/50">
        <div className="container-modern">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold text-balance mb-6">Comment ça marche</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
              Créez du contenu viral en 3 étapes simples avec l'intelligence artificielle
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Décrivez votre idée",
                description: "Partagez votre concept ou laissez notre IA générer des idées tendances pour vous",
                icon: "💡",
              },
              {
                step: "02",
                title: "L'IA crée votre contenu",
                description:
                  "Notre intelligence artificielle génère scripts, visuels et montage optimisés pour la viralité. Modifiez ensuite selon vos préférences ou dictez vos instructions à l'IA",
                icon: "🤖",
              },
              {
                step: "03",
                title: "Publiez et analysez",
                description: "Publiez directement sur vos réseaux et suivez les performances en temps réel",
                icon: "📈",
              },
            ].map((item, index) => (
              <Card key={index} className="glass-card p-8 text-center card-hover">
                <div className="text-4xl mb-6">{item.icon}</div>
                <div className="text-sm font-mono text-primary mb-4">{item.step}</div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-modern">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold text-balance mb-6">Fonctionnalités puissantes</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
              Tous les outils dont vous avez besoin pour dominer les réseaux sociaux
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Génération de Scripts IA",
                description: "Scripts optimisés pour l'engagement et la viralité",
                icon: "✍️",
              },
              {
                title: "Création Visuelle",
                description: "Visuels et animations générés automatiquement",
                icon: "🎨",
              },
              {
                title: "Analytics Avancées",
                description: "Suivi détaillé des performances et insights",
                icon: "📊",
              },
              {
                title: "Publication Multi-Plateformes",
                description: "Publiez sur tous vos réseaux en un clic",
                icon: "🚀",
              },
              {
                title: "Tendances en Temps Réel",
                description: "Restez à jour avec les dernières tendances",
                icon: "🔥",
              },
              {
                title: "Optimisation SEO",
                description: "Hashtags et descriptions optimisés automatiquement",
                icon: "🎯",
              },
            ].map((feature, index) => (
              <Card key={index} className="glass-card p-6 card-hover">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-card/50">
        <div className="container-modern">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold text-balance mb-6">Ils nous font confiance</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
              Plus de 10,000 créateurs utilisent Créalia pour créer du contenu viral
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                name: "Marie Dubois",
                role: "Influenceuse Mode",
                content:
                  "Créalia a révolutionné ma création de contenu. Mes Reels atteignent maintenant des millions de vues !",
                avatar: "👩‍💼",
                stats: "2.3M vues",
              },
              {
                name: "Thomas Martin",
                role: "Créateur Tech",
                content:
                  "L'IA de Créalia comprend parfaitement les tendances. Mes vidéos sont devenues virales en quelques heures.",
                avatar: "👨‍💻",
                stats: "1.8M vues",
              },
              {
                name: "Sophie Laurent",
                role: "Coach Business",
                content: "Grâce à Créalia, je crée 10x plus de contenu en divisant mon temps par 5. Incroyable !",
                avatar: "👩‍🎓",
                stats: "950K vues",
              },
            ].map((testimonial, index) => (
              <Card key={index} className="glass-card p-6 card-hover">
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-3">{testimonial.avatar}</div>
                  <div>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4 leading-relaxed">"{testimonial.content}"</p>
                <div className="text-sm font-bold text-primary">{testimonial.stats}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-modern">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold text-balance mb-6">Questions fréquentes</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
              Tout ce que vous devez savoir sur Créalia
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {[
              {
                question: "Comment Créalia génère-t-il du contenu viral ?",
                answer:
                  "Notre IA analyse les tendances en temps réel, les algorithmes des plateformes et les contenus les plus performants pour créer des scripts et visuels optimisés pour la viralité.",
              },
              {
                question: "Sur quelles plateformes puis-je publier ?",
                answer:
                  "Créalia supporte Instagram, TikTok, YouTube Shorts, Facebook Reels, X (Twitter), Pinterest et LinkedIn. Vous pouvez publier sur toutes ces plateformes simultanément.",
              },
              {
                question: "L'essai gratuit inclut-il toutes les fonctionnalités ?",
                answer:
                  "Oui, l'essai gratuit de 14 jours inclut l'accès complet à toutes les fonctionnalités premium sans limitation.",
              },
              {
                question: "Puis-je personnaliser le contenu généré ?",
                answer:
                  "Absolument ! Vous pouvez modifier tous les éléments générés : scripts, visuels, hashtags et descriptions selon vos préférences. Vous pouvez également dicter vos instructions directement à l'IA de Créalia pour des modifications personnalisées en temps réel.",
              },
              {
                question: "Y a-t-il un support client disponible ?",
                answer: "Notre équipe support est disponible 24/7 via chat en direct et email pour vous accompagner.",
              },
              {
                question: "Comment puis-je donner des instructions à l'IA ?",
                answer:
                  "Vous pouvez communiquer avec l'IA de Créalia de plusieurs façons : saisie de texte, commandes vocales, ou instructions détaillées. L'IA comprend vos demandes et adapte le contenu en conséquence pour correspondre exactement à votre vision.",
              },
            ].map((faq, index) => (
              <Card key={index} className="glass-card p-6">
                <h3 className="text-xl font-bold mb-3">{faq.question}</h3>
                <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
              </Card>
            ))}
          </div>

          <div className="text-center mt-16">
            <p className="text-muted-foreground mb-6">Vous avez d'autres questions ?</p>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
              onClick={() => setIsChatOpen(true)}
            >
              Contacter le support
            </Button>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-modern">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
            <div className="lg:col-span-2">
              <FeatureModules />
            </div>
            <div className="animate-slide-up">
              <AIAssistant />
            </div>
          </div>
        </div>
      </section>

      <SupportChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <SignupModal isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} />
      <SignupModalDark isOpen={isSignupDarkOpen} onClose={() => setIsSignupDarkOpen(false)} />

      <Footer />
    </div>
  )
}
