
import { useState, useEffect, useCallback } from 'react';
import { usuariosService, UsuarioComUnidade } from '../servicos/usuarios.service';

export const useGestoresMaster = () => {
  const [gestores, setGestores] = useState<UsuarioComUnidade[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [busca, setBusca] = useState('');

  const carregarGestores = useCallback(async () => {
    try {
      setLoading(true);
      setErro(null);
      const data = await usuariosService.fetchGestoresGlobal();
      setGestores(data);
    } catch (err: any) {
      const msg = err.message || 'Erro ao carregar gestores';
      setErro(msg);
      if (msg.includes('Failed to fetch')) {
        alert('Erro de Conexão: O servidor Supabase está inacessível. Isso geralmente acontece se o projeto estiver pausado ou se houver um bloqueio de rede.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarGestores();
  }, [carregarGestores]);

  const transferirGestor = async (usuarioId: string, novaUnidadeId: string, nomeUnidade: string) => {
    try {
      await usuariosService.transferirUsuarioDeUnidade(usuarioId, novaUnidadeId, nomeUnidade);
      await carregarGestores();
    } catch (err: any) {
      throw new Error(err.message || 'Erro ao transferir gestor');
    }
  };

  const exonerarGestor = async (usuarioId: string) => {
    try {
      await usuariosService.exonerarUsuario(usuarioId);
      await carregarGestores();
    } catch (err: any) {
      throw new Error(err.message || 'Erro ao exonerar gestor');
    }
  };

  const excluirGestor = async (usuarioId: string) => {
    try {
      await usuariosService.excluirUsuario(usuarioId);
      await carregarGestores();
    } catch (err: any) {
      throw new Error(err.message || 'Erro ao excluir gestor');
    }
  };

  const resetarSenha = async (email: string) => {
    try {
      await usuariosService.resetarSenhaGestor(email);
    } catch (err: any) {
      throw new Error(err.message || 'Erro ao resetar senha');
    }
  };

  const gestoresFiltrados = gestores.filter(g => 
    g.nome.toLowerCase().includes(busca.toLowerCase()) || 
    g.email.toLowerCase().includes(busca.toLowerCase()) ||
    (g.unidade_ref?.nome || '').toLowerCase().includes(busca.toLowerCase())
  );

  return {
    gestores: gestoresFiltrados,
    loading,
    erro,
    busca,
    setBusca,
    carregarGestores,
    transferirGestor,
    exonerarGestor,
    excluirGestor,
    resetarSenha
  };
};
