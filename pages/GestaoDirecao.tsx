
import React from 'react';
import { Building2, ShieldCheck, FileSpreadsheet, History, TrendingUp, AlertCircle, CheckCircle2, LayoutGrid } from 'lucide-react';

/**
 * PÁGINA: GESTÃO E DIREÇÃO (Módulo 2)
 * Finalidade: Dashboard estratégico para diretores e mantenedores.
 */
const GestaoDirecao = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 leading-none">Gestão Administrativa</h2>
          <p className="text-slate-500 text-sm mt-1">Visão macro de unidades, auditoria e decisões críticas.</p>
        </div>
        <div className="flex gap-2">
           <button className="bg-slate-900 text-white px-5 py-2.5 rounded-2xl text-xs font-bold shadow-lg flex items-center gap-2">
             <FileSpreadsheet size={16} /> Relatório Gerencial
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
         <AdminStatCard label="Unidades Ativas" count="05" color="blue" />
         <AdminStatCard label="Orçamento Mês" count="92%" color="emerald" />
         <AdminStatCard label="Auditorias Pend." count="02" color="amber" />
         <AdminStatCard label="Decisões Críticas" count="03" color="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Registro de Decisões e Auditoria */}
        <div className="lg:col-span-8 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[500px]">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
             <div className="flex items-center gap-3">
               <ShieldCheck size={20} className="text-blue-600" />
               <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Logs de Auditoria e Decisões</h3>
             </div>
             <History size={18} className="text-slate-400" />
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
             <AuditLogEntry title="Aprovação de Transferência Legal" user="Carlos (Diretor)" time="14:20" severity="info" />
             <AuditLogEntry title="Ajuste de Carga Horária - Prof. Marcos" user="Coord. Helena" time="11:45" severity="warning" />
             <AuditLogEntry title="Fechamento de Censo Escolar 2024" user="Secretaria" time="Ontem" severity="success" />
             <AuditLogEntry title="Acesso Negado: Módulo Financeiro" user="Visitante.X" time="Ontem" severity="critical" />
          </div>
        </div>

        {/* Gestão Multiescola */}
        <div className="lg:col-span-4 bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col">
           <div className="flex items-center gap-3 mb-8">
             <LayoutGrid className="text-blue-600" size={24} />
             <h3 className="text-lg font-black text-slate-800 uppercase tracking-tighter leading-none">Rede Municipal</h3>
           </div>
           
           <div className="space-y-4 flex-1">
              <SchoolUnitRow name="E.M. Pres. Vargas" status="OK" />
              <SchoolUnitRow name="E.M. Dom Pedro I" status="Alerta" critical />
              <SchoolUnitRow name="Centro Educ. Infantil" status="OK" />
           </div>
           
           <div className="mt-10 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Performance da Rede</p>
              <div className="flex items-center gap-2">
                 <TrendingUp className="text-emerald-500" size={18} />
                 <span className="text-xl font-black text-slate-900">+12% vs 2023</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const AdminStatCard = ({ label, count, color }: any) => {
  const styles: any = {
    blue: 'border-blue-500 text-blue-600 bg-blue-50/50',
    emerald: 'border-emerald-500 text-emerald-600 bg-emerald-50/50',
    amber: 'border-amber-500 text-amber-600 bg-amber-50/50',
    rose: 'border-rose-500 text-rose-600 bg-rose-50/50'
  };
  return (
    <div className={`bg-white p-5 rounded-3xl border-l-4 ${styles[color]} shadow-sm flex flex-col justify-between h-28`}>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">{label}</p>
      <p className="text-2xl font-black text-slate-900 leading-none">{count}</p>
    </div>
  );
};

const AuditLogEntry = ({ title, user, time, severity }: any) => {
  const styles: any = {
    info: 'bg-blue-50 text-blue-600',
    warning: 'bg-amber-50 text-amber-600',
    success: 'bg-emerald-50 text-emerald-600',
    critical: 'bg-rose-50 text-rose-600'
  };
  return (
    <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-center justify-between group hover:bg-white hover:shadow-md transition-all">
       <div className="flex items-center gap-4">
          <div className={`p-2 rounded-xl ${styles[severity]} group-hover:scale-110 transition-transform`}>
             <CheckCircle2 size={16} />
          </div>
          <div>
             <h4 className="text-xs font-bold text-slate-800 leading-none mb-1">{title}</h4>
             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{user}</p>
          </div>
       </div>
       <span className="text-[10px] font-bold text-slate-400">{time}</span>
    </div>
  );
};

const SchoolUnitRow = ({ name, status, critical }: any) => (
  <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-white hover:shadow-md transition-all cursor-pointer">
     <span className="text-xs font-bold text-slate-700">{name}</span>
     <span className={`text-[9px] font-black px-2 py-1 rounded-lg ${critical ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
        {status}
     </span>
  </div>
);

export default GestaoDirecao;
