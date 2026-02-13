import { supabase } from '../supabaseClient';
import { UnidadeEscolar } from '../tipos';

type ProvisionarPayload = {
  nomeEscola: string;
  nomeGestor: string;
  emailGestor: string;
  senhaGestor: string;
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

  async provisionar(payload: ProvisionarPayload): Promise<{ escola_id: string; gestor_auth_user_id: string }> {
    try {
      const { data, error } = await supabase.functions.invoke(
        'provisionar_escola_gestor',
        {
          body: {
            nomeEscola: payload.nomeEscola?.trim(),
            nomeGestor: payload.nomeGestor?.trim(),
            emailGestor: payload.emailGestor?.trim(),
            senhaGestor: payload.senhaGestor,
            codigoInep: payload.codigoInep?.trim() || undefined,
          },
        }
      );

      if (error) throw new Error(msgErro(error));
      if (!data?.ok) throw new Error(data?.error || 'Provisionamento falhou.');

      return {
        escola_id: data.escola_id,
        gestor_auth_user_id: data.gestor_auth_user_id,
      };
    } catch (err: any) {
      throw err;
    }
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

    if (error) {
      if (error.code === '23503') {
        throw new Error('Esta unidade possui vínculos ativos e não pode ser excluída. Use "Arquivar".');
      }
      throw new Error(error.message);
    }
  },

  async arquivarUnidade(id: string) { return this.atualizarStatus(id, 'arquivado'); },
  async excluirUnidade(id: string) { return this.excluirDefinitivo(id); },
};