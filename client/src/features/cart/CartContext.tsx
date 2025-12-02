// src/features/cart/CartContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import toast from "react-hot-toast";

import {
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
  clearCartApi,
} from "../../services/cartApi";
import { useAuth } from "../auth/AuthContext";
import type { CartItem } from "./types";

interface CartContextValue {
  cart: CartItem[];
  loading: boolean;
  addItem: (item: CartItem) => Promise<void>;
  updateQuantity: (
    productId: string,
    size: number,
    quantity: number,
  ) => Promise<void>;
  removeItem: (productId: string, size: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Load cart from backend on login
  useEffect(() => {
    const loadCart = async () => {
      if (!user) {
        setCart([]);
        return;
      }

      try {
        setLoading(true);
        const data = await getCart();

        // Normalize productId into string
        setCart(
          data.map((item: any) => ({
            ...item,
            productId: String(item.productId),
          })),
        );
      } catch (err) {
        console.error("Failed to load cart", err);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [user]);

  // ADD ITEM
  const addItem = async (item: CartItem) => {
    if (!user) return;

    try {
      const res = await addToCart({
        ...item,
        productId: String(item.productId),
      });

      setCart(
        res.map((it: any) => ({
          ...it,
          productId: String(it.productId),
        })),
      );

      toast.success("Added to cart");
    } catch (err) {
      toast.error("Failed to add");
    }
  };

  // UPDATE QUANTITY
  const updateQuantity = async (
    productId: string,
    size: number,
    quantity: number,
  ) => {
    try {
      const res = await updateCart({
        productId: String(productId),
        size,
        quantity,
      });

      setCart(
        res.map((it: any) => ({
          ...it,
          productId: String(it.productId),
        })),
      );

      toast.success("Updated cart");
    } catch (err) {
      toast.error("Update failed");
    }
  };

  // REMOVE ITEM
  const removeItem = async (productId: string, size: number) => {
    try {
      const res = await removeFromCart({
        productId: String(productId),
        size,
      });

      setCart(
        res.map((it: any) => ({
          ...it,
          productId: String(it.productId),
        })),
      );

      toast.success("Removed");
    } catch (err) {
      toast.error("Failed to remove");
    }
  };

  // CLEAR CART
  const clearCart = async () => {
    try {
      await clearCartApi();
      setCart([]);
      toast.success("Cart cleared");
    } catch {
      toast.error("Failed to clear");
    }
  };

  const getItemCount = () =>
    cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
}
