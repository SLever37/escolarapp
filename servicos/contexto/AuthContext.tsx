
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

  const buscarPerfil = async (authId: string, tentativas = 0): Promise<void> => {
    try {
      // Nota: usuarios com RLS corrigido agora permitem esta busca sem recursão
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('auth_user_id', authId)
        .maybeSingle();

      if (error) {
        console.error('Erro RLS/Banco ao buscar perfil:', error.message);
        return;
      }

      if (data) {
        setUsuario(data);
      } else if (tentativas < 3) {
        // Retry progressivo para dar tempo ao trigger do banco em novos cadastros
        await new Promise(res => setTimeout(res, 800 * (tentativas + 1)));
        return buscarPerfil(authId, tentativas + 1);
      } else {
        setUsuario(null);
      }
    } catch (e) {
      console.error('Erro crítico na AuthProvider:', e);
    }
  };

  const recarregarPerfil = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await buscarPerfil(session.user.id);
    }
  };

  useEffect(() => {
    const inicializar = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await buscarPerfil(session.user.id);
      }
      setLoading(false);
    };

    inicializar();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
          await buscarPerfil(session.user.id);
        }
      } else {
        setUsuario(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const sair = async () => {
    await supabase.auth.signOut();
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, loading, sair, recarregarPerfil }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return context;
};
