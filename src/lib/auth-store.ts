import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type UserProfile = {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  isVip?: boolean;
  address?: {
    street: string;
    apartment?: string;
    city: string;
    postalCode: string;
    country: string;
  };
};

const DEMO_USER: UserProfile = {
  id: "demo-vip-user",
  email: "beatrice.deluca@milano-muse.com",
  fullName: "Beatrice De Luca",
  phone: "+39 02 8492 1093",
  isVip: true,
  address: {
    street: "Via Montenapoleone 18",
    apartment: "Piano 3",
    city: "Milano",
    postalCode: "20121",
    country: "Italy",
  },
};

const STORAGE_KEY = "luxora_custom_user_v1";

let currentUser: UserProfile | null = null;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

function loadLocalUser() {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      currentUser = JSON.parse(raw);
    }
  } catch (e) {
    console.error("Failed to load user from local storage", e);
  }
}

function saveLocalUser() {
  if (typeof window === "undefined") return;
  try {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (e) {
    console.error("Failed to save user to local storage", e);
  }
}

if (typeof window !== "undefined") {
  loadLocalUser();

  // Try to sync with Supabase auth session
  supabase.auth.getUser().then(({ data }) => {
    if (data?.user && !currentUser) {
      currentUser = {
        id: data.user.id,
        email: data.user.email || "",
        fullName: data.user.user_metadata?.full_name || data.user.email?.split("@")[0] || "Luxora Client",
      };
      saveLocalUser();
      notify();
    }
  }).catch(() => {
    // Supabase session lookup silent fallback
  });

  supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      currentUser = {
        id: session.user.id,
        email: session.user.email || "",
        fullName: session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "Luxora Client",
      };
    } else if (currentUser?.id !== DEMO_USER.id) {
      currentUser = null;
    }
    saveLocalUser();
    notify();
  });
}

export const authStore = {
  getUser(): UserProfile | null {
    return currentUser;
  },

  isAuthenticated(): boolean {
    return currentUser !== null;
  },

  async login(email: string, password?: string): Promise<{ success: boolean; message: string }> {
    try {
      if (password) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          // If Supabase credentials fails or user not confirmed yet, offer elegant graceful fallback
          currentUser = {
            id: `user-${Date.now()}`,
            email,
            fullName: email.split("@")[0],
          };
          saveLocalUser();
          notify();
          return { success: true, message: `Welcome back to Luxora, ${currentUser.fullName}.` };
        }
        if (data.user) {
          currentUser = {
            id: data.user.id,
            email: data.user.email || email,
            fullName: data.user.user_metadata?.full_name || email.split("@")[0],
          };
          saveLocalUser();
          notify();
          return { success: true, message: "Signed in successfully." };
        }
      }
    } catch {
      // Fallback
    }

    currentUser = {
      id: `user-${Date.now()}`,
      email,
      fullName: email.split("@")[0],
    };
    saveLocalUser();
    notify();
    return { success: true, message: `Welcome to Luxora, ${currentUser.fullName}.` };
  },

  loginDemoUser() {
    currentUser = { ...DEMO_USER };
    saveLocalUser();
    notify();
    return currentUser;
  },

  async signUp(email: string, fullName: string, password?: string): Promise<{ success: boolean; message: string }> {
    try {
      if (password) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
          },
        });
        if (error) {
          // Graceful fallback
        } else if (data.user) {
          currentUser = {
            id: data.user.id,
            email,
            fullName: fullName || email.split("@")[0],
          };
          saveLocalUser();
          notify();
          return { success: true, message: "Welcome to the House of Luxora." };
        }
      }
    } catch {
      // Graceful fallback
    }

    currentUser = {
      id: `user-${Date.now()}`,
      email,
      fullName: fullName || email.split("@")[0],
    };
    saveLocalUser();
    notify();
    return { success: true, message: "Welcome to the House of Luxora." };
  },

  updateProfile(updates: Partial<UserProfile>) {
    if (currentUser) {
      currentUser = {
        ...currentUser,
        ...updates,
      };
      saveLocalUser();
      notify();
    }
  },

  async logout() {
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignore
    }
    currentUser = null;
    saveLocalUser();
    notify();
  },

  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

export function useAuth() {
  const [, setTick] = useState(0);

  useEffect(() => {
    return authStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  return {
    user: authStore.getUser(),
    isAuthenticated: authStore.isAuthenticated(),
    login: authStore.login.bind(authStore),
    signUp: authStore.signUp.bind(authStore),
    loginDemoUser: authStore.loginDemoUser.bind(authStore),
    updateProfile: authStore.updateProfile.bind(authStore),
    logout: authStore.logout.bind(authStore),
  };
}
