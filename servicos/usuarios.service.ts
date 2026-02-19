
import { supabase } from '../supabaseClient';

// Corrigido: Removida a extensão de 'any' que não é permitida para interfaces em TypeScript.
export interface UsuarioComUnidade {
  id: string;
  nome: string;
  email: string;
  papel: string;
  ativo: boolean;
  unidade_id: string;
  unidade_ref?: { nome: string };
}

export const usuariosService = {
  async fetchUsuariosPorUnidade(unidadeId: string) {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('unidade_id', unidadeId)
      .order('nome', { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  },

  async fetchGestoresGlobal(): Promise<UsuarioComUnidade[]> {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*, unidade_ref:unidades_escolares(nome)')
      .eq('papel', 'gestor')
      .order('nome', { ascending: true });

    if (error) throw new Error(error.message);
    return (data || []) as UsuarioComUnidade[];
  },

  async atualizarUsuario(id: string, payload: { nome?: string; papel?: string; ativo?: boolean; unidade_id?: string; unidade?: string }): Promise<void> {
    const { error } = await supabase
      .from('usuarios')
      .update(payload)
      .eq('id', id);

    if (error) throw new Error(error.message);
  },

  async transferirUsuarioDeUnidade(usuarioId: string, novaUnidadeId: string, novoNomeUnidade: string): Promise<void> {
    const { error } = await supabase
      .from('usuarios')
      .update({ 
        unidade_id: novaUnidadeId,
        unidade: novoNomeUnidade // Atualiza o cache de texto da unidade
      })
      .eq('id', usuarioId);

    if (error) throw new Error(error.message);
  },

  async exonerarUsuario(id: string): Promise<void> {
    const { error } = await supabase
      .from('usuarios')
      .update({ ativo: false })
      .eq('id', id);

    if (error) throw new Error(error.message);
  },

  async excluirUsuario(id: string): Promise<void> {
    const { error } = await supabase
      .from('usuarios')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  },

  async resetarSenhaGestor(email: string): Promise<void> {
    // Tenta invocar a Edge Function se existir, caso contrário emite stub
    try {
      const { data, error } = await supabase.functions.invoke('resetar_senha_gestor', {
        body: { email },
      });
      if (error) {
        // Fallback: usar o método nativo de reset do Supabase
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email);
        if (resetError) throw resetError;
      }
    } catch (err) {
      // Se a function não existir (404), usamos o auth padrão
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email);
      if (resetError) throw resetError;
    }
  }
};
