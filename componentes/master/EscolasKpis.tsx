import React from 'react';
import { Building2, Users, Activity, Database, ChevronRight } from 'lucide-react';

interface Props {
  total: number;
}

const KPICard = ({ label, valor, sub, icon, color }: any) => {
  const styles: any = {
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    sky: 'bg-sky-50 text-sky-600 border-sky-100'
  };
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-44 group hover:shadow-2xl transition-all cursor-pointer">
      <div className="flex items-start justify-between">
        <div className={`p-4 rounded-xl ${styles[color]} group-hover:scale-110 transition-transform duration-500`}>
          {/* Fix: Cast icon to React.ReactElement<any> to allow merging the 'size' prop in cloneElement */}
          {React.cloneElement(icon as React.ReactElement<any>, { size: 24 })}
        </div>
        <ChevronRight size={16} className="text-slate-300" />
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">{label}</p>
        <p className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{valor}</p>
        <p className="text-[9px] font-bold text-slate-400 uppercase mt-2">{sub}</p>
      </div>
    </div>
  );
};

const EscolasKpis: React.FC<Props> = ({ total }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    <KPICard label="Rede Federada" valor={total} sub="Escolas Online" icon={<Building2 />} color="indigo" />
    <KPICard label="Gestores Master" valor={total} sub="Supervisão Ativa" icon={<Users />} color="blue" />
    <KPICard label="Uptime Cluster" valor="99.9%" sub="Alta Disponibilidade" icon={<Activity />} color="emerald" />
    <KPICard label="Integridade DB" valor="SAFE" sub="Sincronizado" icon={<Database />} color="sky" />
  </div>
);

export default EscolasKpis;