
// src/hooks/useEscolasMaster.ts
import React, { useState, useEffect, useCallback } from 'react';
import { UnidadeEscolar } from '../tipos';
import { escolasService } from '../servicos/escolas.service';

export const useEscolasMaster = () => {
  const [unidades, setUnidades] = useState<UnidadeEscolar[]>([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [busca, setBusca] = useState('');
  const [processandoAcao, setProcessandoAcao] = useState<string | null>(null);

  // Adicionado estado para controlar a escola que está sendo editada
  const [escolaEditando, setEscolaEditando] = useState<UnidadeEscolar | null>(null);

  // ✅ agora o modal é só escola + INEP
  const [novaUnidade, setNovaUnidade] = useState({
    nome: '',
    codigoInep: '',
    // mantém campos antigos sem usar (evita quebrar UI antiga se existir)
    gestorNome: '',
    gestorEmail: '',
    gestorSenha: '',
  });

  const carregarEscolas = useCallback(async () => {
    try {
      setLoading(true);
      const data = await escolasService.fetchUnidades();
      setUnidades(data);
    } catch (err: any) {
      console.error('Falha ao sincronizar rede:', err?.message ?? err);
      if (err?.message?.includes('Failed to fetch')) {
        alert('Erro de Conexão: Não foi possível alcançar o servidor Supabase. Verifique se o projeto não está pausado ou se há restrições de rede.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarEscolas();
  }, [carregarEscolas]);

  // Corrigido: abrirModal agora aceita uma unidade opcional para edição
  const abrirModal = (escola?: UnidadeEscolar) => {
    if (escola) {
      setEscolaEditando(escola);
      setNovaUnidade({
        nome: escola.nome,
        codigoInep: escola.codigo_inep || '',
        gestorNome: '',
        gestorEmail: '',
        gestorSenha: '',
      });
    } else {
      setEscolaEditando(null);
      setNovaUnidade({
        nome: '',
        codigoInep: '',
        gestorNome: '',
        gestorEmail: '',
        gestorSenha: '',
      });
    }
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setEscolaEditando(null);
    setNovaUnidade({
      nome: '',
      codigoInep: '',
      gestorNome: '',
      gestorEmail: '',
      gestorSenha: '',
    });
  };

  const atualizarNovaUnidade = (campo: string, valor: string) => {
    setNovaUnidade((prev) => ({ ...prev, [campo]: valor }));
  };

  // ✅ Suporta criação ou atualização dependendo do estado escolaEditando
  const handleSalvarEscola = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (salvando) return;

    const nome = (novaUnidade.nome || '').trim();
    const codigoInep = (novaUnidade.codigoInep || '').trim();

    if (!nome) {
      alert('Informe o nome da escola.');
      return;
    }

    setSalvando(true);
    try {
      if (escolaEditando) {
        // Modo Edição
        await escolasService.atualizarEscola(escolaEditando.id, {
          nomeEscola: nome,
          codigoInep: codigoInep || undefined,
        });
      } else {
        // Modo Criação
        await escolasService.criarEscola({
          nomeEscola: nome,
          codigoInep: codigoInep || undefined,
        });
      }

      fecharModal();
      await carregarEscolas();
    } catch (err: any) {
      alert(`Erro ao salvar escola: ${err?.message ?? err}`);
    } finally {
      setSalvando(false);
    }
  };

  const arquivarEscola = async (id: string) => {
    if (processandoAcao) return;
    setProcessandoAcao(id);

    try {
      await escolasService.atualizarStatus(id, 'arquivado');
      await carregarEscolas();
    } catch (err: any) {
      alert(`Falha ao arquivar: ${err?.message ?? err}`);
    } finally {
      setProcessandoAcao(null);
    }
  };

  const excluirEscola = async (id: string) => {
    if (processandoAcao) return;
    setProcessandoAcao(id);

    try {
      await escolasService.excluirDefinitivo(id);
      await carregarEscolas();
    } catch (err: any) {
      alert(`Falha na exclusão: ${err?.message ?? err}`);
    } finally {
      setProcessandoAcao(null);
    }
  };

  return {
    unidades,
    loading,
    salvando,
    modalAberto,
    escolaEditando, // Adicionado para corrigir erro de desestruturação no DashboardMaster
    busca,
    novaUnidade,
    processandoAcao,
    setBusca,
    abrirModal,
    fecharModal,
    atualizarNovaUnidade,
    handleSalvarEscola,
    arquivarEscola,
    excluirEscola,
    carregarEscolas,
  };
};
