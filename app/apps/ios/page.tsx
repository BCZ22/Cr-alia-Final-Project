import ComingSoon from "@/components/ComingSoon";

export const metadata = {
  title: 'Application iOS | Créalia',
  description: 'Téléchargez l\'application Créalia pour iOS. Créez du contenu viral directement depuis votre iPhone ou iPad.',
};

export default function iOSAppPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20">
      <ComingSoon
        title="iOS - Coming Soon"
        subtitle="L'application iOS sera disponible bientôt. Inscrivez-vous pour être informé du lancement."
      />
    </div>
  );
}
