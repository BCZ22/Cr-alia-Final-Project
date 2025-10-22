import ComingSoon from "@/components/ComingSoon";

export const metadata = {
  title: 'Application Android | Créalia',
  description: 'Téléchargez l\'application Créalia pour Android. Créez du contenu viral depuis votre smartphone ou tablette Android.',
};

export default function AndroidAppPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20">
      <ComingSoon
        title="Android - Coming Soon"
        subtitle="L'application Android sera disponible bientôt. Inscrivez-vous pour être informé du lancement."
      />
    </div>
  );
}
