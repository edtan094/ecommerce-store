"use client";
import { useCart } from "@/cartContext/CartContext";
import { useEffect } from "react";
export function Header({ isSuccess }: { isSuccess: boolean }) {
  const { clearCart, cart } = useCart();
  useEffect(() => {
    clearCart();
    sessionStorage.setItem("ecommerce-cart", JSON.stringify([]));
  }, []);

  return (
    <h1 className="text-4xl font-bold">{isSuccess ? "Success!" : "Error!"}</h1>
  );
}
