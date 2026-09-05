import { useEffect, useState } from "react";
import { fallbackProducts, type Product } from "./catalog";

const STORAGE_KEY = "luxora_wishlist_v1";

let globalWishlist: string[] = [];
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

function loadInitialState() {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      globalWishlist = JSON.parse(raw);
    }
  } catch (err) {
    console.error("Failed to load wishlist from storage", err);
  }
}

function saveState() {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(globalWishlist));
  } catch (err) {
    console.error("Failed to save wishlist to storage", err);
  }
}

if (typeof window !== "undefined") {
  loadInitialState();
}

export const wishlistStore = {
  getIds(): string[] {
    return globalWishlist;
  },

  has(productId: string): boolean {
    return globalWishlist.includes(productId);
  },

  toggle(productId: string): boolean {
    const exists = globalWishlist.includes(productId);
    if (exists) {
      globalWishlist = globalWishlist.filter((id) => id !== productId);
    } else {
      globalWishlist.push(productId);
    }
    saveState();
    notify();
    return !exists;
  },

  remove(productId: string) {
    if (globalWishlist.includes(productId)) {
      globalWishlist = globalWishlist.filter((id) => id !== productId);
      saveState();
      notify();
    }
  },

  clear() {
    globalWishlist = [];
    saveState();
    notify();
  },

  getCount(): number {
    return globalWishlist.length;
  },

  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

export function useWishlist(productsList: Product[] = fallbackProducts) {
  const [, setTick] = useState(0);

  useEffect(() => {
    return wishlistStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const ids = wishlistStore.getIds();
  const count = wishlistStore.getCount();

  const items = ids
    .map((id) => productsList.find((p) => p.id === id || p.image_key === id))
    .filter((p): p is Product => Boolean(p));

  return {
    ids,
    items,
    count,
    has: (id: string) => wishlistStore.has(id),
    toggle: (id: string) => wishlistStore.toggle(id),
    remove: (id: string) => wishlistStore.remove(id),
    clear: () => wishlistStore.clear(),
  };
}
