import { AcaoPermissao, Delegacao, PapelUsuario } from '../../tipos';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

export const supabaseConfigurado = Boolean(supabaseUrl && supabaseAnonKey);

const STORAGE_SESSAO = 'escolarapp.sessao';

export interface SessaoSupabase {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user: {
    id: string;
    email?: string;
  };
}

export interface PerfilDB {
  id: string;
  nome: string;
  cpf: string | null;
  papel: PapelUsuario;
  unidade_id: string | null;
  nivel: number;
}

const headersPublicos = {
  apikey: supabaseAnonKey,
  'Content-Type': 'application/json',
};

const headersAuth = (token: string) => ({
  ...headersPublicos,
  Authorization: `Bearer ${token}`,
});

export const salvarSessao = (sessao: SessaoSupabase) => {
  localStorage.setItem(STORAGE_SESSAO, JSON.stringify(sessao));
};

export const obterSessaoSalva = (): SessaoSupabase | null => {
  const conteudo = localStorage.getItem(STORAGE_SESSAO);
  if (!conteudo) return null;
  try {
    return JSON.parse(conteudo) as SessaoSupabase;
  } catch {
    return null;
  }
};

export const limparSessao = () => localStorage.removeItem(STORAGE_SESSAO);

export const entrarComSenhaSupabase = async (email: string, senha: string): Promise<SessaoSupabase> => {
  if (!supabaseConfigurado) throw new Error('Supabase não configurado para autenticação.');

  const resposta = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: headersPublicos,
    body: JSON.stringify({ email, password: senha }),
  });

  if (!resposta.ok) {
    const erro = await resposta.text();
    throw new Error(`Falha de autenticação: ${erro}`);
  }

  const sessao = (await resposta.json()) as SessaoSupabase;
  salvarSessao(sessao);
  return sessao;
};

export const buscarPerfilPorAuthUserId = async (authUserId: string, token: string): Promise<PerfilDB | null> => {
  if (!supabaseConfigurado) return null;

  const resposta = await fetch(`${supabaseUrl}/rest/v1/usuarios?select=id,nome,cpf,papel,unidade_id,nivel&auth_user_id=eq.${authUserId}&limit=1`, {
    headers: headersAuth(token),
  });

  if (!resposta.ok) {
    const erro = await resposta.text();
    throw new Error(`Erro ao carregar perfil: ${erro}`);
  }

  const perfis = (await resposta.json()) as PerfilDB[];
  return perfis[0] || null;
};

export const buscarDelegacoesPorUsuarioId = async (usuarioId: string, token: string): Promise<Delegacao[]> => {
  if (!supabaseConfigurado) return [];

  const resposta = await fetch(`${supabaseUrl}/rest/v1/delegacoes?select=modulo_id,acoes,data_inicio,data_fim&usuario_id=eq.${usuarioId}`, {
    headers: headersAuth(token),
  });

  if (!resposta.ok) {
    const erro = await resposta.text();
    throw new Error(`Erro ao carregar delegações: ${erro}`);
  }

  const itens = (await resposta.json()) as Array<{
    modulo_id: string;
    acoes: AcaoPermissao[];
    data_inicio: string | null;
    data_fim: string | null;
  }>;

  return itens.map((item) => ({
    moduloId: item.modulo_id as Delegacao['moduloId'],
    acoes: item.acoes,
    dataInicio: item.data_inicio || undefined,
    dataFim: item.data_fim || undefined,
  }));
};
