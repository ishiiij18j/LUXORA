import { useEffect, useState } from "react";
import type { CartItem } from "./cart-store";

export type Order = {
  id: string; // e.g. "LX-2026-4892"
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  promoCode?: string;
  shippingMethod: "standard" | "express";
  shippingCost: number;
  total: number;
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    street: string;
    apartment?: string;
    city: string;
    postalCode: string;
    country: string;
  };
  payment: {
    method: "card" | "apple_pay" | "concierge";
    cardLast4?: string;
  };
  status: "Confirmed" | "In Preparation" | "Dispatched" | "Delivered";
  trackingNumber: string;
  estimatedDelivery: string;
  isGift?: boolean;
  giftNote?: string;
};

const STORAGE_KEY = "luxora_orders_v1";

let globalOrders: Order[] = [];
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

function loadInitialOrders() {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      globalOrders = JSON.parse(raw);
    }
  } catch (err) {
    console.error("Failed to load orders from storage", err);
  }
}

function saveOrders() {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(globalOrders));
  } catch (err) {
    console.error("Failed to save orders to storage", err);
  }
}

if (typeof window !== "undefined") {
  loadInitialOrders();
}

function generateOrderId(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `LX-2026-${num}`;
}

function generateTrackingCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "IT-DHL-";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export const ordersStore = {
  getOrders(): Order[] {
    return globalOrders;
  },

  getOrderById(id: string): Order | undefined {
    return globalOrders.find((o) => o.id === id);
  },

  createOrder(params: Omit<Order, "id" | "createdAt" | "status" | "trackingNumber" | "estimatedDelivery">): Order {
    const now = new Date();
    const deliveryDate = new Date();
    deliveryDate.setDate(now.getDate() + (params.shippingMethod === "express" ? 2 : 4));

    const formattedDelivery = deliveryDate.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });

    const newOrder: Order = {
      ...params,
      id: generateOrderId(),
      createdAt: now.toISOString(),
      status: "Confirmed",
      trackingNumber: generateTrackingCode(),
      estimatedDelivery: formattedDelivery,
    };

    globalOrders.unshift(newOrder);
    saveOrders();
    notify();
    return newOrder;
  },

  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

export function useOrders() {
  const [, setTick] = useState(0);

  useEffect(() => {
    return ordersStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  return {
    orders: ordersStore.getOrders(),
    createOrder: ordersStore.createOrder.bind(ordersStore),
    getOrderById: ordersStore.getOrderById.bind(ordersStore),
  };
}
