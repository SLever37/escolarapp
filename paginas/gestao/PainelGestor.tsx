
import React from 'react';
import { Users, Activity, Gavel, ShieldCheck, BarChart3, Package, AlertCircle, Calendar, FileText, ClipboardList } from 'lucide-react';
import { KpiCard, AlertItem, SectionHeader } from '../../componentes/DashboardUI';

const PainelGestor = () => {
  return (
    <div className="p-4 lg:p-10 space-y-6 lg:space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-blue-600 mb-1 lg:mb-2">
            <ShieldCheck size={20} className="lg:w-6 lg:h-6" />
            <span className="text-[8px] lg:text-[10px] font-black uppercase tracking-[0.3em] truncate">Gestão Institucional Plena</span>
          </div>
          <h2 className="text-2xl lg:text-4xl font-black text-slate-900 tracking-tighter truncate">Torre de Controle</h2>
          <p className="text-slate-500 text-xs lg:text-sm mt-1 font-medium leading-relaxed">Consolidado de secretaria, pedagogia e auditoria.</p>
        </div>
      </header>

      {/* Grid KPI Adaptativo: 2 colunas em mobile, 4 em desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        <KpiCard title="Alunos" value="1.240" trend="+2.4%" icon={<Users />} color="blue" />
        <KpiCard title="Frequência" value="92.4%" trend="-1.2%" icon={<Activity />} color="emerald" />
        <KpiCard title="Legal" value="98%" trend="OK" icon={<Gavel />} color="violet" />
        <KpiCard title="Rede" value="Segura" trend="Uptime" icon={<ShieldCheck />} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="lg:col-span-8 bg-white p-5 lg:p-8 rounded-2xl lg:rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
           <SectionHeader title="Visão de Operações" subtitle="Departamentos em tempo real" icon={<BarChart3 size={18} />} />
           
           {/* Grid de Atalhos: 1 coluna mobile, 2 colunas desktop */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4 mt-2 lg:mt-6">
              <ModuleShortcut label="Pedagogia" icon={<ClipboardList className="text-violet-500" />} info="94% Planos entregues" />
              <ModuleShortcut label="Secretaria" icon={<FileText className="text-blue-500" />} info="12 Matrículas pendentes" />
              <ModuleShortcut label="Logística" icon={<Package className="text-amber-500" />} info="Estoque Merenda OK" />
              <ModuleShortcut label="Grade Horária" icon={<Calendar className="text-emerald-500" />} info="Sem conflitos ativos" />
           </div>
        </div>

        <div className="lg:col-span-4 space-y-4 lg:space-y-6">
           <div className="bg-rose-50 border border-rose-100 p-6 lg:p-8 rounded-2xl lg:rounded-[3rem]">
              <SectionHeader title="Alertas" subtitle="Críticos" icon={<AlertCircle size={18} className="text-rose-600" />} />
              <div className="space-y-2 lg:space-y-4">
                 <AlertItem label="Censo Escolar" desc="Expira em 48h" critical />
                 <AlertItem label="Frequência" desc="Queda no 9º B" critical />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const ModuleShortcut = ({ label, icon, info }: any) => (
  <div className="p-4 lg:p-6 bg-slate-50 border border-slate-100 rounded-xl lg:rounded-3xl flex items-center justify-between hover:bg-white hover:shadow-xl transition-all cursor-pointer group min-w-0">
    <div className="flex items-center gap-3 lg:gap-4 min-w-0">
       <div className="p-2 lg:p-3 bg-white rounded-lg lg:rounded-2xl shadow-sm border border-slate-100 group-hover:scale-110 transition-transform shrink-0">{icon}</div>
       <div className="min-w-0">
          <p className="text-xs lg:text-sm font-black text-slate-800 truncate">{label}</p>
          <p className="text-[8px] lg:text-[10px] font-bold text-slate-400 uppercase mt-0.5 lg:mt-1 truncate">{info}</p>
       </div>
    </div>
  </div>
);

export default PainelGestor;
