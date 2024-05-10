import Stripe from "stripe";
import { MultiItemCheckOutForm } from "../_components/MultiItemCheckOutForm";
import db from "@/db/db";

export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function CheckoutPage({
  params: { ids },
}: {
  params: { ids: string };
}) {
  const arrayOfIds = ids.split(".");
  let total = 0;
  for (const id of arrayOfIds) {
    const productPrices = await db.product.findFirst({
      where: { id },
      select: { priceInCents: true },
    });
    if (!productPrices) throw Error("Product not found");
    total += productPrices?.priceInCents;
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: total,
    currency: "USD",
    metadata: { productIds: arrayOfIds.join(".") },
    description: arrayOfIds.length > 1 ? "Multiple items" : undefined,
  });

  if (!paymentIntent.client_secret) {
    throw Error("Stripe failed to create payment intent");
  }

  return (
    <MultiItemCheckOutForm
      clientSecret={paymentIntent.client_secret}
      total={total}
    />
  );
}
