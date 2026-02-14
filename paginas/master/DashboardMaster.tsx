
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Globe,
  Plus,
  Loader2,
  Zap,
  Brain,
  ChevronRight
} from 'lucide-react';

import { supabase } from '../../supabaseClient';
import { useEscolasMaster } from '../../hooks/useEscolasMaster';
import EscolasKpis from '../../componentes/master/EscolasKpis';
import EscolasList from '../../componentes/master/EscolasList';
import ModalNovaEscola from '../../componentes/master/ModalNovaEscola';
import ModalConfirmacao from '../../componentes/ModalConfirmacao';
import { UnidadeEscolar } from '../../tipos';

const DashboardMaster: React.FC = () => {
  const navigate = useNavigate();

  const [modalConfirmacao, setModalConfirmacao] = useState<{
    aberto: boolean;
    tipo: 'arquivar' | 'excluir';
    unidade: UnidadeEscolar | null;
  }>({
    aberto: false,
    tipo: 'arquivar',
    unidade: null,
  });

  const {
    unidades,
    loading,
    processandoAcao,
    modalAberto,
    escolaEditando,
    busca,
    novaUnidade,
    salvando,
    setBusca,
    abrirModal,
    fecharModal,
    arquivarEscola,
    excluirEscola,
    atualizarNovaUnidade,
    handleSalvarEscola,
  } = useEscolasMaster();

  const handleAbrirAmbienteEscola = (u: UnidadeEscolar) => {
    navigate(`/escola/${u.id}`);
  };

  const handleConfirmarAcaoMaster = async () => {
    if (!modalConfirmacao.unidade) return;

    if (modalConfirmacao.tipo === 'arquivar') {
      await arquivarEscola(modalConfirmacao.unidade.id);
    } else {
      await excluirEscola(modalConfirmacao.unidade.id);
    }

    setModalConfirmacao({
      aberto: false,
      tipo: 'arquivar',
      unidade: null,
    });
  };

  return (
    <div className="p-4 md:p-10 space-y-10 bg-[#f8fafc] min-h-full">
      {/* HEADER */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
          <span className="text-[11px] font-black uppercase tracking-[0.4em] opacity-60 text-indigo-600">
            Master Control Core
          </span>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">
            Gestão de Rede
          </h2>
          <p className="text-slate-500 text-sm">
            Controle das instâncias escolares.
          </p>
        </div>

        <button
          onClick={() => abrirModal()}
          disabled={loading}
          className="bg-[#2563eb] text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-wide shadow-lg flex items-center gap-3"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <Plus size={18} />
          )}
          Provisionar Escola
        </button>
      </header>

      {/* KPIs */}
      <EscolasKpis
        total={unidades.filter((u) => u.status !== 'arquivado').length}
      />

      {/* LISTA */}
      <EscolasList
        unidades={unidades}
        busca={busca}
        onBuscaChange={setBusca}
        loading={loading}
        processandoAcao={processandoAcao}
        onEditarEscola={(u) => abrirModal(u)}
        onArquivar={(id) =>
          setModalConfirmacao({
            aberto: true,
            tipo: 'arquivar',
            unidade: unidades.find((u) => u.id === id) || null,
          })
        }
        onExcluir={(id) =>
          setModalConfirmacao({
            aberto: true,
            tipo: 'excluir',
            unidade: unidades.find((u) => u.id === id) || null,
          })
        }
        onAbrirEscola={handleAbrirAmbienteEscola}
      />

      {/* IA VISUAL (APENAS UI) */}
      <section className="bg-slate-900 rounded-3xl p-8 text-white">
        <div className="flex items-center gap-3 mb-6">
          <Brain className="text-blue-400" size={24} />
          <h3 className="text-lg font-black tracking-tight">
            Core Intelligence
          </h3>
        </div>

        <p className="text-slate-300 text-sm mb-6">
          Monitoramento de integridade da rede ativa.
        </p>

        <div className="flex gap-4">
          <div className="bg-white/5 p-4 rounded-xl">
            <p className="text-xs uppercase opacity-60">Instâncias</p>
            <p className="text-xl font-black">{unidades.length}</p>
          </div>
        </div>
      </section>

      {/* MODAL NOVA ESCOLA */}
      <ModalNovaEscola
        aberto={modalAberto}
        novaUnidade={novaUnidade}
        isEdit={!!escolaEditando}
        onChange={atualizarNovaUnidade}
        onClose={fecharModal}
        onSubmit={handleSalvarEscola}
        loading={salvando}
      />

      {/* MODAL CONFIRMAÇÃO */}
      <ModalConfirmacao
        aberto={modalConfirmacao.aberto}
        tipo={modalConfirmacao.tipo}
        titulo={
          modalConfirmacao.tipo === 'excluir'
            ? 'Excluir Unidade'
            : 'Arquivar Unidade'
        }
        itemNome={modalConfirmacao.unidade?.nome || ''}
        onConfirmar={handleConfirmarAcaoMaster}
        onFechar={() =>
          setModalConfirmacao({
            aberto: false,
            tipo: 'arquivar',
            unidade: null,
          })
        }
        loading={!!processandoAcao}
      />
    </div>
  );
};

export default DashboardMaster;
