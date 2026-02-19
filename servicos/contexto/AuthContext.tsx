
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
  const [usuario, setUsuario] = useState<any | null>(() => {
    try {
      const cached = localStorage.getItem('escolarapp-perfil-cache');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  const iniciouRef = useRef(false);

  const buscarPerfilInstitucional = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('auth_user_id', userId)
        .maybeSingle();
      
      if (error || !data) return null;
      
      localStorage.setItem('escolarapp-perfil-cache', JSON.stringify(data));
      return data;
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    if (iniciouRef.current) return;
    iniciouRef.current = true;

    const inicializarAuth = async () => {
      try {
        // 1. Tenta pegar a sessão de forma rápida
        const { data: { session } } = await (supabase.auth as any).getSession();
        
        if (session) {
          setSessao(session);
          // Se não temos usuário no estado (cache falhou), buscamos agora
          if (!usuario) {
            const perfil = await buscarPerfilInstitucional(session.user.id);
            setUsuario(perfil);
          } else {
            // Se já temos cache, atualizamos em background sem bloquear
            buscarPerfilInstitucional(session.user.id).then(perfil => {
              if (perfil) setUsuario(perfil);
            });
          }
        } else {
          localStorage.removeItem('escolarapp-perfil-cache');
          setUsuario(null);
        }
      } catch (err) {
        console.error("Erro no boot auth:", err);
      } finally {
        setLoading(false);
      }

      // 2. Ouvinte de mudanças (Login/Logout)
      const { data: { subscription } } = (supabase.auth as any).onAuthStateChange(async (event: string, newSession: Session | null) => {
        setSessao(newSession);
        
        if (newSession) {
          const perfil = await buscarPerfilInstitucional(newSession.user.id);
          setUsuario(perfil);
        } else {
          localStorage.removeItem('escolarapp-perfil-cache');
          setUsuario(null);
          setSessao(null);
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
    localStorage.removeItem('escolarapp-perfil-cache');
    await (supabase.auth as any).signOut();
    setSessao(null);
    setUsuario(null);
    setLoading(false);
    window.location.href = '/#/acesso';
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
