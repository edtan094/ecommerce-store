"use client";

import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";

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

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartContextType[]>([]);

  const addToCart = (product: CartContextType) => {
    setCart((prevState) => {
      const state = [...prevState, product];
      sessionStorage.setItem("ecommerce-cart", JSON.stringify(state));
      return state;
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevState) => {
      const state = prevState.filter((product) => product.id !== productId);
      sessionStorage.setItem("ecommerce-cart", JSON.stringify(state));
      return state;
    });
  };

  const isInCart = (productId: string) => {
    return cart?.some((product) => product.id === productId);
  };

  const clearCart = () => {
    sessionStorage.setItem("ecommerce-cart", JSON.stringify([]));
    setCart([]);
  };

  useEffect(() => {
    const cartItems = JSON.parse(
      sessionStorage.getItem("ecommerce-cart") as string
    );
    console.log("cartItems", cartItems);
    setCart(cartItems);
  }, []);

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
