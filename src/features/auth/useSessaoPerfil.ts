import { useCallback, useEffect, useMemo, useState } from 'react';
import { PapelUsuario, Usuario } from '../../../tipos';
import {
  buscarDelegacoesPorUsuarioId,
  buscarPerfilPorAuthUserId,
  entrarComSenhaSupabase,
  limparSessao,
  obterSessaoSalva,
  SessaoSupabase,
  supabaseConfigurado,
} from '../../lib/supabase';

const STORAGE_DEV_PERFIL = 'escolarapp.dev.perfil';

const mockUsuarioPorPerfil = (papel: PapelUsuario): Usuario => ({
  id: `dev-${papel}`,
  nome: `Modo DEV (${papel.replace('_', ' ')})`,
  cpf: '000.000.000-00',
  papel,
  unidade: 'Unidade DEV',
  delegacoes: [],
});

const inferirPerfilPorEmail = (email: string): PapelUsuario => {
  const e = email.trim().toLowerCase();
  if (e === 'socrates.lever@gmail.com' || e.startsWith('master')) return 'admin_plataforma';
  if (e.startsWith('gestor')) return 'gestor';
  if (e.startsWith('ped')) return 'pedagogia';
  if (e.startsWith('sec')) return 'secretaria';
  if (e.startsWith('familia') || e.startsWith('cpf')) return 'familia';
  if (e.startsWith('vigia') || e.startsWith('port')) return 'portaria';
  return 'professor';
};

export const useSessaoPerfil = () => {
  const [carregando, setCarregando] = useState(true);
  const [usuarioAtual, setUsuarioAtual] = useState<Usuario | null>(null);
  const [sessaoAtual, setSessaoAtual] = useState<SessaoSupabase | null>(null);

  const aplicarPerfilDevSalvo = useCallback(() => {
    if (!import.meta.env.DEV) return false;
    const perfil = localStorage.getItem(STORAGE_DEV_PERFIL) as PapelUsuario | null;
    if (!perfil) return false;
    setUsuarioAtual(mockUsuarioPorPerfil(perfil));
    return true;
  }, []);

  const carregarPerfilDaSessao = useCallback(async (sessao: SessaoSupabase) => {
    const perfil = await buscarPerfilPorAuthUserId(sessao.user.id, sessao.access_token);
    if (!perfil) {
      throw new Error('Perfil não encontrado em public.usuarios para este usuário autenticado.');
    }

    const delegacoes = await buscarDelegacoesPorUsuarioId(perfil.id, sessao.access_token);

    setUsuarioAtual({
      id: perfil.id,
      nome: perfil.nome,
      cpf: perfil.cpf || '---',
      papel: perfil.papel,
      unidade: perfil.unidade_id || 'Unidade sem vínculo',
      delegacoes,
    });
  }, []);

  useEffect(() => {
    const iniciar = async () => {
      try {
        if (aplicarPerfilDevSalvo()) return;
        const sessao = obterSessaoSalva();
        if (!sessao) return;
        setSessaoAtual(sessao);
        await carregarPerfilDaSessao(sessao);
      } finally {
        setCarregando(false);
      }
    };
    iniciar();
  }, [aplicarPerfilDevSalvo, carregarPerfilDaSessao]);

  const entrar = useCallback(async (email: string, senha: string) => {
    if (!supabaseConfigurado && import.meta.env.DEV) {
      const papel = inferirPerfilPorEmail(email);
      localStorage.setItem(STORAGE_DEV_PERFIL, papel);
      setUsuarioAtual(mockUsuarioPorPerfil(papel));
      return;
    }

    const sessao = await entrarComSenhaSupabase(email, senha);
    setSessaoAtual(sessao);
    await carregarPerfilDaSessao(sessao);
  }, [carregarPerfilDaSessao]);

  const sair = useCallback(() => {
    limparSessao();
    localStorage.removeItem(STORAGE_DEV_PERFIL);
    setSessaoAtual(null);
    setUsuarioAtual(null);
  }, []);

  const trocarPerfilDev = useCallback((papel: PapelUsuario) => {
    if (!import.meta.env.DEV) return;
    localStorage.setItem(STORAGE_DEV_PERFIL, papel);
    setUsuarioAtual(mockUsuarioPorPerfil(papel));
  }, []);

  return useMemo(() => ({
    carregando,
    sessaoAtiva: Boolean(usuarioAtual),
    usuarioAtual,
    supabaseConfigurado,
    sessaoAtual,
    entrar,
    sair,
    trocarPerfilDev,
  }), [carregando, usuarioAtual, sessaoAtual, entrar, sair, trocarPerfilDev]);
};
