"use client"

import { useState, useEffect } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

interface PrivacyPolicyModalProps {
  isOpen: boolean
  onClose: () => void
  initialSection?: number
}

export function PrivacyPolicyModal({ isOpen, onClose, initialSection = 0 }: PrivacyPolicyModalProps) {
  const [currentSection, setCurrentSection] = useState(initialSection)

  useEffect(() => {
    if (isOpen) {
      setCurrentSection(initialSection)
    }
  }, [isOpen, initialSection])

  const sections = [
    {
      title: "1. POLITIQUE DE REMBOURSEMENT",
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-lg mb-3">Principe Général</h4>
            <p className="text-muted-foreground leading-relaxed">
              Créalia s'engage à respecter vos droits en tant que consommateur selon le Code des obligations suisse et
              la Loi fédérale sur la protection des consommateurs.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-3">Droit de Rétractation (Art. 40a-40o CO)</h4>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>
                <strong>14 jours</strong> de délai de rétractation pour tous les contrats conclus à distance
              </li>
              <li>Période calculée à partir de la réception de la confirmation de commande</li>
              <li>Remboursement intégral sans indication de motif</li>
              <li>Exercice du droit par email à : support@crealia.com</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-3">Garantie Satisfait ou Remboursé</h4>
            <p className="text-muted-foreground mb-2">Au-delà du délai légal, nous offrons :</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>
                <strong>30 jours</strong> supplémentaires pour les abonnements mensuels
              </li>
              <li>
                <strong>60 jours</strong> supplémentaires pour les abonnements annuels
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-3">Conditions de Remboursement Étendu</h4>
            <div className="space-y-4">
              <div>
                <h5 className="font-medium mb-2">Remboursement Intégral Accordé :</h5>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Défaillance technique majeure empêchant l'utilisation normale</li>
                  <li>Non-conformité substantielle des prestations décrites</li>
                  <li>Interruption de service de plus de 72h consécutives</li>
                  <li>Problème de facturation non résolu dans les 5 jours ouvrés</li>
                </ul>
              </div>

              <div>
                <h5 className="font-medium mb-2">Remboursement Proportionnel :</h5>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Interruption de service entre 24h et 72h</li>
                  <li>Fonctionnalité premium indisponible plus de 10 jours</li>
                  <li>Limitation technique non annoncée impactant l'usage</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "2. CONDITIONS GÉNÉRALES D'UTILISATION",
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-lg mb-3">1. Dispositions Générales</h4>
            <div className="space-y-3">
              <div>
                <h5 className="font-medium mb-2">Parties Contractantes :</h5>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>
                    <strong>Prestataire :</strong> [Nom de votre société], domiciliée en Suisse
                  </li>
                  <li>
                    <strong>Utilisateur :</strong> Personne physique ou morale utilisant la plateforme Créalia
                  </li>
                </ul>
              </div>
              <p className="text-muted-foreground">
                <strong>Base Légale :</strong> Ces conditions sont régies par le droit suisse, notamment le Code des
                obligations (CO) et la Loi fédérale sur la protection des données (LPD).
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-3">2. Objet du Contrat</h4>
            <p className="text-muted-foreground mb-3">
              Créalia fournit une plateforme SaaS de création de contenu numérique comprenant :
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Transformation automatisée de vidéos par intelligence artificielle</li>
              <li>Outils d'édition et de personnalisation multimédia</li>
              <li>Génération de sous-titres et synthèse vocale</li>
              <li>Publication automatisée multi-plateformes</li>
              <li>Analytics et suivi de performance</li>
              <li>Stockage cloud sécurisé</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-3">3. Formation du Contrat</h4>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>
                <strong>Offre :</strong> Plans et tarifs publiés sur le site constituent notre offre
              </li>
              <li>
                <strong>Acceptation :</strong> Validation du processus d'inscription et paiement
              </li>
              <li>
                <strong>Confirmation :</strong> Email de confirmation faisant foi
              </li>
              <li>
                <strong>Langue :</strong> Français (version de référence)
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: "3. POLITIQUE DE PROTECTION DES DONNÉES",
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-lg mb-3">1. Cadre Légal et Engagement</h4>
            <p className="text-muted-foreground mb-3">
              Cette politique respecte la Loi fédérale sur la protection des données (LPD) révisée, entrée en vigueur le
              1er septembre 2023, ainsi que l'Ordonnance sur la protection des données (OPDo).
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <h5 className="font-medium mb-2">Responsable du traitement :</h5>
              <p className="text-sm text-muted-foreground">
                [Nom de votre société]
                <br />
                [Adresse complète en Suisse]
                <br />
                Email : privacy@crealia.com
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-3">2. Principes Fondamentaux (Art. 6 LPD)</h4>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>
                <strong>Licéité :</strong> traitement conforme à la loi
              </li>
              <li>
                <strong>Bonne foi :</strong> traitement loyal et transparent
              </li>
              <li>
                <strong>Proportionnalité :</strong> limitation aux données nécessaires
              </li>
              <li>
                <strong>Finalité :</strong> usage conforme aux objectifs déclarés
              </li>
              <li>
                <strong>Exactitude :</strong> données correctes et actualisées
              </li>
              <li>
                <strong>Sécurité :</strong> protection adéquate des données
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-3">3. Données Traitées</h4>
            <div className="space-y-4">
              <div>
                <h5 className="font-medium mb-2">Données d'Identification (Art. 5 let. c LPD) :</h5>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                  <li>Nom, prénom, raison sociale</li>
                  <li>Adresse email et postale</li>
                  <li>Numéro de téléphone (optionnel)</li>
                  <li>Données de facturation et TVA</li>
                </ul>
              </div>

              <div>
                <h5 className="font-medium mb-2">Données Techniques :</h5>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                  <li>Adresse IP et géolocalisation approximative</li>
                  <li>Informations sur le navigateur et système d'exploitation</li>
                  <li>Cookies et technologies de traçage</li>
                  <li>Logs de connexion et d'utilisation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "4. VOS DROITS ET CONTACT",
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-lg mb-3">Vos Droits</h4>
            <div className="space-y-4">
              <div>
                <h5 className="font-medium mb-2">Droit d'accès (Art. 25 LPD) :</h5>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                  <li>Obtenir une copie des données personnelles que nous traitons vous concernant</li>
                  <li>Connaître les finalités du traitement et les destinataires</li>
                  <li>Être informé de la durée de conservation prévue</li>
                </ul>
              </div>

              <div>
                <h5 className="font-medium mb-2">Droit de rectification (Art. 32 LPD) :</h5>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                  <li>Corriger les données inexactes ou incomplètes</li>
                  <li>Compléter les informations manquantes</li>
                  <li>Mise à jour gratuite de vos informations</li>
                </ul>
              </div>

              <div>
                <h5 className="font-medium mb-2">Autres droits :</h5>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                  <li>Droit d'effacement</li>
                  <li>Droit à la portabilité des données</li>
                  <li>Droit d'opposition</li>
                  <li>Droit de limitation du traitement</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-3">Nous Contacter</h4>
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h5 className="font-medium mb-2">Support et questions générales :</h5>
                <p className="text-sm text-muted-foreground">Email : support@crealia.com</p>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h5 className="font-medium mb-2">Protection des données :</h5>
                <p className="text-sm text-muted-foreground">Email : privacy@crealia.com</p>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h5 className="font-medium mb-2">Adresse postale :</h5>
                <p className="text-sm text-muted-foreground">
                  [Nom de votre société]
                  <br />
                  [Adresse complète]
                  <br />
                  [Code postal, Ville]
                  <br />
                  Suisse
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-3">Recours et Réclamations</h4>
            <div className="bg-muted p-4 rounded-lg">
              <h5 className="font-medium mb-2">Préposé fédéral à la protection des données :</h5>
              <p className="text-sm text-muted-foreground">
                Adresse : Feldeggweg 1, 3003 Berne
                <br />
                Email : contact@edoeb.admin.ch
                <br />
                Téléphone : +41 58 462 43 95
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-bold text-foreground">Documents Légaux Créalia</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex border-b border-border">
          {sections.map((section, index) => (
            <button
              key={index}
              onClick={() => setCurrentSection(index)}
              className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                currentSection === index
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {section.title.split(".")[0]}.
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <h3 className="text-xl font-bold text-foreground mb-6">{sections[currentSection].title}</h3>
          {sections[currentSection].content}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <button
            onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
            disabled={currentSection === 0}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Précédent</span>
          </button>

          <span className="text-sm text-muted-foreground">
            {currentSection + 1} / {sections.length}
          </span>

          <button
            onClick={() => setCurrentSection(Math.min(sections.length - 1, currentSection + 1))}
            disabled={currentSection === sections.length - 1}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Suivant</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
