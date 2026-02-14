
import { supabase } from '../supabaseClient';

export const usuariosService = {
  async atualizarUsuario(id: string, payload: { nome?: string; papel?: string; ativo?: boolean }): Promise<void> {
    const { error } = await supabase
      .from('usuarios')
      .update(payload)
      .eq('id', id);

    if (error) throw new Error(error.message);
  },

  async excluirUsuario(id: string): Promise<void> {
    const { error } = await supabase
      .from('usuarios')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  }
};
