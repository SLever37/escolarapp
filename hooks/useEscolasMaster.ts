
import { useState, useEffect, useCallback } from 'react';
import { UnidadeEscolar } from '../tipos';
import { escolasService } from '../servicos/escolas.service';

export const useEscolasMaster = () => {
  const [unidades, setUnidades] = useState<UnidadeEscolar[]>([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [escolaEditando, setEscolaEditando] = useState<UnidadeEscolar | null>(null);
  const [busca, setBusca] = useState('');
  const [processandoAcao, setProcessandoAcao] = useState<string | null>(null);

  const [novaUnidade, setNovaUnidade] = useState({
    nome: '',
    codigoInep: '',
  });

  const carregarEscolas = useCallback(async () => {
    try {
      setLoading(true);
      const data = await escolasService.fetchUnidades();
      setUnidades(data);
    } catch (err: any) {
      console.error('Falha ao sincronizar rede:', err?.message ?? err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarEscolas();
  }, [carregarEscolas]);

  const abrirModal = (escola?: UnidadeEscolar) => {
    if (escola) {
      setEscolaEditando(escola);
      setNovaUnidade({
        nome: escola.nome,
        codigoInep: escola.codigo_inep || '',
      });
    } else {
      setEscolaEditando(null);
      setNovaUnidade({ nome: '', codigoInep: '' });
    }
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setEscolaEditando(null);
    setNovaUnidade({ nome: '', codigoInep: '' });
  };

  const atualizarNovaUnidade = (campo: string, valor: string) => {
    setNovaUnidade((prev) => ({ ...prev, [campo]: valor }));
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
        await escolasService.atualizarEscola(escolaEditando.id, {
          nome,
          codigo_inep: codigoInep || null,
        });
      } else {
        // Fix: Changed from 'provisionar' to 'criarEscola' because the modal only provides school info.
        // The gestor will be registered later via the invite link provided in the School environment.
        await escolasService.criarEscola({
          nome: nome,
          codigo_inep: codigoInep || null,
        });
      }

      await carregarEscolas();
      fecharModal();
    } catch (err: any) {
      alert(`Erro ao salvar escola: ${err?.message ?? err}`);
    } finally {
      setSalvando(false);
      await carregarEscolas(); // força sincronização real com banco
    }
  };

  return {
    unidades,
    loading,
    salvando,
    modalAberto,
    escolaEditando,
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
    carregarEscolas,
  };
};
