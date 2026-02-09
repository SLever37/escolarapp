
import React from 'react';
import { 
  Users, Activity, AlertCircle, ShieldCheck, 
  Database, Package, UserCheck, BarChart3, 
  Gavel, GraduationCap, Globe
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell, PieChart, Pie 
} from 'recharts';
import { KpiCard, AlertItem, SectionHeader } from '../components/DashboardUI';

const freqData = [
  { name: 'SEG', valor: 94 },
  { name: 'TER', valor: 96 },
  { name: 'QUA', valor: 92 },
  { name: 'QUI', valor: 88 },
  { name: 'SEX', valor: 91 },
];

const DashboardGestor = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Governança Estratégica</h2>
          <p className="text-slate-500 text-sm mt-1">Visão 360º da rede municipal e conformidade institucional.</p>
        </div>
        <div className="flex gap-2">
           <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg">Relatório Consolidado</button>
        </div>
      </header>

      {/* KPIs Estratégicos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Alunos Ativos" value="1.240" trend="+2.4%" icon={<Users />} color="blue" />
        <KpiCard title="Frequência Rede" value="92.4%" trend="-1.2%" icon={<Activity />} color="emerald" />
        <KpiCard title="Aderência Legal" value="98%" trend="OK" icon={<ShieldCheck />} color="violet" />
        <KpiCard title="Equipe Online" value="52/55" trend="+3" icon={<UserCheck />} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Gráfico de Performance */}
        <div className="lg:col-span-8 bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
           <SectionHeader title="Frequência Consolidada" subtitle="Dados diários de todas as unidades" icon={<BarChart3 size={18} />} />
           <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={freqData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} domain={[0, 100]} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="valor" fill="#3b82f6" radius={[8, 8, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alertas Administrativos & Legais */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-rose-50 border border-rose-100 p-8 rounded-[3rem]">
              <SectionHeader title="Riscos & Conformidade" subtitle="Alertas Críticos Secretaria" icon={<AlertCircle size={18} className="text-rose-600" />} />
              <div className="space-y-3">
                 <AlertItem label="Censo Escolar 2024" desc="Prazo expira em 48h" critical />
                 <AlertItem label="Bolsa Família" desc="12 Alunos sem frequência" critical />
                 <AlertItem label="Cópia de Segurança" desc="Backup falhou na Unid. 04" critical />
              </div>
           </div>

           <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
              <SectionHeader title="Recursos Escolares" subtitle="Inventário e Logística" icon={<Package size={18} />} />
              <div className="space-y-3">
                 <AlertItem label="Merenda Escolar" desc="Leite Tipo A: Estoque Baixo" />
                 <AlertItem label="Patrimônio" desc="5 Novos notebooks recebidos" />
              </div>
           </div>
        </div>
      </div>

      {/* Seção de Gestão de Rede */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-slate-900 text-white p-10 rounded-[3.5rem] relative overflow-hidden group">
            <div className="absolute right-[-10%] top-[-10%] opacity-10 group-hover:scale-110 transition-transform duration-700">
               <Globe size={240} />
            </div>
            <h4 className="text-2xl font-black mb-4 relative z-10">Gestão Multiescola</h4>
            <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8 relative z-10">
               Acesse o painel central da Secretaria de Educação para gerenciar unidades satélites e distribuir verbas municipais.
            </p>
            <button className="bg-blue-600 px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-500 transition-all relative z-10">Acessar Rede de Escolas</button>
         </div>

         <div className="bg-indigo-600 text-white p-10 rounded-[3.5rem] relative overflow-hidden group">
            <div className="absolute right-[-10%] top-[-10%] opacity-10 group-hover:scale-110 transition-transform duration-700">
               <Gavel size={240} />
            </div>
            <h4 className="text-2xl font-black mb-4 relative z-10">Atas & Deliberações</h4>
            <p className="text-indigo-100 text-sm font-medium leading-relaxed mb-8 relative z-10">
               Auditagem completa de decisões do Conselho Escolar. Registros com validade jurídica e assinatura digital.
            </p>
            <button className="bg-white text-indigo-600 px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-50 transition-all relative z-10">Ver Diário Oficial Interno</button>
         </div>
      </div>
    </div>
  );
};

export default DashboardGestor;
