
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://arqcbnkucnqzyhtcosdt.supabase.co";
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFycWNibmt1Y25xenlodGNvc2R0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMjczMDAsImV4cCI6MjA4NTgwMzMwMH0.IfjXo5SojHX3UimG0YWujew_OzZIdhKVcRW8yLvts2o";

// Always create a fresh instance to avoid stale singleton issues
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
    storageKey: 'escolarapp-auth-v1',
    storage: window.localStorage,
  },
})

export const estaConfigurado = !!SUPABASE_URL && !!SUPABASE_ANON_KEY;
