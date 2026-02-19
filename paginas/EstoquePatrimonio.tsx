
import React from 'react';
import { Package, Search, Filter, Plus, AlertTriangle, ArrowUpRight, BarChart3, Database } from 'lucide-react';

/**
 * PÁGINA: ESTOQUE E PATRIMÔNIO (Módulo 10)
 * Finalidade: Inventário de materiais e bens da escola.
 */
const EstoquePatrimonio = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 leading-none">Estoque & Patrimônio</h2>
          <p className="text-slate-500 text-sm mt-1">Controle de suprimentos, merenda e ativos fixos.</p>
        </div>
        <div className="flex gap-2">
           <button className="bg-blue-600 text-white px-5 py-2.5 rounded-2xl text-xs font-bold shadow-lg shadow-blue-200 flex items-center gap-2">
             <Plus size={16} /> Novo Item
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <InventoryCard title="Estoque Crítico" count="08" color="rose" icon={<AlertTriangle />} />
        <InventoryCard title="Patrimônio Total" count="1.240" color="blue" icon={<Database />} />
        <InventoryCard title="Movim. Mês" count="342" color="emerald" icon={<ArrowUpRight />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Lista de Itens Críticos */}
        <div className="lg:col-span-8 bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[500px]">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Alerta de Reposição</h3>
            <BarChart3 size={18} className="text-slate-400" />
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
             <CriticalItem name="Resma Papel A4" stock={5} min={10} unit="Resmas" />
             <CriticalItem name="Toner HP M402" stock={2} min={5} unit="Unid." />
             <CriticalItem name="Sabão Líquido 5L" stock={3} min={8} unit="Galoões" />
             <CriticalItem name="Arroz Tipo 1" stock={15} min={30} unit="Kg" />
             <CriticalItem name="Giz Branco" stock={1} min={5} unit="Caixas" />
          </div>
        </div>

        {/* Gerenciamento de Patrimônio */}
        <div className="lg:col-span-4 bg-slate-900 rounded-[3rem] p-8 text-white relative overflow-hidden group">
           <div className="absolute -right-10 -top-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
             <Database size={200} />
           </div>
           <h4 className="text-lg font-black leading-tight mb-2">Auditoria de Patrimônio</h4>
           <p className="text-slate-400 text-xs font-medium leading-relaxed mb-8">Rastreabilidade total via QR Code para ativos fixos.</p>
           
           <div className="space-y-4">
              <AuditStat label="Último Inventário" value="Mar/2024" />
              <AuditStat label="Novas Aquisições" value="15 Itens" />
              <AuditStat label="Baixas Solicitadas" value="02 Itens" />
           </div>
           
           <button className="mt-12 w-full bg-blue-600 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-900/50 hover:bg-blue-500 transition-all">Iniciar Novo Censo</button>
        </div>
      </div>
    </div>
  );
};

const InventoryCard = ({ title, count, color, icon }: any) => {
  const styles: any = {
    rose: 'border-rose-500 text-rose-600 bg-rose-50/50',
    blue: 'border-blue-500 text-blue-600 bg-blue-50/50',
    emerald: 'border-emerald-500 text-emerald-600 bg-emerald-50/50'
  };
  return (
    <div className={`bg-white p-6 rounded-[2rem] border-l-4 ${styles[color]} shadow-sm flex items-center justify-between group cursor-pointer hover:shadow-md transition-all`}>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
        <p className="text-3xl font-black text-slate-900 tracking-tighter">{count}</p>
      </div>
      <div className={`p-3 rounded-2xl ${styles[color]} group-hover:rotate-12 transition-transform`}>
        {React.cloneElement(icon, { size: 24 })}
      </div>
    </div>
  );
};

const CriticalItem = ({ name, stock, min, unit }: any) => (
  <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between group hover:bg-white hover:shadow-lg transition-all cursor-pointer">
    <div className="flex flex-col">
       <span className="text-sm font-bold text-slate-800">{name}</span>
       <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest mt-0.5">Reposição Necessária</span>
    </div>
    <div className="flex items-center gap-4 text-right">
       <div className="flex flex-col">
          <span className="text-lg font-black text-rose-600">{stock}/{min}</span>
          <span className="text-[9px] font-bold text-slate-400 uppercase">{unit}</span>
       </div>
       <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-500">
         <AlertTriangle size={14} className="animate-pulse" />
       </div>
    </div>
  </div>
);

const AuditStat = ({ label, value }: any) => (
  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
     <p className="text-[9px] font-bold opacity-60 uppercase tracking-widest mb-1">{label}</p>
     <p className="text-sm font-black">{value}</p>
  </div>
);

export default EstoquePatrimonio;
