import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { priceId, affiliateCode, customerEmail, successUrl, cancelUrl } = body;

    if (!priceId) {
      return NextResponse.json(
        { error: "priceId required" },
        { status: 400 }
      );
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";

    // Crée une session Checkout avec metadata pour l'affiliateCode
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: customerEmail,
      subscription_data: {
        metadata: { affiliateCode: affiliateCode || "" },
        // Note: utiliser trial_period_days sur le price Stripe pour offrir 1 mois gratuit
      },
      metadata: { affiliateCode: affiliateCode || "" },
      success_url: successUrl || `${baseUrl}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${baseUrl}/pricing/cancel`,
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: error.message || "stripe_error" },
      { status: 500 }
    );
  }
}

