
import React, { useMemo } from 'react';
import { Search, Building2, User, CheckCircle2, ExternalLink, MoreVertical, Archive, Trash2, Globe, Loader2, Server } from 'lucide-react';
import { UnidadeEscolar } from '../../tipos';

interface Props {
  unidades: UnidadeEscolar[];
  busca: string;
  onBuscaChange: (v: string) => void;
  loading: boolean;
  menuAtivo: string | null;
  onToggleMenu: (id: string) => void;
  onCloseMenu: () => void;
  onArquivar: (id: string) => void;
  onExcluir: (id: string) => void;
  onAbrirEscola: (u: UnidadeEscolar) => void;
}

const EscolasList: React.FC<Props> = ({
  unidades,
  busca,
  onBuscaChange,
  loading,
  menuAtivo,
  onToggleMenu,
  onCloseMenu,
  onArquivar,
  onExcluir,
  onAbrirEscola
}) => {
  const redeFiltrada = useMemo(() => {
    const q = busca.trim().toLowerCase();
    if (!q) return unidades;
    return unidades.filter((e) => 
      e.nome.toLowerCase().includes(q) || 
      (e.codigo_inep && e.codigo_inep.includes(q))
    );
  }, [unidades, busca]);

  return (
    <div className="bg-white p-6 md:p-10 rounded-[3.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
        <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter leading-none">Unidades de Rede</h3>
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
          <input
            type="text"
            value={busca}
            onChange={(e) => onBuscaChange(e.target.value)}
            placeholder="Localizar instância..."
            className="pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none w-full lg:w-96 text-slate-800 focus:ring-4 focus:ring-blue-500/5 focus:bg-white transition-all shadow-inner"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-32 text-center flex flex-col items-center gap-6">
          <div className="relative">
            <Loader2 className="animate-spin text-blue-600" size={56} />
            <Server className="absolute inset-0 m-auto text-blue-200" size={24} />
          </div>
          <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em] animate-pulse">Sincronizando Cluster de Dados...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {redeFiltrada.map((e) => (
            <div
              key={e.id}
              className="p-6 bg-slate-50 border border-slate-100 rounded-[2.5rem] flex flex-col lg:flex-row lg:items-center justify-between group hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 hover:border-blue-100 transition-all duration-500 gap-6"
            >
              <div className="flex items-center gap-6 min-w-0">
                <div className="w-20 h-20 rounded-[1.8rem] bg-white text-blue-600 flex items-center justify-center shadow-sm border border-slate-100 group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shrink-0">
                  <Building2 size={32} />
                </div>

                <div className="min-w-0 space-y-2">
                  <h4 className="text-2xl font-black text-slate-800 leading-none truncate">
                    {e.nome}
                  </h4>
                  <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-slate-400" />
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{e.gestor_nome}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      <span className="text-[11px] font-black text-blue-500 uppercase tracking-tighter">
                        INEP: {e.codigo_inep || '—'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                        Instância Core {e.versao_core}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 relative shrink-0">
                <div className="hidden sm:flex items-center gap-2 bg-emerald-50 text-emerald-600 px-6 py-2.5 rounded-full text-[10px] font-black border border-emerald-100 uppercase tracking-widest">
                  <CheckCircle2 size={14} /> INSTÂNCIA ONLINE
                </div>

                <button 
                  onClick={() => onAbrirEscola(e)}
                  className="p-4 text-slate-400 hover:text-blue-600 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-xl transition-all active:scale-95 group-hover:border-blue-100" 
                  title="Acessar Ambiente Administrativo"
                >
                  <ExternalLink size={22} />
                </button>

                <div className="relative">
                  <button
                    onClick={() => onToggleMenu(e.id)}
                    className="p-4 text-slate-400 hover:text-slate-600 transition-colors bg-white/50 rounded-2xl"
                  >
                    <MoreVertical size={22} />
                  </button>

                  {menuAtivo === e.id && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={onCloseMenu} />
                      <div className="absolute right-0 top-full mt-3 w-64 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 p-3 z-50 animate-in fade-in slide-in-from-top-2">
                        <button
                          onClick={() => onArquivar(e.id)}
                          className="w-full flex items-center gap-4 p-4 text-[11px] font-black uppercase text-slate-600 hover:bg-slate-50 rounded-2xl transition-all"
                        >
                          <Archive size={16} className="text-blue-500" /> Arquivar Unidade
                        </button>
                        <div className="h-px bg-slate-50 my-2" />
                        <button
                          onClick={() => onExcluir(e.id)}
                          className="w-full flex items-center gap-4 p-4 text-[11px] font-black uppercase text-rose-600 hover:bg-rose-50 rounded-2xl transition-all"
                        >
                          <Trash2 size={16} className="text-rose-500" /> Excluir Definitivamente
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}

          {redeFiltrada.length === 0 && (
            <div className="py-24 text-center border-4 border-dashed border-slate-50 rounded-[3rem] space-y-4">
               <Globe size={64} className="mx-auto text-slate-200" />
               <div className="space-y-1">
                 <p className="text-slate-400 text-sm font-black uppercase tracking-widest">Nenhuma unidade localizada</p>
                 <p className="text-slate-300 text-xs font-medium">Verifique o termo de busca ou provisione uma nova escola.</p>
               </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EscolasList;
