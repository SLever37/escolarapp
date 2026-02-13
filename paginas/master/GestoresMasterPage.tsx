import React from 'react';
import { Users, Search, Mail, Phone, ShieldCheck, UserPlus, MoreHorizontal, ExternalLink } from 'lucide-react';

const GestoresMasterPage = () => {
  return (
    <div className="p-6 md:p-10 space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <Users size={24} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Diretório de Governança Municipal</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Gestores Master</h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">Lista de responsáveis institucionais por cada unidade escolar da rede.</p>
        </div>
        <button className="bg-[#2563eb] text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2 hover:bg-blue-700 transition-all">
          <UserPlus size={18} /> Novo Diretor
        </button>
      </header>

      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
           <div className="relative w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input type="text" placeholder="Localizar gestor por nome ou escola..." className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none w-full shadow-sm focus:ring-2 focus:ring-blue-500/20" />
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
               <tr>
                  <th className="px-8 py-6">Gestor Institucional</th>
                  <th className="px-6 py-6">Unidade Federada</th>
                  <th className="px-6 py-6">Nível Acesso</th>
                  <th className="px-6 py-6 text-center">Status Sessão</th>
                  <th className="px-8 py-6"></th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               <GestorRow name="Dr. Roberto Magalhães" unit="E.M. Presidente Vargas" level="Gestor N1" status="online" img="https://picsum.photos/id/64/48/48" />
               <GestorRow name="Profa. Helena Souza" unit="C.E. Arco-Íris" level="Gestor N1" status="offline" img="https://picsum.photos/id/65/48/48" />
               <GestorRow name="Marcio Silva" unit="E.M. Dom Pedro II" level="Gestor N1" status="online" img="https://picsum.photos/id/66/48/48" />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const GestorRow = ({ name, unit, level, status, img }: any) => (
  <tr className="hover:bg-slate-50 transition-colors group">
     <td className="px-8 py-5">
        <div className="flex items-center gap-4">
           <img src={img} className="w-12 h-12 rounded-2xl object-cover shadow-sm border border-slate-200" alt="" />
           <div>
              <p className="text-base font-black text-slate-800 leading-none">{name}</p>
              <div className="flex gap-4 mt-2">
                 <button className="text-[10px] text-blue-600 font-black uppercase tracking-widest flex items-center gap-1 hover:underline"><Mail size={10}/> E-mail</button>
                 <button className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-1 hover:underline"><Phone size={10}/> Telefone</button>
              </div>
           </div>
        </div>
     </td>
     <td className="px-6 py-5">
        <p className="text-sm font-black text-slate-700">{unit}</p>
        <p className="text-[9px] font-black text-blue-500 uppercase mt-1">ID: CORE_04</p>
     </td>
     <td className="px-6 py-5">
        <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[9px] font-black border border-slate-200 uppercase tracking-widest">{level}</span>
     </td>
     <td className="px-6 py-5">
        <div className="flex justify-center">
           <div className={`flex items-center gap-2 px-3 py-1 rounded-xl text-[9px] font-black uppercase ${status === 'online' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${status === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
              {status}
           </div>
        </div>
     </td>
     <td className="px-8 py-5 text-right">
        <div className="flex items-center justify-end gap-2">
           <button className="p-3 text-slate-400 hover:text-blue-600 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-slate-100 transition-all"><ExternalLink size={18} /></button>
           <button className="p-3 text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-slate-100 transition-all"><MoreHorizontal size={18} /></button>
        </div>
     </td>
  </tr>
);

export default GestoresMasterPage;