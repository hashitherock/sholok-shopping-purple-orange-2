import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { productById, type Product } from "@/data/catalog";

type CartLine = { id: string; qty: number };

type ShopState = {
  cart: CartLine[];
  cartItems: { product: Product; qty: number }[];
  cartCount: number;
  subtotal: number;
  addToCart: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  wishlist: string[];
  toggleWishlist: (id: string) => void;
  compare: string[];
  toggleCompare: (id: string) => void;
  location: string;
  setLocation: (l: string) => void;
  lastSearch: string | null;
  recordSearch: (q: string) => void;
  sessionSeed: number;
  cartOpen: boolean;
  setCartOpen: (o: boolean) => void;
  compareOpen: boolean;
  setCompareOpen: (o: boolean) => void;
  quickView: Product | null;
  setQuickView: (p: Product | null) => void;
};

const ShopContext = createContext<ShopState | null>(null);

function usePersisted<T>(key: string, initial: T, storage: "local" | "session" = "local") {
  const [value, setValue] = useState<T>(initial);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    try {
      const s = storage === "local" ? localStorage : sessionStorage;
      const raw = s.getItem(key);
      if (raw) setValue(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, [key, storage]);
  useEffect(() => {
    if (!loaded) return;
    try {
      const s = storage === "local" ? localStorage : sessionStorage;
      s.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value, loaded, storage]);
  return [value, setValue] as const;
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = usePersisted<CartLine[]>("sholok-cart", []);
  const [wishlist, setWishlist] = usePersisted<string[]>("sholok-wishlist", []);
  const [compare, setCompare] = usePersisted<string[]>("sholok-compare", []);
  const [location, setLocation] = usePersisted<string>("sholok-location", "Dhaka");
  const [lastSearch, setLastSearch] = usePersisted<string | null>("sholok-last-search", null, "session");
  const [sessionSeed, setSessionSeed] = usePersisted<number>("sholok-seed", 1, "session");
  const [cartOpen, setCartOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [quickView, setQuickView] = useState<Product | null>(null);

  useEffect(() => {
    if (!sessionStorage.getItem("sholok-seed")) setSessionSeed(Math.floor(Math.random() * 100000) + 1);
  }, [setSessionSeed]);

  const addToCart = useCallback((id: string, qty = 1) => {
    setCart((c) => {
      const ex = c.find((l) => l.id === id);
      return ex ? c.map((l) => (l.id === id ? { ...l, qty: l.qty + qty } : l)) : [...c, { id, qty }];
    });
    const p = productById(id);
    toast.success("Added to cart", { description: p?.name });
    setCartOpen(true);
  }, [setCart]);

  const setQty = useCallback((id: string, qty: number) => {
    setCart((c) => (qty <= 0 ? c.filter((l) => l.id !== id) : c.map((l) => (l.id === id ? { ...l, qty } : l))));
  }, [setCart]);

  const removeFromCart = useCallback((id: string) => setCart((c) => c.filter((l) => l.id !== id)), [setCart]);

  const toggleWishlist = useCallback((id: string) => {
    setWishlist((w) => {
      const has = w.includes(id);
      toast(has ? "Removed from wishlist" : "Saved to wishlist", { description: productById(id)?.name });
      return has ? w.filter((x) => x !== id) : [...w, id];
    });
  }, [setWishlist]);

  const toggleCompare = useCallback((id: string) => {
    setCompare((c) => {
      if (c.includes(id)) return c.filter((x) => x !== id);
      if (c.length >= 4) { toast.error("You can compare up to 4 products"); return c; }
      toast("Added to compare", { description: productById(id)?.name });
      return [...c, id];
    });
  }, [setCompare]);

  const recordSearch = useCallback((q: string) => { if (q.trim()) setLastSearch(q.trim()); }, [setLastSearch]);

  const value = useMemo<ShopState>(() => {
    const cartItems = cart
      .map((l) => ({ product: productById(l.id), qty: l.qty }))
      .filter((x): x is { product: Product; qty: number } => !!x.product);
    return {
      cart, cartItems,
      cartCount: cartItems.reduce((s, x) => s + x.qty, 0),
      subtotal: cartItems.reduce((s, x) => s + x.qty * x.product.price, 0),
      addToCart, setQty, removeFromCart,
      wishlist, toggleWishlist, compare, toggleCompare,
      location, setLocation, lastSearch, recordSearch, sessionSeed,
      cartOpen, setCartOpen, compareOpen, setCompareOpen, quickView, setQuickView,
    };
  }, [cart, addToCart, setQty, removeFromCart, wishlist, toggleWishlist, compare, toggleCompare, location, setLocation, lastSearch, recordSearch, sessionSeed, cartOpen, compareOpen, quickView]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used inside ShopProvider");
  return ctx;
}
