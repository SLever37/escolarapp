
import React from 'react';
import { History, Search, Download, RotateCcw, CheckCircle, Calendar, User } from 'lucide-react';

/**
 * PÁGINA: Histórico de Versões
 * Finalidade: Manter trilha de auditoria das mudanças no horário.
 */
const TimetableHistorico = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <History className="text-blue-600" /> Histórico de Versões
          </h2>
          <p className="text-slate-500 text-sm">Controle de versionamento e restauração da grade horária.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input type="text" placeholder="Buscar por data ou autor..." className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none w-64" />
        </div>
      </header>

      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
           <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Publicações Oficiais</h3>
           <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">Ano Letivo 2024</span>
        </div>
        <div className="divide-y divide-slate-100">
           <VersionRow 
            version="V2.4" 
            date="22 Abr, 2024" 
            author="Carlos Silva" 
            desc="Ajuste final para início do 2º Bimestre. Inclui novos horários de Robótica." 
            active
           />
           <VersionRow 
            version="V2.3" 
            date="15 Mar, 2024" 
            author="Helena Souza" 
            desc="Remoção do Prof. Ricardo e redistribuição emergencial de Matemática." 
           />
           <VersionRow 
            version="V2.2" 
            date="02 Fev, 2024" 
            author="Carlos Silva" 
            desc="Grade de Início de Ano Letivo. Versão padrão." 
           />
           <VersionRow 
            version="V2.1 (Draft)" 
            date="15 Jan, 2024" 
            author="Sistema" 
            desc="Geração automática do motor heurístico (Testes Iniciais)." 
           />
        </div>
      </div>
    </div>
  );
};

const VersionRow = ({ version, date, author, desc, active }: any) => (
  <div className="p-8 flex flex-col md:flex-row gap-6 hover:bg-slate-50 transition-all group">
     <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${active ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
        <History size={24} />
     </div>
     <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
           <h4 className="text-lg font-black text-slate-800">{version}</h4>
           {active && <span className="bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-200">Em Produção</span>}
        </div>
        <p className="text-xs text-slate-500 leading-relaxed font-medium mb-4">{desc}</p>
        <div className="flex flex-wrap gap-4">
           <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase">
             <Calendar size={12} /> {date}
           </div>
           <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase">
             <User size={12} /> {author}
           </div>
        </div>
     </div>
     <div className="flex items-center gap-2">
        <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 hover:shadow-md transition-all group-hover:border-blue-200" title="Ver Detalhes">
           <Download size={18} />
        </button>
        {!active && (
          <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-emerald-600 hover:shadow-md transition-all group-hover:border-emerald-200" title="Restaurar esta Versão">
            <RotateCcw size={18} />
          </button>
        )}
     </div>
  </div>
);

export default TimetableHistorico;
