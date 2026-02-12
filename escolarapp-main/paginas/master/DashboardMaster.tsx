
import React, { useState } from 'react';
import { 
  Building2, Users, Plus, ShieldCheck, Globe, 
  Search, MoreVertical, CheckCircle2, 
  UserPlus, ExternalLink, Activity, Database
} from 'lucide-react';

const DashboardMaster = () => {
  const [unidades] = useState([
    { id: '1', nome: 'E.M. Presidente Vargas', gestor: 'Dr. Roberto Magalhães', status: 'ativo', alunos: 1240 },
    { id: '2', nome: 'C.E. Arco-Íris', gestor: 'Profa. Helena Souza', status: 'ativo', alunos: 210 },
  ]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 mb-2">
            <Globe size={24} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Ecossistema EscolarApp</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Administração de Plataforma</h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">Provisionamento de unidades, controle de instâncias e auditoria global.</p>
        </div>
        <button className="bg-blue-600 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2">
          <Plus size={18} /> Provisionar Unidade
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPICardMaster label="Unidades Providas" valor={unidades.length} icone={<Building2 />} cor="indigo" />
        <KPICardMaster label="Usuários em Rede" valor="4.850" icone={<Users />} cor="blue" />
        <KPICardMaster label="Uptime Servidores" valor="99.9%" icone={<Activity />} cor="emerald" />
        <KPICardMaster label="Status Backups" valor="Seguro" icone={<Database />} cor="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Instâncias Ativas</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input type="text" placeholder="Buscar unidade..." className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none w-64" />
            </div>
          </div>

          <div className="space-y-4">
            {unidades.map((u) => (
              <div key={u.id} className="p-5 bg-slate-50 border border-slate-100 rounded-[2rem] flex items-center justify-between group hover:bg-white hover:shadow-xl transition-all">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 text-indigo-600">
                    <Building2 size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-800 leading-none">{u.nome}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-2">Gestor: {u.gestor}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                   <span className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-xl text-[9px] font-black border border-emerald-100 flex items-center gap-2">
                     <CheckCircle2 size={12} /> ATIVA
                   </span>
                   <button className="p-3 text-slate-300 hover:text-blue-600 transition-all" title="Acessar Painel da Unidade"><ExternalLink size={18} /></button>
                   <button className="p-3 text-slate-300 hover:text-slate-600"><MoreVertical size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute right-[-10%] top-[-10%] opacity-10 group-hover:scale-110 transition-transform duration-700">
               <UserPlus size={200} />
            </div>
            <h4 className="text-xl font-black leading-tight mb-2">Vincular Gestor</h4>
            <p className="text-slate-400 text-xs font-medium leading-relaxed mb-8">Crie o acesso master do diretor de uma unidade. Ele terá autonomia total para criar os usuários da escola dele.</p>
            <div className="space-y-4 mb-8">
               <input placeholder="E-mail do Gestor" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-sm outline-none focus:border-blue-500" />
               <select className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-sm outline-none text-slate-400">
                 <option>Selecionar Unidade...</option>
                 {unidades.map(u => <option key={u.id}>{u.nome}</option>)}
               </select>
            </div>
            <button className="w-full bg-indigo-600 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all">CONCEDER ACESSO MASTER</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const KPICardMaster = ({ label, valor, icone, cor }: any) => (
  <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col justify-between h-36">
    <div className={`p-3 rounded-2xl w-fit ${cor === 'indigo' ? 'bg-indigo-50 text-indigo-600' : cor === 'emerald' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
       {React.cloneElement(icone, { size: 20 })}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-3xl font-black text-slate-900 tracking-tighter mt-1">{valor}</p>
    </div>
  </div>
);

export default DashboardMaster;
