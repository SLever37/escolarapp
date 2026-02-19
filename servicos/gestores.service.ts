import { supabase } from '../supabaseClient';

export const gestoresService = {
  async criarGestorVinculado(payload: {
    nome: string;
    email: string;
    unidade_id: string;
    unidade_nome: string;
  }): Promise<void> {
    const { error } = await supabase
      .from('usuarios')
      .insert([{
        nome: payload.nome.trim(),
        email: payload.email.trim().toLowerCase(),
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