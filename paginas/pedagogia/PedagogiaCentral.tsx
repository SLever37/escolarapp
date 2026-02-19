
import React from 'react';
import { 
  Users, Target, ClipboardList, BrainCircuit, 
  ChevronRight, AlertCircle, TrendingUp, Filter 
} from 'lucide-react';

const PedagogiaCentral = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 leading-none">Pedagogia Central</h2>
          <p className="text-slate-500 text-sm mt-1">Gestão de turmas, planejamento coletivo e monitoramento individual.</p>
        </div>
        <div className="flex gap-2">
           <button className="bg-blue-600 text-white px-5 py-2.5 rounded-2xl text-xs font-bold shadow-lg shadow-blue-200 uppercase tracking-widest">Novo Planejamento</button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <StatCard icon={<Users className="text-blue-600" />} label="Gestão de Turmas" count="12" desc="Turmas monitoradas" />
        <StatCard icon={<Target className="text-emerald-600" />} label="Intervenções" count="45" desc="Ações individuais ativas" />
        <StatCard icon={<BrainCircuit className="text-violet-600" />} label="Evolução Média" count="92%" desc="Meta de aprendizagem" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pedagogia 1 - Coletivo */}
        <div className="lg:col-span-7 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
           <div className="flex items-center justify-between mb-8">
             <h3 className="text-lg font-black text-slate-800 uppercase tracking-tighter">Cronograma Coletivo</h3>
             <div className="flex gap-2">
               <button className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 transition-all"><Filter size={16} /></button>
             </div>
           </div>
           
           <div className="space-y-4">
              {[
                { turma: '8º Ano B', subject: 'Matemática', teacher: 'Helena Souza', status: 'entregue', deadline: 'Hoje' },
                { turma: '7º Ano A', subject: 'História', teacher: 'Marcos Ramos', status: 'atrasado', deadline: 'Ontem' },
                { turma: '9º Ano C', subject: 'Ciências', teacher: 'Paula Silva', status: 'pendente', deadline: '24/04' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md transition-all group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400"><ClipboardList size={20} /></div>
                    <div>
                      <p className="text-sm font-black text-slate-800">{item.turma}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.subject} • {item.teacher}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                       <span className={`text-[10px] font-black uppercase tracking-widest ${item.status === 'entregue' ? 'text-emerald-500' : item.status === 'atrasado' ? 'text-rose-500' : 'text-amber-500'}`}>
                         {item.status}
                       </span>
                       <p className="text-[9px] font-bold text-slate-400">Prazo: {item.deadline}</p>
                    </div>
                    <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
                  </div>
                </div>
              ))}
           </div>
        </div>

        {/* Pedagogia 2 - Alertas Individuais */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-rose-50 border border-rose-100 p-8 rounded-[2.5rem]">
             <div className="flex items-center gap-3 mb-6">
               <AlertCircle className="text-rose-600" />
               <h3 className="text-lg font-black text-rose-900 uppercase tracking-tighter">Acompanhamento Crítico</h3>
             </div>
             <div className="space-y-3">
                <RiskStudent name="Bruno Oliveira" grade="7º Ano A" reason="Frequência (75%)" />
                <RiskStudent name="Carla Souza" grade="9º Ano C" reason="Queda brusca notas" />
                <RiskStudent name="Lucas Mendes" grade="6º Ano B" reason="Dificuldade relatada" />
             </div>
             <button className="mt-8 w-full bg-white text-rose-600 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-rose-200 shadow-sm">Ver Todos em Risco</button>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
             <div className="flex items-center gap-3 mb-6">
               <TrendingUp className="text-emerald-600" />
               <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Indicadores de Evolução</h3>
             </div>
             <p className="text-xs text-slate-500 leading-relaxed font-medium">Observamos um crescimento de 12% na taxa de entrega de planos pedagógicos este mês. Foco agora na integração escola-família via portal.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, count, desc }: any) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-between group cursor-pointer hover:shadow-lg transition-all">
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 bg-slate-50 rounded-2xl group-hover:scale-110 transition-transform">{icon}</div>
      <span className="text-2xl font-black text-slate-800 tracking-tighter">{count}</span>
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-xs font-bold text-slate-500 uppercase">{desc}</p>
    </div>
  </div>
);

const RiskStudent = ({ name, grade, reason }: any) => (
  <div className="flex items-center justify-between p-3 bg-white/60 rounded-2xl border border-transparent hover:border-rose-200 transition-all cursor-pointer">
    <div>
      <p className="text-sm font-black text-slate-800 leading-none">{name}</p>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{grade}</p>
    </div>
    <span className="text-[9px] font-black text-rose-500 uppercase tracking-tighter">{reason}</span>
  </div>
);

export default PedagogiaCentral;
