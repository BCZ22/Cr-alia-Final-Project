/**
 * Simulate complete affiliate flow locally:
 *  - create affiliate user A
 *  - generate affiliate code for A
 *  - create referred user B who uses code
 *  - simulate invoice.payment_succeeded -> create subscriptionPayment + affiliateEarning
 *  - run batchPayout in MOCK mode to mark payouts as paid
 *
 * REQUIREMENTS: prisma client + ts-node
 *
 * Run: MOCK_STRIPE=true ts-node scripts/mockAffiliateFlow.ts
 *      or: npm run mock-affiliate-flow
 */

import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";

const prisma = new PrismaClient();

function generateAffiliateCode(): string {
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `CREALIA-${random}`;
}

async function recordAffiliateEarning(
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

async function run() {
  try {
    console.log("🚀 Starting mock affiliate flow...\n");

    // 1) Create affiliate user A
    const affiliateEmail = `aff_${Date.now()}@example.com`;
    const affiliate = await prisma.user.create({
      data: {
        email: affiliateEmail,
        name: "Affiliate A",
      },
    });
    console.log("✅ Created affiliate user:", affiliate.email, affiliate.id);

    // 2) Generate code for A
    const code = generateAffiliateCode();
    await prisma.user.update({
      where: { id: affiliate.id },
      data: { affiliateCode: code },
    });
    console.log("✅ Generated affiliate code:", code);

    // 3) Create referred user B who uses code
    const referredEmail = `referred_${Date.now()}@example.com`;
    const referred = await prisma.user.create({
      data: {
        email: referredEmail,
        name: "Referred B",
        referredByCode: code,
      },
    });
    console.log("✅ Created referred user:", referred.email);

    // 4) Simulate invoice.payment_succeeded -> create subscriptionPayment + affiliateEarning
    // Let's assume the plan cost is 10.00 EUR
    const amountCents = 1000;
    await prisma.subscriptionPayment.create({
      data: {
        userId: referred.id,
        stripeChargeId: `mock_charge_${Date.now()}`,
        amount: amountCents / 100,
        affiliateCode: code,
      },
    });
    console.log("✅ Created subscriptionPayment for referred user");

    // Use recordAffiliateEarning helper to create an AffiliateEarning
    await recordAffiliateEarning(code, referred.id, amountCents);
    console.log("✅ Recorded affiliate earning (30% of 10 EUR = 3 EUR)\n");

    // 5) Run batchPayout in MOCK mode
    console.log("💸 Running batchPayout in MOCK mode...");
    try {
      execSync("MOCK_STRIPE=true ts-node scripts/batchPayout.ts", {
        stdio: "inherit",
      });
      console.log(
        "\n✅ Batch payout executed (mock). Check DB for updated payoutStatus."
      );
    } catch (err) {
      console.error("\n❌ Error running batchPayout:", err);
    }

    console.log("\n🎯 Mock affiliate flow completed.");
  } catch (err: any) {
    console.error("❌ Mock flow error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

run();

