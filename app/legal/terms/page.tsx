import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Conditions d\'utilisation | Créalia',
  description: 'Conditions générales d\'utilisation de la plateforme Créalia.',
}

export default function TermsOfServicePage() {
  return (
    <section className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Conditions d'utilisation
          </h1>
          <p className="text-muted-foreground">
            Dernière mise à jour : Janvier 2024
          </p>
        </div>

        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">1. Acceptation des conditions</h2>
            <p className="text-muted-foreground leading-relaxed">
              En accédant et en utilisant Créalia ("la Plateforme"), vous acceptez d'être lié par 
              ces Conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas 
              utiliser nos services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">2. Description du service</h2>
            <p className="text-muted-foreground leading-relaxed">
              Créalia est une plateforme de création de contenu assistée par intelligence artificielle. 
              Nous fournissons des outils pour générer, éditer et optimiser du contenu créatif pour 
              les réseaux sociaux et autres plateformes digitales.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">3. Compte utilisateur</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Pour utiliser certaines fonctionnalités, vous devez créer un compte. Vous vous engagez à :
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Fournir des informations exactes et complètes</li>
              <li>Maintenir la confidentialité de votre compte</li>
              <li>Nous informer immédiatement de toute utilisation non autorisée</li>
              <li>Être responsable de toutes les activités sous votre compte</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">4. Propriété intellectuelle</h2>
            <p className="text-muted-foreground leading-relaxed">
              Le contenu généré via nos outils d'IA vous appartient. Cependant, vous accordez à Créalia 
              une licence limitée pour héberger, stocker et afficher ce contenu dans le cadre de la 
              fourniture de nos services. La Plateforme et son contenu original (interface, logos, code) 
              restent la propriété de Créalia.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">5. Utilisation acceptable</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Vous vous engagez à ne pas utiliser la Plateforme pour :
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Créer du contenu illégal, offensant ou discriminatoire</li>
              <li>Violer les droits de propriété intellectuelle de tiers</li>
              <li>Diffuser des virus ou codes malveillants</li>
              <li>Tenter d'accéder à des systèmes ou données non autorisés</li>
              <li>Utiliser des bots ou automatisations non autorisés</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">6. Abonnements et paiements</h2>
            <p className="text-muted-foreground leading-relaxed">
              Les abonnements sont facturés selon le plan choisi. Les paiements sont traités de manière 
              sécurisée. Vous pouvez annuler votre abonnement à tout moment. Les remboursements sont 
              disponibles selon notre politique de remboursement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">7. Limitation de responsabilité</h2>
            <p className="text-muted-foreground leading-relaxed">
              Créalia est fourni "en l'état". Nous ne garantissons pas que le service sera ininterrompu 
              ou exempt d'erreurs. Nous ne sommes pas responsables des dommages indirects résultant de 
              l'utilisation de nos services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">8. Modifications</h2>
            <p className="text-muted-foreground leading-relaxed">
              Nous nous réservons le droit de modifier ces Conditions à tout moment. Les modifications 
              entreront en vigueur dès leur publication. L'utilisation continue de la Plateforme après 
              les modifications constitue votre acceptation des nouvelles conditions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">9. Résiliation</h2>
            <p className="text-muted-foreground leading-relaxed">
              Nous pouvons suspendre ou résilier votre compte en cas de violation de ces Conditions. 
              Vous pouvez également résilier votre compte à tout moment depuis les paramètres.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">10. Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              Pour toute question concernant ces Conditions, contactez-nous à : <strong>legal@crealia.com</strong>
            </p>
          </section>
        </div>
      </div>
    </section>
  )
}

