import { supabase } from './supabaseClient';
import { Usuario } from '../tipos';

export type AcaoPermissao = 'ver' | 'criar' | 'editar' | 'excluir' | 'imprimir' | 'exportar';

const niveis: Record<string, number> = {
  admin_plataforma: 0,
  gestor: 1,
  supervisao: 2,
  secretaria: 3,
  professor: 4,
  familia: 5,
  portaria: 6
};

export const nivelDoPapel = (papel: string) => niveis[papel] ?? 99;

export const podeAcessar = async (usuario: Usuario | null, modulo: string, acao: AcaoPermissao): Promise<boolean> => {
  if (!usuario) return false;
  // Master sempre pode (nível 0)
  if (usuario.papel === 'admin_plataforma') return true;

  // Gestor tem visão completa (nivel 1)
  if (usuario.papel === 'gestor') return true;

  // Verifica delegações explícitas
  try {
    const { data, error } = await supabase
      .from('delegacoes')
      .select('*')
      .eq('profile_id', usuario.id)
      .eq('modulo', modulo);

    if (error) {
      console.error('Erro ao consultar delegações:', error.message);
    } else if (data && data.length) {
      const agora = new Date();
      for (const d of data) {
        const acoes: string[] = d.acoes || [];
        if (acoes.includes(acao)) {
          if (d.data_inicio && new Date(d.data_inicio) > agora) continue;
          if (d.data_fim && new Date(d.data_fim) < agora) continue;
          return true;
        }
      }
    }
  } catch (e) {
    console.error('podeAcessar error', e);
  }

  // Verificações por papel base (fallback)
  const permissoesBase: Record<string, string[]> = {
    supervisao: ['pedagogia_central', 'grade_horarios', 'diario_classe'],
    secretaria: ['secretaria_legal', 'portal_familia'],
    professor: ['diario_classe'],
    familia: ['portal_familia'],
    portaria: ['portaria_acesso']
  };

  if (permissoesBase[usuario.papel]?.includes(modulo)) return true;

  return false;
};

export const listarDelegacoes = async (profileId: string) => {
  const { data, error } = await supabase.from('delegacoes').select('*').eq('profile_id', profileId);
  if (error) throw error;
  return data;
};

export const criarDelegacao = async (deleg: { profile_id: string; modulo: string; acoes: string[]; data_inicio?: string; data_fim?: string; criado_por?: string; }) => {
  const { data, error } = await supabase.from('delegacoes').insert(deleg).select().single();
  if (error) throw error;
  await supabase.from('delegacoes_log').insert({ delegacao_id: data.id, acao: 'create', detalhes: deleg, autor: deleg.criado_por });
  return data;
};
