import ComingSoon from "@/components/ComingSoon";

export const metadata = {
  title: 'Communauté | Créalia',
  description: 'Rejoignez la communauté Créalia',
};

export default function CommunityPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20">
      <ComingSoon
        title="Communauté - Coming Soon"
        subtitle="Le forum communautaire sera disponible bientôt. Restez connectés !"
      />
    </div>
  );
}

