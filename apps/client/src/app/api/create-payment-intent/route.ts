import {NextResponse} from "next/server";
import Stripe from "stripe";

interface CreatePaymentIntentBody {
  prices: number;
  email?: string | null;
  userName?: string | null;
}

export async function POST(request: Request) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        {error: "STRIPE_SECRET_KEY is not configured"},
        {status: 500}
      );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const body = (await request.json()) as CreatePaymentIntentBody;
    const {prices, email, userName} = body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: prices,
      currency: "usd",
      receipt_email: email ?? undefined,
      metadata: {userName: userName ?? "", email: email ?? ""},
      automatic_payment_methods: {enabled: true},
    });

    return NextResponse.json({clientSecret: paymentIntent.client_secret});
  } catch (error) {
    console.error("Internal Error:", error);
    return NextResponse.json(
      {error: `Internal Server Error: ${error}`},
      {status: 500}
    );
  }
}
