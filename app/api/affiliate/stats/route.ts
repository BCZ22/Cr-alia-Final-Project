import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { getAffiliateStats } from "@/lib/affiliate";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (!user.stripeAccountId) {
      return NextResponse.json(
        {
          error: "Pas de compte Stripe lié",
          stats: {
            totalReferrals: 0,
            activeSubscribers: 0,
            pendingPayouts: 0,
            totalEarned: 0,
            recentEarnings: [],
          },
        },
        { status: 200 }
      );
    }

    const stats = await getAffiliateStats(user.id);

    return NextResponse.json(stats, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching affiliate stats:", error);
    return NextResponse.json(
      { error: error.message || "server_error" },
      { status: 500 }
    );
  }
}

