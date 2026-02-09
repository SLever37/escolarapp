
import React from 'react';
import { 
  FileText, UserPlus, Search, Filter, 
  ArrowRightLeft, FileCheck, Bookmark, ShieldAlert 
} from 'lucide-react';

const SecretariaLegal = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Secretaria Escolar</h2>
          <p className="text-slate-500 text-sm">Gestão legal, matrículas e documentação institucional.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-blue-600 text-white px-5 py-2.5 rounded-2xl text-xs font-bold shadow-lg shadow-blue-200 flex items-center gap-2 hover:bg-blue-700 transition-all">
            <UserPlus size={16} /> Nova Matrícula
          </button>
          <button className="bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 hover:bg-slate-50 transition-all">
            <FileCheck size={16} /> Declarações
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input type="text" placeholder="Buscar aluno por nome, CPF ou matrícula..." className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none" />
        </div>
        <div className="flex gap-2">
          <button className="px-5 py-3 border border-slate-200 rounded-2xl text-xs font-black text-slate-500 uppercase flex items-center gap-2 bg-white"><Filter size={16} /> Filtros</button>
          <select className="px-5 py-3 border border-slate-200 rounded-2xl text-xs font-black text-slate-500 uppercase bg-white outline-none">
            <option>Todas as Séries</option>
            <option>1º Ano</option>
            <option>2º Ano</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Lista de Alunos / Documentação */}
        <div className="lg:col-span-8 bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Aluno / Matrícula</th>
                <th className="px-6 py-4">Situação Legal</th>
                <th className="px-6 py-4 text-center">Docs.</th>
                <th className="px-6 py-4">Bolsa Família</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <SecretariaRow 
                name="Ana Beatriz Silva" 
                mat="2024.0012" 
                status="validado" 
                docs="completo" 
                bf={true} 
              />
              <SecretariaRow 
                name="Bruno Oliveira" 
                mat="2024.0085" 
                status="em_analise" 
                docs="pendente" 
                bf={false} 
              />
              <SecretariaRow 
                name="Carla Ramos" 
                mat="2024.0102" 
                status="pendente" 
                docs="completo" 
                bf={true} 
              />
            </tbody>
          </table>
        </div>

        {/* Alertas da Secretaria */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-rose-50 border border-rose-100 p-6 rounded-[2rem]">
            <div className="flex items-center gap-3 mb-4">
              <ShieldAlert className="text-rose-500" size={24} />
              <h3 className="font-black text-rose-900 uppercase tracking-tighter">Prazos e Pendências</h3>
            </div>
            <div className="space-y-3">
              <PendingItem label="Censo Escolar 2024" date="Expira em 3 dias" critical />
              <PendingItem label="Relatórios Bolsa Família" date="Envio até 28/04" />
              <PendingItem label="Documentos Alunos Novos" date="12 pendentes" />
            </div>
          </div>

          <div className="bg-blue-600 p-6 rounded-[2rem] text-white shadow-xl shadow-blue-200">
             <div className="flex items-center justify-between mb-4">
               <Bookmark size={24} className="opacity-50" />
               <span className="text-[10px] font-black uppercase tracking-widest bg-white/10 px-2 py-1 rounded-lg">Ação Rápida</span>
             </div>
             <h4 className="text-lg font-black leading-tight">Emitir Histórico Digital de Aluno Transferido</h4>
             <p className="text-blue-100 text-[10px] font-bold mt-2 uppercase tracking-widest">Protocolo Assinado via Gov.br</p>
             <button className="mt-6 w-full bg-white text-blue-600 py-3 rounded-2xl text-xs font-black shadow-lg">ACESSAR PORTAL DIGITAL</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SecretariaRow = ({ name, mat, status, docs, bf }: any) => {
  const statusStyles: any = {
    validado: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    em_analise: 'text-amber-600 bg-amber-50 border-amber-100',
    pendente: 'text-rose-600 bg-rose-50 border-rose-100',
  };
  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="px-6 py-4">
        <p className="text-sm font-black text-slate-800">{name}</p>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{mat}</p>
      </td>
      <td className="px-6 py-4">
        <span className={`px-2 py-1 rounded-lg text-[9px] font-black border uppercase tracking-widest ${statusStyles[status]}`}>
          {status.replace('_', ' ')}
        </span>
      </td>
      <td className="px-6 py-4 text-center">
        {docs === 'completo' ? (
          <FileCheck size={18} className="text-emerald-500 mx-auto" />
        ) : (
          <ShieldAlert size={18} className="text-rose-500 mx-auto" />
        )}
      </td>
      <td className="px-6 py-4">
        {bf ? (
          <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-black border border-blue-100">
            <Bookmark size={10} fill="currentColor" /> ATIVO
          </div>
        ) : <span className="text-[9px] font-black text-slate-300">NÃO</span>}
      </td>
      <td className="px-6 py-4 text-right">
        <button className="p-2 text-slate-400 hover:text-blue-600"><ArrowRightLeft size={18} /></button>
      </td>
    </tr>
  );
};

const PendingItem = ({ label, date, critical }: any) => (
  <div className={`p-3 rounded-2xl bg-white/60 border border-transparent hover:border-slate-200 transition-all flex items-center justify-between group cursor-pointer`}>
    <div>
      <p className="text-xs font-bold text-slate-800">{label}</p>
      <p className={`text-[9px] font-black uppercase ${critical ? 'text-rose-500' : 'text-slate-400'}`}>{date}</p>
    </div>
    <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-slate-300 group-hover:text-blue-600 transition-colors">
      <ArrowRightLeft size={14} className="rotate-90" />
    </div>
  </div>
);

export default SecretariaLegal;
