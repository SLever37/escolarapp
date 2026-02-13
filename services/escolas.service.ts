import { supabase } from '../supabaseClient';
import { UnidadeEscolar } from '../tipos';

export const escolasService = {
  async fetchUnidades(): Promise<UnidadeEscolar[]> {
    const { data, error } = await supabase
      .from('unidades_escolares')
      .select('*')
      .eq('ativa', true)
      .order('nome', { ascending: true });

    if (error) throw new Error(error.message);
    
    return (data || []).map(u => ({
      ...u,
      status: u.ativa ? 'ativo' : 'arquivado',
      gestor_nome: u.gestor_nome || 'Pendente'
    })) as UnidadeEscolar[];
  },

  async handleAddUnidade(payload: { nome: string; gestor_nome: string; codigo_inep?: string }): Promise<UnidadeEscolar> {
    const { data, error } = await supabase
      .from('unidades_escolares')
      .insert([{
        nome: payload.nome.trim(),
        gestor_nome: payload.gestor_nome.trim(),
        ativa: true,
        codigo_inep: payload.codigo_inep?.trim() || null,
        versao_core: '3.1.0',
        alunos_count: 0
      }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as UnidadeEscolar;
  },

  async arquivarUnidade(id: string): Promise<void> {
    const { error } = await supabase
      .from('unidades_escolares')
      .update({ ativa: false })
      .eq('id', id);

    if (error) throw new Error(error.message);
  },

  async excluirUnidade(id: string): Promise<void> {
    const { error } = await supabase
      .from('unidades_escolares')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  }
};