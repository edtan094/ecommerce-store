import db from "@/db/db";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import PurchaseReceiptEmail from "@/email/PurchaseReceipt";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const resend = new Resend(process.env.RESEND_API_KEY as string);

export async function POST(req: NextRequest) {
  const event = await stripe.webhooks.constructEvent(
    await req.text(),
    req.headers.get("stripe-signature") as string,
    process.env.STRIPE_WEBHOOK_SECRET as string
  );

  if (event.type === "charge.succeeded") {
    const charge = event.data.object;
    if (charge.description === "Multiple items") {
      handleMultiItems(event);
    } else {
      const productId = charge.metadata.productId;
      const email = charge.billing_details.email;
      const pricePaidInCents = charge.amount;

      const product = await db.product.findUnique({ where: { id: productId } });

      if (!product || !email) {
        return new NextResponse("Bad Request", { status: 400 });
      }

      const userFields = {
        email,
        orders: { create: { productId, pricePaidInCents } },
      };
      const {
        orders: [order],
      } = await db.user.upsert({
        where: { email },
        create: userFields,
        update: userFields,
        select: { orders: { orderBy: { createdAt: "desc" }, take: 1 } },
      });

      const downloadVerification = await db.downloadVerification.create({
        data: {
          productId,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
        },
      });

      const { data, error } = await resend.emails.send({
        from: `Support <${process.env.SENDER_EMAIL}>`,
        to: [email],
        subject: "Order Confirmation",
        react: (
          <PurchaseReceiptEmail
            order={order}
            product={product}
            downloadVerificationId={downloadVerification.id}
          />
        ),
      });
      if (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
      }
    }
  }

  return new NextResponse();
}

// async function handleMultiItems(event: Stripe.Event) {
//   if (event.type !== "charge.succeeded") throw new Error("Invalid event type");
//   const charge = event.data.object;
//   const productIds = charge.metadata.productId.split(".");
//   const email = charge.billing_details.email;
//   const pricePaidInCents = charge.amount;

//   const productsPromises = productIds.map(async (productId) => {
//     return await db.product.findUnique({ where: { id: productId } });
//   });

//   const products = await Promise.all(productsPromises);

//   if (!products || !email) {
//     return new NextResponse("Bad Request", { status: 400 });
//   }

//   const orders = products.map(async (product) => {
//     const userFields = {
//       email,
//       orders: { create: { productId, pricePaidInCents } },
//     };
//     const {
//       orders: [order],
//     } = await db.user.upsert({
//       where: { email },
//       create: userFields,
//       update: userFields,
//       select: { orders: { orderBy: { createdAt: "desc" }, take: 1 } },
//     });
//     return order;
//   });
// }

async function handleMultiItems(event: Stripe.Event) {
  if (event.type !== "charge.succeeded") throw new Error("Invalid event type");
  const charge = event.data.object;
  console.log("charge.metadata.productId", charge.metadata.productId);
  const productIds = charge.metadata.productIds.split(".");
  const email = charge.billing_details.email;
  const pricePaidInCents = charge.amount;

  const products = await db.product.findMany({
    where: { id: { in: productIds } },
  });

  if (!products || !email) {
    return new NextResponse("Bad Request", { status: 400 });
  }

  const ordersData = products.map((product) => ({
    productId: product.id,
    pricePaidInCents: product.priceInCents,
  }));

  const userFields = {
    email,
    orders: { create: ordersData },
  };

  const { orders } = await db.user.upsert({
    where: { email },
    create: userFields,
    update: userFields,
    select: { orders: { orderBy: { createdAt: "desc" } } },
  });

  console.log("orders", orders);

  const downloadVerifications = await Promise.all(
    products.map((product) =>
      db.downloadVerification.create({
        data: {
          productId: product.id,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
        },
      })
    )
  );
  console.log("downloadVerifications", downloadVerifications);

  // const { data, error } = await resend.emails.send({
  //   from: `Support <${process.env.SENDER_EMAIL}>`,
  //   to: [email],
  //   subject: "Order Confirmation",
  //   react: (
  //     <PurchaseReceiptEmail
  //       orders={orders}
  //       products={products}
  //       downloadVerificationIds={downloadVerifications.map((dv) => dv.id)}
  //     />
  //   ),
  // });

  // if (error) {
  //   return new NextResponse("Internal Server Error", { status: 500 });
  // }
}
