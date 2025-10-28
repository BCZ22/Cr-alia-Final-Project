"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface AboutModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AboutModal({ isOpen, onClose }: AboutModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">À propos de Créalia</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 text-foreground">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-primary mb-2">
              Révolutionnez votre création de contenu avec l'IA
            </h2>
            <p className="text-muted-foreground">
              Créalia est bien plus qu'un simple outil de création de contenu. C'est la plateforme tout-en-un qui
              transforme votre façon de concevoir, créer et optimiser vos contenus vidéo pour les réseaux sociaux.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">Notre Vision</h3>
            <p className="text-muted-foreground">
              Nous croyons que chacun mérite d'avoir accès aux outils les plus avancés pour faire exploser ses projets
              et réussir sa mission. C'est pourquoi nous avons créé Créalia : pour démocratiser la création de contenu
              professionnel et permettre à tous de briller sur les plateformes digitales.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">Une Solution Complète et Unique</h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold text-primary mb-3 flex items-center">🎬 Création Simplifiée</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    • <strong>Transformation automatique :</strong> Convertissez n'importe quelle vidéo en reels
                    optimisés
                  </li>
                  <li>
                    • <strong>Édition intuitive :</strong> Ajustez tous les paramètres d'image selon vos besoins
                  </li>
                  <li>
                    • <strong>Découpage intelligent :</strong> Coupez et montez vos vidéos avec précision
                  </li>
                  <li>
                    • <strong>Sous-titres automatiques :</strong> Générez des sous-titres parfaitement synchronisés
                  </li>
                  <li>
                    • <strong>Voix-off IA :</strong> Ajoutez des narrations professionnelles générées par intelligence
                    artificielle
                  </li>
                </ul>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold text-primary mb-3 flex items-center">🚀 Diffusion Multi-Plateformes</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    • <strong>Export automatique :</strong> Vos contenus sont prêts à publier en un clic
                  </li>
                  <li>
                    • <strong>Publication directe :</strong> Postez simultanément sur toutes vos plateformes préférées
                  </li>
                  <li>
                    • <strong>Optimisation native :</strong> Chaque contenu est adapté aux spécificités de chaque réseau
                    social
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg mt-4">
              <h4 className="font-semibold text-primary mb-3 flex items-center">📊 Analytics Avancées</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  • <strong>Suivi en temps réel :</strong> Tracez les performances de tous vos contenus
                </li>
                <li>
                  • <strong>Analyse multi-plateformes :</strong> Une vision globale de votre impact sur tous les réseaux
                </li>
                <li>
                  • <strong>Insights actionnables :</strong> Des données qui vous aident à améliorer continuellement vos
                  résultats
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">Ce Qui Nous Rend Uniques</h3>
            <p className="text-muted-foreground">
              Créalia est la première plateforme à combiner création assistée par IA et analytics avancées dans une
              seule interface. Là où d'autres outils se contentent de créer ou d'analyser, nous offrons l'écosystème
              complet qui manquait au marché.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">Notre Mission</h3>
            <p className="text-muted-foreground mb-4">
              Accélérer votre succès. Nous ne nous contentons pas de vous faire gagner du temps dans la création de
              contenu. Nous vous donnons les outils pour l'améliorer constamment, optimiser vos performances et
              atteindre vos objectifs plus rapidement.
            </p>

            <div className="bg-primary/10 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">
                Chaque fonctionnalité de Créalia a été pensée pour vous permettre de :
              </p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✨ Créer plus rapidement sans compromettre la qualité</li>
                <li>📈 Optimiser vos contenus grâce aux données de performance</li>
                <li>🎯 Maximiser votre impact sur toutes les plateformes</li>
                <li>🚀 Faire passer vos projets au niveau supérieur</li>
              </ul>
            </div>
          </div>

          <div className="text-center bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-primary mb-3">Rejoignez la Révolution</h3>
            <p className="text-muted-foreground mb-4">
              Que vous soyez entrepreneur, créateur de contenu, marketeur ou passionné, Créalia vous donne les
              super-pouvoirs nécessaires pour transformer vos idées en succès viral.
            </p>
            <p className="font-semibold text-primary">Prêt à révolutionner votre création de contenu ?</p>
            <p className="text-sm text-muted-foreground mt-2 italic">
              Créalia - Là où l'intelligence artificielle rencontre la créativité, et où vos projets prennent vie.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
