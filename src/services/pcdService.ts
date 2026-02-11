import { Usuario } from '../../tipos';
import { buscarPerfilPorAuthUserId, obterSessaoSalva, supabaseConfigurado } from '../lib/supabase';

export interface DadosPCD {
  pcd: boolean;
  tipos: string[];
  laudo: string;
  adaptacoes: string[];
}

const baseUrl = () => (import.meta.env.VITE_SUPABASE_URL || '').trim();

const headersAuth = (token: string) => ({
  apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
});

const contexto = async () => {
  const sessao = obterSessaoSalva();
  if (!sessao) return null;
  const perfil = await buscarPerfilPorAuthUserId(sessao.user.id, sessao.access_token);
  if (!perfil) return null;
  return { token: sessao.access_token, perfil };
};

export const podeVisualizarPCD = async (usuario: Usuario): Promise<boolean> => {
  if (usuario.papel === 'gestor' || usuario.papel === 'pedagogia') return true;
  if (usuario.papel !== 'secretaria') return false;
  if (!supabaseConfigurado) return usuario.delegacoes.some((d) => d.moduloId === 'pcd' && d.acoes.includes('ver'));

  try {
    const ctx = await contexto();
    if (!ctx) return false;

    const resp = await fetch(`${baseUrl()}/rest/v1/permissoes_pcd?select=pode_ver_pcd&usuario_id=eq.${ctx.perfil.id}&limit=1`, {
      headers: headersAuth(ctx.token),
    });
    if (!resp.ok) return false;
    const data = await resp.json() as Array<{ pode_ver_pcd: boolean }>;
    return Boolean(data[0]?.pode_ver_pcd);
  } catch {
    return false;
  }
};

export const registrarLogPCD = async (acao: 'VER_PCD' | 'EDITAR_PCD', metadata: Record<string, unknown>) => {
  if (!supabaseConfigurado) return;
  try {
    const ctx = await contexto();
    if (!ctx) return;
    await fetch(`${baseUrl()}/rest/v1/logs_auditoria`, {
      method: 'POST',
      headers: {
        ...headersAuth(ctx.token),
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        usuario_id: ctx.perfil.id,
        acao,
        modulo_id: 'pedagogia_central',
        contexto: 'Dados PCD do aluno',
        metadata,
      }),
    });
  } catch {
    // sem quebra de fluxo visual
  }
};

export const carregarDadosPCD = async (alunoId: string): Promise<DadosPCD | null> => {
  if (!supabaseConfigurado) return null;
  try {
    const ctx = await contexto();
    if (!ctx) return null;
    const resp = await fetch(`${baseUrl()}/rest/v1/alunos_pcd?select=pcd,tipos,laudo,adaptacoes&aluno_id=eq.${alunoId}&limit=1`, {
      headers: headersAuth(ctx.token),
    });
    if (!resp.ok) return null;
    const data = await resp.json() as Array<DadosPCD>;
    return data[0] || null;
  } catch {
    return null;
  }
};

export const salvarDadosPCD = async (alunoId: string, dados: DadosPCD): Promise<boolean> => {
  if (!supabaseConfigurado) return false;
  try {
    const ctx = await contexto();
    if (!ctx) return false;
    const resp = await fetch(`${baseUrl()}/rest/v1/alunos_pcd?aluno_id=eq.${alunoId}`, {
      method: 'PATCH',
      headers: {
        ...headersAuth(ctx.token),
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(dados),
    });
    return resp.ok;
  } catch {
    return false;
  }
};
