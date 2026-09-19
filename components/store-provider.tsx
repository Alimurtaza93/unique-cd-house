"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/types";

type CartItem = { product: Product; quantity: number };
type StoreState = {
  cart: CartItem[];
  wishlist: Product[];
  compare: Product[];
  cartCount: number;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  toggleCompare: (product: Product) => void;
  inWishlist: (id: string) => boolean;
  inCompare: (id: string) => boolean;
};

const StoreContext = createContext<StoreState | null>(null);
const CART_KEY = "ucd-cart-v2";
const WISHLIST_KEY = "ucd-wishlist-v2";
const COMPARE_KEY = "ucd-compare-v2";

function safeRead<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [compare, setCompare] = useState<Product[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setCart(safeRead<CartItem[]>(CART_KEY, []));
    setWishlist(safeRead<Product[]>(WISHLIST_KEY, []));
    setCompare(safeRead<Product[]>(COMPARE_KEY, []));
    setReady(true);
  }, []);

  useEffect(() => { if (ready) localStorage.setItem(CART_KEY, JSON.stringify(cart)); }, [cart, ready]);
  useEffect(() => { if (ready) localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist)); }, [wishlist, ready]);
  useEffect(() => { if (ready) localStorage.setItem(COMPARE_KEY, JSON.stringify(compare)); }, [compare, ready]);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    if (product.stock_qty < 1) return;
    setCart((current) => {
      const found = current.find((item) => item.product.id === product.id);
      if (found) return current.map((item) => item.product.id === product.id ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock_qty) } : item);
      return [...current, { product, quantity: Math.min(Math.max(quantity, 1), product.stock_qty) }];
    });
  }, []);

  const removeFromCart = useCallback((id: string) => setCart((current) => current.filter((item) => item.product.id !== id)), []);
  const setQuantity = useCallback((id: string, quantity: number) => setCart((current) => current.map((item) => item.product.id === id ? { ...item, quantity: Math.max(1, Math.min(quantity, item.product.stock_qty || 1)) } : item)), []);
  const clearCart = useCallback(() => setCart([]), []);
  const toggleWishlist = useCallback((product: Product) => setWishlist((current) => current.some((p) => p.id === product.id) ? current.filter((p) => p.id !== product.id) : [...current, product]), []);
  const toggleCompare = useCallback((product: Product) => setCompare((current) => {
    if (current.some((p) => p.id === product.id)) return current.filter((p) => p.id !== product.id);
    return [...current.slice(-2), product];
  }), []);
  const inWishlist = useCallback((id: string) => wishlist.some((p) => p.id === id), [wishlist]);
  const inCompare = useCallback((id: string) => compare.some((p) => p.id === id), [compare]);
  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  return <StoreContext.Provider value={{ cart, wishlist, compare, cartCount, addToCart, removeFromCart, setQuantity, clearCart, toggleWishlist, toggleCompare, inWishlist, inCompare }}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error("useStore must be used inside StoreProvider");
  return value;
}
