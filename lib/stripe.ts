import Stripe from "stripe";
import { prisma } from "./prisma";
import { recordAffiliateEarning } from "./affiliate";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-12-18.acacia",
  typescript: true,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

/**
 * Vérifie la signature du webhook Stripe
 */
export function verifyWebhookSignature(
  body: string,
  signature: string
): Stripe.Event {
  return stripe.webhooks.constructEvent(body, signature, webhookSecret);
}

/**
 * Gère les événements webhook Stripe
 */
export async function handleWebhookEvent(event: Stripe.Event): Promise<void> {
  const type = event.type;
  const object = event.data.object as any;

  console.log(`Processing webhook event: ${type}`);

  try {
    switch (type) {
      case "checkout.session.completed": {
        const session = object as Stripe.Checkout.Session;
        const email = session.customer_email;
        const subscriptionId = session.subscription as string | undefined;
        const affiliateCode = session.metadata?.affiliateCode || null;

        if (email && subscriptionId) {
          await prisma.user.updateMany({
            where: { email },
            data: {
              subscriptionId,
              referredByCode: affiliateCode || undefined,
            },
          });
          console.log(`Linked subscription ${subscriptionId} to user ${email}`);
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string | undefined;
        const amountPaid = (invoice.amount_paid ?? invoice.total) as number;
        const chargeId = invoice.charge as string | undefined;

        if (!subscriptionId) break;

        const user = await prisma.user.findUnique({
          where: { subscriptionId },
        });

        if (user) {
          // Idempotence: vérifie si on a déjà enregistré ce paiement
          if (chargeId) {
            const already = await prisma.subscriptionPayment.findFirst({
              where: { stripeChargeId: chargeId },
            });

            if (already) {
              console.log("Invoice already recorded, skipping:", chargeId);
              break;
            }
          }

          // Enregistre le paiement
          await prisma.subscriptionPayment.create({
            data: {
              userId: user.id,
              stripeChargeId: chargeId || `nocharge_${Date.now()}`,
              amount: (amountPaid || 0) / 100,
              affiliateCode: user.referredByCode || undefined,
            },
          });

          // Enregistre les gains d'affiliation
          await recordAffiliateEarning(
            user.referredByCode || null,
            user.id,
            amountPaid || 0
          );

          console.log(`Recorded payment and affiliate earning for user ${user.email}`);
        } else {
          console.warn("No user found for subscriptionId:", subscriptionId);
        }
        break;
      }

      case "account.updated": {
        const account = object as Stripe.Account;
        const stripeAccountId = account.id;
        const metadataUserId = account.metadata?.userId;

        if (metadataUserId) {
          await prisma.user.updateMany({
            where: { id: metadataUserId },
            data: {
              stripeAccountId,
              role:
                account.charges_enabled && account.payouts_enabled
                  ? "PRO"
                  : undefined,
            },
          });
          console.log(`Updated user ${metadataUserId} with Stripe account ${stripeAccountId}`);
        } else {
          const usr = await prisma.user.findFirst({
            where: { stripeAccountId },
          });

          if (usr && account.charges_enabled && account.payouts_enabled) {
            await prisma.user.update({
              where: { id: usr.id },
              data: { role: "PRO" },
            });
            console.log(`Set user ${usr.email} role to PRO after account.updated`);
          }
        }
        break;
      }

      case "transfer.paid":
      case "payout.paid": {
        const transfer = object as Stripe.Transfer;
        if (transfer.id) {
          await prisma.affiliateEarning.updateMany({
            where: { stripeTransferId: transfer.id },
            data: { payoutStatus: "paid" },
          });
          console.log(`Marked affiliate earning as paid: ${transfer.id}`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${type}`);
    }
  } catch (error) {
    console.error(`Error handling webhook event ${type}:`, error);
    throw error;
  }
}

export default stripe;

