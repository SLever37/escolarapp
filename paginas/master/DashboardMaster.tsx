import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Loader2,
  Brain
} from 'lucide-react';

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
      <header className="max-w-6xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-8 w-full">
        <div>
          <span className="text-[11px] font-black uppercase tracking-[0.4em] opacity-60 text-indigo-600">
            Master Control Core
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Gestão de Rede
          </h2>
          <p className="text-slate-500 text-sm">
            Controle das instâncias escolares.
          </p>
        </div>

        <button
          onClick={() => abrirModal()}
          disabled={loading}
          className="bg-[#2563eb] text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-wide shadow-lg flex items-center gap-3 shrink-0"
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
        onArquivar={(id) => {
          const unidade = unidades.find((u) => u.id === id);
          if (!unidade) return;
          setModalConfirmacao({
            aberto: true,
            tipo: 'arquivar',
            unidade,
          });
        }}
        onExcluir={(id) => {
          const unidade = unidades.find((u) => u.id === id);
          if (!unidade) return;
          setModalConfirmacao({
            aberto: true,
            tipo: 'excluir',
            unidade,
          });
        }}
        onAbrirEscola={handleAbrirAmbienteEscola}
      />

      {/* IA VISUAL (APENAS UI) */}
      <section className="max-w-6xl mx-auto bg-slate-900 rounded-3xl p-6 md:p-8 text-white w-full overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Brain className="text-blue-400" size={20} />
              <h3 className="text-base md:text-lg font-black tracking-tight">
                Core Intelligence
              </h3>
            </div>

            <p className="text-slate-300 text-xs md:text-sm max-w-xl leading-relaxed">
              Monitoramento de integridade da rede ativa.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full md:w-auto">
            <div className="bg-white/5 p-4 rounded-xl text-center">
              <p className="text-[10px] uppercase opacity-60">Instâncias</p>
              <p className="text-lg md:text-xl font-black break-words">
                {unidades.length}
              </p>
            </div>
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