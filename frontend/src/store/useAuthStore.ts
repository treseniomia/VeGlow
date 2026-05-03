import { create } from "zustand";
import * as SecureStore from "expo-secure-store";

interface AuthState {
  user: any | null;
  token: string | null;
  isHydrated: boolean;
  rehydrate: (user: any, token: string) => void;
  login: (user: any, token: string) => Promise<void>;
  updateUser: (updatedFields: any) => Promise<void>;
  setHydrated: (val: boolean) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isHydrated: false,

  rehydrate: (user, token) => {
    set({ user, token, isHydrated: true });
  },

  login: async (user, token) => {
    try {
      await SecureStore.setItemAsync("userToken", token);
      await SecureStore.setItemAsync("userData", JSON.stringify(user));
      set({ user, token, isHydrated: true });
    } catch (e) {
      console.error("Store Save Error:", e);
    }
  },

  updateUser: async (updatedFields) => {
    try {
      const currentUser = get().user;
      const newUser = { ...currentUser, ...updatedFields };

      await SecureStore.setItemAsync("userData", JSON.stringify(newUser));

      set({ user: newUser });
    } catch (e) {
      console.error("Update Store Error:", e);
    }
  },

  setHydrated: (val: boolean) => set({ isHydrated: val }),

  logout: async () => {
    await SecureStore.deleteItemAsync("userToken");
    await SecureStore.deleteItemAsync("userData");
    set({ user: null, token: null, isHydrated: true });
  },
}));
