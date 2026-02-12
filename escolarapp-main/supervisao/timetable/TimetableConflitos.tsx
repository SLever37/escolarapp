
import React from 'react';
import { AlertTriangle, ShieldAlert, ChevronRight, CheckCircle, Info, RefreshCcw, Search } from 'lucide-react';

/**
 * PÁGINA: Diagnóstico de Conflitos
 * Finalidade: Listar problemas de alocação e sugerir correções.
 */
const TimetableConflitos = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <ShieldAlert className="text-rose-500" /> Diagnóstico de Conflitos
          </h2>
          <p className="text-slate-500 text-sm">Detecção e inteligência corretiva para a grade escolar.</p>
        </div>
        <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase flex items-center gap-2 hover:bg-slate-800 transition-all">
          <RefreshCcw size={16} /> Revalidar Grade
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <ConflictStat label="Sobrecarga Docente" value="02" color="rose" />
        <ConflictStat label="Turmas x Horário" value="00" color="emerald" />
        <ConflictStat label="Falta de Espaço" value="01" color="amber" />
        <ConflictStat label="Janelas Excessivas" value="05" color="blue" />
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
           <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lista de Inconsistências Detectadas</h3>
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
             <input type="text" placeholder="Filtrar por professor ou turma..." className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none w-64 shadow-sm" />
           </div>
        </div>
        <div className="divide-y divide-slate-100">
           <ConflictItem 
            type="ALTA" 
            title="Professor Duplicado" 
            desc="Prof. Ricardo Santos alocado simultaneamente no 8º B e 9º A (Segunda, 07:45)." 
            suggestion="Mover 9º A para Terça, 3º Horário."
           />
           <ConflictItem 
            type="MEDIA" 
            title="Conflito de Sala Especial" 
            desc="Laboratório de Ciências requisitado por duas turmas diferentes simultaneamente." 
            suggestion="Priorizar 9º Ano conforme regra de conclusão de ciclo."
           />
           <ConflictItem 
            type="BAIXA" 
            title="Janela Indesejada" 
            desc="Prof. Helena tem 100min vagos entre as aulas de Quarta-feira." 
            suggestion="Antecipar aula de Português para preencher o slot vazio."
           />
        </div>
      </div>
    </div>
  );
};

const ConflictStat = ({ label, value, color }: any) => {
  const styles: any = {
    rose: 'text-rose-600 bg-rose-50 border-rose-100',
    emerald: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    amber: 'text-amber-600 bg-amber-50 border-amber-100',
    blue: 'text-blue-600 bg-blue-50 border-blue-100'
  };
  return (
    <div className={`p-6 rounded-[2rem] border ${styles[color]} shadow-sm`}>
      <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">{label}</p>
      <p className="text-3xl font-black">{value}</p>
    </div>
  );
};

const ConflictItem = ({ type, title, desc, suggestion }: any) => {
  const typeStyles: any = {
    ALTA: 'bg-rose-500 text-white',
    MEDIA: 'bg-amber-500 text-white',
    BAIXA: 'bg-blue-500 text-white'
  };
  return (
    <div className="p-8 flex flex-col md:flex-row gap-6 hover:bg-slate-50 transition-all group">
      <div className={`w-16 h-16 rounded-[2rem] flex items-center justify-center shrink-0 shadow-lg ${typeStyles[type]}`}>
        <AlertTriangle size={32} />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
           <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg border ${type === 'ALTA' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>{type} PRIORIDADE</span>
           <h4 className="text-lg font-black text-slate-800">{title}</h4>
        </div>
        <p className="text-sm text-slate-500 leading-relaxed font-medium">{desc}</p>
        <div className="mt-4 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 flex items-start gap-3">
           <Info size={16} className="text-emerald-600 mt-0.5" />
           <p className="text-[11px] font-bold text-emerald-800 leading-snug">Sugestão Corretiva: <span className="font-medium">{suggestion}</span></p>
        </div>
      </div>
      <div className="flex items-center">
         <button className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 hover:shadow-lg transition-all">
            <ChevronRight size={24} />
         </button>
      </div>
    </div>
  );
};

export default TimetableConflitos;
