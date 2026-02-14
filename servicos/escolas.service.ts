
import { supabase } from '../supabaseClient';
import { UnidadeEscolar } from '../tipos';

type CriarEscolaPayload = {
  nome: string;
  codigo_inep: string | null;
};

export const escolasService = {
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
      alunos_count: (u as any).usuarios?.[0]?.count || 0 
    })) as UnidadeEscolar[];
  },

  async provisionar(payload: { 
    nomeEscola: string, 
    nomeGestor: string, 
    emailGestor: string, 
    senhaGestor: string, 
    codigoInep?: string 
  }) {
    console.log("INICIANDO PROVISIONAMENTO:", payload);

    const { data, error } = await supabase.functions.invoke(
      'provisionar_escola_gestor',
      { body: payload }
    );

    console.log("RESPOSTA EDGE:", { data, error });

    if (error) {
      throw new Error(error.message || "Erro ao chamar Edge Function");
    }

    if (!data) {
      throw new Error("Edge Function não retornou dados.");
    }

    return data;
  },

  async criarEscola(payload: CriarEscolaPayload): Promise<UnidadeEscolar> {
    const { data, error } = await supabase
      .from('unidades_escolares')
      .insert([
        {
          nome: payload.nome,
          codigo_inep: payload.codigo_inep,
          status: 'ativo',
          versao_core: '3.0.1'
        },
      ])
      .select('*')
      .single();

    if (error) throw new Error(error.message);
    return data as UnidadeEscolar;
  },

  async atualizarEscola(id: string, payload: Partial<CriarEscolaPayload>): Promise<void> {
    const { error } = await supabase
      .from('unidades_escolares')
      .update(payload)
      .eq('id', id);

    if (error) throw new Error(error.message);
  },

  async atualizarStatus(
    id: string,
    status: 'ativo' | 'arquivado' | 'suspenso'
  ): Promise<void> {
    const { error } = await supabase
      .from('unidades_escolares')
      .update({ status })
      .eq('id', id);

    if (error) throw new Error(error.message);
  },

  async excluirDefinitivo(id: string): Promise<void> {
    const { error } = await supabase
      .from('unidades_escolares')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  },

  async fetchUnidadeById(id: string): Promise<UnidadeEscolar | null> {
    const { data, error } = await supabase
      .from('unidades_escolares')
      .select('*, usuarios(*)')
      .eq('id', id)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return (data || null) as UnidadeEscolar | null;
  },
};
