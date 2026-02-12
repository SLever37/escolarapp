
import { supabase } from '../supabaseClient';
import { UnidadeEscolar } from '../tipos';

export const escolasService = {
  async listarEscolasAtivas(): Promise<UnidadeEscolar[]> {
    const { data, error } = await supabase
      .from('unidades_escolares')
      .select('*')
      .eq('ativa', true)
      .order('nome');

    if (error) throw new Error(error.message);
    
    // Mapeia o campo 'ativa' do banco para o campo 'status' do tipo UnidadeEscolar
    return (data || []).map(u => ({
      ...u,
      status: u.ativa ? 'ativo' : 'arquivado',
      gestor_nome: u.gestor_nome || 'Pendente'
    })) as UnidadeEscolar[];
  },

  async criarEscola(payload: { nome: string; gestor_nome: string; codigo_inep?: string }): Promise<UnidadeEscolar> {
    const { data, error } = await supabase
      .from('unidades_escolares')
      .insert([{
        nome: payload.nome,
        gestor_nome: payload.gestor_nome,
        ativa: true,
        codigo_inep: payload.codigo_inep || null,
        versao_core: '3.1.0',
        alunos_count: 0
      }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as UnidadeEscolar;
  },

  async arquivarEscola(id: string): Promise<void> {
    const { error } = await supabase
      .from('unidades_escolares')
      .update({ ativa: false })
      .eq('id', id);

    if (error) throw new Error(error.message);
  },

  async excluirEscola(id: string): Promise<void> {
    const { error } = await supabase
      .from('unidades_escolares')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  }
};
