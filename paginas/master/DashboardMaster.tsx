import React, { useState } from 'react';
import { Globe, Plus, Zap, Network } from 'lucide-react';
import { useEscolasMaster } from '../../hooks/useEscolasMaster';
import EscolasKpis from '../../componentes/master/EscolasKpis';
import EscolasList from '../../componentes/master/EscolasList';
import ModalNovaEscola from '../../componentes/master/ModalNovaEscola';
import ModalConfirmacao from '../../componentes/ModalConfirmacao';
import { UnidadeEscolar } from '../../tipos';
import { supabase } from '../../supabaseClient';

const DashboardMaster: React.FC = () => {
  const [salvando, setSalvando] = useState(false);
  const [modalConfirmacao, setModalConfirmacao] = useState<{aberto: boolean, tipo: 'arquivar' | 'excluir', unidade: UnidadeEscolar | null}>({
    aberto: false,
    tipo: 'arquivar',
    unidade: null
  });
  
  const {
    unidades, loading, processandoAcao, modalAberto, busca, novaUnidade, setBusca,
    abrirModal, fecharModal, carregarEscolas,
    arquivarEscola, excluirEscola, atualizarNovaUnidade
  } = useEscolasMaster();

  const handleAbrirEscola = (u: UnidadeEscolar) => {
    // Salva a escola selecionada para o app inteiro usar como contexto de unidade ativa
    localStorage.setItem('escolarapp_unidade_ativa_id', u.id);
    localStorage.setItem('escolarapp_unidade_ativa_nome', u.nome);

    // Navega para o painel de edição/gestão da escola específica
    window.location.hash = `#/escola/${u.id}`;
  };

  const handleTriggerConfirmacao = (unidade: UnidadeEscolar, tipo: 'arquivar' | 'excluir') => {
    setModalConfirmacao({ aberto: true, tipo, unidade });
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

  const handleAddUnidade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (salvando) return;
    
    setSalvando(true);
    try {
      // 1. Criar Unidade Escolar
      const { data: escola, error: errorEscola } = await supabase
        .from('unidades_escolares')
        .insert([{
          nome: novaUnidade.nome.trim(),
          gestor_nome: novaUnidade.gestorNome.trim(),
          ativa: true,
          codigo_inep: novaUnidade.codigoInep?.trim() || null,
          versao_core: '3.1.0',
          alunos_count: 0
        }])
        .select()
        .single();

      if (errorEscola) throw errorEscola;

      // 2. Criar Gestor Vinculado com insert corrigido
      const { error: errorGestor } = await supabase
        .from('usuarios')
        .insert([{
          nome: novaUnidade.gestorNome.trim(),
          email: novaUnidade.gestorEmail.trim().toLowerCase(),
          papel: 'gestor',
          unidade_id: escola.id,
          nivel: 5,
          ativo: true
        }]);

      if (errorGestor) throw errorGestor;

      await carregarEscolas();
      fecharModal();
      alert(`Provisionamento concluído para: ${escola.nome}`);
    } catch (err: any) {
      console.error('Erro crítico no provisionamento:', err);
      alert('Falha no banco de dados: ' + err.message);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="p-4 md:p-10 space-y-10 animate-in fade-in duration-700 bg-slate-50/30 min-h-full">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-indigo-600">
            <div className="bg-indigo-600 p-1.5 rounded-lg text-white shadow-lg shadow-indigo-200">
              <Globe size={20} />
            </div>
            <span className="text-[11px] font-black uppercase tracking-[0.4em]">Master Core Engine v3.1</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none">Gestão de Rede</h2>
          <p className="text-slate-500 text-sm font-medium">Controle de soberania sobre instâncias e provisionamento de rede municipal.</p>
        </div>

        <button
          onClick={abrirModal}
          className="bg-blue-600 text-white px-10 py-5 rounded-lg text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3 shrink-0"
        >
          <Plus size={20} /> Adicionar Escola
        </button>
      </header>

      <EscolasKpis total={unidades.length} />

      <div className="bg-slate-900 rounded-lg p-10 text-white relative overflow-hidden shadow-2xl border border-white/5 group">
        <div className="absolute right-[-40px] top-[-40px] opacity-[0.03] group-hover:scale-110 transition-transform duration-1000">
          <Network size={320} />
        </div>
        <div className="relative z-10 flex flex-col xl:flex-row gap-10 items-center">
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-amber-400/20 p-2.5 rounded-lg">
                <Zap size={20} className="text-amber-400 fill-amber-400" />
              </div>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-amber-400">Core Intelligence Diagnostics</h3>
            </div>
            <p className="text-lg text-slate-300 font-medium leading-relaxed max-w-3xl">
              Cluster operando em <span className="text-white font-black underline decoration-emerald-500 underline-offset-4">Capacidade Ótima</span>. 
              {unidades.length === 0 
                ? " Aguardando provisionamento da primeira unidade para iniciar monitoramento municipal."
                : ` Rede consolidada com ${unidades.length} instâncias ativas e saudáveis.`}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full xl:w-auto shrink-0">
             <div className="bg-white/5 border border-white/10 p-4 rounded-lg"><p className="text-[9px] font-black text-slate-500 uppercase mb-1">Protocolo</p><p className="text-sm font-black">HTTPS/SSL</p></div>
             <div className="bg-white/5 border border-white/10 p-4 rounded-lg"><p className="text-[9px] font-black text-slate-500 uppercase mb-1">Backup</p><p className="text-sm font-black">Real-time</p></div>
          </div>
        </div>
      </div>

      <EscolasList 
        unidades={unidades}
        busca={busca}
        onBuscaChange={setBusca}
        loading={loading}
        processandoAcao={processandoAcao}
        onArquivar={(id) => handleTriggerConfirmacao(unidades.find(u => u.id === id)!, 'arquivar')}
        onExcluir={(id) => handleTriggerConfirmacao(unidades.find(u => u.id === id)!, 'excluir')}
        onAbrirEscola={handleAbrirEscola}
      />

      <ModalNovaEscola 
        aberto={modalAberto}
        novaUnidade={novaUnidade}
        onChange={atualizarNovaUnidade}
        onClose={fecharModal}
        onSubmit={handleAddUnidade}
        loading={salvando}
      />

      <ModalConfirmacao 
        aberto={modalConfirmacao.aberto}
        tipo={modalConfirmacao.tipo}
        titulo={modalConfirmacao.tipo === 'excluir' ? 'Excluir Instância' : 'Arquivar Instância'}
        itemNome={modalConfirmacao.unidade?.nome || ''}
        onConfirmar={handleConfirmarAcaoMaster}
        onFechar={() => setModalConfirmacao({ aberto: false, tipo: 'arquivar', unidade: null })}
        loading={!!processandoAcao}
      />
    </div>
  );
};

export default DashboardMaster;