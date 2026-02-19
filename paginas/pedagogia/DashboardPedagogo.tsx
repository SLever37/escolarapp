
import React from 'react';
import { 
  Users, Target, BrainCircuit, Accessibility, 
  Calendar, GraduationCap, AlertTriangle, 
  MessageSquare, History, Microscope
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { KpiCard, AlertItem, SectionHeader } from '../../componentes/DashboardUI';

const academicData = [
  { name: '8º B', media: 8.5 },
  { name: '9º A', media: 7.2 },
  { name: '7º C', media: 6.8 },
  { name: '6º B', media: 7.9 },
  { name: '8º A', media: 8.1 },
];

const DashboardPedagogo = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Coordenação Pedagógica</h2>
          <p className="text-slate-500 text-sm mt-1">Supervisão de rendimento, intervenções e jornada docente.</p>
        </div>
        <div className="flex gap-2">
           <button className="bg-blue-600 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-200">Novo Plano de Intervenção</button>
        </div>
      </header>

      {/* KPIs Pedagógicos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Alunos em Risco" value="12" trend="+3" icon={<Target />} color="rose" />
        <KpiCard title="AEE (PCD)" value="08" trend="ESTÁVEL" icon={<Accessibility />} color="blue" />
        <KpiCard title="Evolução Média" value="8.2" trend="+0.4" icon={<BrainCircuit />} color="emerald" />
        <KpiCard title="Planos de Aula" value="94%" trend="OK" icon={<GraduationCap />} color="violet" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Gráfico de Rendimento por Turma */}
        <div className="lg:col-span-8 bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
           <SectionHeader title="Média Acadêmica por Turma" subtitle="Rendimento consolidado do bimestre" icon={<Microscope size={18} />} />
           <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={academicData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} domain={[0, 10]} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="media" radius={[8, 8, 0, 0]} barSize={40}>
                   {academicData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.media < 7 ? '#ef4444' : '#10b981'} />
                   ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alertas Pedagógicos */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-blue-50 border border-blue-100 p-8 rounded-[3rem]">
              <SectionHeader title="Ações Urgentes" subtitle="Monitoramento de Alunos" icon={<AlertTriangle size={18} className="text-blue-600" />} />
              <div className="space-y-3">
                 <AlertItem label="Abandono Escolar" desc="Bruno O. (7º A): 7 faltas seguidas" critical />
                 <AlertItem label="Baixo Rendimento" desc="9º C: Média de Matemática < 5.0" />
                 <AlertItem label="AEE" desc="Adaptação curricular pendente: Ana B." />
              </div>
           </div>

           <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
              <SectionHeader title="Grade & Rotina" subtitle="Gestão de Horários" icon={<Calendar size={18} />} />
              <div className="space-y-3">
                 <AlertItem label="Conflito Grade" desc="Slot 02 (Seg): Prof. Ricardo duplicado" critical />
                 <AlertItem label="Substituição" desc="Prof. Helena ausente hoje" />
              </div>
           </div>
        </div>
      </div>

      {/* Navegação Pedagógica Rápida */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
         <NavCard label="Planos de Acompanhamento" icon={<History />} />
         <NavCard label="Comunicação Família" icon={<MessageSquare />} badge="5" />
         <NavCard label="Monitoramento de Risco" icon={<Target />} />
      </div>
    </div>
  );
};

const NavCard = ({ label, icon, badge }: any) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center justify-between hover:border-blue-300 transition-all cursor-pointer group">
     <div className="flex items-center gap-3">
        <div className="text-slate-400 group-hover:text-blue-600 transition-colors">{icon}</div>
        <span className="text-xs font-black text-slate-700 uppercase tracking-tighter">{label}</span>
     </div>
     {badge && <span className="bg-rose-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full">{badge}</span>}
  </div>
);

export default DashboardPedagogo;
