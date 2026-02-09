
import React from 'react';
import { Eye, Clock, User, ShieldCheck, Terminal, Filter, Search, Download } from 'lucide-react';

/**
 * COMPONENTE: RastreabilidadeCompleta
 * Finalidade: Auditoria de alto nível (Forense Escolar).
 * Foco: Quem, Quando, Onde e Porquê. Essencial para conformidade LGPD.
 */
const RastreabilidadeCompleta = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-700 p-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
            <Eye className="text-blue-600" />
            Audit Log de Alta Precisão
          </h2>
          <p className="text-slate-500 text-sm mt-1">Monitoramento ininterrupto de operações críticas e acessos a dados sensíveis.</p>
        </div>
        <button className="bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-sm">
          <Download size={16} /> Exportar Log Jurídico
        </button>
      </header>

      <div className="bg-slate-900 rounded-[3rem] p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 p-8 opacity-10"><Terminal size={120} /></div>
        <div className="flex flex-col md:flex-row gap-4 mb-8 relative z-10">
           <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input type="text" placeholder="Filtrar por Usuário, IP ou Ação..." className="w-full bg-white/5 border border-white/10 pl-12 pr-4 py-4 rounded-2xl outline-none focus:border-blue-500 transition-all text-sm font-mono" />
           </div>
           <button className="bg-white/10 px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 border border-white/10">
              <Filter size={16} /> Filtros Avançados
           </button>
        </div>

        <div className="space-y-2 font-mono text-[11px] relative z-10">
           <LogEntry time="14:32:01" user="Carlos.Silva" action="ALTERAÇÃO_HORÁRIO_PEDAGÓGICO" module="TIMETABLE" ip="189.10.42.1" severity="CRITICAL" />
           <LogEntry time="14:35:12" user="Ana.Beatriz" action="CONSULTA_DADOS_BOLSA_FAMILIA" module="SECRETARIA" ip="189.10.42.1" severity="WARNING" />
           <LogEntry time="14:38:40" user="Sistema" action="BACKUP_REDE_MUNICIPAL_SUCCESS" module="CORE" ip="INTERNAL" severity="SUCCESS" />
           <LogEntry time="14:40:05" user="Visitante.X" action="FALHA_LOGIN_PORTARIA" module="AUTH" ip="45.10.22.100" severity="ERROR" />
           <LogEntry time="14:42:00" user="Carlos.Silva" action="EMISSÃO_HISTÓRICO_OFICIAL" module="SECRETARIA" ip="189.10.42.1" severity="SUCCESS" />
           <LogEntry time="14:45:00" user="Pedagogia.User" action="LANÇAMENTO_ALERTA_RISCO_EVASÃO" module="IA_HUB" ip="189.10.42.1" severity="INFO" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <AuditMetric label="Acessos nas últimas 24h" value="1.242" icon={<User />} />
         <AuditMetric label="Ações Críticas" value="08" icon={<ShieldCheck />} color="rose" />
         <AuditMetric label="Tempo de Retenção" value="5 Anos" icon={<Clock />} />
      </div>
    </div>
  );
};

const LogEntry = ({ time, user, action, module, ip, severity }: any) => {
  const colors: any = {
    CRITICAL: 'text-rose-400',
    WARNING: 'text-amber-400',
    SUCCESS: 'text-emerald-400',
    ERROR: 'text-rose-500',
    INFO: 'text-blue-400'
  };
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

const AuditMetric = ({ label, value, icon, color }: any) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center justify-between">
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{label}</p>
      <p className={`text-3xl font-black mt-2 ${color === 'rose' ? 'text-rose-600' : 'text-slate-900'}`}>{value}</p>
    </div>
    <div className={`p-3 rounded-2xl ${color === 'rose' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-400'}`}>{icon}</div>
  </div>
);

export default RastreabilidadeCompleta;
