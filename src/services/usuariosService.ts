import { AcaoPermissao, Delegacao, NomeModulo, PapelUsuario } from '../../tipos';
import { PRESETS_DELEGACAO, PresetDelegacao } from '../utils/delegacoes';
import { buscarPerfilPorAuthUserId, obterSessaoSalva, supabaseConfigurado } from '../lib/supabase';

export interface UsuarioInterno {
  id: string;
  nome: string;
  papel: PapelUsuario;
  nivel: number;
  unidade_id: string | null;
  delegacoes: Delegacao[];
}

export const MODULOS_DELEGAVEIS: NomeModulo[] = ['estoque_cozinha', 'patrimonio', 'biblioteca', 'estoque_geral', 'portaria_acesso'];
export const ACOES_DELEGAVEIS: AcaoPermissao[] = ['ver', 'criar', 'editar', 'excluir', 'imprimir', 'exportar'];

const usuariosMock: UsuarioInterno[] = [
  { id: '1', nome: 'Sra. Maria Auxiliadora', papel: 'servicos_gerais', nivel: 6, unidade_id: 'dev', delegacoes: [{ moduloId: 'estoque_cozinha', acoes: ['ver', 'criar', 'editar'] }] },
  { id: '2', nome: 'Sr. Cláudio Rocha', papel: 'portaria', nivel: 6, unidade_id: 'dev', delegacoes: [{ moduloId: 'portaria_acesso', acoes: ['ver', 'criar', 'editar'] }, { moduloId: 'patrimonio', acoes: ['ver', 'editar'] }] },
  { id: '3', nome: 'Joana Prado', papel: 'secretaria', nivel: 3, unidade_id: 'dev', delegacoes: [] },
];

const nivelPorPapel: Record<PapelUsuario, number> = {
  admin_plataforma: 0,
  gestor: 1,
  pedagogia: 2,
  secretaria: 3,
  professor: 4,
  familia: 5,
  portaria: 6,
  servicos_gerais: 6,
};

const headersAuth = (token: string) => ({
  apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
});

const contextoAutenticado = async () => {
  const sessao = obterSessaoSalva();
  if (!sessao) return null;
  const perfil = await buscarPerfilPorAuthUserId(sessao.user.id, sessao.access_token);
  if (!perfil) return null;
  return { token: sessao.access_token, perfil };
};

const mapearDelegacoes = (linhas: Array<{ modulo_id: string; acoes: AcaoPermissao[]; data_inicio: string | null; data_fim: string | null }>): Delegacao[] =>
  linhas.map((d) => ({ moduloId: d.modulo_id as NomeModulo, acoes: d.acoes, dataInicio: d.data_inicio || undefined, dataFim: d.data_fim || undefined }));

export const listarUsuariosInternos = async (): Promise<{ usuarios: UsuarioInterno[]; conectadoAoBanco: boolean }> => {
  if (!supabaseConfigurado) return { usuarios: usuariosMock, conectadoAoBanco: false };

  try {
    const contexto = await contextoAutenticado();
    if (!contexto?.perfil.unidade_id) return { usuarios: usuariosMock, conectadoAoBanco: false };

    const baseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
    const usuariosResp = await fetch(`${baseUrl}/rest/v1/usuarios?select=id,nome,papel,nivel,unidade_id&unidade_id=eq.${contexto.perfil.unidade_id}`, {
      headers: headersAuth(contexto.token),
    });
    if (!usuariosResp.ok) throw new Error(await usuariosResp.text());
    const usuarios = await usuariosResp.json() as Array<{ id: string; nome: string; papel: PapelUsuario; nivel: number; unidade_id: string | null }>;

    const delegResp = await fetch(`${baseUrl}/rest/v1/delegacoes?select=usuario_id,modulo_id,acoes,data_inicio,data_fim`, {
      headers: headersAuth(contexto.token),
    });
    if (!delegResp.ok) throw new Error(await delegResp.text());
    const delegacoes = await delegResp.json() as Array<{ usuario_id: string; modulo_id: string; acoes: AcaoPermissao[]; data_inicio: string | null; data_fim: string | null }>;

    return {
      conectadoAoBanco: true,
      usuarios: usuarios.map((u) => ({
        ...u,
        delegacoes: mapearDelegacoes(delegacoes.filter((d) => d.usuario_id === u.id)),
      })),
    };
  } catch {
    return { usuarios: usuariosMock, conectadoAoBanco: false };
  }
};

