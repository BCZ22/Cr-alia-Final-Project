"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 6 6 18" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m6 6 12 12" />
  </svg>
)

const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} cx="11" cy="11" r="8" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-4.35-4.35" />
  </svg>
)

const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m6 9 6 6 6-6" />
  </svg>
)

const HelpCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} cx="12" cy="12" r="10" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 17h.01" />
  </svg>
)

const SparklesIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09z"
    />
  </svg>
)

interface FAQInterfaceProps {
  isOpen: boolean
  onClose: () => void
}

const faqCategories = [
  {
    id: "general",
    name: "Général",
    icon: "🏠",
    color: "bg-purple-100",
    questions: [
      {
        question: "Qu'est-ce que Créalia ?",
        answer:
          "Créalia est une plateforme complète de création de contenu alimentée par l'IA, conçue pour aider les créateurs, marketeurs et entreprises à produire du contenu engageant pour toutes les plateformes sociales. Notre IA analyse les tendances, votre audience et vos objectifs pour générer du contenu personnalisé et des stratégies optimisées.",
      },
      {
        question: "Comment fonctionne l'IA de création de contenu ?",
        answer:
          "Notre IA utilise des modèles de langage avancés entraînés sur des millions de contenus performants. Elle analyse votre secteur, votre audience cible, les tendances actuelles et vos objectifs pour générer du contenu adapté à chaque plateforme avec des hooks, structures et formats optimisés.",
      },
      {
        question: "Quelles plateformes sociales sont supportées ?",
        answer:
          "Créalia supporte 8 plateformes principales : Instagram, TikTok, YouTube, Facebook, X/Twitter, LinkedIn, Pinterest et Snapchat. Chaque plateforme dispose d'optimisations spécifiques (formats, longueurs, hashtags, timing) pour maximiser l'engagement.",
      },
      {
        question: "Puis-je essayer Créalia gratuitement ?",
        answer:
          "Oui ! Nous offrons un essai gratuit de 14 jours avec accès complet à toutes les fonctionnalités premium : génération de contenu illimitée, analytics avancés, planification automatique et support prioritaire.",
      },
      {
        question: "Créalia remplace-t-il ma créativité ?",
        answer:
          "Non, Créalia amplifie votre créativité ! L'IA génère des idées, structures et suggestions que vous pouvez personnaliser, modifier et adapter selon votre style. Vous gardez le contrôle créatif total tout en gagnant un temps précieux.",
      },
    ],
  },
  {
    id: "ai-content",
    name: "IA & Création",
    icon: "🤖",
    color: "bg-blue-100",
    questions: [
      {
        question: "Comment l'IA génère-t-elle du contenu original ?",
        answer:
          "Notre IA combine analyse sémantique, patterns de performance et créativité algorithmique. Elle ne copie jamais de contenu existant mais crée des variations originales basées sur des structures éprouvées, votre brief et les meilleures pratiques de chaque plateforme.",
      },
      {
        question: "Puis-je personnaliser le ton et le style de l'IA ?",
        answer:
          "Absolument ! Vous pouvez définir votre persona de marque : ton (professionnel, décontracté, humoristique), style (informatif, inspirant, provocateur), vocabulaire spécifique et même des expressions récurrentes. L'IA s'adapte à votre identité unique.",
      },
      {
        question: "L'IA peut-elle créer des visuels et des images ?",
        answer:
          "Oui ! Créalia génère des images personnalisées, des miniatures YouTube, des visuels Instagram, des infographies Pinterest et des designs adaptés à chaque plateforme. Vous pouvez spécifier style, couleurs, éléments et composition.",
      },
      {
        question: "Comment l'IA adapte-t-elle le contenu à chaque plateforme ?",
        answer:
          "L'IA maîtrise les spécificités de chaque plateforme : longueur optimale, formats préférés, hashtags performants, timing de publication, types d'engagement et algorithmes. Un même concept est automatiquement décliné pour maximiser la performance sur chaque réseau.",
      },
      {
        question: "Puis-je entraîner l'IA avec mon contenu existant ?",
        answer:
          "Oui ! Vous pouvez importer vos meilleurs contenus pour que l'IA apprenne votre style, vos sujets de prédilection et vos formulations. Plus vous l'alimentez, plus elle devient précise et alignée avec votre marque.",
      },
      {
        question: "L'IA peut-elle créer des scripts vidéo complets ?",
        answer:
          "Parfaitement ! L'IA génère des scripts détaillés avec hooks d'ouverture, structure narrative, transitions, call-to-action et même des indications de montage. Formats supportés : TikTok, Reels, YouTube, Stories et vidéos longues.",
      },
      {
        question: "Comment l'IA gère-t-elle les tendances et l'actualité ?",
        answer:
          "Notre IA surveille en temps réel les tendances émergentes, hashtags populaires, formats viraux et actualités de votre secteur. Elle propose automatiquement des adaptations créatives pour surfer sur les trends tout en restant authentique à votre marque.",
      },
    ],
  },
  {
    id: "platforms",
    name: "Plateformes Spécialisées",
    icon: "📱",
    color: "bg-green-100",
    questions: [
      {
        question: "Comment optimiser mon contenu LinkedIn avec l'IA ?",
        answer:
          "L'IA LinkedIn de Créalia maîtrise le personal branding, thought leadership et networking B2B. Elle génère des posts qui positionnent votre expertise, des carrousels éducatifs, des stories professionnelles et des stratégies de croissance d'audience qualifiée.",
      },
      {
        question: "L'IA peut-elle créer des scripts TikTok viraux ?",
        answer:
          "Oui ! Notre IA TikTok analyse les patterns viraux, hooks efficaces, transitions captivantes et trends actuels. Elle génère des scripts de 15-60 secondes avec timing précis, suggestions musicales et techniques de rétention d'audience.",
      },
      {
        question: "Comment l'IA aide-t-elle pour Instagram ?",
        answer:
          "L'IA Instagram excelle dans les captions engageantes, concepts de Reels, Stories interactives, carrousels informatifs et stratégies de hashtags. Elle adapte le contenu selon vos objectifs : notoriété, engagement, croissance d'audience ou conversion.",
      },
      {
        question: "L'IA peut-elle optimiser mes vidéos YouTube ?",
        answer:
          "Absolument ! L'IA YouTube crée des titres accrocheurs, descriptions SEO, scripts structurés, hooks de rétention, miniatures conceptuelles et stratégies d'optimisation. Elle optimise pour l'algorithme YouTube et l'engagement long-terme.",
      },
      {
        question: "Comment l'IA gère-t-elle Pinterest et le SEO visuel ?",
        answer:
          "L'IA Pinterest maîtrise le SEO visuel : descriptions optimisées, mots-clés performants, designs d'épingles attractifs, organisation de tableaux thématiques et stratégies de trafic vers votre site web.",
      },
      {
        question: "L'IA peut-elle créer du contenu pour X/Twitter ?",
        answer:
          "Oui ! L'IA X/Twitter excelle dans les threads éducatifs, tweets d'opinion nuancés, live-tweeting d'événements, engagement communautaire et stratégies de croissance d'influence dans votre niche.",
      },
      {
        question: "Comment optimiser mon contenu Facebook avec l'IA ?",
        answer:
          "L'IA Facebook génère des posts engageants pour pages et groupes, des stratégies de communauté, du contenu événementiel, des campagnes publicitaires optimisées et des formats adaptés à l'algorithme Facebook.",
      },
      {
        question: "L'IA peut-elle créer du contenu pour Snapchat ?",
        answer:
          "Parfaitement ! L'IA Snapchat maîtrise les Stories éphémères, les Snaps créatifs, les filtres personnalisés, les campagnes Discover et les stratégies d'engagement pour une audience jeune et dynamique.",
      },
    ],
  },
  {
    id: "analytics",
    name: "Analytics & Performance",
    icon: "📊",
    color: "bg-orange-100",
    questions: [
      {
        question: "Comment connecter mes comptes sociaux en toute sécurité ?",
        answer:
          "Utilisez Créalia Analytics > Connexions, cliquez 'Gérer' pour chaque plateforme (Instagram, TikTok, YouTube, Facebook, X/Twitter, LinkedIn, Pinterest, Snapchat). Nous utilisons OAuth 2.0 sécurisé, chiffrement bancaire et ne stockons jamais vos mots de passe. Vous pouvez révoquer l'accès à tout moment.",
      },
      {
        question: "Quelles métriques avancées puis-je analyser ?",
        answer:
          "Suivez engagement rate, reach organique, impressions, clics, conversions, croissance d'audience, meilleurs horaires de publication, performance par type de contenu et analyses prédictives de performance sur toutes les plateformes connectées.",
      },
      {
        question: "L'IA peut-elle prédire la performance de mon contenu ?",
        answer:
          "Oui ! Notre IA analyse vos données historiques sur Instagram, TikTok, YouTube, Facebook, X/Twitter, LinkedIn, Pinterest et Snapchat, les tendances actuelles et patterns d'engagement pour prédire la performance probable d'un contenu avant publication.",
      },
      {
        question: "Comment interpréter mes rapports analytics ?",
        answer:
          "Créalia transforme vos données cross-platform en insights actionnables : identification des contenus top-performers par réseau, audiences les plus engagées, meilleurs créneaux de publication et recommandations personnalisées d'amélioration.",
      },
      {
        question: "Puis-je comparer mes performances entre plateformes ?",
        answer:
          "Absolument ! Le dashboard unifié compare vos KPIs entre Instagram, TikTok, YouTube, Facebook, X/Twitter, LinkedIn, Pinterest et Snapchat : engagement rate par réseau, audiences communes, contenus les plus performants et allocation optimale de vos efforts créatifs.",
      },
      {
        question: "L'IA peut-elle identifier mes meilleurs créneaux de publication ?",
        answer:
          "Oui ! L'IA analyse vos données d'engagement sur toutes les plateformes connectées, habitudes de votre audience et algorithmes spécifiques pour identifier vos créneaux optimaux par réseau social, jour de la semaine et type de contenu.",
      },
    ],
  },
  {
    id: "strategy",
    name: "Stratégie & Planification",
    icon: "🎯",
    color: "bg-purple-100",
    questions: [
      {
        question: "Comment créer un calendrier éditorial avec l'IA ?",
        answer:
          "L'IA génère des calendriers personnalisés pour toutes vos plateformes (Instagram, TikTok, YouTube, Facebook, X/Twitter, LinkedIn, Pinterest, Snapchat) : fréquence optimale par réseau, mix de contenus équilibré, événements saisonniers et planification jusqu'à 3 mois.",
      },
      {
        question: "L'IA peut-elle développer ma stratégie de croissance ?",
        answer:
          "Parfaitement ! L'IA analyse votre niche, concurrence et objectifs pour créer des stratégies sur-mesure par plateforme : acquisition d'audience, engagement communautaire, positionnement d'expert et synergies cross-platform.",
      },
      {
        question: "Comment l'IA m'aide-t-elle à trouver ma niche ?",
        answer:
          "L'IA analyse vos compétences, passions, marché potentiel et concurrence sur toutes les plateformes pour identifier votre niche optimale. Elle évalue la demande par réseau social et votre différenciation unique pour maximiser vos chances de succès.",
      },
      {
        question: "Puis-je automatiser ma stratégie de hashtags ?",
        answer:
          "Oui ! L'IA recherche et teste continuellement les hashtags les plus performants pour votre niche sur Instagram, TikTok, LinkedIn, Pinterest et X/Twitter. Elle crée des pools de hashtags par thématique et plateforme, analyse leur performance et adapte automatiquement vos stratégies.",
      },
      {
        question: "L'IA peut-elle planifier des campagnes multi-plateformes ?",
        answer:
          "Absolument ! L'IA orchestre des campagnes cohérentes sur Instagram, TikTok, YouTube, Facebook, X/Twitter, LinkedIn, Pinterest et Snapchat : message unifié adapté à chaque réseau, timing synchronisé, contenus complémentaires et suivi de performance globale.",
      },
      {
        question: "Comment l'IA optimise-t-elle ma stratégie de contenu ?",
        answer:
          "L'IA calcule l'efficacité de chaque contenu par plateforme : coût de création vs engagement généré, conversions obtenues, croissance d'audience et impact sur vos objectifs. Elle recommande les formats et sujets les plus performants pour chaque réseau.",
      },
    ],
  },
  {
    id: "advanced",
    name: "Fonctionnalités Avancées",
    icon: "⚡",
    color: "bg-indigo-100",
    questions: [
      {
        question: "Comment utiliser l'IA pour le personal branding ?",
        answer:
          "L'IA développe votre marque personnelle sur toutes les plateformes : identification de votre expertise unique, création de contenus qui renforcent votre positionnement sur LinkedIn, Instagram, YouTube, networking stratégique et construction d'autorité dans votre domaine.",
      },
      {
        question: "L'IA peut-elle créer des séries de contenus cohérentes ?",
        answer:
          "Oui ! L'IA planifie des séries thématiques cross-platform : formats récurrents adaptés à chaque réseau (Instagram, TikTok, YouTube, Facebook, X/Twitter, LinkedIn, Pinterest, Snapchat), progression narrative, hooks de continuité et engagement soutenu.",
      },
      {
        question: "Comment l'IA gère-t-elle la saisonnalité de mon contenu ?",
        answer:
          "L'IA intègre calendrier marketing, événements sectoriels, fêtes, saisons et moments clés de votre audience sur toutes les plateformes. Elle anticipe et prépare vos contenus saisonniers pour maximiser la pertinence et l'engagement sur chaque réseau.",
      },
      {
        question: "Puis-je utiliser l'IA pour la veille concurrentielle ?",
        answer:
          "Absolument ! L'IA surveille vos concurrents sur Instagram, TikTok, YouTube, Facebook, X/Twitter, LinkedIn, Pinterest et Snapchat : contenus performants, stratégies émergentes, gaps d'opportunité, benchmarks de performance et identification de niches sous-exploitées.",
      },
      {
        question: "L'IA peut-elle adapter mon contenu à différentes audiences ?",
        answer:
          "Parfaitement ! L'IA segmente vos audiences par plateforme et adapte le même message : ton LinkedIn professionnel, style TikTok décontracté, format Instagram visuel, approche YouTube éducative. Un contenu, multiples versions optimisées pour chaque segment et réseau.",
      },
      {
        question: "Comment l'IA m'aide-t-elle avec l'engagement communautaire ?",
        answer:
          "L'IA génère des stratégies d'engagement spécifiques à chaque plateforme : réponses authentiques aux commentaires, questions pour stimuler l'interaction sur Instagram Stories, challenges TikTok, discussions LinkedIn, contenus participatifs et techniques de fidélisation d'audience.",
      },
    ],
  },
  {
    id: "technical",
    name: "Support Technique",
    icon: "🔧",
    color: "bg-gray-100",
    questions: [
      {
        question: "Que faire si une connexion de plateforme échoue ?",
        answer:
          "1) Vérifiez vos paramètres de confidentialité sur la plateforme concernée (Instagram, TikTok, YouTube, Facebook, X/Twitter, LinkedIn, Pinterest, Snapchat), 2) Déconnectez puis reconnectez votre compte, 3) Videz le cache de votre navigateur, 4) Vérifiez que vous avez les droits d'administrateur sur les comptes business. Si le problème persiste, contactez notre support avec des captures d'écran.",
      },
      {
        question: "L'interface est lente ou ne répond pas, que faire ?",
        answer:
          "Solutions rapides : 1) Actualisez la page (F5), 2) Videz votre cache navigateur, 3) Vérifiez votre connexion internet, 4) Essayez un autre navigateur (Chrome recommandé), 5) Désactivez temporairement les extensions. Pour les problèmes persistants, contactez-nous avec vos informations système.",
      },
      {
        question: "Comment signaler un bug ou problème technique ?",
        answer:
          "Utilisez le bouton 'Signaler un problème' dans l'interface ou envoyez un email à support@crealia.com avec : description détaillée, captures d'écran, navigateur utilisé, étapes pour reproduire le bug. Notre équipe technique répond sous 24h.",
      },
      {
        question: "Créalia fonctionne-t-il sur mobile et tablette ?",
        answer:
          "Oui ! Créalia est entièrement responsive et optimisé pour tous les appareils. L'interface s'adapte automatiquement à votre écran. Une application mobile native iOS/Android est en développement pour une expérience encore plus fluide.",
      },
      {
        question: "Comment sauvegarder et exporter mes contenus ?",
        answer:
          "Tous vos contenus sont automatiquement sauvegardés dans le cloud. Vous pouvez exporter vos créations en formats multiples : texte, PDF, CSV, images haute résolution. Sauvegarde automatique toutes les 30 secondes pendant la création.",
      },
      {
        question: "Que faire en cas de perte de données ou contenu ?",
        answer:
          "Créalia sauvegarde automatiquement tout votre travail avec historique des versions. En cas de problème : 1) Vérifiez l'historique des versions, 2) Contactez immédiatement notre support, 3) Nous récupérons vos données depuis nos sauvegardes sécurisées sous 2h maximum.",
      },
    ],
  },
  {
    id: "account",
    name: "Compte & Paramètres",
    icon: "👤",
    color: "bg-yellow-100",
    questions: [
      {
        question: "Comment modifier mon abonnement ?",
        answer:
          "Allez dans Paramètres > Abonnement pour voir tous les plans disponibles et effectuer des modifications. Les changements prennent effet immédiatement. Vous conservez l'accès jusqu'à la fin de votre période de facturation en cours.",
      },
      {
        question: "Comment ajouter des membres à mon équipe ?",
        answer:
          "Dans les plans Business et Enterprise, allez dans Paramètres > Équipe pour inviter des collaborateurs. Définissez des rôles personnalisés : Admin, Éditeur, Contributeur, Lecteur avec permissions granulaires sur chaque fonctionnalité et plateforme connectée.",
      },
      {
        question: "Mes données et contenus sont-ils sécurisés ?",
        answer:
          "Sécurité maximale garantie : chiffrement AES-256, serveurs certifiés SOC2, conformité RGPD, sauvegardes quotidiennes chiffrées, authentification 2FA disponible. Vos données ne sont jamais partagées, vendues ou utilisées pour entraîner d'autres IA.",
      },
      {
        question: "Puis-je transférer mon compte vers une autre personne ?",
        answer:
          "Oui, contactez notre support pour un transfert de compte sécurisé. Processus : vérification d'identité des deux parties, transfert des données et connexions aux plateformes, mise à jour des informations.",
      },
      {
        question: "Comment gérer mes connexions aux plateformes sociales ?",
        answer:
          "Dans Paramètres > Connexions, vous pouvez voir toutes vos plateformes connectées (Instagram, TikTok, YouTube, Facebook, X/Twitter, LinkedIn, Pinterest, Snapchat), gérer les permissions, renouveler les tokens d'accès et déconnecter des comptes si nécessaire.",
      },
      {
        question: "Quelles sont les limites de chaque plan ?",
        answer:
          "Plan Gratuit : 50 générations/mois, 2 plateformes connectées. Plan Pro : générations illimitées, toutes plateformes, analytics avancés. Plan Business : équipe jusqu'à 10 membres, API access. Plan Enterprise : équipe illimitée, support dédié, personnalisations.",
      },
    ],
  },
]

