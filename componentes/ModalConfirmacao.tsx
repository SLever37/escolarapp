import React, { useState, useEffect } from 'react';
import { AlertTriangle, Trash2, Archive, X, Info } from 'lucide-react';

interface Props {
  aberto: boolean;
  tipo: 'arquivar' | 'excluir';
  titulo: string;
  itemNome: string;
  onConfirmar: () => void;
  onFechar: () => void;
  loading?: boolean;
}

const ModalConfirmacao: React.FC<Props> = ({ aberto, tipo, titulo, itemNome, onConfirmar, onFechar, loading }) => {
  const [aceite, setAceite] = useState(false);

  // Resetar aceite ao fechar/abrir
  useEffect(() => {
    if (!aberto) setAceite(false);
  }, [aberto]);

  if (!aberto) return null;

  const isExcluir = tipo === 'excluir';

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-lg shadow-2xl overflow-hidden border border-slate-200">
        <div className={`p-6 flex items-center justify-between border-b ${isExcluir ? 'bg-rose-50 border-rose-100' : 'bg-amber-50 border-amber-100'}`}>
          <div className="flex items-center gap-3">
            {isExcluir ? <Trash2 className="text-rose-600" size={20} /> : <Archive className="text-amber-600" size={20} />}
            <h3 className={`text-sm font-black uppercase tracking-widest ${isExcluir ? 'text-rose-900' : 'text-amber-900'}`}>
              {titulo}
            </h3>
          </div>
          <button onClick={onFechar} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-3">
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Item selecionado:</p>
            <p className="text-slate-900 font-black text-lg leading-tight">{itemNome}</p>
          </div>

          <div className={`p-4 rounded-lg border flex gap-3 ${isExcluir ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
            <AlertTriangle className="shrink-0" size={18} />
            <p className="text-xs font-bold leading-relaxed">
              {isExcluir 
                ? 'AVISO CRÍTICO: Esta ação removerá permanentemente todos os registros, documentos e históricos vinculados a este item do banco de dados central. Não há recuperação.' 
                : 'AVISO: Este item será desativado e removido das visualizações ativas do sistema, permanecendo arquivado em modo offline/leitura.'}
            </p>
          </div>

          {isExcluir && (
            <label className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors group">
              <input 
                type="checkbox" 
                checked={aceite} 
                onChange={(e) => setAceite(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500" 
              />
              <span className="text-[11px] font-black text-slate-600 uppercase leading-snug group-hover:text-slate-900">
                Eu entendo que esta ação é irreversível e desejo apagar todos os dados.
              </span>
            </label>
          )}

          <div className="flex gap-3 pt-2">
            <button 
              onClick={onFechar}
              className="flex-1 px-6 py-4 rounded-lg text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all"
            >
              Cancelar
            </button>
            <button 
              disabled={loading || (isExcluir && !aceite)}
              onClick={onConfirmar}
              className={`flex-1 px-6 py-4 rounded-lg text-[10px] font-black uppercase tracking-widest text-white shadow-xl transition-all disabled:opacity-30
                ${isExcluir ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-200' : 'bg-amber-600 hover:bg-amber-700 shadow-amber-200'}`}
            >
              {loading ? 'Processando...' : isExcluir ? 'Sim, Excluir Tudo' : 'Confirmar Arquivamento'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmacao;