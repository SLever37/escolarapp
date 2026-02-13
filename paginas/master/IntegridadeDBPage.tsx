import React from 'react';
import { Database, ShieldCheck, Lock, RefreshCw, AlertTriangle, FileCheck, HardDrive } from 'lucide-react';

const IntegridadeDBPage = () => {
  return (
    <div className="p-6 md:p-10 space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-sky-600 mb-2">
            <Database size={24} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Módulo de Sanidade de Dados</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Integridade DB</h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">Monitoramento de tabelas, chaves de criptografia e sincronismo master-replica.</p>
        </div>
        <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2">
          <RefreshCw size={18} className="animate-spin" /> Rodar Diagnóstico
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
           <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-10">
              <div className="flex items-center justify-between">
                 <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter leading-none">Saúde das Tabelas Core</h3>
                 <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl">100% Saudável</span>
              </div>

              <div className="space-y-4">
                 <TableHealthRow name="usuarios" rows="1,245" status="safe" last_sync="2 min atrás" />
                 <TableHealthRow name="unidades_escolares" rows="12" status="safe" last_sync="Justo agora" />
                 <TableHealthRow name="diarios_classe" rows="45,892" status="safe" last_sync="5 min atrás" />
                 <TableHealthRow name="alunos_pcd_sensivel" rows="142" status="encrypted" last_sync="1 min atrás" />
                 <TableHealthRow name="logs_auditoria_forense" rows="890,231" status="safe" last_sync="Sincronizando..." />
              </div>
           </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="bg-sky-600 p-8 rounded-[3rem] text-white shadow-xl shadow-sky-200 relative overflow-hidden group">
              <div className="absolute right-[-10%] top-[-10%] opacity-10 group-hover:scale-110 transition-transform duration-700">
                <Lock size={200} />
              </div>
              <h4 className="text-lg font-black mb-4 relative z-10">Criptografia AES-256</h4>
              <p className="text-sky-100 text-xs leading-relaxed mb-8 relative z-10">
                Todos os dados sensíveis de alunos e documentos legais são criptografados no nível da coluna antes da persistência.
              </p>
              <div className="bg-white/10 p-4 rounded-2xl border border-white/20 relative z-10">
                 <p className="text-[9px] font-black text-sky-200 uppercase tracking-widest mb-2">Chave Master Ativa</p>
                 <p className="text-sm font-mono truncate">********************A2B4</p>
              </div>
           </div>

           <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3 mb-4">
                 <FileCheck className="text-emerald-500" size={20} />
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Relatórios de Sanidade</h4>
              </div>
              <ReportCard name="Integridade de Referência" status="Pass" />
              <ReportCard name="Indexação Global" status="Pass" />
              <ReportCard name="Vulnerabilidades" status="Zero" />
           </div>
        </div>
      </div>
    </div>
  );
};

const TableHealthRow = ({ name, rows, status, last_sync }: any) => (
  <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl group hover:bg-white hover:shadow-md transition-all">
     <div className="flex items-center gap-4">
        <div className={`p-2.5 rounded-xl ${status === 'encrypted' ? 'bg-indigo-50 text-indigo-600' : 'bg-blue-50 text-blue-600'}`}>
           {status === 'encrypted' ? <Lock size={18} /> : <HardDrive size={18} />}
        </div>
        <div>
           <p className="text-sm font-black text-slate-800">public.{name}</p>
           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{rows} Registros</p>
        </div>
     </div>
     <div className="text-right">
        <span className={`text-[9px] font-black px-2 py-1 rounded-lg border uppercase tracking-widest ${status === 'encrypted' ? 'bg-indigo-50 border-indigo-100 text-indigo-600' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}`}>
           {status}
        </span>
        <p className="text-[8px] font-black text-slate-300 uppercase mt-2 tracking-tighter">{last_sync}</p>
     </div>
  </div>
);

const ReportCard = ({ name, status }: any) => (
  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
     <span className="text-xs font-bold text-slate-700">{name}</span>
     <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">{status}</span>
  </div>
);

export default IntegridadeDBPage;