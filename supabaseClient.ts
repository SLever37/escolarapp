
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const SUPABASE_URL = ((import.meta as any).env?.VITE_SUPABASE_URL) || "https://arqcbnkucnqzyhtcosdt.supabase.co";
const SUPABASE_ANON_KEY = ((import.meta as any).env?.VITE_SUPABASE_ANON_KEY) || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFycWNibmt1Y25xenlodGNvc2R0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMjczMDAsImV4cCI6MjA4NTgwMzMwMH0.IfjXo5SojHX3UimG0YWujew_OzZIdhKVcRW8yLvts2o";

declare global {
  // eslint-disable-next-line no-var
  var __SUPABASE_CLIENT__: SupabaseClient | undefined
}

export const supabase =
  globalThis.__SUPABASE_CLIENT__ ??
  (globalThis.__SUPABASE_CLIENT__ = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true, // Garante que a sessão seja salva
      autoRefreshToken: true, // Renova o token automaticamente antes de expirar
      detectSessionInUrl: true,
      storageKey: 'escolarapp-auth-v1', // Chave única para evitar conflitos
      storage: window.localStorage, // Força o uso do localStorage para persistência permanente
    },
  }))

export const estaConfigurado = !!SUPABASE_URL && !!SUPABASE_ANON_KEY;
