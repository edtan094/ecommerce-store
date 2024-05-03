"use client";

import { useEffect, useState } from "react";
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

export default function MyCartPage() {
  const { addToCart, removeFromCart, cart, clearCart, isInCart } = useCart();

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
            </CardContent>
            <CardFooter>
              <Button>
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  );
}
