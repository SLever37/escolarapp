import { useState, useEffect, useCallback } from 'react';
import { UnidadeEscolar } from '../tipos';
import { escolasService } from '../servicos/escolas.service';

export const useEscolasMaster = () => {
  const [unidades, setUnidades] = useState<UnidadeEscolar[]>([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [processandoAcao, setProcessandoAcao] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [busca, setBusca] = useState('');

  const [novaUnidade, setNovaUnidade] = useState({
    nome: '',
    gestorNome: '',
    gestorEmail: '',
    gestorSenha: '',
    codigoInep: '' 
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
    setNovaUnidade({ nome: '', gestorNome: '', gestorEmail: '', gestorSenha: '', codigoInep: '' });
  };

  const atualizarNovaUnidade = (campo: string, valor: string) => {
    setNovaUnidade(prev => ({ ...prev, [campo]: valor }));
  };

  const handleSalvarEscola = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (salvando) return;
    
    setSalvando(true);
    try {
      await escolasService.provisionar({
        nomeEscola: novaUnidade.nome,
        nomeGestor: novaUnidade.gestorNome,
        emailGestor: novaUnidade.gestorEmail,
        senhaGestor: novaUnidade.gestorSenha,
        codigoInep: novaUnidade.codigoInep
      });
      
      await carregarEscolas();
      fecharModal();
    } catch (err: any) {
      alert(`Falha no provisionamento: ${err.message || 'Erro desconhecido'}`);
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
      alert('Erro ao arquivar: ' + err.message);
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
      alert(err.message);
    } finally {
      setProcessandoAcao(null);
    }
  };

  return {
    unidades,
    loading,
    salvando,
    processandoAcao,
    modalAberto,
    busca,
    novaUnidade,
    setBusca,
    abrirModal,
    fecharModal,
    carregarEscolas,
    atualizarNovaUnidade,
    handleSalvarEscola,
    arquivarEscola,
    excluirEscola
  };
};