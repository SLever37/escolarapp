
import React, { useState, useEffect } from 'react';
import { X, Search, Building2, Loader2, ArrowRightLeft } from 'lucide-react';
import { escolasService } from '../../servicos/escolas.service';
import { UnidadeEscolar } from '../../tipos';

interface Props {
  aberto: boolean;
  onClose: () => void;
  onConfirmar: (unidadeId: string, nomeUnidade: string) => void;
  gestorNome: string;
  unidadeAtualId?: string;
}

export const ModalTransferirGestor: React.FC<Props> = ({ aberto, onClose, onConfirmar, gestorNome, unidadeAtualId }) => {
  const [escolas, setEscolas] = useState<UnidadeEscolar[]>([]);
  const [loading, setLoading] = useState(false);
  const [busca, setBusca] = useState('');
  const [processando, setProcessando] = useState(false);

  useEffect(() => {
    if (aberto) {
      const carregar = async () => {
        setLoading(true);
        try {
          const data = await escolasService.fetchUnidades();
          setEscolas(data.filter(e => e.id !== unidadeAtualId && e.status === 'ativo'));
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      carregar();
    }
  }, [aberto, unidadeAtualId]);

  if (!aberto) return null;

  const escolasFiltradas = escolas.filter(e => e.nome.toLowerCase().includes(busca.toLowerCase()));

  const handleTransferir = async (escola: UnidadeEscolar) => {
    setProcessando(true);
    try {
      await onConfirmar(escola.id, escola.nome);
      onClose();
    } catch (err) {
      alert("Erro ao transferir: " + err);
    } finally {
      setProcessando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        <div className="p-8 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-xl font-black uppercase tracking-tighter">Transferir Gestor</h3>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{gestorNome}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl"><X size={24} /></button>
        </div>

        <div className="p-6 border-b border-slate-100 bg-slate-50 shrink-0">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar nova unidade destino..." 
              value={busca}
              onChange={e => setBusca(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {loading ? (
            <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto text-blue-600" /></div>
          ) : escolasFiltradas.length > 0 ? (
            escolasFiltradas.map(e => (
              <button 
                key={e.id}
                onClick={() => handleTransferir(e)}
                disabled={processando}
                className="w-full p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between hover:border-blue-500 hover:shadow-lg transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Building2 size={20} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-black text-slate-800">{e.nome}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">INEP: {e.codigo_inep || '---'}</p>
                  </div>
                </div>
                <ArrowRightLeft size={18} className="text-slate-300 group-hover:text-blue-600" />
              </button>
            ))
          ) : (
            <div className="p-10 text-center text-slate-400 text-xs font-bold uppercase">Nenhuma unidade ativa encontrada</div>
          )}
        </div>
      </div>
    </div>
  );
};
