// Added missing React import to fix namespace error
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

  const [novaUnidade, setNovaUnidade] = useState({
    nome: '',
    codigoInep: '',
    gestorNome: '',
    gestorEmail: '',
    gestorSenha: ''
  });

  const carregarEscolas = useCallback(async () => {
    try {
      setLoading(true);
      const data = await escolasService.fetchUnidades();
      setUnidades(data);
    } catch (err: any) {
      console.error('Falha ao sincronizar rede:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarEscolas();
  }, [carregarEscolas]);

  const abrirModal = () => setModalAberto(true);
  const fecharModal = () => {
    setModalAberto(false);
    setNovaUnidade({ nome: '', codigoInep: '', gestorNome: '', gestorEmail: '', gestorSenha: '' });
  };

  const atualizarNovaUnidade = (campo: string, valor: string) => {
    setNovaUnidade(prev => ({ ...prev, [campo]: valor }));
  };

  const arquivarEscola = async (id: string) => {
    setProcessandoAcao(id);
    try {
      await escolasService.atualizarStatus(id, 'arquivado');
      await carregarEscolas();
    } catch (err: any) {
      alert(`Falha ao arquivar: ${err.message}`);
    } finally {
      setProcessandoAcao(null);
    }
  };

  const excluirEscola = async (id: string) => {
    setProcessandoAcao(id);
    try {
      await escolasService.excluirDefinitivo(id);
      await carregarEscolas();
    } catch (err: any) {
      alert(`Falha na exclusão: ${err.message}`);
    } finally {
      setProcessandoAcao(null);
    }
  };

  const handleSalvarEscola = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (salvando || !novaUnidade.nome || !novaUnidade.gestorEmail) return;
    
    setSalvando(true);
    try {
      // Chama a Edge Function para criação atômica de Escola + Gestor
      await escolasService.provisionar({
        nomeEscola: novaUnidade.nome,
        nomeGestor: novaUnidade.gestorNome,
        emailGestor: novaUnidade.gestorEmail,
        senhaGestor: novaUnidade.gestorSenha,
        codigoInep: novaUnidade.codigoInep || undefined
      });

      await carregarEscolas();
      fecharModal();
    } catch (err: any) {
      alert(`Erro no provisionamento: ${err.message}`);
    } finally {
      setSalvando(true); // O componente ModalNovaEscola espera fechar ou resetar. Aqui setamos false após o processo.
      setSalvando(false);
    }
  };

  return {
    unidades,
    loading,
    salvando,
    modalAberto,
    busca,
    novaUnidade,
    processandoAcao,
    setBusca,
    abrirModal,
    fecharModal,
    setModalAberto,
    setNovaUnidade,
    atualizarNovaUnidade,
    arquivarEscola,
    excluirEscola,
    handleSalvarEscola,
    carregarEscolas
  };
};