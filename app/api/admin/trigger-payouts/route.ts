import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-12-18.acacia",
});

const SECRET = process.env.PAYOUT_TRIGGER_TOKEN || "";

async function doPayouts(mock = false) {
  const affiliates = await prisma.user.findMany({
    where: { stripeAccountId: { not: null } },
  });

  const results: any[] = [];

  for (const affiliate of affiliates) {
    const pending = await prisma.affiliateEarning.findMany({
      where: {
        affiliateId: affiliate.id,
        payoutStatus: "pending",
      },
    });

    if (!pending || pending.length === 0) continue;

    const total = pending.reduce((s, p) => s + p.amount, 0);
    if (total <= 0) continue;

    if (mock) {
      const transferId = `mock_tr_${Date.now()}`;
      await prisma.affiliateEarning.updateMany({
        where: { id: { in: pending.map((p) => p.id) } },
        data: { payoutStatus: "paid", stripeTransferId: transferId },
      });
      results.push({
        affiliateEmail: affiliate.email,
        amount: total,
        transferId,
        mode: "mock",
      });
    } else {
      if (!affiliate.stripeAccountId) continue;

      try {
        const transfer = await stripe.transfers.create({
          amount: Math.round(total * 100),
          currency: "eur",
          destination: affiliate.stripeAccountId,
          description: `Affiliate payout for ${affiliate.email}`,
        });

        await prisma.affiliateEarning.updateMany({
          where: { id: { in: pending.map((p) => p.id) } },
          data: { payoutStatus: "paid", stripeTransferId: transfer.id },
        });

        results.push({
          affiliateEmail: affiliate.email,
          amount: total,
          transferId: transfer.id,
          mode: "live",
        });
      } catch (err: any) {
        console.error("Transfer error for", affiliate.email, err);
        results.push({
          affiliateEmail: affiliate.email,
          error: err.message,
        });
      }
    }
  }

  return results;
}

export async function POST(req: NextRequest) {
  try {
    const auth = req.headers.get("authorization") || "";

    if (!auth.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing token" }, { status: 401 });
    }

    const token = auth.split(" ")[1];

    if (!token || token !== SECRET) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const mock = process.env.MOCK_STRIPE === "true" || body?.mock === true;

    const results = await doPayouts(mock);

    return NextResponse.json(
      {
        ok: true,
        mode: mock ? "mock" : "live",
        results,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("trigger-payouts error", err);
    return NextResponse.json(
      { error: err.message || "payout_error" },
      { status: 500 }
    );
  }
}

