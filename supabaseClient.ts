import { createClient } from '@supabase/supabase-js';

// Usando process.env pois o vite.config.ts está injetando via define
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://arqcbnkucnqzyhtcosdt.supabase.co';
const supabaseAnonKey = process.env.VITE_VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFycWNibmt1Y25xenlodGNvc2R0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMjczMDAsImV4cCI6MjA4NTgwMzMwMH0.IfjXo5SojHX3UimG0YWujew_OzZIdhKVcRW8yLvts2o';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const estaConfigurado = !!supabaseUrl && !!supabaseAnonKey;