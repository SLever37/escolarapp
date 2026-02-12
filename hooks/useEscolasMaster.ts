
import { useState, useEffect, useCallback } from 'react';
import { UnidadeEscolar } from '../tipos';
import { escolasService } from '../services/escolas.service';
import { gestoresService } from '../services/gestores.service';

export const useEscolasMaster = () => {
  const [unidades, setUnidades] = useState<UnidadeEscolar[]>([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
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
    setErro(null);
    try {
      const data = await escolasService.listarEscolasAtivas();
      setUnidades(data);
    } catch (err: any) {
      setErro(err.message);
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
    setSalvando(true);
    try {
      // 1. Cria a unidade
      const escola = await escolasService.criarEscola({
        nome: novaUnidade.nome,
        gestor_nome: novaUnidade.gestorNome,
        codigo_inep: novaUnidade.codigoInep
      });

      // 2. Cria o gestor institucional vinculado
      await gestoresService.criarGestorVinculado({
        nome: novaUnidade.gestorNome,
        email: novaUnidade.gestorEmail,
        unidade_id: escola.id,
        unidade_nome: escola.nome
      });

      await carregarEscolas();
      fecharModal();
      alert(`Provisionamento concluído!\nUnidade: ${escola.nome}\nGestor: ${novaUnidade.gestorNome}`);
    } catch (err: any) {
      alert('Falha no provisionamento: ' + err.message);
    } finally {
      setSalvando(false);
    }
  };

  const arquivarEscola = async (id: string) => {
    try {
      await escolasService.arquivarEscola(id);
      await carregarEscolas();
      setMenuAtivo(null);
    } catch (err: any) {
      alert('Erro ao arquivar: ' + err.message);
    }
  };

  const excluirEscola = async (id: string) => {
    if (!confirm('ATENÇÃO: Você está prestes a excluir uma instância permanentemente. Confirmar?')) return;
    try {
      await escolasService.excluirEscola(id);
      await carregarEscolas();
      setMenuAtivo(null);
    } catch (err: any) {
      alert('Erro ao excluir: ' + err.message);
    }
  };

  const toggleMenu = (id: string) => {
    setMenuAtivo(prev => prev === id ? null : id);
  };

  const fecharMenu = () => setMenuAtivo(null);

  return {
    unidades,
    loading,
    salvando,
    erro,
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
