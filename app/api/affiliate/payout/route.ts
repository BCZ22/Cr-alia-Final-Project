import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

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

    if (!user.stripeAccountId) {
      return NextResponse.json(
        { error: "Affiliate has no Stripe Connect account" },
        { status: 400 }
      );
    }

    // Récupère les gains en attente
    const pending = await prisma.affiliateEarning.findMany({
      where: {
        affiliateId: user.id,
        payoutStatus: "pending",
      },
    });

    if (!pending.length) {
      return NextResponse.json(
        { error: "No pending earnings" },
        { status: 400 }
      );
    }

    const total = pending.reduce((s, p) => s + p.amount, 0);

    // Mode MOCK
    if (process.env.MOCK_STRIPE === "true") {
      const mockTransferId = `mock_tr_${Date.now()}`;
      await prisma.affiliateEarning.updateMany({
        where: { id: { in: pending.map((p) => p.id) } },
        data: { payoutStatus: "paid", stripeTransferId: mockTransferId },
      });

      return NextResponse.json(
        { ok: true, transferId: mockTransferId, mode: "mock" },
        { status: 200 }
      );
    }

    // Crée un transfert Stripe Connect
    try {
      const transfer = await stripe.transfers.create({
        amount: Math.round(total * 100),
        currency: "eur",
        destination: user.stripeAccountId,
        description: `Affiliate payout for ${user.email}`,
      });

      await prisma.affiliateEarning.updateMany({
        where: { id: { in: pending.map((p) => p.id) } },
        data: { payoutStatus: "paid", stripeTransferId: transfer.id },
      });

      return NextResponse.json(
        { ok: true, transferId: transfer.id },
        { status: 200 }
      );
    } catch (err: any) {
      console.error("Payout error", err);
      return NextResponse.json(
        { error: err.message || "transfer_failed" },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error processing payout:", error);
    return NextResponse.json(
      { error: error.message || "server_error" },
      { status: 500 }
    );
  }
}

