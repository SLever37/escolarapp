
import React from 'react';
import { 
  Users, Activity, AlertCircle, ShieldCheck, 
  Package, UserCheck, BarChart3, 
  Gavel, Globe, ShieldAlert,
  TrendingUp, History, Database
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { KpiCard, AlertItem, SectionHeader } from '../../componentes/DashboardUI';

const analyticsData = [
  { name: 'Jan', freq: 92, rend: 85 },
  { name: 'Fev', freq: 94, rend: 82 },
  { name: 'Mar', freq: 90, rend: 88 },
  { name: 'Abr', freq: 88, rend: 84 },
  { name: 'Mai', freq: 91, rend: 86 },
];

const DashboardGestor = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <ShieldCheck size={24} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Governança Estratégica Institucional</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Torre de Controle</h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">Análise macroscópica de rendimento, recursos e conformidade legal.</p>
        </div>
        <div className="flex gap-2">
           <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2 hover:bg-slate-800 transition-all">
             <Globe size={18} /> Relatório da Rede
           </button>
        </div>
      </header>

      {/* KPI Consolidados */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Alunos na Unidade" value="1.240" trend="+2.4%" icon={<Users />} color="blue" />
        <KpiCard title="Frequência Consolidada" value="92.4%" trend="-1.2%" icon={<Activity />} color="emerald" />
        <KpiCard title="Conformidade Legal" value="98%" trend="OK" icon={<Gavel />} color="violet" />
        <KpiCard title="Saúde do Sistema" value="100%" trend="ESTÁVEL" icon={<ShieldCheck />} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Gráfico de Desempenho Global */}
        <div className="lg:col-span-8 bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden group">
           <div className="absolute right-[-20px] top-[-20px] opacity-10 group-hover:scale-110 transition-transform">
              <TrendingUp size={200} />
           </div>
           <SectionHeader title="Desempenho x Frequência" subtitle="Indicadores agregados da Secretaria de Educação" icon={<BarChart3 size={18} />} />
           <div className="h-80 w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData}>
                <defs>
                  <linearGradient id="colorFreq" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} domain={[0, 100]} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} />
                <Area type="monotone" dataKey="freq" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorFreq)" />
                <Area type="monotone" dataKey="rend" stroke="#10b981" strokeWidth={4} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alertas Críticos por Setor */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-rose-50 border border-rose-100 p-8 rounded-[3rem]">
              <SectionHeader title="Alertas de Soberania" subtitle="Eventos que exigem decisão master" icon={<ShieldAlert size={18} className="text-rose-600" />} />
              <div className="space-y-4">
                 <AlertItem label="Matrícula Censo" desc="Prazo expira em 48h na Unidade" critical />
                 <AlertItem label="Evasão Crítica" desc="9º Ano B: -15% frequência" critical />
                 <AlertItem label="Backup Forense" desc="Falha de espelhamento na nuvem" critical />
              </div>
           </div>

           <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
              <SectionHeader title="Recursos Delegados" subtitle="Resumo Cozinha e Almoxarifado" icon={<Package size={18} />} />
              <div className="space-y-4">
                 <AlertItem label="Estoque Merenda" desc="Leite Tipo A: Reposição Pendente" />
                 <AlertItem label="Acervo Biblioteca" desc="5 Obras raras em atraso" />
              </div>
           </div>
        </div>
      </div>

      {/* Seção de Governança Digital */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         <ActionCard title="Auditoria de Acessos" desc="Rastreabilidade total conforme LGPD." icon={<History />} />
         <ActionCard title="Gestão de Atas" desc="Deliberações do Conselho Escolar." icon={<Gavel />} />
         <ActionCard title="Políticas de Backup" desc="Continuidade operacional garantida." icon={<Database />} />
      </div>
    </div>
  );
};

const ActionCard = ({ title, desc, icon }: any) => (
  <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] relative overflow-hidden group hover:bg-slate-800 transition-all cursor-pointer border border-white/5">
     <div className="absolute right-[-10%] top-[-10%] opacity-10 group-hover:scale-110 transition-transform">
        {React.cloneElement(icon, { size: 140 })}
     </div>
     <div className="relative z-10">
        <div className="bg-white/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
           {React.cloneElement(icon, { size: 24 })}
        </div>
        <h4 className="text-lg font-black tracking-tight leading-none mb-2">{title}</h4>
        <p className="text-slate-400 text-xs font-medium leading-relaxed">{desc}</p>
     </div>
  </div>
);

export default DashboardGestor;
