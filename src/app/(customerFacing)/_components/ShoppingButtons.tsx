"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useCart } from "@/cartContext/CartContext";

type ShoppingButtonsProps = {
  id: string;
  name: string;
  description: string;
  priceInCents: number;
  imagePath: string;
};

export default function ShoppingButtons({
  id,
  name,
  description,
  priceInCents,
  imagePath,
}: ShoppingButtonsProps) {
  const { addToCart, removeFromCart, cart, isInCart } = useCart();
  return (
    <>
      <Button asChild size="lg" className="w-1/3">
        <Link href={`/products/${id}/purchase`}>Purchase</Link>
      </Button>
      <Button
        className="w-1/3"
        size="lg"
        variant={isInCart(id) ? "destructive" : "default"}
        onClick={() => {
          if (isInCart(id)) {
            removeFromCart(id);
          } else {
            addToCart({
              id,
              name,
              description,
              priceInCents,
              imagePath,
            });
          }
        }}
      >
        {isInCart(id) ? "Remove" : "Add to Cart"}
      </Button>
    </>
  );
}
