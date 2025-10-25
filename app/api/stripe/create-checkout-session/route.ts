import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const { id: userId, email: userEmail } = session.user;

    const body = await req.json();
    const { priceId, successUrl, cancelUrl } = body;

    if (!priceId) {
      return NextResponse.json({ error: "priceId is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let stripeCustomerId = user.stripeCustomerId;

    // If the user doesn't have a Stripe Customer ID, create one
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: userEmail,
        name: user.name ?? undefined,
        metadata: {
          userId: userId,
        },
      });
      stripeCustomerId = customer.id;

      // Save the new customer ID to the user record in our database
      await prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId },
      });
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Create a Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        metadata: {
            userId: userId,
        }
      },
      metadata: {
        userId: userId,
        priceId: priceId,
      },
      success_url: successUrl || `${baseUrl}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${baseUrl}/pricing`,
    });

    return NextResponse.json({ url: checkoutSession.url }, { status: 200 });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: error.message || "stripe_error" },
      { status: 500 }
    );
  }
}

