
import React from 'react';
import { Gavel, History, FileText, CheckCircle, ShieldAlert, Users, TrendingUp } from 'lucide-react';

const GovernancaEscolar = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <header className="flex items-center justify-between bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-slate-900 text-white rounded-[1.5rem] shadow-xl">
            <Gavel size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Atas & Governança</h2>
            <p className="text-slate-500 text-sm font-medium">Registro histórico de decisões administrativas e pedagógicas.</p>
          </div>
        </div>
        <button className="bg-blue-600 text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-200 hover:scale-105 transition-all">Nova Ata de Decisão</button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-4">
           <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
             <History size={14} /> Histórico Recente de Deliberações
           </h3>
           <DecisionItem 
             title="Aprovação de Reforma na Unidade Rural" 
             type="ADMINISTRATIVA" 
             date="22 Abr, 2024"
             resp="Carlos Silva (Diretor)"
             status="APROVADO"
           />
           <DecisionItem 
             title="Suspensão Temporária de Aula (Evento Climático)" 
             type="EMERGÊNCIA" 
             date="21 Abr, 2024"
             resp="Secretaria de Educação"
             status="EXECUTADO"
           />
           <DecisionItem 
             title="Alteração Curricular: Inclusão de Robótica" 
             type="PEDAGÓGICA" 
             date="18 Abr, 2024"
             resp="Conselho Escolar"
             status="PLANEJAMENTO"
           />
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6">Status de Compliance</h4>
              <div className="space-y-4">
                 <ComplianceRow label="Transparência de Verbas" status="OK" />
                 <ComplianceRow label="Assiduidade Professor" status="ALERTA" critical />
                 <ComplianceRow label="Manutenção Patrimônio" status="OK" />
                 <ComplianceRow label="Segurança de Dados" status="OK" />
              </div>
           </div>

           <div className="bg-blue-50 border border-blue-100 p-8 rounded-[3rem]">
              <div className="flex items-center gap-3 mb-4">
                 <ShieldAlert className="text-blue-600" size={24} />
                 <h4 className="text-sm font-black text-blue-900 uppercase tracking-tighter">Rastreabilidade Jurídica</h4>
              </div>
              <p className="text-xs text-blue-800 font-medium leading-relaxed">Todas as decisões registradas neste módulo possuem validade institucional e são assinadas digitalmente via certificado ICP-Brasil (mock).</p>
           </div>
        </div>
      </div>
    </div>
  );
};

const DecisionItem = ({ title, type, date, resp, status }: any) => (
  <div className="p-6 bg-white border border-slate-200 rounded-[2rem] hover:shadow-xl hover:shadow-slate-200/50 transition-all cursor-pointer group">
    <div className="flex justify-between items-start mb-4">
       <span className="text-[9px] font-black bg-slate-100 text-slate-500 px-2 py-1 rounded-lg uppercase tracking-widest">{type}</span>
       <span className="text-[10px] font-bold text-slate-400">{date}</span>
    </div>
    <h4 className="text-lg font-black text-slate-800 leading-tight mb-4 group-hover:text-blue-600 transition-colors">{title}</h4>
    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
       <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-slate-200" />
          <span className="text-[10px] font-bold text-slate-500 uppercase">{resp}</span>
       </div>
       <div className="flex items-center gap-2">
          <CheckCircle size={14} className="text-emerald-500" />
          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{status}</span>
       </div>
    </div>
  </div>
);

const ComplianceRow = ({ label, status, critical }: any) => (
  <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
     <span className="text-xs font-bold text-slate-700">{label}</span>
     <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${critical ? 'text-rose-500 bg-rose-50' : 'text-emerald-500 bg-emerald-50'}`}>{status}</span>
  </div>
);

export default GovernancaEscolar;
