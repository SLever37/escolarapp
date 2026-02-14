import React, { useMemo } from 'react';
import { Search, Building2, User, CheckCircle2, ExternalLink, Archive, Trash2, Globe, Loader2, Edit3 } from 'lucide-react';
import { UnidadeEscolar } from '../../tipos';

interface Props {
  unidades: UnidadeEscolar[];
  busca: string;
  onBuscaChange: (v: string) => void;
  loading: boolean;
  processandoAcao?: string | null;
  onArquivar: (id: string) => void;
  onExcluir: (id: string) => void;
  onAbrirEscola: (u: UnidadeEscolar) => void;
  onEditarEscola: (u: UnidadeEscolar) => void;
}

const EscolasList: React.FC<Props> = ({
  unidades, busca, onBuscaChange, loading, processandoAcao, onArquivar, onExcluir, onAbrirEscola, onEditarEscola
}) => {
  const filtradas = useMemo(() => {
    const q = busca.toLowerCase();
    return unidades.filter(u => u.nome.toLowerCase().includes(q) || u.codigo_inep?.includes(q));
  }, [unidades, busca]);

  return (
    <div className="max-w-7xl mx-auto bg-white p-5 md:p-10 rounded-lg border border-slate-200 shadow-sm relative">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 md:mb-12">
        <h3 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tighter leading-none">Unidades de Rede</h3>
        <div className="relative group w-full lg:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
          <input
            type="text"
            value={busca}
            onChange={(e) => onBuscaChange(e.target.value)}
            placeholder="Localizar instância..."
            className="pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-lg text-sm font-bold outline-none w-full text-slate-800 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all shadow-inner"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-32 text-center flex flex-col items-center gap-6">
          <Loader2 className="animate-spin text-blue-600" size={48} />
          <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em] animate-pulse">Sincronizando Cluster...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtradas.map((e) => (
            <div key={e.id} className="p-4 md:p-6 bg-slate-50 border border-slate-100 rounded-lg flex flex-col xl:flex-row xl:items-center justify-between gap-4 group hover:bg-white hover:shadow-2xl transition-all duration-500">
              
              <div className="flex items-start gap-4 md:gap-6 min-w-0 flex-1">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-lg bg-white text-blue-600 flex items-center justify-center shadow-sm border border-slate-100 group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
                  <Building2 size={24} />
                </div>
                <div className="min-w-0 flex-1 pr-2">
                  <h4 className="text-base md:text-lg lg:text-xl font-black text-slate-900 leading-snug break-words">
                    {e.nome}
                  </h4>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <User size={12} className="text-slate-400 shrink-0" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">{e.gestor_nome || 'Aguardando Gestor'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-black text-blue-500 uppercase">INEP: {e.codigo_inep || '—'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between xl:justify-end gap-3 md:gap-4 shrink-0 w-full xl:w-auto">
                <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg text-[9px] font-black border border-emerald-100 uppercase tracking-widest shrink-0">
                  <CheckCircle2 size={12} /> ONLINE
                </div>
                
                <div className="flex items-center gap-2 shrink-0">
                  <button 
                    onClick={() => onAbrirEscola(e)} 
                    className="p-2.5 text-blue-600 bg-white border border-slate-100 rounded-lg shadow-sm hover:bg-blue-600 hover:text-white transition-all"
                  >
                    <ExternalLink size={18} />
                  </button>

                  <button 
                    onClick={() => onEditarEscola(e)} 
                    className="p-2.5 text-slate-600 bg-white border border-slate-100 rounded-lg shadow-sm hover:bg-slate-900 hover:text-white transition-all"
                  >
                    <Edit3 size={18} />
                  </button>

                  <button 
                    onClick={() => onArquivar(e.id)} 
                    disabled={!!processandoAcao}
                    className={`p-2.5 text-slate-400 bg-white border border-slate-100 rounded-lg shadow-sm hover:bg-amber-500 hover:text-white transition-all ${processandoAcao === e.id ? 'animate-pulse' : ''}`}
                  >
                    <Archive size={18} />
                  </button>

                  <button 
                    onClick={() => onExcluir(e.id)} 
                    disabled={!!processandoAcao}
                    className={`p-2.5 text-rose-400 bg-white border border-slate-100 rounded-lg shadow-sm hover:bg-rose-600 hover:text-white transition-all ${processandoAcao === e.id ? 'animate-pulse' : ''}`}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {filtradas.length === 0 && (
            <div className="py-24 text-center border-4 border-dashed border-slate-50 rounded-lg">
               <Globe size={64} className="mx-auto text-slate-200 mb-4" />
               <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Nenhuma escola localizada na rede</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EscolasList;