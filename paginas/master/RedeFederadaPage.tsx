import React from 'react';
import { Network, Server, Globe, Activity, ShieldCheck, Database } from 'lucide-react';

const RedeFederadaPage = () => {
  return (
    <div className="p-6 md:p-10 space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 mb-2">
            <Network size={24} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Módulo de Soberania de Rede</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Rede Federada</h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">Monitoramento técnico de todas as instâncias escolares conectadas.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-10">
           <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Status de Instâncias</h3>
              <div className="flex gap-2">
                 <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black border border-emerald-100 uppercase">Todas Online</span>
              </div>
           </div>

           <div className="space-y-4">
              <NetworkRow name="E.M. Presidente Vargas" ip="189.10.42.1" status="stable" latency="12ms" />
              <NetworkRow name="C.E. Arco-Íris" ip="189.10.42.5" status="stable" latency="14ms" />
              <NetworkRow name="E.M. Dom Pedro II" ip="189.10.42.12" status="warning" latency="156ms" />
              <NetworkRow name="E.M. Rural Santa Maria" ip="189.10.42.20" status="stable" latency="28ms" />
           </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute right-[-10%] top-[-10%] opacity-10 group-hover:scale-110 transition-transform duration-700">
                <Globe size={200} />
              </div>
              <h4 className="text-lg font-black mb-4 relative z-10">Topologia Global</h4>
              <p className="text-slate-400 text-xs leading-relaxed mb-8 relative z-10">
                Suas escolas estão distribuídas em 2 regiões redundantes para garantir 100% de disponibilidade.
              </p>
              <div className="space-y-4 relative z-10">
                 <RegionStat label="São Paulo (Local)" status="Primary" load="42%" />
                 <RegionStat label="Virginia (Backup)" status="Standby" load="05%" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const NetworkRow = ({ name, ip, status, latency }: any) => (
  <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between hover:bg-white hover:shadow-lg transition-all cursor-pointer group">
     <div className="flex items-center gap-4">
        <div className={`w-3 h-3 rounded-full ${status === 'stable' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500 animate-bounce'}`} />
        <div>
           <p className="text-sm font-black text-slate-800">{name}</p>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">IP: {ip}</p>
        </div>
     </div>
     <div className="text-right">
        <p className="text-sm font-black text-slate-700">{latency}</p>
        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-1">Latência</p>
     </div>
  </div>
);

const RegionStat = ({ label, status, load }: any) => (
  <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center justify-between">
     <div>
        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{label}</p>
        <p className="text-xs font-bold text-slate-300">{status}</p>
     </div>
     <div className="text-right">
        <p className="text-sm font-black text-white">{load}</p>
        <p className="text-[8px] font-black text-slate-500 uppercase">Carga</p>
     </div>
  </div>
);

export default RedeFederadaPage;