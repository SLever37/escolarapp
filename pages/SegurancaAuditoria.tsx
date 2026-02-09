
import React from 'react';
import { 
  ShieldCheck, History, Eye, User, Lock, Terminal, 
  UserSquare2, GraduationCap, Users 
} from 'lucide-react';

const SegurancaAuditoria = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 leading-none">Segurança & Auditoria</h2>
          <p className="text-slate-500 text-sm mt-1">Monitoramento de acessos, logs de sistema e conformidade LGPD.</p>
        </div>
        <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-2xl border border-emerald-100 flex items-center gap-2">
          <ShieldCheck size={18} />
          <span className="text-xs font-black uppercase tracking-widest">LGPD Compliance OK</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Terminal de Logs */}
        <div className="lg:col-span-8 bg-slate-900 rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
           <div className="p-6 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
             <div className="flex items-center gap-2">
               <Terminal size={18} className="text-blue-400" />
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Logs de Sistema (Real-time)</h3>
             </div>
             <div className="flex gap-2">
               <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
               <div className="w-2 h-2 rounded-full bg-amber-500" />
               <div className="w-2 h-2 rounded-full bg-emerald-500" />
             </div>
           </div>
           <div className="flex-1 p-6 font-mono text-[10px] space-y-2 overflow-y-auto max-h-[400px] custom-scrollbar">
              <LogLine time="14:20:12" user="Carlos.Silva" action="ACESSO_MÓDULO_DIREÇÃO" severity="info" />
              <LogLine time="14:22:05" user="Ana.Beatriz" action="ALTERAÇÃO_NOTAS_HUB_2024" severity="warning" />
              <LogLine time="14:25:40" user="Sistema" action="BACKUP_DIÁRIO_EXECUTADO" severity="success" />
              <LogLine time="14:30:15" user="Visitante.X" action="FALHA_LOGIN_PORTARIA_C" severity="error" />
              <LogLine time="14:32:00" user="Paula.IA" action="GERAÇÃO_RELATÓRIO_PREDICTIVO" severity="info" />
              <LogLine time="14:35:10" user="Carlos.Silva" action="APROVAÇÃO_TRANSFERÊNCIA_LEGAL" severity="success" />
              <LogLine time="14:40:00" user="Secretaria" action="DOWNLOAD_BASE_DADOS_ALUNOS" severity="warning" />
           </div>
        </div>

        {/* Perfis de Acesso */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
             <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6">Controle de Perfis</h4>
             <div className="space-y-3">
                <ProfileItem icon={<User size={14} />} label="Administradores" count="02" />
                <ProfileItem icon={<UserSquare2 size={14} />} label="Secretaria" count="05" />
                <ProfileItem icon={<GraduationCap size={14} />} label="Pedagogia" count="08" />
                <ProfileItem icon={<Users size={14} />} label="Professores" count="45" />
             </div>
             <button className="mt-8 w-full bg-slate-50 border border-slate-200 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all">Gerenciar Permissões</button>
           </div>

           <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-200">
              <Lock size={32} className="opacity-40 mb-4" />
              <h4 className="text-lg font-black leading-tight">Criptografia de Dados em Repouso</h4>
              <p className="text-blue-100 text-xs mt-2 font-medium">Todas as notas e documentos legais são protegidos por criptografia AES-256 de grau militar.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

const LogLine = ({ time, user, action, severity }: any) => {
  const colors: any = {
    info: 'text-blue-400',
    warning: 'text-amber-400',
    error: 'text-rose-400',
    success: 'text-emerald-400'
  };
  return (
    <div className="flex gap-4 border-b border-slate-800/50 pb-1">
      <span className="text-slate-600 shrink-0">[{time}]</span>
      <span className="text-indigo-400 font-bold shrink-0">{user}</span>
      <span className={`flex-1 ${colors[severity]} font-black`}>{action}</span>
    </div>
  );
};

const ProfileItem = ({ icon, label, count }: any) => (
  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md transition-all cursor-pointer">
    <div className="flex items-center gap-3">
      <span className="text-blue-600">{icon}</span>
      <span className="text-xs font-bold text-slate-700 uppercase tracking-tighter">{label}</span>
    </div>
    <span className="text-xs font-black text-slate-400 tracking-tighter">{count}</span>
  </div>
);

export default SegurancaAuditoria;
