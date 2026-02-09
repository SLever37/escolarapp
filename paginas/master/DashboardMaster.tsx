
import React, { useState, useEffect } from 'react';
import { 
  Building2, Users, Plus, ShieldCheck, Globe, 
  Search, MoreVertical, LayoutGrid, CheckCircle2, 
  UserPlus, ExternalLink, Activity, Database, X
} from 'lucide-react';
import { bd } from '../../servicos/bancoDeDados';
import { UnidadeEscolar } from '../../tipos';

const DashboardMaster = () => {
  const [unidades, setUnidades] = useState<UnidadeEscolar[]>([]);
  const [novaUnidadeNome, setNovaUnidadeNome] = useState('');
  const [gestorEmail, setGestorEmail] = useState('');
  const [gestorNome, setGestorNome] = useState('');
  const [unidadeSelecionada, setUnidadeSelecionada] = useState('');

  useEffect(() => {
    setUnidades(bd.getUnidades());
  }, []);

  const handleCriarUnidade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaUnidadeNome.trim()) return;
    bd.adicionarUnidade(novaUnidadeNome);
    setUnidades(bd.getUnidades());
    setNovaUnidadeNome('');
    alert('Unidade provisionada com sucesso!');
  };

  const handleVincularGestor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unidadeSelecionada || !gestorNome) return;
    bd.adicionarUsuario(gestorNome, 'gestor', unidadeSelecionada);
    setUnidades(bd.getUnidades());
    setGestorNome('');
    setGestorEmail('');
    alert(`Acesso de Gestor criado para ${gestorNome}`);
  };

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
      </header>

      {/* KPIs da Plataforma */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPICardMaster label="Unidades Providas" valor={unidades.length} icone={<Building2 />} cor="indigo" />
        <KPICardMaster label="Usuários em Rede" valor="4.850" icone={<Users />} cor="blue" />
        <KPICardMaster label="Uptime Servidores" valor="99.9%" icone={<Activity />} cor="emerald" />
        <KPICardMaster label="Segurança Core" valor="Ativa" icone={<ShieldCheck />} cor="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Listagem de Unidades Providas */}
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
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-2">Gestor: <span className={u.gestorNome === 'Pendente' ? 'text-rose-500' : 'text-indigo-600'}>{u.gestorNome}</span></p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                   <span className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-xl text-[9px] font-black border border-emerald-100 flex items-center gap-2">
                     <CheckCircle2 size={12} /> ATIVA
                   </span>
                   <button className="p-3 text-slate-300 hover:text-blue-600 transition-all"><ExternalLink size={18} /></button>
                   <button className="p-3 text-slate-300 hover:text-slate-600"><MoreVertical size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cadastro de Unidade e Gestor */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6">Nova Unidade</h4>
            <form onSubmit={handleCriarUnidade} className="space-y-4">
               <input 
                 value={novaUnidadeNome}
                 onChange={e => setNovaUnidadeNome(e.target.value)}
                 placeholder="Nome da Escola / Unidade" 
                 className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-xs font-bold outline-none focus:border-indigo-500 transition-all" 
               />
               <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                 <Plus size={16} /> Provisionar Unidade
               </button>
            </form>
          </div>

          <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute right-[-10%] top-[-10%] opacity-10 group-hover:scale-110 transition-transform duration-700">
               <UserPlus size={200} />
            </div>
            <h4 className="text-xl font-black leading-tight mb-2">Vincular Gestor</h4>
            <p className="text-slate-400 text-xs font-medium leading-relaxed mb-8">Conceda autonomia total a um diretor institucional.</p>
            
            <form onSubmit={handleVincularGestor} className="space-y-4 mb-8">
               <input 
                 value={gestorNome}
                 onChange={e => setGestorNome(e.target.value)}
                 placeholder="Nome Completo do Gestor" 
                 className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-xs font-bold outline-none focus:border-blue-500" 
               />
               <input 
                 value={gestorEmail}
                 onChange={e => setGestorEmail(e.target.value)}
                 placeholder="E-mail Institucional" 
                 className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-xs font-bold outline-none focus:border-blue-500" 
               />
               <select 
                 value={unidadeSelecionada}
                 onChange={e => setUnidadeSelecionada(e.target.value)}
                 className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-xs font-bold outline-none text-slate-400 cursor-pointer"
               >
                 <option value="" className="bg-slate-900">Selecionar Unidade...</option>
                 {unidades.map(u => <option key={u.id} value={u.nome} className="bg-slate-900">{u.nome}</option>)}
               </select>
               
               <button type="submit" className="w-full bg-indigo-600 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-900/40">
                 GERAR CREDENCIAIS MASTER
               </button>
            </form>
            
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest leading-relaxed">
                Nota: O gestor receberá as instruções de acesso e chaves de criptografia via e-mail institucional.
              </p>
            </div>
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
