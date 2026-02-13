import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Usuario } from '../../tipos';

interface AuthContextType {
  usuario: Usuario | null;
  loading: boolean;
  sair: () => Promise<void>;
  recarregarPerfil: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  // Função interna para buscar o perfil na tabela 'usuarios' vinculada ao auth_user_id do Supabase
  const buscarPerfilInstitucional = async (userId: string): Promise<Usuario | null> => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('auth_user_id', userId)
        .maybeSingle();

      if (error) throw error;
      return data as Usuario | null;
    } catch (err) {
      console.error('Erro ao recuperar perfil institucional:', err);
      return null;
    }
  };

  const recarregarPerfil = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const perfil = await buscarPerfilInstitucional(session.user.id);
        setUsuario(perfil);
      } else {
        setUsuario(null);
      }
    } catch (e) {
      setUsuario(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let montado = true;

    const inicializarSessao = async () => {
      try {
        // 1. Tenta recuperar sessão atual do storage local/cookies
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;

        if (session?.user && montado) {
          const perfil = await buscarPerfilInstitucional(session.user.id);
          if (montado) setUsuario(perfil);
        } else if (montado) {
          setUsuario(null);
        }
      } catch (err) {
        console.error("Falha crítica na inicialização da autenticação:", err);
        if (montado) setUsuario(null);
      } finally {
        // CRÍTICO: Sempre garante o fim do estado de carregamento
        if (montado) setLoading(false);
      }
    };

    inicializarSessao();

    // 2. Escuta mudanças de estado (Login, Logout, Expiração de Token)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!montado) return;

      if (session?.user) {
        const perfil = await buscarPerfilInstitucional(session.user.id);
        if (montado) {
          setUsuario(perfil);
          setLoading(false);
        }
      } else if (event === 'SIGNED_OUT' || !session) {
        if (montado) {
          setUsuario(null);
          setLoading(false);
        }
      }
    });

    return () => {
      montado = false;
      subscription.unsubscribe();
    };
  }, []);

  const sair = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUsuario(null);
    } catch (e) {
      console.error("Erro ao encerrar sessão:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ usuario, loading, sair, recarregarPerfil }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
