"use client";

import { useEffect, useState } from "react";
import { CartItem } from "./_components/CartItem";

export default function MyCartPage() {
  const [cartItems, setCartItems] = useState<
    {
      name: string;
      priceInCents: number;
      description: string;
      id: string;
      imagePath: string;
    }[]
  >([]);
  function handleRemoveCartItem(id: string) {
    const updatedCart = cartItems.filter(
      (item: { id: string }) => item.id !== id
    );
    setCartItems(updatedCart);
    localStorage.setItem("ecommerce-cart", JSON.stringify(updatedCart));
  }

  useEffect(() => {
    if (
      localStorage.getItem("ecommerce-cart") &&
      Array.isArray(
        JSON.parse(localStorage.getItem("ecommerce-cart") as string)
      )
    ) {
      setCartItems(
        JSON.parse(localStorage.getItem("ecommerce-cart") as string)
      );
    }
  }, []);

  return (
    <main>
      <div className="flex justify-center">
        <h1 className="text-4xl">My Cart</h1>
      </div>
      {cartItems.length > 0 ? (
        <div className="my-9">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-4">
            {cartItems.map((item) => {
              return (
                <CartItem
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  priceInCents={item.priceInCents}
                  description={item.description}
                  imagePath={item.imagePath}
                  handleRemoveCartItem={handleRemoveCartItem}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <h2 className="text-2xl">Your Cart is Empty!</h2>
      )}
    </main>
  );
}
