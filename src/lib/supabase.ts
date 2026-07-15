import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string || "https://placeholder.supabase.co";
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string || "placeholder-key";

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn("Supabase env vars missing - chatbot DB context will be unavailable.");
}

export const supabase = createClient(url, anonKey);
