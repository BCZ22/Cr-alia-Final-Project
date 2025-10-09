import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/backend/lib/utils"

const VideoIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polygon strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} points="23 7 16 12 23 17 23 7" />
    <rect
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      x="1"
      y="5"
      width="15"
      height="14"
      rx="2"
      ry="2"
    />
  </svg>
)

const BarChart3Icon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3v18h18" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m19 9-5 5-4-4-3 3" />
  </svg>
)

const LightbulbIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 21h6" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 3a6 6 0 0 0-6 6c0 1 .2 2 .6 2.8L8 15h8l1.4-3.2c.4-.8.6-1.8.6-2.8a6 6 0 0 0-6-6Z"
    />
  </svg>
)

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m12 5 7 7-7 7" />
  </svg>
)

const SparklesIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.456-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z"
    />
  </svg>
)

const modules = [
  {
    name: "Reels Studio",
    description:
      "Créez des Reels et Shorts époustouflants avec l'IA. Montage automatique, effets premium et optimisation pour chaque plateforme.",
    icon: VideoIcon,
    color: "from-purple-500 to-pink-500",
    features: ["Montage IA automatique", "Effets premium & transitions", "Export multi-format HD", "Templates viraux"],
    cta: "Créer un Reel",
    badge: "Populaire",
  },
  {
    name: "Social Analytics",
    description:
      "Analysez vos performances avec des insights avancés. Comprenez votre audience et optimisez votre stratégie de contenu.",
    icon: BarChart3Icon,
    color: "from-blue-500 to-cyan-500",
    features: ["Analytics temps réel", "Insights audience IA", "Prédictions tendances", "Rapports automatiques"],
    cta: "Voir les stats",
    badge: "Nouveau",
  },
  {
    name: "Inspiration IA",
    description:
      "Générez des idées de contenu illimitées avec notre IA créative. Tendances, concepts et scripts personnalisés.",
    icon: LightbulbIcon,
    color: "from-amber-500 to-orange-500",
    features: ["Idées illimitées", "Analyse tendances", "Scripts IA personnalisés", "Calendrier éditorial"],
    cta: "Générer des idées",
    badge: "IA",
  },
]

export function FeatureModules() {
  return (
    <div className="space-y-12">
      <div className="text-center animate-fade-in">
        <h2 className="text-4xl md:text-5xl font-bold text-balance mb-6 text-pretty">
          Vos outils de création
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> premium</span>
        </h2>
        <p className="text-muted-foreground text-xl max-w-3xl mx-auto text-balance leading-relaxed">
          Trois modules puissants pour transformer votre création de contenu et dominer les réseaux sociaux
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {modules.map((module, index) => (
          <Card
            key={module.name}
            className={cn(
              "group relative overflow-hidden glass-card border-border/50 hover:border-primary/30 card-hover animate-slide-up p-8",
            )}
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <div className="absolute top-6 right-6 z-10">
              <div
                className={`px-4 py-2 rounded-full text-xs font-medium bg-gradient-to-r ${module.color} text-white flex items-center gap-2 shadow-lg`}
              >
                <SparklesIcon className="w-3 h-3" />
                {module.badge}
              </div>
            </div>

            <div
              className={`inline-flex p-6 rounded-3xl bg-gradient-to-br ${module.color} mb-8 shadow-xl group-hover:scale-110 transition-all duration-500`}
            >
              <module.icon className="w-8 h-8 text-white" />
            </div>

            <h3 className="text-2xl font-bold mb-6 text-foreground group-hover:text-primary transition-colors duration-300">
              {module.name}
            </h3>
            <p className="text-muted-foreground mb-8 text-balance leading-relaxed text-lg">{module.description}</p>

            <div className="space-y-4 mb-10">
              {module.features.map((feature, featureIndex) => (
                <div
                  key={feature}
                  className="flex items-center gap-4 group-hover:translate-x-2 transition-all duration-300"
                  style={{ transitionDelay: `${featureIndex * 0.1}s` }}
                >
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${module.color} shadow-sm`} />
                  <span className="text-sm text-muted-foreground font-medium group-hover:text-foreground transition-colors duration-300">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <Button className="w-full btn-gradient text-white font-medium py-4 rounded-full text-lg">
              {module.cta}
              <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>

            <div
              className={`absolute inset-0 bg-gradient-to-br ${module.color} opacity-0 group-hover:opacity-[0.02] transition-opacity duration-700`}
            />
          </Card>
        ))}
      </div>
    </div>
  )
}
