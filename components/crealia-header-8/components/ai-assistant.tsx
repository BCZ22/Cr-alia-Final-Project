import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

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

const MessageCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
    />
  </svg>
)

const ZapIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
)

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
)

export function AIAssistant() {
  return (
    <Card className="relative overflow-hidden glass border-border/50 hover:border-primary/30 transition-all duration-500">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
      <div className="relative p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-primary to-accent rounded-2xl animate-glow">
              <SparklesIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">Assistant IA Créalia</h3>
              <p className="text-muted-foreground">Votre partenaire créatif intelligent</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-accent/20 rounded-full">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span className="text-xs font-medium text-accent">En ligne</span>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center mt-1">
              <MessageCircleIcon className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Suggestions personnalisées</p>
              <p className="text-xs text-muted-foreground">Idées de contenu basées sur vos performances</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center mt-1">
              <ZapIcon className="w-4 h-4 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Optimisation automatique</p>
              <p className="text-xs text-muted-foreground">Améliore vos contenus pour maximiser l'engagement</p>
            </div>
          </div>
        </div>

        <div className="bg-secondary/30 rounded-xl p-4 mb-6">
          <p className="text-sm text-muted-foreground mb-2">💡 Suggestion du jour</p>
          <p className="text-sm text-foreground font-medium text-balance">
            "Vos Reels avec de la musique trending obtiennent 40% plus d'engagement. Voulez-vous que je vous propose des
            sons populaires ?"
          </p>
        </div>

        <Button className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300">
          Discuter avec l'IA
          <ArrowRightIcon className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </Card>
  )
}
