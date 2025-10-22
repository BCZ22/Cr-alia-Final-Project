/**
 * Batch payout script
 *
 * Usage:
 *  NODE_ENV=production ts-node scripts/batchPayout.ts
 *  or npm run payout (if added to package.json)
 *
 * Environment:
 *  - If MOCK_STRIPE=true -> does not call Stripe, just marks payouts as 'paid' and writes stripeTransferId mock
 *  - Otherwise STRIPE_SECRET_KEY must be set and stripe.transfers.create will be called
 *
 * WARNING: this script creates transfers from your Stripe platform balance to connected accounts.
 * Make sure you understand the financial flow before running in production.
 */

import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";

const prisma = new PrismaClient();
const MOCK = process.env.MOCK_STRIPE === "true";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-12-18.acacia",
});

async function run() {
  console.log("🚀 Starting batch payout - MOCK:", MOCK);
  try {
    // Get affiliates with pending earnings and a stripeAccountId
    const affiliates = await prisma.user.findMany({
      where: { stripeAccountId: { not: null } },
    });

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

      console.log(
        `💸 Processing affiliate ${affiliate.email} (${affiliate.id}) - total: ${total} EUR`
      );

      if (MOCK) {
        // Mark as paid with mock transfer id
        const transferId = `mock_tr_${Date.now()}`;
        await prisma.affiliateEarning.updateMany({
          where: { id: { in: pending.map((p) => p.id) } },
          data: { payoutStatus: "paid", stripeTransferId: transferId },
        });
        console.log(
          `✅ MOCK: Marked ${pending.length} earnings as paid -> ${transferId}`
        );
      } else {
        // Real transfer via Stripe
        if (!affiliate.stripeAccountId) {
          console.warn(
            `⚠️  Affiliate ${affiliate.email} has no stripeAccountId, skipping.`
          );
          continue;
        }

        // Create a transfer - ensure platform has balance
        const amountCents = Math.round(total * 100);
        try {
          const transfer = await stripe.transfers.create({
            amount: amountCents,
            currency: "eur",
            destination: affiliate.stripeAccountId,
            description: `Affiliate payout for ${affiliate.email}`,
            metadata: {
              affiliateId: affiliate.id,
              affiliateEmail: affiliate.email || "",
            },
          });

          await prisma.affiliateEarning.updateMany({
            where: { id: { in: pending.map((p) => p.id) } },
            data: { payoutStatus: "paid", stripeTransferId: transfer.id },
          });
          console.log(
            `✅ Transfer created: ${transfer.id} for ${affiliate.email}`
          );
        } catch (err: any) {
          console.error(
            `❌ Stripe transfer failed for ${affiliate.email}:`,
            err.message || err
          );
        }
      }
    }

    console.log("🎯 Batch payout complete.");
  } catch (err: any) {
    console.error("❌ Batch payout error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

run();

