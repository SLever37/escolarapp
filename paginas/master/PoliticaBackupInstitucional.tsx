import React from 'react';
import { Database, ShieldCheck, Clock, Download, FileCheck, AlertTriangle, RotateCcw, FileText, History } from 'lucide-react';

const PoliticaBackupInstitucional = () => {
  return (
    <div className="p-4 md:p-10 space-y-6 animate-in fade-in duration-700">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Database className="text-blue-600" /> Política de Backup
          </h2>
          <p className="text-slate-500 text-sm">Governança de retenção, exportação e recuperação parcial.</p>
        </div>
        <button className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black text-xs shadow-lg flex items-center gap-2">
          <FileCheck size={18} /> Exportar Auditoria MEC
        </button>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
           <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Políticas de Retenção Ativas</h3>
              <div className="space-y-4">
                 <RetentionPolicy label="Diários de Classe" duration="10 Anos" status="CRIPTO" />
                 <RetentionPolicy label="Históricos Escolares" duration="PERMANENTE" status="REDE_NACIONAL" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
const RetentionPolicy = ({ label, duration, status }: any) => (
  <div className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-white hover:shadow-md transition-all cursor-pointer group">
    <div className="flex flex-col">
       <span className="text-sm font-black text-slate-800">{label}</span>
       <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest mt-0.5">{status}</span>
    </div>
    <div className="text-right">
       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Retenção</span>
       <p className="text-sm font-black text-slate-700">{duration}</p>
    </div>
  </div>
);
export default PoliticaBackupInstitucional;