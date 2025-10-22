"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Link from "next/link";

interface AffiliateStats {
  totalReferrals: number;
  activeSubscribers: number;
  pendingPayouts: number;
  totalEarned: number;
  recentEarnings: { month: string; amount: number }[];
}

export default function AffiliateDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/affiliate/stats");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };
    if (session) {
      fetchStats();
    }
  }, [session]);

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground text-lg">
            Connectez-vous pour accéder au tableau de bord
          </p>
          <Link href="/auth/signin">
            <Button>Se connecter</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground text-lg">
          Chargement de votre tableau de bord...
        </p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 text-lg">
          Impossible de récupérer vos données.
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-8">
      <header className="mb-8 flex justify-between items-center max-w-7xl mx-auto">
        <h1 className="text-3xl font-semibold text-foreground">
          Tableau de bord affilié
        </h1>
        <Link href="/">
          <Button variant="outline">Retour à l&apos;accueil</Button>
        </Link>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 max-w-7xl mx-auto">
        <Card className="shadow-md rounded-2xl">
          <CardContent className="text-center py-6">
            <h2 className="text-sm text-muted-foreground mb-1">
              Références totales
            </h2>
            <p className="text-3xl font-semibold text-purple-600">
              {stats.totalReferrals}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md rounded-2xl">
          <CardContent className="text-center py-6">
            <h2 className="text-sm text-muted-foreground mb-1">
              Abonnés actifs
            </h2>
            <p className="text-3xl font-semibold text-green-600">
              {stats.activeSubscribers}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md rounded-2xl">
          <CardContent className="text-center py-6">
            <h2 className="text-sm text-muted-foreground mb-1">
              Paiement en attente
            </h2>
            <p className="text-3xl font-semibold text-orange-500">
              {stats.pendingPayouts} €
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md rounded-2xl">
          <CardContent className="text-center py-6">
            <h2 className="text-sm text-muted-foreground mb-1">
              Gains totaux
            </h2>
            <p className="text-3xl font-semibold text-blue-600">
              {stats.totalEarned} €
            </p>
          </CardContent>
        </Card>
      </section>

      <Card className="shadow-md rounded-2xl mb-8 max-w-7xl mx-auto">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">
            Évolution des revenus mensuels
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.recentEarnings}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="flex justify-center max-w-7xl mx-auto">
        <Link href="/affiliate/connect">
          <Button className="px-6 py-3 bg-purple-600 text-white hover:bg-purple-700 rounded-xl transition-all">
            Connecter mon compte Stripe
          </Button>
        </Link>
      </div>
    </main>
  );
}