export function CrealiaFAQInterface({ isOpen, onClose }: FAQInterfaceProps) {
  const [selectedCategory, setSelectedCategory] = useState("general")
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null)

  if (!isOpen) return null

  const currentCategory = faqCategories.find((cat) => cat.id === selectedCategory)
  const filteredQuestions =
    currentCategory?.questions.filter(
      (q) =>
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || []

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-[95vw] h-[95vh] mx-4 bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/30 bg-white/80">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center shadow-lg">
              <HelpCircleIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Centre d'Aide Créalia</h2>
              <p className="text-sm text-gray-600">Toutes les réponses sur la création de contenu avec IA</p>
            </div>
          </div>
          <Button onClick={onClose} variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-gray-100">
            <XIcon className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-80 border-r border-gray-200/30 bg-gray-50/50 overflow-y-auto">
            <div className="p-4 space-y-6">
              {/* Search */}
              <div>
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher dans la FAQ..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white border-gray-200/50 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 rounded-xl"
                  />
                </div>
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <SparklesIcon className="w-4 h-4 text-purple-600" />
                  Catégories
                </h3>
                <div className="space-y-2">
                  {faqCategories.map((category) => (
                    <Card
                      key={category.id}
                      className={`cursor-pointer transition-all border-gray-200/50 ${
                        selectedCategory === category.id
                          ? "ring-2 ring-purple-500 bg-purple-50"
                          : "hover:shadow-sm hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg ${category.color} flex items-center justify-center`}>
                            <span className="text-sm">{category.icon}</span>
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm text-gray-900">{category.name}</div>
                            <div className="text-xs text-gray-500">{category.questions.length} questions</div>
                          </div>
                          {selectedCategory === category.id && (
                            <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {/* Category Header */}
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-16 h-16 rounded-2xl ${currentCategory?.color} flex items-center justify-center`}>
                    <span className="text-2xl">{currentCategory?.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900">{currentCategory?.name}</h3>
                    <p className="text-gray-600">
                      {filteredQuestions.length} question{filteredQuestions.length > 1 ? "s" : ""}
                      {searchQuery && ` trouvée${filteredQuestions.length > 1 ? "s" : ""} pour "${searchQuery}"`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Questions */}
              <div className="space-y-4 max-w-4xl">
                {filteredQuestions.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
                      <SearchIcon className="w-10 h-10 text-gray-400" />
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">Aucun résultat trouvé</h4>
                    <p className="text-gray-600 max-w-md mx-auto">
                      Essayez avec d'autres mots-clés ou parcourez les autres catégories pour trouver l'information
                      recherchée.
                    </p>
                  </div>
                ) : (
                  filteredQuestions.map((faq, index) => (
                    <Card
                      key={index}
                      className="border border-gray-200/50 rounded-xl bg-white/80 overflow-hidden hover:shadow-sm transition-all"
                    >
                      <button
                        onClick={() =>
                          setExpandedQuestion(
                            expandedQuestion === `${selectedCategory}-${index}` ? null : `${selectedCategory}-${index}`,
                          )
                        }
                        className="w-full flex items-center justify-between p-5 text-left hover:bg-purple-50/30 transition-colors"
                      >
                        <h4 className="font-semibold text-gray-900 pr-4 text-lg">{faq.question}</h4>
                        <ChevronDownIcon
                          className={cn(
                            "w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0",
                            expandedQuestion === `${selectedCategory}-${index}` && "rotate-180 text-purple-600",
                          )}
                        />
                      </button>
                      {expandedQuestion === `${selectedCategory}-${index}` && (
                        <div className="px-5 pb-5 border-t border-gray-200/30">
                          <div className="pt-4 text-gray-700 leading-relaxed text-base">{faq.answer}</div>
                        </div>
                      )}
                    </Card>
                  ))
                )}
              </div>

              {/* Contact Support */}
              <div className="mt-16 p-8 bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200/50 rounded-2xl max-w-4xl">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center flex-shrink-0">
                    <SparklesIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Vous ne trouvez pas votre réponse ?</h4>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                      Notre équipe d'experts Créalia est là pour vous accompagner dans votre création de contenu avec
                      IA. Contactez-nous et recevez une réponse personnalisée sous 2h en moyenne.
                    </p>
                    <div className="flex gap-4">
                      <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg">
                        💬 Chat Support Instantané
                      </Button>
                      <Button
                        variant="outline"
                        className="border-purple-300 text-purple-700 hover:bg-purple-50 bg-white/80"
                      >
                        📧 Envoyer un Email
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