export const criarUsuarioInterno = async (
  nome: string,
  papel: PapelUsuario,
): Promise<{ sucesso: boolean; mensagem: string }> => {
  if (!nome.trim()) return { sucesso: false, mensagem: 'Informe o nome do usuário.' };
  if (!supabaseConfigurado) return { sucesso: true, mensagem: 'Usuário criado em modo local (sem conexão com banco).' };

  try {
    const contexto = await contextoAutenticado();
    if (!contexto?.perfil.unidade_id) return { sucesso: false, mensagem: 'Não foi possível identificar a unidade do gestor.' };

    const baseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
    const emailMock = `${nome.toLowerCase().replace(/\s+/g, '.')}@escolarapp.local`;

    const resposta = await fetch(`${baseUrl}/rest/v1/usuarios`, {
      method: 'POST',
      headers: {
        ...headersAuth(contexto.token),
        Prefer: 'return=representation',
      },
      body: JSON.stringify({
        nome,
        email: emailMock,
        papel,
        nivel: nivelPorPapel[papel],
        unidade_id: contexto.perfil.unidade_id,
        ativo: true,
      }),
    });

    if (!resposta.ok) throw new Error(await resposta.text());
    return { sucesso: true, mensagem: 'Usuário criado com sucesso no banco.' };
  } catch (erro) {
    return { sucesso: false, mensagem: `Falha ao criar usuário: ${String(erro)}` };
  }
};

export const aplicarPresetDelegacao = (preset: PresetDelegacao): Delegacao[] => PRESETS_DELEGACAO[preset].delegacoes;

export const salvarDelegacoesUsuario = async (
  usuarioAlvoId: string,
  novasDelegacoes: Delegacao[],
): Promise<{ sucesso: boolean; mensagem: string }> => {
  if (!supabaseConfigurado) return { sucesso: true, mensagem: 'Delegações salvas em modo local.' };

  try {
    const contexto = await contextoAutenticado();
    if (!contexto) return { sucesso: false, mensagem: 'Sessão inválida para delegação.' };

    const baseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();

    const atualResp = await fetch(`${baseUrl}/rest/v1/delegacoes?select=modulo_id,acoes,data_inicio,data_fim&usuario_id=eq.${usuarioAlvoId}`, {
      headers: headersAuth(contexto.token),
    });
    if (!atualResp.ok) throw new Error(await atualResp.text());
    const antes = await atualResp.json();

    const delResp = await fetch(`${baseUrl}/rest/v1/delegacoes?usuario_id=eq.${usuarioAlvoId}`, {
      method: 'DELETE',
      headers: headersAuth(contexto.token),
    });
    if (!delResp.ok) throw new Error(await delResp.text());

    const paraInserir = novasDelegacoes
      .filter((d) => d.acoes.length > 0)
      .map((d) => ({ usuario_id: usuarioAlvoId, modulo_id: d.moduloId, acoes: d.acoes, data_inicio: d.dataInicio || null, data_fim: d.dataFim || null }));

    if (paraInserir.length > 0) {
      const insResp = await fetch(`${baseUrl}/rest/v1/delegacoes`, {
        method: 'POST',
        headers: {
          ...headersAuth(contexto.token),
          Prefer: 'return=minimal',
        },
        body: JSON.stringify(paraInserir),
      });
      if (!insResp.ok) throw new Error(await insResp.text());
    }

    for (const delegacao of novasDelegacoes) {
      await fetch(`${baseUrl}/rest/v1/logs_auditoria`, {
        method: 'POST',
        headers: {
          ...headersAuth(contexto.token),
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({
          usuario_id: contexto.perfil.id,
          acao: 'DELEGAR_PERMISSOES',
          modulo_id: delegacao.moduloId,
          contexto: 'Gestão de Acessos',
          metadata: {
            usuario_alvo_id: usuarioAlvoId,
            antes,
            depois: novasDelegacoes,
          },
        }),
      });
    }

    return { sucesso: true, mensagem: 'Delegações salvas com sucesso.' };
  } catch (erro) {
    return { sucesso: false, mensagem: `Falha ao salvar delegações: ${String(erro)}` };
  }
};
