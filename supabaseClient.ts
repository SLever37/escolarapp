import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// No Vite, usamos import.meta.env. Para ambientes de desenvolvimento/preview, 
// mantemos os fallbacks das suas chaves de produção.
const SUPABASE_URL = (import.meta.env?.VITE_SUPABASE_URL) || "https://arqcbnkucnqzyhtcosdt.supabase.co";
const SUPABASE_ANON_KEY = (import.meta.env?.VITE_SUPABASE_ANON_KEY) || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFycWNibmt1Y25xenlodGNvc2R0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMjczMDAsImV4cCI6MjA4NTgwMzMwMH0.IfjXo5SojHX3UimG0YWujew_OzZIdhKVcRW8yLvts2o";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || SUPABASE_URL.includes('undefined')) {
  console.error("Erro Crítico: Supabase URL ou Anon Key não detectados.");
}

declare global {
  // eslint-disable-next-line no-var
  var __SUPABASE_CLIENT__: SupabaseClient | undefined
}

export const supabase =
  globalThis.__SUPABASE_CLIENT__ ??
  (globalThis.__SUPABASE_CLIENT__ = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'escolarapp-auth',
    },
  }))

export const estaConfigurado = !!SUPABASE_URL && !!SUPABASE_ANON_KEY;