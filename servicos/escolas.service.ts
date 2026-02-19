
// src/servicos/escolas.service.ts
import { supabase } from '../supabaseClient';
import type { UnidadeEscolar } from '../tipos';

type CriarEscolaPayload = {
  nomeEscola: string;
  codigoInep?: string;
};

type ProvisionarPayload = {
  nomeEscola: string;
  nomeGestor?: string;
  emailGestor?: string;
  senhaGestor?: string;
  codigoInep?: string;
};

function msgErro(error: any): string {
  return (
    error?.message ||
    error?.error_description ||
    error?.details ||
    JSON.stringify(error) ||
    'Erro desconhecido'
  );
}

export const escolasService = {
  async fetchUnidades(): Promise<UnidadeEscolar[]> {
    const { data, error } = await supabase
      .from('unidades_escolares')
      .select('*')
      .neq('status', 'arquivado')
      .order('nome', { ascending: true });

    if (error) throw new Error(error.message);
    return (data || []) as UnidadeEscolar[];
  },

  // ✅ ESSENCIAL: usado ao abrir /escola/:id
  async fetchUnidadeById(id: string): Promise<UnidadeEscolar | null> {
    const { data, error } = await supabase
      .from('unidades_escolares')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return (data || null) as UnidadeEscolar | null;
  },

  // ✅ MASTER (web/mobile): cria APENAS a escola (sem Edge Function)
  async criarEscola(payload: CriarEscolaPayload): Promise<{ id: string }> {
    const nome = (payload.nomeEscola || '').trim();
    const codigoInep = (payload.codigoInep || '').trim();

    if (!nome) throw new Error('Informe o nome da escola.');

    // opcional: valida INEP (se preencher)
    if (codigoInep && !/^\d{8}$/.test(codigoInep)) {
      throw new Error('Código INEP inválido. Use 8 dígitos.');
    }

    const { data, error } = await supabase
      .from('unidades_escolares')
      .insert([
        {
          nome,
          codigo_inep: codigoInep || null,
          status: 'ativo',
        },
      ])
      .select('id')
      .single();

    if (error) throw new Error(error.message);
    return { id: data.id as string };
  },

  /**
   * Atualiza os dados de uma unidade escolar existente.
   */
  async atualizarEscola(id: string, payload: CriarEscolaPayload): Promise<void> {
    const nome = (payload.nomeEscola || '').trim();
    const codigoInep = (payload.codigoInep || '').trim();

    if (!nome) throw new Error('Informe o nome da escola.');

    const { error } = await supabase
      .from('unidades_escolares')
      .update({
        nome,
        codigo_inep: codigoInep || null,
      })
      .eq('id', id);

    if (error) throw new Error(error.message);
  },

  // (Opcional) buscar por INEP (para tela de cadastro do gestor por código)
  async fetchUnidadeByInep(codigoInep: string): Promise<UnidadeEscolar | null> {
    const { data, error } = await supabase
      .from('unidades_escolares')
      .select('*')
      .eq('codigo_inep', codigoInep)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return (data || null) as UnidadeEscolar | null;
  },

  // ⚠️ Mantido para uso futuro (server-side). NÃO usar no Master no AI Studio.
  async provisionar(payload: ProvisionarPayload): Promise<any> {
    const { data, error } = await supabase.functions.invoke('provisionar_escola_gestor', {
      body: {
        nomeEscola: payload.nomeEscola?.trim(),
        nomeGestor: payload.nomeGestor?.trim(),
        emailGestor: payload.emailGestor?.trim(),
        senhaGestor: payload.senhaGestor,
        codigoInep: payload.codigoInep?.trim() || undefined,
      },
    });

    if (error) throw new Error(msgErro(error));
    if (!data?.ok && data?.ok !== undefined) throw new Error(data?.error || 'Provisionamento falhou.');
    return data;
  },

  async atualizarStatus(id: string, status: 'ativo' | 'arquivado'): Promise<void> {
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
};
