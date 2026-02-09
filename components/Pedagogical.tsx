
import React from 'react';
import { BrainCircuit, Users, Target, ClipboardList, TrendingUp, AlertCircle, ChevronRight, FileText } from 'lucide-react';

const Pedagogical: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Núcleo Pedagógico</h2>
          <p className="text-slate-500">Gestão de turmas, indicadores e intervenções de aprendizagem.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PedagogicalCard 
          icon={<Users className="text-blue-600" />} 
          title="Gestão de Turmas" 
          desc="Monitoramento coletivo e distribuição de carga horária."
          count="12 Turmas"
        />
        <PedagogicalCard 
          icon={<Target className="text-emerald-600" />} 
          title="Planos de Ação" 
          desc="Intervenções individuais para alunos em risco de evasão."
          count="45 Ativos"
        />
        <PedagogicalCard 
          icon={<BrainCircuit className="text-violet-600" />} 
          title="Aprendizagem IA" 
          desc="Detecção de padrões e sugestão de reforço escolar."
          count="92% Evolução"
        />
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-800">Cronograma de Planejamento</h3>
          <button className="text-sm font-bold text-blue-600 hover:underline">Ver Calendário Completo</button>
        </div>
        <div className="p-8 space-y-4">
           {[
             { teacher: 'Marcos Vinícius', subject: 'Matemática', status: 'entregue', deadline: 'Hoje' },
             { teacher: 'Helena Souza', subject: 'Português', status: 'atrasado', deadline: 'Ontem' },
             { teacher: 'Ricardo Silva', subject: 'Geografia', status: 'pendente', deadline: '24 Abr' },
           ].map((item, i) => (
             <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100/80 transition-all group">
               <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                   <ClipboardList size={20} />
                 </div>
                 <div>
                   <p className="text-sm font-bold text-slate-800">{item.teacher}</p>
                   <p className="text-[10px] font-bold text-slate-400 uppercase">{item.subject}</p>
                 </div>
               </div>
               <div className="flex items-center gap-8">
                  <div className="flex flex-col items-end">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${item.status === 'entregue' ? 'text-emerald-500' : item.status === 'atrasado' ? 'text-rose-500' : 'text-amber-500'}`}>
                      {item.status}
                    </span>
                    <span className="text-xs text-slate-400">Prazo: {item.deadline}</span>
                  </div>
                  <ChevronRight size={20} className="text-slate-300 group-hover:text-blue-600" />
               </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

const PedagogicalCard = ({ icon, title, desc, count }: any) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group">
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 rounded-2xl bg-slate-50 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <span className="text-2xl font-black text-slate-800">{count}</span>
    </div>
    <h4 className="font-bold text-slate-800 mb-1">{title}</h4>
    <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
  </div>
);

export default Pedagogical;
