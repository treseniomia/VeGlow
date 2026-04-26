import { create } from "zustand";
import * as SecureStore from "expo-secure-store";

interface AuthState {
  user: any | null;
  token: string | null;
  isHydrated: boolean;
  // Para sa initial load (walang side effect sa storage)
  rehydrate: (user: any, token: string) => void;
  // Para sa actual login (nag-sa-save sa storage)
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

  // 2. ADDED: The actual implementation of updateUser
  updateUser: async (updatedFields) => {
    try {
      const currentUser = get().user; // 3. Get current user data from store
      const newUser = { ...currentUser, ...updatedFields }; // 4. Merge old data with new fields (like profilePicture)

      // 5. Update SecureStore so the change persists after app restart
      await SecureStore.setItemAsync("userData", JSON.stringify(newUser));

      // 6. Update the global state
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
