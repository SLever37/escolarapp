import { supabase } from './supabaseClient';
import { Usuario } from '../tipos';

export const authService = {
  signIn: async (email: string, password: string): Promise<Usuario | null> => {
    const resp = await supabase.auth.signInWithPassword({ email, password });
    if (resp.error || !resp.data?.user) return null;

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', resp.data.user.id)
      .single();

    if (error || !profile) return null;

    // Mapear para tipo local `Usuario`
    const usuario: Usuario = {
      id: profile.id,
      nome: profile.nome || profile.email || 'Usuário',
      cpf: profile.cpf || '',
      papel: profile.papel,
      unidade: profile.unidade || 'Plataforma Central',
      delegacoes: profile.delegacoes || []
    };

    return usuario;
  },

  signOut: async () => {
    await supabase.auth.signOut();
  },

  getProfileById: async (id: string): Promise<Usuario | null> => {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !profile) return null;

    return {
      id: profile.id,
      nome: profile.nome || profile.email || 'Usuário',
      cpf: profile.cpf || '',
      papel: profile.papel,
      unidade: profile.unidade || 'Plataforma Central',
      delegacoes: profile.delegacoes || []
    };
  }
};
