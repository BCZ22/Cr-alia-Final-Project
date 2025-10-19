import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Politique de confidentialité | Créalia',
  description: 'Politique de confidentialité et protection des données personnelles de Créalia.',
}

export default function PrivacyPolicyPage() {
  return (
    <section className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Politique de confidentialité
          </h1>
          <p className="text-muted-foreground">
            Dernière mise à jour : Janvier 2024
          </p>
        </div>

        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">1. Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              Créalia ("nous", "notre" ou "nos") s'engage à protéger et à respecter votre vie privée. 
              Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons 
              vos informations personnelles.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">2. Données collectées</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Nous collectons les types de données suivants :
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Informations d'identification (nom, email)</li>
              <li>Données d'utilisation (pages visitées, fonctionnalités utilisées)</li>
              <li>Données techniques (adresse IP, type de navigateur)</li>
              <li>Contenu créé (vidéos, images, textes générés)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">3. Utilisation des données</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Nous utilisons vos données pour :
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Fournir et améliorer nos services</li>
              <li>Personnaliser votre expérience</li>
              <li>Communiquer avec vous</li>
              <li>Analyser l'utilisation de la plateforme</li>
              <li>Assurer la sécurité de nos services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">4. Protection des données</h2>
            <p className="text-muted-foreground leading-relaxed">
              Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles 
              appropriées pour protéger vos données personnelles contre tout accès, modification, 
              divulgation ou destruction non autorisés.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">5. Vos droits</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Conformément au RGPD, vous disposez des droits suivants :
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Droit d'accès à vos données</li>
              <li>Droit de rectification</li>
              <li>Droit à l'effacement ("droit à l'oubli")</li>
              <li>Droit à la portabilité des données</li>
              <li>Droit d'opposition au traitement</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">6. Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              Nous utilisons des cookies et technologies similaires pour améliorer votre expérience, 
              analyser le trafic et personnaliser le contenu. Vous pouvez gérer vos préférences 
              de cookies dans les paramètres de votre navigateur.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">7. Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              Pour toute question concernant cette politique de confidentialité ou pour exercer 
              vos droits, contactez-nous à : <strong>privacy@crealia.com</strong>
            </p>
          </section>
        </div>
      </div>
    </section>
  )
}

