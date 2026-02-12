
import React from 'react';
import { Target, UserCheck, Search, Filter, Plus, ChevronRight, BrainCircuit, Calendar } from 'lucide-react';

/**
 * PÁGINA: Planos de Acompanhamento
 * Finalidade: Gestão individualizada de evolução acadêmica.
 */
const PlanosDeAcompanhamento = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Target className="text-emerald-600" /> Planos de Acompanhamento
          </h2>
          <p className="text-slate-500 text-sm">Intervenções pedagógicas e metas de aprendizagem personalizadas.</p>
        </div>
        <button className="bg-emerald-600 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-200 flex items-center gap-2">
          <Plus size={16} /> Novo Plano de Intervenção
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SummaryCard label="Planos Ativos" count="45" color="blue" />
        <SummaryCard label="Metas Atingidas" count="12" color="emerald" />
        <SummaryCard label="Atrasados" count="03" color="rose" />
        <SummaryCard label="Monitoramento IA" count="15" color="violet" />
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div className="flex gap-2">
              <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase text-slate-500 hover:bg-slate-50">Todos</button>
              <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase text-slate-500 hover:bg-slate-50">Em Risco</button>
           </div>
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input type="text" placeholder="Buscar aluno..." className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none w-64" />
           </div>
        </div>
        <div className="divide-y divide-slate-100">
           <PlanoRow 
            name="Bruno Oliveira" 
            grade="7º Ano A" 
            goal="Recuperação de Média: Matemática" 
            status="Em Progresso" 
            progress={65} 
            priority="Alta"
           />
           <PlanoRow 
            name="Carla Souza" 
            grade="9º Ano C" 
            goal="Intervenção Socioemocional" 
            status="Atrasado" 
            progress={20} 
            priority="Crítica"
           />
           <PlanoRow 
            name="Lucas Mendes" 
            grade="6º Ano B" 
            goal="Adaptação Curricular (Inclusão)" 
            status="Em Dia" 
            progress={90} 
            priority="Média"
           />
        </div>
      </div>
    </div>
  );
};

const SummaryCard = ({ label, count, color }: any) => {
  const styles: any = {
    blue: 'border-blue-500 text-blue-600 bg-blue-50/50',
    emerald: 'border-emerald-500 text-emerald-600 bg-emerald-50/50',
    rose: 'border-rose-500 text-rose-600 bg-rose-50/50',
    violet: 'border-violet-500 text-violet-600 bg-violet-50/50'
  };
  return (
    <div className={`bg-white p-5 rounded-3xl border-l-4 ${styles[color]} shadow-sm flex flex-col justify-between h-28`}>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">{label}</p>
      <p className="text-2xl font-black text-slate-900 leading-none">{count}</p>
    </div>
  );
};

const PlanoRow = ({ name, grade, goal, status, progress, priority }: any) => {
  return (
    <div className="p-6 flex flex-col md:flex-row items-center gap-6 hover:bg-slate-50 transition-all cursor-pointer group">
       <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-400 border border-slate-200">
            {name[0]}
          </div>
          <div className="min-w-0 flex-1">
             <div className="flex items-center gap-2 mb-1">
                <h4 className="text-sm font-black text-slate-800 truncate">{name}</h4>
                <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border uppercase tracking-widest ${priority === 'Crítica' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>{priority}</span>
             </div>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{grade} • {goal}</p>
          </div>
       </div>

       <div className="flex items-center gap-8 shrink-0">
          <div className="flex flex-col items-center">
             <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden mb-1.5">
                <div 
                  className={`h-full transition-all duration-1000 ${progress > 70 ? 'bg-emerald-500' : progress > 30 ? 'bg-blue-500' : 'bg-rose-500'}`} 
                  style={{ width: `${progress}%` }} 
                />
             </div>
             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{progress}% Evolução</span>
          </div>
          <div className="text-right w-24">
             <span className={`text-[9px] font-black uppercase tracking-widest ${status === 'Em Dia' ? 'text-emerald-500' : status === 'Atrasado' ? 'text-rose-500' : 'text-blue-500'}`}>{status}</span>
          </div>
          <ChevronRight size={18} className="text-slate-300 group-hover:text-emerald-600 transition-colors" />
       </div>
    </div>
  );
};

export default PlanosDeAcompanhamento;
