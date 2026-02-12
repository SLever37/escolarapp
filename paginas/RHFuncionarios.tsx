
import React from 'react';
import { UserCheck, UserPlus, Search, Filter, MoreHorizontal, Clock, ShieldCheck, Mail, Briefcase } from 'lucide-react';

/**
 * PÁGINA: GESTÃO DE RH / FUNCIONÁRIOS (Módulo 9)
 * Finalidade: Cadastro, jornada e escalas de toda a equipe escolar.
 */
const RHFuncionarios = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 leading-none">Recursos Humanos</h2>
          <p className="text-slate-500 text-sm mt-1">Gestão de equipe, escalas e controle de jornada institucional.</p>
        </div>
        <div className="flex gap-2">
           <button className="bg-[#1e3a8a] text-white px-5 py-2.5 rounded-2xl text-xs font-bold shadow-lg shadow-blue-200 flex items-center gap-2 hover:bg-blue-800 transition-all">
             <UserPlus size={16} /> Contratar Funcionário
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <RHStatCard label="Administrativo" count="12" color="blue" />
        <RHStatCard label="Pedagógico" count="45" color="emerald" />
        <RHStatCard label="Serviços Gerais" count="08" color="amber" />
        <RHStatCard label="Faltas / Licenças" count="03" color="rose" />
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <UserCheck className="text-blue-600" size={20} />
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Quadro de Equipe Ativa</h3>
           </div>
           <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input type="text" placeholder="Nome..." className="pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none" />
              </div>
           </div>
        </div>
        <table className="w-full text-left">
           <thead className="bg-slate-50/50 text-slate-400 text-[9px] uppercase font-black tracking-widest border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Funcionário</th>
                <th className="px-6 py-4">Cargo / Setor</th>
                <th className="px-6 py-4">Jornada</th>
                <th className="px-6 py-4">Status Hoje</th>
                <th className="px-6 py-4"></th>
              </tr>
           </thead>
           <tbody className="divide-y divide-slate-100">
              <StaffRow name="Ricardo Santos" role="Professor de Inglês" sector="Pedagógico" shift="40h/sem" status="presente" />
              <StaffRow name="Maria Helena" role="Coordenadora" sector="Administrativo" shift="40h/sem" status="presente" />
              <StaffRow name="Cláudio Rocha" role="Segurança" sector="Apoio" shift="12x36" status="ausente" />
           </tbody>
        </table>
      </div>
    </div>
  );
};

const StaffRow = ({ name, role, sector, shift, status }: any) => (
  <tr className="hover:bg-slate-50 transition-colors group">
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
         <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400 border border-slate-200 group-hover:bg-white group-hover:text-blue-600 transition-all">
           {name.charAt(0)}
         </div>
         <span className="text-sm font-bold text-slate-800">{name}</span>
      </div>
    </td>
    <td className="px-6 py-4">
      <div className="flex flex-col">
        <span className="text-xs font-bold text-slate-600">{role}</span>
        <span className="text-[9px] text-slate-400 uppercase font-black tracking-tighter mt-0.5">{sector}</span>
      </div>
    </td>
    <td className="px-6 py-4 font-black text-slate-500 text-xs tracking-tighter">{shift}</td>
    <td className="px-6 py-4">
      <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black border uppercase tracking-widest ${
        status === 'presente' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
      }`}>
        {status}
      </span>
    </td>
    <td className="px-6 py-4 text-right">
       <button className="p-2 text-slate-300 hover:text-slate-600 rounded-xl transition-all">
         <MoreHorizontal size={20} />
       </button>
    </td>
  </tr>
);

const RHStatCard = ({ label, count, color }: any) => {
  const styles: any = {
    blue: 'border-blue-500 text-blue-600 bg-blue-50/30',
    emerald: 'border-emerald-500 text-emerald-600 bg-emerald-50/30',
    amber: 'border-amber-500 text-amber-600 bg-amber-50/30',
    rose: 'border-rose-500 text-rose-600 bg-rose-50/30'
  };
  return (
    <div className={`bg-white p-6 rounded-[2rem] border-l-4 ${styles[color]} shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-32`}>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{label}</p>
      <div className="flex items-end justify-between">
         <p className="text-3xl font-black text-slate-900 leading-none">{count}</p>
         <Briefcase size={20} className="opacity-20" />
      </div>
    </div>
  );
};

export default RHFuncionarios;
