
import React from 'react';
import { X, Building2, User, Mail, KeyRound, Globe, Loader2, ShieldCheck } from 'lucide-react';

interface Props {
  aberto: boolean;
  novaUnidade: any;
  onChange: (campo: string, valor: string) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

const FormInput = ({ label, value, onChange, ...props }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">{label}</label>
    <input
      {...props}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-slate-50 border border-slate-100 p-4 px-6 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-500 text-sm font-bold text-slate-800 transition-all"
    />
  </div>
);

const ModalNovaEscola: React.FC<Props> = ({
  aberto,
  novaUnidade,
  onChange,
  onClose,
  onSubmit,
  loading
}) => {
  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-slate-900/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-white w-full max-w-4xl rounded-[4rem] shadow-[0_0_100px_rgba(0,0,0,0.3)] overflow-hidden animate-in zoom-in duration-300 border border-white/20">
        <div className="p-8 md:p-12 bg-slate-900 text-white flex items-center justify-between border-b border-white/10">
          <div className="space-y-1">
            <h3 className="text-2xl font-black uppercase tracking-tighter leading-none">Provisionar Nova Instância</h3>
            <p className="text-slate-400 text-[11px] uppercase font-bold tracking-[0.2em]">Criação de Escola e Gestão Master Institucional</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-3 text-slate-400 hover:text-white transition-all bg-white/5 hover:bg-white/10 rounded-2xl"
          >
            <X size={28} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-10 bg-white">
          <div className="space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="bg-blue-50 p-2 rounded-xl text-blue-600"><Building2 size={18}/></div>
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">Dados da Unidade</h4>
            </div>
            <div className="space-y-5">
              <FormInput 
                label="Nome da Escola" 
                placeholder="Ex: Escola Municipal Machado de Assis"
                required
                value={novaUnidade.nome}
                onChange={(v: string) => onChange('nome', v)}
              />
              <FormInput 
                label="Código INEP" 
                placeholder="8 dígitos oficiais"
                value={novaUnidade.codigoInep}
                onChange={(v: string) => onChange('codigoInep', v)}
              />
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600"><User size={18}/></div>
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">Responsável Master</h4>
            </div>
            <div className="space-y-5">
              <FormInput 
                label="Nome do Diretor" 
                placeholder="Nome completo do gestor"
                required
                value={novaUnidade.gestorNome}
                onChange={(v: string) => onChange('gestorNome', v)}
              />
              <FormInput 
                label="E-mail Institucional" 
                type="email"
                placeholder="direcao@escolar.app"
                required
                value={novaUnidade.gestorEmail}
                onChange={(v: string) => onChange('gestorEmail', v)}
              />
              <FormInput 
                label="Senha Provisória" 
                type="password"
                placeholder="Mínimo 8 caracteres"
                required
                value={novaUnidade.gestorSenha}
                onChange={(v: string) => onChange('gestorSenha', v)}
              />
            </div>
          </div>

          <div className="md:col-span-2 pt-8">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-6 rounded-[2.5rem] font-black text-sm uppercase tracking-widest shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] hover:bg-blue-700 hover:scale-[1.02] active:scale-100 transition-all disabled:opacity-50 flex items-center justify-center gap-4"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  Provisionando Arquitetura...
                </>
              ) : (
                <>
                  <Globe size={24} />
                  Provisionar Escola e Vincular Gestor
                </>
              )}
            </button>
            <div className="flex items-center justify-center gap-2 mt-6 text-slate-400">
               <ShieldCheck size={14} />
               <p className="text-[10px] font-bold uppercase tracking-widest">Operação Auditada e Criptografada</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalNovaEscola;
