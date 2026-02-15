import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://pnsaxhdjencvlntgbdyw.supabase.co";
const SUPABASE_PUBLIC_KEY = "sb_publishable_alNt-P6APLNb5zhExcl7nA_iiEZQu7-";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
