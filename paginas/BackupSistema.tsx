
import React from 'react';
import { Database, ShieldCheck, Download, History, RotateCcw, AlertTriangle, CheckCircle2 } from 'lucide-react';

/**
 * PÁGINA: BACKUP E RESILIÊNCIA (Módulo 15)
 * Finalidade: Garantir a integridade permanente dos dados históricos dos alunos.
 */
const BackupSistema = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 leading-none">Resiliência & Backup</h2>
          <p className="text-slate-500 text-sm mt-1">Integridade histórica e continuidade operacional do sistema.</p>
        </div>
        <div className="flex gap-2">
           <button className="bg-blue-600 text-white px-5 py-2.5 rounded-2xl text-xs font-bold shadow-lg shadow-blue-200 flex items-center gap-2">
             <Database size={16} /> Backup Manual Agora
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Status do Backup Automático */}
        <div className="lg:col-span-8 bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
           <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-[1.5rem] bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-200">
                    <ShieldCheck size={24} />
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-slate-800">Sistema Integra</h3>
                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1">Backup Automático: Ativo</p>
                 </div>
              </div>
              <div className="text-right">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Última Sincronização</p>
                 <p className="text-sm font-black text-slate-800">Hoje às 03:00 AM</p>
              </div>
           </div>

           <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Histórico de Restauração</h4>
              <BackupRecord date="21/04/2024" size="240MB" status="success" />
              <BackupRecord date="20/04/2024" size="238MB" status="success" />
              <BackupRecord date="19/04/2024" size="238MB" status="success" />
              <BackupRecord date="18/04/2024" size="235MB" status="warning" />
           </div>
        </div>

        {/* Informações Institucionais */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-slate-900 p-8 rounded-[3rem] text-white overflow-hidden relative group">
              <div className="absolute right-[-20px] top-[-20px] opacity-10 group-hover:scale-110 transition-transform duration-700">
                 <Download size={180} />
              </div>
              <h4 className="text-lg font-black leading-tight mb-2">Exportação em Massa</h4>
              <p className="text-slate-400 text-xs font-medium leading-relaxed mb-8">Exporte toda a base histórica para conformidade com o MEC/INEP.</p>
              <button className="w-full bg-white/10 border border-white/20 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                 <Download size={14} /> Baixar Snapshot Institucional
              </button>
           </div>

           <div className="bg-amber-50 border border-amber-100 p-8 rounded-[3rem]">
              <div className="flex items-center gap-3 mb-4">
                 <AlertTriangle className="text-amber-600" size={24} />
                 <h4 className="text-sm font-black text-amber-900 uppercase tracking-tighter">Continuidade Operacional</h4>
              </div>
              <p className="text-xs text-amber-800 font-medium leading-relaxed">Em caso de falha sistêmica, o EscolarApp mantém uma versão offline dos diários de classe para sincronização posterior.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

const BackupRecord = ({ date, size, status }: any) => (
  <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl group hover:bg-white hover:shadow-md transition-all">
     <div className="flex items-center gap-4">
        <div className={`p-2 rounded-xl ${status === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
           {status === 'success' ? <CheckCircle2 size={16} /> : <History size={16} />}
        </div>
        <div>
           <p className="text-xs font-bold text-slate-800">{date}</p>
           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{size}</p>
        </div>
     </div>
     <div className="flex gap-2">
        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Restaurar">
           <RotateCcw size={16} />
        </button>
        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Baixar">
           <Download size={16} />
        </button>
     </div>
  </div>
);

export default BackupSistema;
