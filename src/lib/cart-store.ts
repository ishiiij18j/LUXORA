import { useEffect, useState } from "react";
import type { Product } from "./catalog";
import { getDefaultSizeForProduct } from "./catalog";

export type CartItem = {
  id: string; // unique cart line id: e.g. "prod-blazer-38 IT-Onyx Black"
  productId: string;
  name: string;
  price: number;
  image_key: string;
  size: string;
  color?: string;
  quantity: number;
};

export type PromoCode = {
  code: string;
  type: "percent" | "fixed";
  value: number;
  minSpend?: number;
  description: string;
};

export const AVAILABLE_PROMOS: Record<string, PromoCode> = {
  LUXORA10: {
    code: "LUXORA10",
    type: "percent",
    value: 10,
    description: "10% off luxury inaugural privilege",
  },
  MILANO: {
    code: "MILANO",
    type: "fixed",
    value: 100,
    minSpend: 500,
    description: "€100 off boutique collections over €500",
  },
  VIP20: {
    code: "VIP20",
    type: "percent",
    value: 20,
    description: "20% off private VIP salon privilege",
  },
};

const STORAGE_KEY = "luxora_cart_items_v1";
const PROMO_KEY = "luxora_applied_promo_v1";

let globalItems: CartItem[] = [];
let globalPromo: PromoCode | null = null;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

function loadInitialState() {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      globalItems = JSON.parse(raw);
    }
    const rawPromo = localStorage.getItem(PROMO_KEY);
    if (rawPromo && AVAILABLE_PROMOS[rawPromo]) {
      globalPromo = AVAILABLE_PROMOS[rawPromo];
    }
  } catch (err) {
    console.error("Failed to load cart from storage", err);
  }
}

function saveState() {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(globalItems));
    if (globalPromo) {
      localStorage.setItem(PROMO_KEY, globalPromo.code);
    } else {
      localStorage.removeItem(PROMO_KEY);
    }
  } catch (err) {
    console.error("Failed to save cart to storage", err);
  }
}

// Initialize immediately in browser
if (typeof window !== "undefined") {
  loadInitialState();
}

export const cartStore = {
  getItems(): CartItem[] {
    return globalItems;
  },

  getPromo(): PromoCode | null {
    return globalPromo;
  },

  addItem(
    product: Product,
    size?: string,
    color?: string,
    quantity: number = 1
  ): CartItem {
    const chosenSize = size || getDefaultSizeForProduct(product);
    const chosenColor = color || product.colors?.[0]?.name;
    const lineId = `${product.id || product.image_key}-${chosenSize}-${chosenColor || "default"}`;

    const existingIndex = globalItems.findIndex((item) => item.id === lineId);
    if (existingIndex > -1) {
      globalItems[existingIndex].quantity += quantity;
    } else {
      globalItems.push({
        id: lineId,
        productId: product.id,
        name: product.name,
        price: product.price,
        image_key: product.image_key,
        size: chosenSize,
        color: chosenColor,
        quantity,
      });
    }

    saveState();
    notify();
    return globalItems.find((i) => i.id === lineId)!;
  },

  updateQuantity(id: string, quantity: number) {
    if (quantity <= 0) {
      this.removeItem(id);
      return;
    }
    const item = globalItems.find((i) => i.id === id);
    if (item) {
      item.quantity = quantity;
      saveState();
      notify();
    }
  },

  removeItem(id: string) {
    globalItems = globalItems.filter((i) => i.id !== id);
    saveState();
    notify();
  },

  clearCart() {
    globalItems = [];
    globalPromo = null;
    saveState();
    notify();
  },

  applyPromo(code: string): { success: boolean; message: string } {
    const clean = code.trim().toUpperCase();
    const promo = AVAILABLE_PROMOS[clean];
    if (!promo) {
      return { success: false, message: "Invalid promotional privilege code." };
    }

    const subtotal = this.getSubtotal();
    if (promo.minSpend && subtotal < promo.minSpend) {
      return {
        success: false,
        message: `This code requires a minimum purchase of €${promo.minSpend}.`,
      };
    }

    globalPromo = promo;
    saveState();
    notify();
    return { success: true, message: `Privilege applied: ${promo.description}` };
  },

  removePromo() {
    globalPromo = null;
    saveState();
    notify();
  },

  getSubtotal(): number {
    return globalItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  },

  getDiscount(subtotal: number): number {
    if (!globalPromo) return 0;
    if (globalPromo.minSpend && subtotal < globalPromo.minSpend) return 0;

    if (globalPromo.type === "percent") {
      return Math.round((subtotal * globalPromo.value) / 100);
    }
    if (globalPromo.type === "fixed") {
      return Math.min(globalPromo.value, subtotal);
    }
    return 0;
  },

  getTotal(): { subtotal: number; discount: number; shipping: number; total: number } {
    const subtotal = this.getSubtotal();
    const discount = this.getDiscount(subtotal);
    const shipping = 0; // Complimentary standard shipping
    const total = Math.max(0, subtotal - discount + shipping);
    return { subtotal, discount, shipping, total };
  },

  getCount(): number {
    return globalItems.reduce((acc, item) => acc + item.quantity, 0);
  },

  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

export function useCart() {
  const [, setTick] = useState(0);

  useEffect(() => {
    return cartStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const items = cartStore.getItems();
  const promo = cartStore.getPromo();
  const totals = cartStore.getTotal();
  const count = cartStore.getCount();

  return {
    items,
    promo,
    totals,
    count,
    addItem: cartStore.addItem.bind(cartStore),
    updateQuantity: cartStore.updateQuantity.bind(cartStore),
    removeItem: cartStore.removeItem.bind(cartStore),
    clearCart: cartStore.clearCart.bind(cartStore),
    applyPromo: cartStore.applyPromo.bind(cartStore),
    removePromo: cartStore.removePromo.bind(cartStore),
  };
}
