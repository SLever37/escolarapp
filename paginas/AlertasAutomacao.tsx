
import React from 'react';
import { Bell, AlertCircle, TrendingDown, Book, Package, ShieldAlert, CheckCircle2, ChevronRight } from 'lucide-react';

/**
 * PÁGINA: CENTRAL DE ALERTAS (Módulo 13)
 * Finalidade: Notificações automáticas de eventos críticos em todos os departamentos.
 */
const AlertasAutomacao = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 leading-none">Central de Alertas</h2>
          <p className="text-slate-500 text-sm mt-1">Automações institucionais e notificações de eventos críticos.</p>
        </div>
        <div className="flex gap-2">
           <button className="bg-slate-50 border border-slate-200 text-slate-700 px-5 py-2.5 rounded-2xl text-xs font-bold">Configurar Gatilhos</button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         <AlertGroup title="Pedagógico" color="violet" icon={<TrendingDown size={20} />} alerts={[
           { text: "Queda de 12% rendimento - 9º C", time: "1h atrás" },
           { text: "7 faltas consecutivas: Bruno O.", time: "3h atrás" }
         ]} />
         <AlertGroup title="Operacional" color="amber" icon={<Package size={20} />} alerts={[
           { text: "Estoque Merenda: Leite (2 dias)", time: "08:00" },
           { text: "Devolução atrasada: Dom Casmurro", time: "09:15" }
         ]} />
         <AlertGroup title="Administrativo" color="rose" icon={<ShieldAlert size={20} />} alerts={[
           { text: "Censo Escolar: Prazo Crítico", time: "07:30" },
           { text: "Documento Pendente: Unid. 04", time: "Ontem" }
         ]} />
      </div>

      <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
         <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tighter">Log de Automações Recentes</h3>
            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl">Monitorando Ativamente</span>
         </div>
         
         <div className="space-y-3">
            <AutomationLog icon={<CheckCircle2 className="text-emerald-500" />} text="Push enviado aos responsáveis: Alerta de Frequência - 8º Ano" time="10:45" />
            <AutomationLog icon={<CheckCircle2 className="text-emerald-500" />} text="Relatório de Merenda gerado e enviado para Secretaria de Educação" time="08:00" />
            <AutomationLog icon={<CheckCircle2 className="text-emerald-500" />} text="Sincronização com Backup em Nuvem completada com sucesso" time="03:00" />
            <AutomationLog icon={<AlertCircle className="text-amber-500" />} text="Tentativa de acesso não autorizado: Bloqueio temporário IP 192.168.1.10" time="Ontem" />
         </div>
      </div>
    </div>
  );
};

const AlertGroup = ({ title, color, icon, alerts }: any) => {
  const styles: any = {
    violet: 'text-violet-600 border-violet-100 bg-violet-50/30',
    amber: 'text-amber-600 border-amber-100 bg-amber-50/30',
    rose: 'text-rose-600 border-rose-100 bg-rose-50/30'
  };
  return (
    <div className={`p-6 rounded-[2.5rem] border ${styles[color]} shadow-sm`}>
       <div className="flex items-center gap-3 mb-6">
          <div className={`p-2 rounded-xl ${styles[color]} border-none`}>{icon}</div>
          <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs">{title}</h4>
       </div>
       <div className="space-y-4">
          {alerts.map((a: any, i: number) => (
            <div key={i} className="flex justify-between items-start gap-4">
               <p className="text-xs text-slate-600 font-bold leading-tight">{a.text}</p>
               <span className="text-[9px] font-black text-slate-400 uppercase whitespace-nowrap">{a.time}</span>
            </div>
          ))}
       </div>
    </div>
  );
};

const AutomationLog = ({ icon, text, time }: any) => (
  <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-white hover:shadow-md transition-all cursor-pointer group">
     <div className="flex items-center gap-4">
        <span className="shrink-0">{icon}</span>
        <p className="text-sm font-bold text-slate-700">{text}</p>
     </div>
     <div className="flex items-center gap-4">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{time}</span>
        <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-600" />
     </div>
  </div>
);

export default AlertasAutomacao;
