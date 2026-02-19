
import React from 'react';
import { Brain, TrendingUp, ShieldAlert, Zap, Search, ChevronRight } from 'lucide-react';

const IAInsights = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="bg-gradient-to-r from-blue-700 to-indigo-800 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute right-[-5%] top-[-10%] opacity-10"><Brain size={300} /></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Zap className="text-amber-400 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80">Motor de Inteligência EscolarApp</span>
            </div>
            <h2 className="text-4xl font-black tracking-tighter leading-none">Insights Predictivos</h2>
            <p className="text-blue-100 text-sm mt-4 max-w-lg font-medium">Nossa IA analisa padrões de frequência, comportamento e notas para antecipar evasão e otimizar o planejamento pedagógico.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20">
             <p className="text-[10px] font-black uppercase tracking-widest mb-2">Status do Processamento</p>
             <div className="flex items-center gap-3">
               <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
               <span className="text-lg font-bold">Otimizado (V. 2.4)</span>
             </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <InsightCard 
          title="Risco de Evasão" 
          prob="8.5% (Reduzindo)" 
          desc="Identificamos 12 alunos com padrões de falta intermitente. Recomenda-se contato proativo via Portal da Família." 
          color="blue"
        />
        <InsightCard 
          title="Tendência Pedagógica" 
          prob="Alta Performance" 
          desc="O 8º Ano B superou em 15% as metas de Matemática. Padrão relacionado ao novo método aplicado pelo Prof. Marcos." 
          color="emerald"
        />
        <InsightCard 
          title="Alerta Estratégico" 
          prob="Crítico (Unidade 2)" 
          desc="Detecção de queda sistêmica na frequência de professores nas sextas-feiras (Turno Noite)." 
          color="rose"
        />
      </div>

      <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
         <div className="flex items-center justify-between mb-10">
           <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Exploração de Padrões</h3>
           <div className="relative">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
             <input type="text" placeholder="Pergunte à IA..." className="pl-12 pr-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none w-80" />
           </div>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PatternItem label="Alunos Bolsa Família x Frequência" desc="Correlação positiva de 0.82" />
            <PatternItem label="Uso da Biblioteca x Médias Finais" desc="Correlação moderada detectada" />
            <PatternItem label="Intervenções Pedagógicas x Retenção" desc="Eficácia de 94% nas ações individuais" />
            <PatternItem label="Consumo de Merenda x Engajamento" desc="Coleta de dados em andamento" />
         </div>
      </div>
    </div>
  );
};

const InsightCard = ({ title, prob, desc, color }: any) => {
  const styles: any = {
    blue: 'border-blue-500 text-blue-600',
    emerald: 'border-emerald-500 text-emerald-600',
    rose: 'border-rose-500 text-rose-600'
  };
  return (
    <div className={`bg-white p-8 rounded-[2.5rem] border-l-8 ${styles[color]} shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between`}>
      <div>
        <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">{title}</h4>
        <p className="text-xl font-black text-slate-900 leading-tight">{prob}</p>
        <p className="text-xs text-slate-500 mt-4 leading-relaxed font-medium">{desc}</p>
      </div>
      <button className="mt-8 flex items-center justify-between text-[10px] font-black uppercase tracking-widest hover:translate-x-1 transition-transform">
        <span>Explorar Detalhes</span>
        <ChevronRight size={14} />
      </button>
    </div>
  );
};

const PatternItem = ({ label, desc }: any) => (
  <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-white hover:shadow-md transition-all">
    <span className="text-xs font-bold text-slate-700 uppercase tracking-tighter">{label}</span>
    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{desc}</span>
  </div>
);

export default IAInsights;
