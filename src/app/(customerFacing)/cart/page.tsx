"use client";

import { CartItem } from "./_components/CartItem";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";
import { useCart } from "@/cartContext/CartContext";
import { useFormState, useFormStatus } from "react-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { redirect } from "next/navigation";

export default function MyCartPage() {
  const { addToCart, removeFromCart, cart, clearCart, isInCart } = useCart();
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const handleCheckProducts = async () => {
    const response = await fetch("/cart/findProducts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productIds: cart.map((item) => item.id), email }),
    });
    const listOfItemsThatHaveBeenBoughtAlready: {
      status: boolean;
      id: string;
    }[] = await response.json();
    let error = false;
    cart.forEach((item) => {
      const product = listOfItemsThatHaveBeenBoughtAlready.find(
        (product) => product.id === item.id
      );
      if (product?.status) {
        setErrorMessage(
          "You have already bought some items on this list, so we have clear these duplicate items from your cart! Please click checkout again to proceed."
        );
        error = true;
        removeFromCart(item.id);
      }
    });
    if (!error) {
      const productIds = cart.map((item) => item.id).join(".");
      redirect(`/cart/checkout/${productIds}`);
    }

    return listOfItemsThatHaveBeenBoughtAlready;
  };
  const [error, action] = useFormState(handleCheckProducts, {});

  return (
    <main>
      <div className="flex justify-center">
        <h1 className="text-4xl">My Cart</h1>
      </div>
      <div className="flex">
        <div className="w-2/3 px-4">
          {cart.length > 0 ? (
            <div className="my-9">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-4">
                {cart.map((item) => {
                  return (
                    <CartItem
                      key={item.id}
                      id={item.id}
                      name={item.name}
                      priceInCents={item.priceInCents}
                      description={item.description}
                      imagePath={item.imagePath}
                      handleRemoveCartItem={removeFromCart}
                    />
                  );
                })}
              </div>
            </div>
          ) : (
            <h2 className="text-2xl">Your Cart is Empty!</h2>
          )}
        </div>
        <div className="w-1/3 my-9">
          <form action={action}>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">Items in Cart: {cart.length}</p>
                <p className="text-lg">
                  Total:{" "}
                  {formatCurrency(
                    cart.reduce((acc, item) => acc + item.priceInCents, 0) / 100
                  )}
                </p>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {errorMessage && (
                  <div className="text-destructive">{errorMessage}</div>
                )}
              </CardContent>
              <CardFooter>
                <SubmitButton />
              </CardFooter>
            </Card>
          </form>
        </div>
      </div>
    </main>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit">{pending ? "Checking out..." : "Checkout"}</Button>
  );
}
