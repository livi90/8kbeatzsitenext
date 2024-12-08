// src/store/useUserStore.ts
import { createClient } from "@/utils/supabase/client";
import { Session } from "@supabase/supabase-js";
import { create } from "zustand";

// Initialize Supabase client
const supabase = createClient();

// Define the store
type SessionStore = {
  session: Session | null; // The user can be any object, or null if not logged in
  setSession: (session: any) => void;
  clearSession: () => void;
};

const useSessionStore = create<SessionStore>((set, get) => ({
  session: null,
  setSession: (session) => set({ session }),
  clearSession: () => set({ session: null }),
}));

// Optional: Listen for user authentication state changes (e.g., using supabase auth listener)
supabase.auth.onAuthStateChange((_event, session) => {
  useSessionStore.getState().setSession(session);
});

export default useSessionStore;
