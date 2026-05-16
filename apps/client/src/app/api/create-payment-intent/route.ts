import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Stripe from "stripe";
import { z } from "zod";
import { serverEnv } from "@/config/env";
import { authOptions } from "@/lib/auth-options";

const createPaymentIntentSchema = z
  .object({
    prices: z.number().int().positive().max(100_000),
  })
  .strict();

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    if (!serverEnv.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "STRIPE_SECRET_KEY is not configured" },
        { status: 500 }
      );
    }

    const stripe = new Stripe(serverEnv.STRIPE_SECRET_KEY);
    const body = createPaymentIntentSchema.safeParse(await request.json());
    if (!body.success) {
      return NextResponse.json(
        { error: "Invalid payment request" },
        { status: 400 }
      );
    }
    const { prices } = body.data;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: prices,
      currency: "usd",
      receipt_email: session.user.email,
      metadata: {
        userId: session.user.id ?? "",
        userName: session.user.name ?? "",
        email: session.user.email,
      },
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
