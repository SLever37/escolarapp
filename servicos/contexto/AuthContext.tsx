
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../../supabaseClient';

type AuthState = {
  loading: boolean;
  sessao: Session | null;
  usuario: any | null;
  sair: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [sessao, setSessao] = useState<Session | null>(null);
  const [usuario, setUsuario] = useState<any | null>(null);

  const iniciouRef = useRef(false);

  const buscarPerfilInstitucional = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('auth_user_id', userId)
        .single();
      
      if (error) {
        console.warn('Perfil institucional não encontrado para o usuário Auth.');
        return null;
      }
      return data;
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    if (iniciouRef.current) return;
    iniciouRef.current = true;

    const inicializarAuth = async () => {
      // 1. Tenta recuperar a sessão atual do storage
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (session) {
        setSessao(session);
        const perfil = await buscarPerfilInstitucional(session.user.id);
        setUsuario(perfil);
      }

      setLoading(false);

      // 2. Escuta mudanças globais de auth (Login, Logout, Token Refresh)
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
        setSessao(newSession);
        
        if (newSession) {
          const perfil = await buscarPerfilInstitucional(newSession.user.id);
          setUsuario(perfil);
        } else {
          setUsuario(null);
        }
        
        setLoading(false);
      });

      return () => {
        subscription.unsubscribe();
      };
    };

    inicializarAuth();
  }, []);

  const sair = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setSessao(null);
    setUsuario(null);
    setLoading(false);
  };

  const value = useMemo<AuthState>(
    () => ({ loading, sessao, usuario, sair }),
    [loading, sessao, usuario]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro do AuthProvider');
  return ctx;
};
