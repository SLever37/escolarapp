
import React from 'react';
import { UserCheck, UserPlus, Search, Filter, MoreHorizontal, Clock, ShieldCheck, Mail } from 'lucide-react';

const Staff: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Funcionários & RH</h2>
          <p className="text-slate-500">Gestão de Equipe, Escalas e Controle de Jornada.</p>
        </div>
        <button className="bg-[#1e3a8a] text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-800 transition-all flex items-center gap-2">
          <UserPlus size={18} />
          <span>Contratar Funcionário</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Administrativo" count="12" active="10 Online" color="blue" />
        <StatCard label="Pedagógico" count="45" active="38 Online" color="emerald" />
        <StatCard label="Serviços Gerais" count="08" active="08 Online" color="amber" />
        <StatCard label="Faltas / Licenças" count="03" active="Alerta RH" color="rose" />
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <UserCheck className="text-blue-600" />
              <h3 className="text-xl font-bold text-slate-800">Quadro de Equipe</h3>
           </div>
           <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input type="text" placeholder="Nome..." className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs outline-none" />
              </div>
           </div>
        </div>
        <table className="w-full text-left">
           <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
              <tr>
                <th className="px-8 py-4">Funcionário</th>
                <th className="px-6 py-4">Cargo / Setor</th>
                <th className="px-6 py-4">Jornada</th>
                <th className="px-6 py-4">Status Hoje</th>
                <th className="px-8 py-4"></th>
              </tr>
           </thead>
           <tbody className="divide-y divide-slate-100">
              {[
                { name: 'Ricardo Santos', role: 'Professor de Inglês', sector: 'Pedagógico', hours: '40h/sem', status: 'presente' },
                { name: 'Maria Helena', role: 'Coordenadora', sector: 'Administrativo', hours: '40h/sem', status: 'presente' },
                { name: 'Cláudio Rocha', role: 'Segurança', sector: 'Apoio', hours: '12x36', status: 'ausente' },
              ].map((staff, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-400">
                         {staff.name.charAt(0)}
                       </div>
                       <span className="text-sm font-bold text-slate-800">{staff.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-600">{staff.role}</span>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">{staff.sector}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-500 text-sm">{staff.hours}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-black border uppercase tracking-wider ${
                      staff.status === 'presente' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                    }`}>
                      {staff.status}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-right">
                     <button className="p-2 text-slate-300 hover:text-slate-600 rounded-xl transition-all">
                       <MoreHorizontal size={20} />
                     </button>
                  </td>
                </tr>
              ))}
           </tbody>
        </table>
      </div>
    </div>
  );
};

const StatCard = ({ label, count, active, color }: any) => {
  const colors: any = {
    blue: 'border-blue-500 text-blue-600',
    emerald: 'border-emerald-500 text-emerald-600',
    amber: 'border-amber-500 text-amber-600',
    rose: 'border-rose-500 text-rose-600'
  };
  return (
    <div className={`bg-white p-6 rounded-3xl border-l-4 ${colors[color]} shadow-sm hover:shadow-md transition-all`}>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-3xl font-black text-slate-800">{count}</p>
      <p className="text-[10px] font-bold mt-2 opacity-60 uppercase">{active}</p>
    </div>
  );
};

export default Staff;
