
import { supabase } from '../supabaseClient';

export const gestoresService = {
  /**
   * Cria o registro institucional do gestor na tabela usuarios.
   * TODO: Implementar Edge Function com service_role para provisionar 
   * o Supabase Auth (e-mail/senha) e obter o auth_user_id real.
   */
  async criarGestorVinculado(payload: {
    nome: string;
    email: string;
    unidade_id: string;
    unidade_nome: string;
  }): Promise<void> {
    const { error } = await supabase
      .from('usuarios')
      .insert([{
        nome: payload.nome,
        email: payload.email,
        papel: 'gestor',
        nivel: 5,
        unidade_id: payload.unidade_id,
        unidade: payload.unidade_nome,
        ativo: true,
        cpf: '',
        delegacoes: []
      }]);

    if (error) throw new Error(error.message);
  }
};
