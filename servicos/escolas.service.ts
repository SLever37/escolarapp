import { supabase } from '../supabaseClient';
import { UnidadeEscolar } from '../tipos';

export const escolasService = {
  /**
   * Busca todas as unidades ativas, incluindo a contagem de usuários vinculados.
   */
  async fetchUnidades(): Promise<UnidadeEscolar[]> {
    const { data, error } = await supabase
      .from('unidades_escolares')
      .select(`
        *,
        usuarios(count)
      `)
      .neq('status', 'arquivado')
      .order('nome', { ascending: true });

    if (error) throw new Error(error.message);
    
    return (data || []).map(u => ({
      ...u,
      alunos_count: u.usuarios?.[0]?.count || 0 
    })) as UnidadeEscolar[];
  },

  /**
   * Provisiona uma nova escola e seu respectivo gestor via Edge Function.
   */
  async provisionar(payload: { 
    nomeEscola: string, 
    nomeGestor: string, 
    emailGestor: string, 
    senhaGestor: string, 
    codigoInep?: string 
  }): Promise<{ schoolId: string }> {
    const { data, error } = await supabase.functions.invoke('provisionar_escola_gestor', {
      body: payload
    });

    if (error) {
      // Tenta extrair mensagem detalhada da Edge Function se disponível
      const errorMsg = error.message || 'Falha no provisionamento do cluster.';
      throw new Error(errorMsg);
    }

    return data;
  },

  /**
   * Atualiza o status de uma unidade (ex: arquivar).
   */
  async atualizarStatus(id: string, status: 'ativo' | 'arquivado' | 'suspenso'): Promise<void> {
    const { error } = await supabase
      .from('unidades_escolares')
      .update({ status })
      .eq('id', id);
    
    if (error) throw error;
  },

  /**
   * Remove permanentemente a unidade do banco de dados.
   */
  async excluirDefinitivo(id: string): Promise<void> {
    const { error } = await supabase
      .from('unidades_escolares')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
  },

  async fetchUnidadeById(id: string): Promise<UnidadeEscolar | null> {
    const { data, error } = await supabase
      .from('unidades_escolares')
      .select('*, usuarios(*)')
      .eq('id', id)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  }
};