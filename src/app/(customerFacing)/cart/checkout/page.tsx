import Stripe from "stripe";

export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function CheckoutPage() {
  // const paymentIntent = await stripe.paymentIntents.create({
  //   amount: total,
  //   currency: "USD",
  //   metadata: { orderId: productIdsBase64 },
  // });
  return (
    <h1>hi</h1>
    // <MultiItemCheckOutForm
    //   product={product}
    //   clientSecret={paymentIntent.client_secret}
    // />
  );
}
