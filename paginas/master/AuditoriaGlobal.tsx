
import React from 'react';
// Added missing imports for Activity and CheckCircle2
import { Eye, ShieldAlert, Terminal, Search, Filter, Download, User, Activity, CheckCircle2 } from 'lucide-react';

const AuditoriaGlobal = () => {
  const logs = [
    { id: 1, time: '14:22:05', unit: 'Pres. Vargas', user: 'Carlos.Dir', action: 'EXPORT_DATABASE_USERS', severity: 'critico' },
    { id: 2, time: '14:25:10', unit: 'Arco-Íris', user: 'Helena.Sec', action: 'UPDATE_LEGAL_DOCS', severity: 'info' },
    { id: 3, time: '14:30:45', unit: 'System', user: 'Automator', action: 'DAILY_BACKUP_SUCCESS', severity: 'safe' },
    { id: 4, time: '14:32:00', unit: 'Pres. Vargas', user: 'Unknown', action: 'FAILED_LOGIN_ATTEMPT', severity: 'warning' },
  ];

  return (
    <div className="p-6 md:p-10 space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
            <Eye className="text-blue-600" /> Auditoria Forense Global
          </h2>
          <p className="text-slate-500 text-sm mt-1">Trilha de auditoria inalterável para conformidade LGPD e segurança de rede.</p>
        </div>
        <button className="bg-white border border-slate-200 px-6 py-3 rounded-2xl text-xs font-black uppercase flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
          <Download size={16} /> Baixar Logs Jurídicos
        </button>
      </header>

      <div className="bg-slate-900 rounded-[3rem] border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[600px]">
        <div className="p-6 bg-slate-800/50 border-b border-white/5 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <Terminal className="text-blue-400" size={20} />
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Global Activity Stream</h3>
           </div>
           <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                <input placeholder="Filtrar eventos..." className="bg-slate-900 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white outline-none focus:border-blue-500" />
              </div>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 font-mono text-[11px] space-y-2 custom-scrollbar">
           {logs.map(log => (
             <div key={log.id} className="flex gap-4 border-b border-white/5 pb-2 group hover:bg-white/5 transition-all">
                <span className="text-slate-500 shrink-0">[{log.time}]</span>
                <span className="text-indigo-400 font-bold shrink-0 w-24">@{log.unit}</span>
                <span className={`shrink-0 w-32 ${log.severity === 'critico' ? 'text-rose-500' : 'text-emerald-400'}`}>{log.action}</span>
                <span className="text-slate-400 flex-1">{log.user} realizou operation no core.</span>
                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${log.severity === 'critico' ? 'bg-rose-500/10 text-rose-500' : 'bg-slate-700 text-slate-400'}`}>{log.severity}</span>
             </div>
           ))}
           <div className="text-slate-600 animate-pulse mt-4">_ AWAINTING_NEW_SOCKET_DATA...</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 flex items-center justify-between">
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Acessos Hoje</p>
               <p className="text-3xl font-black text-slate-900">1.240</p>
            </div>
            <Activity className="text-blue-500" />
         </div>
         <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 flex items-center justify-between">
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Alertas Criticos</p>
               <p className="text-3xl font-black text-rose-600">02</p>
            </div>
            <ShieldAlert className="text-rose-500" />
         </div>
         <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 flex items-center justify-between">
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Core Health</p>
               <p className="text-3xl font-black text-emerald-600">99%</p>
            </div>
            <CheckCircle2 className="text-emerald-500" />
         </div>
      </div>
    </div>
  );
};

export default AuditoriaGlobal;
