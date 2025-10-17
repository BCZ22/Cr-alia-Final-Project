"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 6 6 18" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m6 6 12 12" />
  </svg>
)

const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
)

const plans = [
  {
    name: "Créateur",
    monthlyPrice: "19", // Original monthly price kept
    annualMonthlyPrice: "13", // New annual monthly equivalent
    annualTotalPrice: "160", // New annual total price
    description: "50 vidéos d'IA par mois",
    features: ["40 minutes d'export", "30 minutes de voix off", "100 images IA", "Analytics de base", "Support email"],
    buttonText: "Choisir Créateur",
    popular: false,
  },
  {
    name: "Viral",
    monthlyPrice: "39", // Original monthly price kept
    annualMonthlyPrice: "27", // New annual monthly equivalent
    annualTotalPrice: "327", // New annual total price
    description: "150 vidéos d'IA par mois",
    features: [
      "2 heures d'export",
      "120 minutes de voix off",
      "300 images IA",
      "Analytics avancées",
      "Support prioritaire",
      "Templates premium",
    ],
    buttonText: "Choisir Viral",
    popular: true,
  },
  {
    name: "Pro",
    monthlyPrice: "79", // Original monthly price kept
    annualMonthlyPrice: "55", // New annual monthly equivalent
    annualTotalPrice: "664", // New annual total price
    description: "250 vidéos d'IA par mois",
    features: [
      "3 heures d'export",
      "180 minutes de voix off",
      "500 images IA",
      "Analytics complètes",
      "Support 24/7",
      "Templates illimités",
      "API access",
    ],
    buttonText: "Choisir Pro",
    popular: false,
  },
]

const featuresComparison = [
  {
    category: "Crédits Workflow",
    features: [
      { name: "Crédits inclus", hobby: "40 crédits inclus", viral: "120 crédits inclus", pro: "180 crédits inclus" },
    ],
  },
  {
    category: "Types de contenu",
    features: [
      { name: "Générateur de Reels IA", hobby: true, viral: true, pro: true },
      { name: "Créateur d'Avatar IA", hobby: false, viral: true, pro: true },
      { name: "Générateur d'Images IA", hobby: true, viral: true, pro: true },
      { name: "Générateur de Memes IA", hobby: false, viral: true, pro: true },
      { name: "Analytics avancées", hobby: false, viral: true, pro: true },
      { name: "Interface d'inspiration", hobby: false, viral: true, pro: true },
    ],
  },
]

const toolsComparison = [
  {
    category: "Outils IA",
    features: [
      {
        name: "Générateur de Voix Off IA",
        hobby: "30 minutes incluses",
        viral: "120 minutes incluses",
        pro: "180 minutes incluses",
      },
      {
        name: "Générateur de Sous-titres IA",
        hobby: "100 crédits inclus",
        viral: "300 crédits inclus",
        pro: "500 crédits inclus",
      },
      {
        name: "Crédits Créalia",
        hobby: "40 crédits inclus",
        viral: "120 crédits inclus",
        pro: "180 crédits inclus",
      },
    ],
  },
  {
    category: "Outils avancés",
    features: [
      { name: "Analytics de performance", hobby: false, viral: true, pro: true },
      { name: "Interface d'inspiration", hobby: false, viral: true, pro: true },
      { name: "Connexions plateformes", hobby: false, viral: true, pro: true },
      { name: "Support FAQ intégré", hobby: true, viral: true, pro: true },
    ],
  },
]

