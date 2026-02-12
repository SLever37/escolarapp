
import React from 'react';
import { Server, Database, ShieldCheck, RefreshCw, HardDrive, Globe, AlertTriangle } from 'lucide-react';

const ResilienciaSistema = () => {
  return (
    <div className="p-6 md:p-10 space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
            <Server className="text-indigo-600" /> Resiliência & Core
          </h2>
          <p className="text-slate-500 text-sm mt-1">Status de infraestrutura global, replicação de dados e integridade do cluster.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
           <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-10">
                 <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter leading-none">Global Replicas</h3>
                 <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-xl text-[10px] font-black border border-emerald-100">SYNCED</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <ReplicaCard region="São Paulo (SA-EAST-1)" status="Primary" latency="12ms" />
                 <ReplicaCard region="Virginia (US-EAST-1)" status="Standby" latency="145ms" />
              </div>
           </div>

           <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Snapshot History</h3>
              <div className="space-y-4">
                 <SnapshotRow date="Hoje, 03:00 AM" size="2.4 GB" status="success" />
                 <SnapshotRow date="Ontem, 03:00 AM" size="2.3 GB" status="success" />
                 <SnapshotRow date="21 Abr, 03:00 AM" size="2.3 GB" status="warning" />
              </div>
           </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="bg-slate-900 p-8 rounded-[3rem] text-white overflow-hidden relative">
              <h4 className="text-lg font-black mb-4 relative z-10">Recuperação de Desastre</h4>
              <p className="text-slate-400 text-xs mb-8 leading-relaxed">Em caso de falha crítica regional, o sistema fará o chaveamento automático (failover) em menos de 30 segundos.</p>
              <button className="w-full bg-rose-600 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-900/40 hover:bg-rose-500 transition-all">Manual Failover Test</button>
           </div>

           <div className="bg-indigo-50 border border-indigo-100 p-8 rounded-[3rem]">
              <div className="flex items-center gap-3 mb-4 text-indigo-700">
                 <ShieldCheck size={24} />
                 <h4 className="text-sm font-black uppercase tracking-widest">Integridade</h4>
              </div>
              <p className="text-xs text-indigo-800 font-medium leading-relaxed">Verificação de integridade de checksum realizada a cada 60 minutos em todos os volumes de dados de todas as unidades.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

const ReplicaCard = ({ region, status, latency }: any) => (
  <div className="p-6 bg-slate-50 border border-slate-100 rounded-[2rem] hover:bg-white hover:shadow-xl transition-all">
     <div className="flex items-center gap-4 mb-4">
        <Globe className="text-blue-500" size={20} />
        <p className="text-sm font-black text-slate-800 leading-none">{region}</p>
     </div>
     <div className="flex justify-between items-center pt-4 border-t border-slate-200/50">
        <span className="text-[10px] font-bold text-slate-400 uppercase">{status}</span>
        <span className="text-[10px] font-black text-blue-600">{latency}</span>
     </div>
  </div>
);

const SnapshotRow = ({ date, size, status }: any) => (
  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
     <div className="flex items-center gap-4">
        <HardDrive size={18} className="text-slate-400" />
        <div>
           <p className="text-xs font-bold text-slate-800">{date}</p>
           <p className="text-[9px] font-black text-slate-400 uppercase">{size}</p>
        </div>
     </div>
     {status === 'success' ? <ShieldCheck className="text-emerald-500" size={16} /> : <AlertTriangle className="text-amber-500" size={16} />}
  </div>
);

export default ResilienciaSistema;
