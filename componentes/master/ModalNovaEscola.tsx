// src/componentes/master/ModalNovaEscola.tsx
import React from 'react';
import { X, Building2, Globe, Loader2, ShieldCheck, Edit3 } from 'lucide-react';

interface Props {
  aberto: boolean;
  novaUnidade: any;
  isEdit?: boolean;
  onChange: (campo: string, valor: string) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

const InputField = ({ label, value, onChange, ...props }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">
      {label}
    </label>
    <input
      {...props}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-slate-50 border border-slate-100 p-4 px-6 rounded-[1.2rem] outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-500 text-sm font-bold text-slate-800 transition-all"
    />
  </div>
);

const ModalNovaEscola: React.FC<Props> = ({
  aberto,
  novaUnidade,
  isEdit = false,
  onChange,
  onClose,
  onSubmit,
  loading,
}) => {
  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-slate-900/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 border border-white/20">
        <div className="p-8 md:p-10 bg-slate-900 text-white flex items-center justify-between border-b border-white/10">
          <div className="space-y-1">
            <h3 className="text-2xl font-black uppercase tracking-tighter leading-none">
              {isEdit ? 'Editar Instância' : 'Nova Escola'}
            </h3>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.25em] mt-2">
              {isEdit ? 'Ajustar metadados da escola selecionada' : 'Criar escola na rede municipal'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-3 text-slate-400 hover:text-white transition-all bg-white/5 hover:bg-white/10 rounded-2xl"
          >
            <X size={28} />
          </button>
        </div>

        <form
          onSubmit={onSubmit}
          className="p-8 md:p-12 space-y-8 bg-white max-h-[80vh] overflow-y-auto custom-scrollbar"
        >
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              {isEdit ? (
                <Edit3 className="text-blue-600" size={18} />
              ) : (
                <Building2 className="text-blue-600" size={18} />
              )}
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Identificação Institucional
              </h4>
            </div>

            <div className="space-y-6">
              <InputField
                label="Nome da Escola"
                placeholder="Ex: EM Osmarina Melo de Oliveira"
                required
                value={novaUnidade.nome}
                onChange={(v: string) => onChange('nome', v)}
              />

              <InputField
                label="Código INEP (8 dígitos)"
                placeholder="Opcional"
                value={novaUnidade.codigoInep || ''}
                onChange={(v: string) => onChange('codigoInep', v)}
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2563eb] text-white py-5 rounded-[1.2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/30 hover:bg-blue-700 hover:scale-[1.01] active:scale-100 transition-all disabled:opacity-50 flex items-center justify-center relative overflow-hidden"
            >
              {loading ? (
                <div className="flex items-center gap-3 relative z-10">
                  <Loader2 className="animate-spin" size={20} />
                  <span>{isEdit ? 'Atualizando...' : 'Salvando...'}</span>
                </div>
              ) : (
                <>
                  <Globe
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none"
                    size={110}
                  />
                  <span className="relative z-10">{isEdit ? 'Salvar Alterações' : 'Criar Escola'}</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 mt-8 text-slate-400">
              <ShieldCheck size={16} />
              <p className="text-[10px] font-black uppercase tracking-[0.2em]">
                Auditoria Master Ativa
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalNovaEscola;