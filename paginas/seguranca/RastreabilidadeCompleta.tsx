import React from 'react';
import { Eye, Clock, User, ShieldCheck, Terminal, Filter, Search, Download } from 'lucide-react';

const RastreabilidadeCompleta = () => {
  return (
    <div className="p-4 md:p-10 space-y-6 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
            <Eye className="text-blue-600" /> Audit Log de Alta Precisão
          </h2>
          <p className="text-slate-500 text-sm mt-1">Monitoramento ininterrupto de operações críticas e acessos a dados sensíveis.</p>
        </div>
        <button className="bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-sm">
          <Download size={16} /> Exportar Log Jurídico
        </button>
      </header>
      <div className="bg-slate-900 rounded-[3rem] p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="space-y-2 font-mono text-[11px] relative z-10">
           <LogEntry time="14:32:01" user="Carlos.Silva" action="ALTERAÇÃO_HORÁRIO_PEDAGÓGICO" module="TIMETABLE" ip="189.10.42.1" severity="CRITICAL" />
           <LogEntry time="14:35:12" user="Ana.Beatriz" action="CONSULTA_DADOS_BOLSA_FAMILIA" module="SECRETARIA" ip="189.10.42.1" severity="WARNING" />
        </div>
      </div>
    </div>
  );
};
const LogEntry = ({ time, user, action, module, ip, severity }: any) => {
  const colors: any = { CRITICAL: 'text-rose-400', WARNING: 'text-amber-400', SUCCESS: 'text-emerald-400', ERROR: 'text-rose-500', INFO: 'text-blue-400' };
  return (
    <div className="flex items-center gap-4 py-2 border-b border-white/5 hover:bg-white/5 transition-all">
       <span className="text-slate-500 shrink-0">[{time}]</span>
       <span className="text-blue-400 font-bold w-32 shrink-0">{user}</span>
       <span className={`flex-1 font-black ${colors[severity]}`}>{action}</span>
       <span className="text-slate-600 w-24 shrink-0">{module}</span>
       <span className="text-slate-700 w-32 text-right shrink-0">{ip}</span>
    </div>
  );
};
export default RastreabilidadeCompleta;