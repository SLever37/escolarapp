
import React from 'react';
import { Building2, Users, Activity, Database, ChevronRight } from 'lucide-react';

interface Props {
  totalEscolas: number;
}

const KPICardMaster = ({ label, valor, sub, icone, cor }: any) => {
  const styles: any = {
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    sky: 'bg-sky-50 text-sky-600 border-sky-100'
  };
  return (
    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col justify-between h-44 group hover:shadow-2xl hover:shadow-slate-200 transition-all cursor-pointer">
      <div className="flex items-start justify-between">
        <div className={`p-4 rounded-2xl ${styles[cor]} group-hover:scale-110 transition-transform duration-500`}>
          {React.cloneElement(icone, { size: 24 })}
        </div>
        <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-600 transition-all" />
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">{label}</p>
        <p className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{valor}</p>
        <p className="text-[9px] font-bold text-slate-400 uppercase mt-2">{sub}</p>
      </div>
    </div>
  );
};

const EscolasKpis: React.FC<Props> = ({ totalEscolas }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <KPICardMaster label="Rede Federada" valor={totalEscolas} sub="Escolas Online" icon={<Building2 />} cor="indigo" />
      <KPICardMaster label="Gestores Master" valor={totalEscolas} sub="Supervisão Ativa" icon={<Users />} cor="blue" />
      <KPICardMaster label="Uptime Cluster" valor="99.9%" sub="Alta Disponibilidade" icon={<Activity />} cor="emerald" />
      <KPICardMaster label="Integridade DB" valor="SAFE" sub="Snapshot Sync" icon={<Database />} cor="sky" />
    </div>
  );
};

export default EscolasKpis;
