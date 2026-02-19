import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, Activity, Database, ChevronRight } from 'lucide-react';

interface Props {
  total: number;
}

const KPICard = ({ label, valor, sub, icon, color, onClick }: any) => {
  const styles: any = {
    indigo: 'bg-[#e0e7ff] text-[#4338ca] border-[#c7d2fe]',
    blue: 'bg-[#dbeafe] text-[#1d4ed8] border-[#bfdbfe]',
    emerald: 'bg-[#d1fae5] text-[#059669] border-[#a7f3d0]',
    sky: 'bg-[#e0f2fe] text-[#0369a1] border-[#bae6fd]'
  };
  
  return (
    <div 
      onClick={onClick}
      className="bg-white p-5 md:p-6 rounded-[1.5rem] border border-slate-200 shadow-sm flex flex-col justify-between min-h-[10.5rem] group hover:shadow-xl transition-all cursor-pointer relative"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 lg:p-4 rounded-2xl ${styles[color]} group-hover:scale-110 transition-transform duration-500`}>
          {React.cloneElement(icon as React.ReactElement<any>, { size: 22 })}
        </div>
        <ChevronRight size={18} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
      </div>
      <div className="space-y-1">
        <p className="text-[clamp(10px,1vw,12px)] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
        <p className="text-[clamp(26px,3.2vw,40px)] font-black text-[#0f172a] tracking-tighter leading-none">
          {valor}
        </p>
        <p className="text-[clamp(10px,1vw,12px)] font-black text-slate-400 uppercase tracking-widest mt-2">{sub}</p>
      </div>
    </div>
  );
};

const EscolasKpis: React.FC<Props> = ({ total }) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 2xl:gap-6">
      <KPICard 
        label="Rede Federada" 
        valor={total} 
        sub="Escolas Online" 
        icon={<Building2 />} 
        color="indigo" 
        onClick={() => navigate('/master/rede')}
      />
      <KPICard 
        label="Gestores Master" 
        valor={total} 
        sub="Supervisão Ativa" 
        icon={<Users />} 
        color="blue" 
        onClick={() => navigate('/master/gestores')}
      />
      <KPICard 
        label="Uptime Cluster" 
        valor="99.9%" 
        sub="Alta Disponibilidade" 
        icon={<Activity />} 
        color="emerald" 
        onClick={() => navigate('/master/resiliencia')}
      />
      <KPICard 
        label="Integridade DB" 
        valor="SAFE" 
        sub="Sincronizado" 
        icon={<Database />} 
        color="sky" 
        onClick={() => navigate('/master/integridade')}
      />
    </div>
  );
};

export default EscolasKpis;