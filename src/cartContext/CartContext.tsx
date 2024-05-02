"use client";

import { createContext, useState, useContext } from "react";

const CartContext = createContext<{
  cart: CartContextType[];
  addToCart: (product: CartContextType) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
}>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
});

type CartContextType = {
  name: string;
  priceInCents: number;
  description: string;
  id: string;
  imagePath: string;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState<CartContextType[]>([]);

  const addToCart = (product: CartContextType) => {
    setCart((prevState) => [...prevState, product]);
  };

  const removeFromCart = (productId: string) => {
    setCart((prevState) =>
      prevState.filter((product) => product.id !== productId)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