const faqData = [
  {
    question: "Puis-je annuler mon abonnement ?",
    answer:
      "Oui, vous pouvez annuler votre abonnement à tout moment depuis votre tableau de bord. L'annulation prendra effet à la fin de votre période de facturation actuelle.",
  },
  {
    question: "Qu'est-ce qu'un crédit workflow ?",
    answer:
      "Un crédit workflow vous permet de créer un contenu viral complet avec Créalia IA. Chaque création de vidéo, post ou story consomme un crédit.",
  },
  {
    question: "Combien de temps dure une vidéo Créalia ?",
    answer:
      "Les vidéos Créalia peuvent durer jusqu'à 5 minutes selon votre plan. La qualité et la durée dépendent des crédits Créalia disponibles.",
  },
  {
    question: "Créalia est-il gratuit ?",
    answer:
      "Créalia offre un essai gratuit de 14 jours. Après cette période, vous pouvez choisir parmi nos plans Créateur, Viral ou Pro selon vos besoins.",
  },
  {
    question: "Comment voir mon utilisation ?",
    answer:
      "Vous pouvez consulter votre utilisation actuelle, vos crédits restants et votre historique depuis votre tableau de bord personnel dans la section 'Mon compte'.",
  },
  {
    question: "Avez-vous une politique de remboursement ?",
    answer:
      "Oui, nous offrons un remboursement complet dans les 14 premiers jours si vous n'êtes pas satisfait. Après cette période, les remboursements sont évalués au cas par cas.",
  },
  {
    question: "Qu'est-ce qu'une minute d'export ?",
    answer:
      "Une minute d'export correspond au temps de traitement nécessaire pour finaliser et télécharger vos créations. Plus votre plan est élevé, plus vous avez de minutes d'export.",
  },
  {
    question: "Puis-je monétiser les vidéos créées avec Créalia ?",
    answer:
      "Absolument ! Tous les contenus créés avec Créalia vous appartiennent entièrement. Vous pouvez les monétiser sur toutes les plateformes sans restriction.",
  },
  {
    question: "Puis-je générer dans d'autres langues ?",
    answer:
      "Oui, Créalia supporte plus de 40 langues pour la génération de contenu, incluant le français, l'anglais, l'espagnol, l'allemand, et bien d'autres.",
  },
  {
    question: "Puis-je importer des images depuis ChatGPT vers Créalia ?",
    answer:
      "Oui, vous pouvez facilement importer des images générées par ChatGPT ou d'autres outils IA directement dans vos projets Créalia via notre interface de téléchargement.",
  },
]

interface PricingModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PricingModal({ isOpen, onClose }: PricingModalProps) {
  const [isYearly, setIsYearly] = useState(false)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-background rounded-3xl shadow-2xl animate-scale-up border border-border/50">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-secondary/80 transition-colors z-10"
        >
          <XIcon className="w-5 h-5" />
        </button>

        <div className="p-8 lg:p-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-balance">Tarification simple et transparente</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
              Simple, mais exceptionnellement puissant. Toutes les fonctionnalités dont vous avez besoin maintenant et
              quand vous atteignez des millions de vues.
            </p>
          </div>

          {/* Toggle */}
          <div className="flex items-center justify-center mb-12">
            <div className="flex items-center gap-4 p-1 bg-secondary/50 rounded-full">
              <button
                onClick={() => setIsYearly(false)}
                className={cn(
                  "px-6 py-2 rounded-full text-sm font-medium transition-all",
                  !isYearly ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                )}
              >
                Mensuel
              </button>
              <button
                onClick={() => setIsYearly(true)}
                className={cn(
                  "px-6 py-2 rounded-full text-sm font-medium transition-all",
                  isYearly ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                )}
              >
                Annuel <span className="text-green-500 ml-1">(économisez 20%)</span>
              </button>
            </div>
          </div>

