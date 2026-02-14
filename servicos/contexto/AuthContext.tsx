
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '../../supabaseClient';

// Fallback for Session type if not exported correctly from the library version
type Session = any;

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
      
      if (error) return null;
      return data;
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    if (iniciouRef.current) return;
    iniciouRef.current = true;

    const inicializarAuth = async () => {
      // Use any casting to bypass incomplete type definitions for getSession
      const { data: { session } } = await (supabase.auth as any).getSession();
      
      if (session) {
        setSessao(session);
        const perfil = await buscarPerfilInstitucional(session.user.id);
        setUsuario(perfil);
      }
      setLoading(false);

      // Handle auth state changes with any casting to satisfy compiler
      const { data: { subscription } } = (supabase.auth as any).onAuthStateChange(async (event: string, newSession: Session | null) => {
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
    // Use any casting for signOut
    await (supabase.auth as any).signOut();
    setSessao(null);
    setUsuario(null);
    setLoading(false);
    window.location.href = '/#/acesso'; // Full route cleanup
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
