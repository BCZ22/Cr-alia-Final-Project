import { prisma } from "./prisma";

/**
 * Génère un code d'affiliation unique au format CREALIA-XXXXXX
 */
export function generateAffiliateCode(): string {
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `CREALIA-${random}`;
}

/**
 * S'assure qu'un utilisateur a un code d'affiliation unique
 * Génère un nouveau code si l'utilisateur n'en a pas
 */
export async function ensureAffiliateCodeForUser(userId: string): Promise<string> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  
  if (!user) {
    throw new Error("User not found");
  }
  
  if (user.affiliateCode) {
    return user.affiliateCode;
  }

  // Génère un code unique
  let code = generateAffiliateCode();
  let exists = await prisma.user.findUnique({ where: { affiliateCode: code } });
  
  // Vérifie l'unicité
  while (exists) {
    code = generateAffiliateCode();
    exists = await prisma.user.findUnique({ where: { affiliateCode: code } });
  }

  // Met à jour l'utilisateur avec le nouveau code
  await prisma.user.update({
    where: { id: userId },
    data: { affiliateCode: code },
  });

  return code;
}

/**
 * Enregistre les gains d'affiliation (30% du montant)
 */
export async function recordAffiliateEarning(
  affiliateCode: string | null,
  referredUserId: string,
  amountCents: number
): Promise<any | null> {
  if (!affiliateCode) return null;

  const affiliate = await prisma.user.findUnique({
    where: { affiliateCode },
  });

  if (!affiliate) return null;

  const amount = (amountCents / 100) * 0.3; // 30% de commission

  const earning = await prisma.affiliateEarning.create({
    data: {
      affiliateId: affiliate.id,
      referredUserId,
      amount,
    },
  });

  return earning;
}

/**
 * Récupère les statistiques d'un affilié
 */
export async function getAffiliateStats(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      affiliateReferrals: {
        where: {
          status: { in: ["active", "pending_payout", "paid"] },
        },
      },
    },
  });

  if (!user || !user.affiliateCode) {
    return {
      totalReferrals: 0,
      activeSubscribers: 0,
      pendingPayouts: 0,
      totalEarned: 0,
      recentEarnings: [],
    };
  }

  const referrals = user.affiliateReferrals || [];
  const totalReferrals = referrals.length;
  const activeSubscribers = referrals.filter((r) => r.status === "active").length;
  const totalEarned = referrals.reduce((sum, r) => sum + (r.commission || 0), 0);
  const pendingPayouts = referrals
    .filter((r) => r.status === "pending_payout")
    .reduce((sum, r) => sum + (r.commission || 0), 0);

  // Mock des données de revenus mensuels (à adapter selon vos besoins)
  const recentEarnings = [
    { month: "Juin", amount: 320 },
    { month: "Juil", amount: 540 },
    { month: "Août", amount: 880 },
    { month: "Sept", amount: 1250 },
    { month: "Oct", amount: 940 },
  ];

  return {
    totalReferrals,
    activeSubscribers,
    pendingPayouts,
    totalEarned,
    recentEarnings,
  };
}

