
import React from 'react';
import { Globe, Plus, Zap, Network } from 'lucide-react';
import { useEscolasMaster } from '../../hooks/useEscolasMaster';
import EscolasKpis from '../../componentes/master/EscolasKpis';
import EscolasList from '../../componentes/master/EscolasList';
import ModalNovaEscola from '../../componentes/master/ModalNovaEscola';
import { UnidadeEscolar } from '../../tipos';

const DashboardMaster: React.FC = () => {
  const {
    unidades,
    loading,
    salvando,
    modalAberto,
    menuAtivo,
    busca,
    novaUnidade,
    setBusca,
    abrirModal,
    fecharModal,
    atualizarNovaUnidade,
    confirmarCriacaoEscolaEGestor,
    arquivarEscola,
    excluirEscola,
    toggleMenu,
    fecharMenu
  } = useEscolasMaster();

  const handleAbrirEscola = (u: UnidadeEscolar) => {
    alert(`Carregando ambiente administrativo de: ${u.nome}`);
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    confirmarCriacaoEscolaEGestor();
  };

  return (
    <div className="p-4 md:p-10 space-y-10 animate-in fade-in duration-700 bg-slate-50/30">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-indigo-600">
            <div className="bg-indigo-600 p-1.5 rounded-lg text-white shadow-lg shadow-indigo-200">
              <Globe size={20} />
            </div>
            <span className="text-[11px] font-black uppercase tracking-[0.4em]">Master Core Engine v3.1</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none">Gestão de Rede</h2>
          <p className="text-slate-500 text-sm font-medium">Controle de soberania sobre instâncias e privilégios master.</p>
        </div>

        <button
          onClick={abrirModal}
          className="bg-blue-600 text-white px-10 py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3 shrink-0"
        >
          <Plus size={20} /> Adicionar Escola
        </button>
      </header>

      <EscolasKpis totalEscolas={unidades.length} />

      <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl border border-white/5 group">
        <div className="absolute right-[-40px] top-[-40px] opacity-[0.03] group-hover:scale-110 transition-transform duration-1000">
          <Network size={320} />
        </div>
        <div className="relative z-10 flex flex-col xl:flex-row gap-10 items-center">
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-amber-400/20 p-2.5 rounded-2xl">
                <Zap size={20} className="text-amber-400 fill-amber-400" />
              </div>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-amber-400">Core Intelligence Diagnostics</h3>
            </div>
            <p className="text-lg text-slate-300 font-medium leading-relaxed max-w-3xl">
              Sua rede municipal está operando em <span className="text-white font-black underline decoration-emerald-500 underline-offset-4">Capacidade Ótima</span>. 
              O provisionamento automático está configurado para redundância tripla. 
              {unidades.length < 5 ? " Recomendamos o cadastro das unidades satélites para consolidação do Censo Escolar." : " Todas as instâncias principais estão reportando saúde estável."}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full xl:w-auto shrink-0">
             <InfoPill label="Protocolo" value="HTTPS/SSL" />
             <InfoPill label="Backup" value="Real-time" />
             <InfoPill label="Latência" value="12ms" />
             <InfoPill label="Cripto" value="AES-256" />
          </div>
        </div>
      </div>

      <EscolasList 
        unidades={unidades}
        busca={busca}
        onBuscaChange={setBusca}
        loading={loading}
        menuAtivo={menuAtivo}
        onToggleMenu={toggleMenu}
        onCloseMenu={fecharMenu}
        onArquivar={arquivarEscola}
        onExcluir={excluirEscola}
        onAbrirEscola={handleAbrirEscola}
      />

      <ModalNovaEscola 
        aberto={modalAberto}
        novaUnidade={novaUnidade}
        onChange={atualizarNovaUnidade}
        onClose={fecharModal}
        onSubmit={handleModalSubmit}
        loading={salvando}
      />
    </div>
  );
};

const InfoPill = ({ label, value }: any) => (
  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl hover:bg-white/10 transition-all">
     <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
     <p className="text-sm font-black text-white">{value}</p>
  </div>
);

export default DashboardMaster;