          {/* Pricing cards */}
          <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
            {plans.map((plan, index) => (
              <div
                key={plan.name}
                className={cn(
                  "relative p-8 rounded-2xl border transition-all duration-300 hover:shadow-lg",
                  plan.popular
                    ? "border-primary bg-primary/5 scale-105"
                    : "border-border bg-card hover:border-border/80",
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium">
                      PLUS POPULAIRE !
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                  <div className="mb-2">
                    <span className="text-4xl font-bold">
                      ${isYearly ? plan.annualMonthlyPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-muted-foreground">/mois</span>
                  </div>
                  {isYearly && (
                    <p className="text-sm text-muted-foreground mb-2">
                      Facturé annuellement à {plan.annualTotalPrice} $
                    </p>
                  )}
                  <p className="text-muted-foreground text-sm">{plan.description}</p>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3">
                      <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  className={cn(
                    "w-full rounded-full py-3 font-medium transition-all",
                    plan.popular
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
                      : "bg-secondary hover:bg-secondary/80 text-foreground",
                  )}
                >
                  {plan.buttonText} →
                </Button>
              </div>
            ))}
          </div>

          {/* Features comparison table */}
          <div className="max-w-5xl mx-auto mb-12">
            <h3 className="text-2xl font-bold text-center mb-8">Fonctionnalités</h3>

            <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-4 gap-4 p-6 bg-secondary/30 border-b border-border/50">
                <div className="font-semibold text-muted-foreground">Créalia Workflows</div>
                <div className="text-center font-semibold">Créateur</div>
                <div className="text-center font-semibold text-primary">Viral</div>
                <div className="text-center font-semibold">Pro</div>
              </div>

              {/* Features rows */}
              {featuresComparison.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  {category.features.map((feature, featureIndex) => (
                    <div
                      key={featureIndex}
                      className="grid grid-cols-4 gap-4 p-6 border-b border-border/30 last:border-b-0 hover:bg-secondary/20 transition-colors"
                    >
                      <div className="font-medium">{feature.name}</div>
                      <div className="text-center">
                        {typeof feature.hobby === "string" ? (
                          <span className="text-sm text-muted-foreground">{feature.hobby}</span>
                        ) : feature.hobby ? (
                          <CheckIcon className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <div className="w-5 h-5 mx-auto rounded-full border-2 border-muted-foreground/30 flex items-center justify-center">
                            <div className="w-2 h-2 bg-muted-foreground/30 rounded-full" />
                          </div>
                        )}
                      </div>
                      <div className="text-center">
                        {typeof feature.viral === "string" ? (
                          <span className="text-sm text-muted-foreground">{feature.viral}</span>
                        ) : feature.viral ? (
                          <CheckIcon className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <div className="w-5 h-5 mx-auto rounded-full border-2 border-muted-foreground/30 flex items-center justify-center">
                            <div className="w-2 h-2 bg-muted-foreground/30 rounded-full" />
                          </div>
                        )}
                      </div>
                      <div className="text-center">
                        {typeof feature.pro === "string" ? (
                          <span className="text-sm text-muted-foreground">{feature.pro}</span>
                        ) : feature.pro ? (
                          <CheckIcon className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <div className="w-5 h-5 mx-auto rounded-full border-2 border-muted-foreground/30 flex items-center justify-center">
                            <div className="w-2 h-2 bg-muted-foreground/30 rounded-full" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Tools comparison table */}
          <div className="max-w-5xl mx-auto mb-12">
            <h3 className="text-2xl font-bold text-center mb-8">Outils Créalia</h3>

            <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-4 gap-4 p-6 bg-secondary/30 border-b border-border/50">
                <div className="font-semibold text-muted-foreground">Outils Créalia</div>
                <div className="text-center font-semibold">Créateur</div>
                <div className="text-center font-semibold text-primary">Viral</div>
                <div className="text-center font-semibold">Pro</div>
              </div>

              {/* Tools rows */}
              {toolsComparison.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  {category.features.map((feature, featureIndex) => (
                    <div
                      key={featureIndex}
                      className="grid grid-cols-4 gap-4 p-6 border-b border-border/30 last:border-b-0 hover:bg-secondary/20 transition-colors"
                    >
                      <div className="font-medium">{feature.name}</div>
                      <div className="text-center">
                        {typeof feature.hobby === "string" ? (
                          <span className="text-sm text-muted-foreground">{feature.hobby}</span>
                        ) : feature.hobby ? (
                          <CheckIcon className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <div className="w-5 h-5 mx-auto rounded-full border-2 border-muted-foreground/30 flex items-center justify-center">
                            <div className="w-2 h-2 bg-muted-foreground/30 rounded-full" />
                          </div>
                        )}
                      </div>
                      <div className="text-center">
                        {typeof feature.viral === "string" ? (
                          <span className="text-sm text-muted-foreground">{feature.viral}</span>
                        ) : feature.viral ? (
                          <CheckIcon className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <div className="w-5 h-5 mx-auto rounded-full border-2 border-muted-foreground/30 flex items-center justify-center">
                            <div className="w-2 h-2 bg-muted-foreground/30 rounded-full" />
                          </div>
                        )}
                      </div>
                      <div className="text-center">
                        {typeof feature.pro === "string" ? (
                          <span className="text-sm text-muted-foreground">{feature.pro}</span>
                        ) : feature.pro ? (
                          <CheckIcon className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <div className="w-5 h-5 mx-auto rounded-full border-2 border-muted-foreground/30 flex items-center justify-center">
                            <div className="w-2 h-2 bg-muted-foreground/30 rounded-full" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* FAQ section */}
          <div className="max-w-5xl mx-auto mb-12">
            <div className="text-center mb-12">
              <h3 className="text-lg font-semibold text-primary mb-2">FAQs</h3>
              <h2 className="text-3xl font-bold">Questions fréquemment posées</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {faqData.map((faq, index) => (
                <div
                  key={index}
                  className="bg-card border border-border/50 rounded-2xl p-6 hover:border-border/80 transition-colors"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <h4 className="font-medium text-foreground pr-4">{faq.question}</h4>
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center hover:bg-secondary/80 transition-colors">
                      <PlusIcon className={cn("w-4 h-4 transition-transform", expandedFaq === index && "rotate-45")} />
                    </div>
                  </button>
                  {expandedFaq === index && (
                    <div className="mt-4 pt-4 border-t border-border/30">
                      <p className="text-muted-foreground text-sm leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-12 pt-8 border-t border-border/50">
            <p className="text-muted-foreground text-sm">
              Tous les plans incluent un essai gratuit de 14 jours. Annulez à tout moment.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
