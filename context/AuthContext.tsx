import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../servicos/supabaseClient';
import { Usuario } from '../tipos';
import { authService } from '../servicos/supabaseService';

interface AuthContextValue {
  usuario: Usuario | null;
  carregando: boolean;
  signIn: (email: string, senha: string) => Promise<boolean>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) {
        const u = await authService.getProfileById(data.session.user.id);
        setUsuario(u);
      }
      setCarregando(false);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const u = await authService.getProfileById(session.user.id);
        setUsuario(u);
      } else {
        setUsuario(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, senha: string) => {
    setCarregando(true);
    const usuarioLogado = await authService.signIn(email, senha);
    setUsuario(usuarioLogado);
    setCarregando(false);
    return !!usuarioLogado;
  };

  const signOut = async () => {
    await authService.signOut();
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, carregando, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
};
