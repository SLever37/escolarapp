import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Plus, Zap, Network, Loader2, ShieldCheck, Brain, Search, TrendingUp, BarChart3, ChevronRight } from 'lucide-react';
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
    unidade: null
  });
  
  const {
    unidades, 
    loading, 
    processandoAcao, 
    modalAberto, 
    busca, 
    novaUnidade, 
    salvando, 
    setBusca,
    abrirModal, 
    fecharModal, 
    arquivarEscola, 
    excluirEscola, 
    atualizarNovaUnidade, 
    handleSalvarEscola
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
    setModalConfirmacao({ aberto: false, tipo: 'arquivar', unidade: null });
  };

  return (
    <div className="p-4 md:p-10 space-y-10 animate-in fade-in duration-700 bg-[#f8fafc] min-h-full">
      {/* Header Soberano */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-1">
          <div className="flex items-center gap-3 text-indigo-600">
            <span className="text-[11px] font-black uppercase tracking-[0.4em] opacity-60">Master Control Core</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none">Gestão de Rede</h2>
          <p className="text-slate-500 text-sm font-medium">Controle de soberania sobre instâncias e provisionamento municipal.</p>
        </div>

        <button
          onClick={abrirModal}
          disabled={loading}
          className="bg-[#2563eb] text-white px-10 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3 shrink-0"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
          Provisionar Escola
        </button>
      </header>

      {/* Visão de KPIs da Imagem */}
      <EscolasKpis total={unidades.filter(u => u.status !== 'arquivado').length} />

      {/* Lista de Instâncias */}
      <EscolasList 
        unidades={unidades}
        busca={busca}
        onBuscaChange={setBusca}
        loading={loading}
        processandoAcao={processandoAcao}
        onArquivar={(id) => setModalConfirmacao({ aberto: true, tipo: 'arquivar', unidade: unidades.find(u => u.id === id)! })}
        onExcluir={(id) => setModalConfirmacao({ aberto: true, tipo: 'excluir', unidade: unidades.find(u => u.id === id)! })}
        onAbrirEscola={handleAbrirAmbienteEscola}
      />

      {/* IA Intelligence - Posicionada Abaixo das Unidades */}
      <IAIntelligenceMaster />

      {/* Modais */}
      <ModalNovaEscola 
        aberto={modalAberto}
        novaUnidade={novaUnidade}
        onChange={atualizarNovaUnidade}
        onClose={fecharModal}
        onSubmit={handleSalvarEscola}
        loading={salvando}
      />

      <ModalConfirmacao 
        aberto={modalConfirmacao.aberto}
        tipo={modalConfirmacao.tipo}
        titulo={modalConfirmacao.tipo === 'excluir' ? 'Remover Soberania' : 'Arquivar Unidade'}
        itemNome={modalConfirmacao.unidade?.nome || ''}
        onConfirmar={handleConfirmarAcaoMaster}
        onFechar={() => setModalConfirmacao({ aberto: false, tipo: 'arquivar', unidade: null })}
        loading={!!processandoAcao}
      />
    </div>
  );
};

const IAIntelligenceMaster = () => (
  <section className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl border border-white/5 group">
    <div className="absolute right-[-40px] top-[-40px] opacity-[0.03] group-hover:scale-110 transition-transform duration-1000">
      <Brain size={320} />
    </div>
    
    <div className="relative z-10 flex flex-col xl:flex-row gap-12 items-start">
      <div className="flex-1 space-y-8">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600/20 p-3 rounded-2xl border border-blue-500/30">
            <Zap size={24} className="text-blue-400 fill-blue-400" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-blue-400">EscolarApp Core Intelligence</h3>
            <p className="text-2xl font-black tracking-tight mt-1">Análise Preditiva de Rede</p>
          </div>
        </div>
        
        <p className="text-xl text-slate-300 font-medium leading-relaxed max-w-4xl">
          Nossa IA detectou um padrão de <span className="text-blue-400 font-black">alta eficiência operacional</span> em 85% das unidades. 
          Alerta preventivo: A unidade "Dom Pedro II" apresenta uma discrepância de 12% no sincronismo de diários em relação à média da rede. 
          Recomendado: Auditoria de conformidade no módulo N4 (Professor).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <PredictionCard label="Previsão de Evasão" value="-8.4%" trend="Redução" color="emerald" />
           <PredictionCard label="Risco de Conformidade" value="Baixo" trend="Estável" color="blue" />
           <PredictionCard label="Saúde de Cluster" value="Excelente" trend="100% Sinc." color="sky" />
        </div>
      </div>

      <div className="w-full xl:w-96 space-y-4">
         <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Sugestões de Ações Master</h4>
         <IASuggestion label="Otimizar Infraestrutura" desc="Liberar cache de instâncias suspensas." />
         <IASuggestion label="Auditoria Forense" desc="Verificar acesso master não usual em Unid. 04." />
         <IASuggestion label="Relatório MEC" desc="Base pronta para exportação automática." />
      </div>
    </div>
  </section>
);

const PredictionCard = ({ label, value, trend, color }: any) => (
  <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
     <p className="text-[9px] font-black text-slate-500 uppercase mb-2 tracking-widest">{label}</p>
     <div className="flex items-end justify-between">
        <p className="text-xl font-black">{value}</p>
        <span className={`text-[9px] font-black uppercase text-${color}-400`}>{trend}</span>
     </div>
  </div>
);

const IASuggestion = ({ label, desc }: any) => (
  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all cursor-pointer group flex items-center justify-between">
    <div>
      <p className="text-xs font-black text-blue-400 uppercase tracking-tighter">{label}</p>
      <p className="text-[10px] text-slate-400 mt-1">{desc}</p>
    </div>
    <ChevronRight size={14} className="text-slate-600 group-hover:text-blue-400 transition-colors" />
  </div>
);

export default DashboardMaster;