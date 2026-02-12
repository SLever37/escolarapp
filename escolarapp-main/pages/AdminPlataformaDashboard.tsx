
import React, { useState } from 'react';
import { 
  Building2, Users, Plus, ShieldCheck, Globe, 
  Search, MoreVertical, LayoutGrid, CheckCircle2, 
  UserPlus, ExternalLink, Activity
} from 'lucide-react';
import { KpiCard, SectionHeader } from '../components/DashboardUI';

const AdminPlataformaDashboard = () => {
  const [units, setUnits] = useState([
    { id: '1', name: 'E.M. Presidente Vargas', manager: 'Roberto Magalhães', status: 'ativo', students: 1240 },
    { id: '2', name: 'Centro Educ. Arco-Íris', manager: 'Helena Souza', status: 'ativo', students: 210 },
  ]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 mb-2">
            <Globe size={24} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Master Platform Admin</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Gestão de Ecossistema</h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">Controle global de instituições, provisionamento de unidades e segurança de rede.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-blue-600 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2">
            <Plus size={18} /> Provisionar Nova Unidade
          </button>
        </div>
      </header>

      {/* KPIs da Plataforma */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Total de Unidades" value={units.length} icon={<Building2 />} color="blue" />
        <KpiCard title="Usuários na Rede" value="4.850" trend="+12%" icon={<Users />} color="violet" />
        <KpiCard title="Servidores Core" value="Ativos" trend="100%" icon={<Activity />} color="emerald" />
        <KpiCard title="Alertas Segurança" value="0" icon={<ShieldCheck />} color="emerald" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Listagem de Unidades Providas */}
        <div className="lg:col-span-8 bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <SectionHeader title="Unidades Ativas" subtitle="Gerenciamento de Instâncias" icon={<LayoutGrid size={18} />} />
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input type="text" placeholder="Buscar unidade..." className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none w-64 focus:ring-2 focus:ring-blue-500/10" />
            </div>
          </div>

          <div className="space-y-4 flex-1">
            {units.map((unit) => (
              <div key={unit.id} className="p-5 bg-slate-50 border border-slate-100 rounded-[2rem] flex items-center justify-between hover:bg-white hover:shadow-xl transition-all group">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 text-blue-600">
                    <Building2 size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-800 leading-none">{unit.name}</h4>
                    <div className="flex items-center gap-3 mt-2">
                       <span className="text-[10px] font-bold text-slate-400 uppercase">Gestor: {unit.manager}</span>
                       <span className="w-1 h-1 rounded-full bg-slate-300" />
                       <span className="text-[10px] font-bold text-slate-400 uppercase">{unit.students} Alunos</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-xl text-[9px] font-black border border-emerald-100 flex items-center gap-2">
                     <CheckCircle2 size={12} /> ATIVA
                   </div>
                   <button className="p-3 text-slate-300 hover:text-blue-600 hover:bg-white rounded-xl transition-all">
                      <ExternalLink size={18} />
                   </button>
                   <button className="p-3 text-slate-300 hover:text-slate-600">
                      <MoreVertical size={18} />
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cadastro de Gestor / Ação Rápida */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute right-[-10%] top-[-10%] opacity-10 group-hover:scale-110 transition-transform duration-700">
               <UserPlus size={200} />
            </div>
            <h4 className="text-xl font-black leading-tight mb-2">Novo Gestor Institucional</h4>
            <p className="text-slate-400 text-xs font-medium leading-relaxed mb-8">
              Crie a conta mestre para o diretor de uma unidade. Ele terá autonomia total dentro do seu tenant.
            </p>
            <div className="space-y-4 mb-8">
               <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                  <p className="text-[9px] font-black uppercase text-slate-500 mb-1">Unidade Alvo</p>
                  <select className="bg-transparent text-sm font-bold w-full outline-none appearance-none cursor-pointer">
                     <option className="bg-slate-900">Selecionar Unidade...</option>
                     {units.map(u => <option key={u.id} className="bg-slate-900">{u.name}</option>)}
                  </select>
               </div>
               <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                  <p className="text-[9px] font-black uppercase text-slate-500 mb-1">E-mail do Gestor</p>
                  <input type="text" placeholder="diretor@escola.gov.br" className="bg-transparent text-sm font-bold w-full outline-none" />
               </div>
            </div>
            <button className="w-full bg-indigo-600 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-900/50 hover:bg-indigo-500 transition-all">
              VINCULAR E CRIAR ACESSO
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-100 p-8 rounded-[3rem]">
             <h4 className="text-[10px] font-black text-blue-900 uppercase tracking-widest mb-4">Monitoramento Core</h4>
             <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                   <span className="font-bold text-blue-700">Uptime Servidores</span>
                   <span className="font-black text-blue-900">99.9%</span>
                </div>
                <div className="w-full h-1.5 bg-blue-100 rounded-full overflow-hidden">
                   <div className="w-[99.9%] h-full bg-blue-600 rounded-full" />
                </div>
                <p className="text-[9px] text-blue-600 font-medium leading-relaxed mt-2">
                  Backup global em nuvem executado há 4h. Sincronização de dados em tempo real estável.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPlataformaDashboard;
