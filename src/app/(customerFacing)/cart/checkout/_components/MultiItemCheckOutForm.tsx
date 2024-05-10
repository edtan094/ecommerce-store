"use client";

import { userOrderExists } from "@/app/actions/orders";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";
import { Product } from "@prisma/client";
import {
  Elements,
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Image from "next/image";
import { FormEvent, useState } from "react";

type CheckoutFormProps = {
  product: Product[];
  clientSecret: string;
};

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY as string);

export function MultiItemCheckOutForm({
  product,
  clientSecret,
}: CheckoutFormProps) {
  function totalPrice() {
    let total = 0;
    product.forEach((item) => {
      total += item.priceInCents;
    });
    return total;
  }

  return (
    <>
      <div className="max-w-5xl w-full mx-auto space-y-8">
        <div className=" flex gap-4 items-center">
          <div>
            <div className=" text-lg ">
              {formatCurrency(totalPrice() / 100)}
            </div>
          </div>
        </div>
        <Elements options={{ clientSecret }} stripe={stripePromise}>
          <Form
            priceInCents={totalPrice()}
            productId={JSON.stringify(productIds)}
          />
        </Elements>
      </div>
    </>
  );
}

function Form({
  priceInCents,
  productId,
}: {
  priceInCents: number;
  productId: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [email, setEmail] = useState<string>();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !email) return;

    setIsLoading(true);

    const orderExist = await userOrderExists(email, productId);

    if (orderExist) {
      setErrorMessage(
        "You have already purchased this product. Try downloading this from your Orders page"
      );
      setIsLoading(false);
      return;
    }

    stripe
      .confirmPayment({
        elements,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/stripe/purchase-success`,
        },
      })
      .then(({ error }) => {
        if (error.type === "card_error" || error.type === "validation_error") {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("An unexpected error occurred");
        }
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          {errorMessage && (
            <CardDescription className="text-destructive">
              {errorMessage}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <PaymentElement />
          <div className="mt-4">
            <LinkAuthenticationElement
              onChange={(e) => setEmail(e.value.email)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            size="lg"
            disabled={!stripe || !elements || isLoading}
          >
            {isLoading
              ? "Purchasing"
              : `Purchase - ${formatCurrency(priceInCents / 100)}`}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
