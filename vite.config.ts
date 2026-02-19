import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        // Injetamos as variáveis como strings globais para compatibilidade
        'process.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL || 'https://arqcbnkucnqzyhtcosdt.supabase.co'),
        'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFycWNibmt1Y25xenlodGNvc2R0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMjczMDAsImV4cCI6MjA4NTgwMzMwMH0.IfjXo5SojHX3UimG0YWujew_OzZIdhKVcRW8yLvts2o'),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || '')
      },
      resolve: {
        alias: {
          '@': path.resolve('.'),
        }
      }
    };
});