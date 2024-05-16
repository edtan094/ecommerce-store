"use client";

import { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext<{
  cart: CartContextType[];
  addToCart: (product: CartContextType) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
}>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  isInCart: () => false,
});

type CartContextType = {
  name: string;
  priceInCents: number;
  description: string;
  id: string;
  imagePath: string;
};

export const CartProvider = ({ children }) => {
  const cartExists =
    sessionStorage.getItem("ecommerce-cart") &&
    Array.isArray(
      JSON.parse(sessionStorage.getItem("ecommerce-cart") as string)
    );
  const [cart, setCart] = useState<CartContextType[]>(
    cartExists
      ? JSON.parse(sessionStorage.getItem("ecommerce-cart") as string)
      : []
  );

  const addToCart = (product: CartContextType) => {
    setCart((prevState) => [...prevState, product]);
  };

  const removeFromCart = (productId: string) => {
    setCart((prevState) =>
      prevState.filter((product) => product.id !== productId)
    );
  };

  const isInCart = (productId: string) => {
    return cart.some((product) => product.id === productId);
  };

  const clearCart = () => {
    setCart([]);
  };

  useEffect(() => {
    if (cartExists) {
      const cartItems = JSON.parse(
        sessionStorage.getItem("ecommerce-cart") as string
      );
      setCart(cartItems);
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("ecommerce-cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
