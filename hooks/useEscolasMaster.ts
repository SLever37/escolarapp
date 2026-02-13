import { useState, useEffect, useCallback } from 'react';
import { UnidadeEscolar } from '../tipos';
import { escolasService } from '../services/escolas.service';
import { gestoresService } from '../services/gestores.service';

export const useEscolasMaster = () => {
  const [unidades, setUnidades] = useState<UnidadeEscolar[]>([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [processandoAcao, setProcessandoAcao] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [menuAtivo, setMenuAtivo] = useState<string | null>(null);
  const [busca, setBusca] = useState('');

  const [novaUnidade, setNovaUnidade] = useState({
    nome: '',
    codigoInep: '',
    gestorNome: '',
    gestorEmail: '',
    gestorSenha: '',
  });

  const carregarEscolas = useCallback(async () => {
    setLoading(true);
    try {
      const data = await escolasService.fetchUnidades();
      setUnidades(data);
    } catch (err: any) {
      console.error(err.message);
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

  const confirmarCriacaoEscolaEGestor = async () => {
    if (salvando) return;
    setSalvando(true);
    try {
      const escola = await escolasService.handleAddUnidade({
        nome: novaUnidade.nome,
        gestor_nome: novaUnidade.gestorNome,
        codigo_inep: novaUnidade.codigoInep
      });

      await gestoresService.criarGestorVinculado({
        nome: novaUnidade.gestorNome,
        email: novaUnidade.gestorEmail,
        unidade_id: escola.id,
        unidade_nome: escola.nome
      });

      await carregarEscolas();
      fecharModal();
      alert(`Provisionamento concluído para: ${escola.nome}`);
    } catch (err: any) {
      alert('Falha crítica: ' + err.message);
    } finally {
      setSalvando(false);
    }
  };

  const arquivarEscola = async (id: string) => {
    if (processandoAcao) return;
    setProcessandoAcao(id);
    try {
      await escolasService.arquivarUnidade(id);
      await carregarEscolas();
      setMenuAtivo(null);
    } catch (err: any) {
      alert('Erro: ' + err.message);
    } finally {
      setProcessandoAcao(null);
    }
  };

  const excluirEscola = async (id: string) => {
    if (processandoAcao) return;
    if (!confirm('Deseja excluir permanentemente esta unidade?')) return;
    setProcessandoAcao(id);
    try {
      await escolasService.excluirUnidade(id);
      await carregarEscolas();
      setMenuAtivo(null);
    } catch (err: any) {
      alert('Erro: ' + err.message);
    } finally {
      setProcessandoAcao(null);
    }
  };

  const toggleMenu = (id: string) => setMenuAtivo(prev => prev === id ? null : id);
  const fecharMenu = () => setMenuAtivo(null);

  return {
    unidades,
    loading,
    salvando,
    processandoAcao,
    modalAberto,
    menuAtivo,
    busca,
    novaUnidade,
    setBusca,
    carregarEscolas,
    abrirModal,
    fecharModal,
    atualizarNovaUnidade,
    confirmarCriacaoEscolaEGestor,
    arquivarEscola,
    excluirEscola,
    toggleMenu,
    fecharMenu
  };
};