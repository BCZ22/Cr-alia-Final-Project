import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Not authenticated" },
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

    try {
      // Si l'utilisateur a déjà un compte Stripe, génère un lien de dashboard
      if (user.stripeAccountId) {
        const link = await stripe.accounts.createLoginLink(user.stripeAccountId);
        return NextResponse.json({ url: link.url }, { status: 200 });
      }

      // Crée un compte Connect Express
      const account = await stripe.accounts.create({
        type: "express",
        country: "FR", // Adapter selon pays
        email: user.email || undefined,
        capabilities: {
          transfers: { requested: true },
        },
        metadata: {
          userId: user.id,
        },
      });

      // Sauvegarde le stripeAccountId
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeAccountId: account.id },
      });

      const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
      const returnUrl = `${baseUrl}/affiliate/onboarded`;
      const refreshUrl = `${baseUrl}/affiliate/connect?refresh=true`;

      // Crée le lien d'onboarding
      const accountLink = await stripe.accountLinks.create({
        account: account.id,
        refresh_url: refreshUrl,
        return_url: returnUrl,
        type: "account_onboarding",
      });

      return NextResponse.json({ url: accountLink.url }, { status: 200 });
    } catch (err: any) {
      console.error("Stripe onboarding error:", err);
      return NextResponse.json(
        { error: err.message || "Onboarding failed" },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error processing onboarding:", error);
    return NextResponse.json(
      { error: error.message || "server_error" },
      { status: 500 }
    );
  }
}

