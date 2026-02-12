
import React from 'react';
import { AlertCircle, TrendingDown, Clock, UserX, MessageCircle, ArrowRight, ShieldAlert } from 'lucide-react';

/**
 * COMPONENTE: AlunosEmRisco
 * Finalidade: Gestão de Alerta Precoce (Early Warning System).
 * Foco: Prevenção de abandono e recuperação de aprendizagem.
 */
const AlunosEmRisco = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700 p-8">
      <header className="bg-rose-600 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute right-[-5%] top-[-10%] opacity-10 rotate-12"><ShieldAlert size={300} /></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="text-rose-200 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80">Protocolo de Prevenção de Evasão</span>
            </div>
            <h2 className="text-4xl font-black tracking-tighter leading-none">Atenção Prioritária</h2>
            <p className="text-rose-100 text-sm mt-4 max-w-lg font-medium opacity-90">Detectamos padrões de ausência e queda de rendimento que requerem intervenção imediata da coordenação pedagógica.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20">
             <p className="text-[10px] font-black uppercase tracking-widest mb-2">Total sob Monitoramento</p>
             <div className="flex items-center gap-3">
               <span className="text-3xl font-black">45 Alunos</span>
             </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-4">
           <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Lista de Intervenção Urgente</h3>
           <RiskCard name="Bruno Oliveira" grade="7º Ano A" reason="Frequência Crítica (68%)" days="5 dias sem contato" />
           <RiskCard name="Carla Souza" grade="9º Ano C" reason="Queda brusca rendimento Exatas" days="Monitoramento 2 semanas" />
           <RiskCard name="Lucas Mendes" grade="6º Ano B" reason="Dificuldade socioemocional relatada" days="Novo alerta hoje" />
           <RiskCard name="Fernanda Lima" grade="8º Ano B" reason="Inconsistência documental / Bolsa Família" days="Pendente Secretaria" />
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6">Próximos Passos Sugeridos</h4>
              <div className="space-y-4">
                 <ActionItem icon={<MessageCircle size={16} />} label="Convocar Responsável" desc="Agendar reunião via Portal Família" />
                 <ActionItem icon={<TrendingDown size={16} />} label="Avaliação Diagnóstica" desc="Verificar lacunas de aprendizagem" />
                 <ActionItem icon={<UserX size={16} />} label="Busca Ativa" desc="Protocolo municipal de visita domiciliar" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const RiskCard = ({ name, grade, reason, days }: any) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center justify-between group hover:shadow-xl transition-all cursor-pointer">
    <div className="flex items-center gap-6">
       <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-black text-xl">
         {name[0]}
       </div>
       <div>
         <p className="text-lg font-black text-slate-900 leading-none">{name}</p>
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{grade} • {reason}</p>
       </div>
    </div>
    <div className="flex items-center gap-8">
       <div className="text-right">
          <p className="text-xs font-bold text-rose-500">{days}</p>
          <p className="text-[9px] font-black text-slate-300 uppercase mt-1">Status: Alerta Máximo</p>
       </div>
       <ArrowRight size={20} className="text-slate-300 group-hover:translate-x-2 group-hover:text-rose-600 transition-all" />
    </div>
  </div>
);

const ActionItem = ({ icon, label, desc }: any) => (
  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3 hover:bg-white hover:shadow-md transition-all cursor-pointer">
    <div className="text-blue-600 mt-1">{icon}</div>
    <div>
      <p className="text-xs font-black text-slate-800 uppercase tracking-tighter">{label}</p>
      <p className="text-[10px] text-slate-500 font-medium leading-relaxed mt-1">{desc}</p>
    </div>
  </div>
);

export default AlunosEmRisco;
