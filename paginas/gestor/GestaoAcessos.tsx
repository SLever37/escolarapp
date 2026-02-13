import React, { useState } from 'react';
import { 
  UserPlus, ShieldCheck, ShieldAlert, 
  Search, MoreHorizontal, Filter, Clock, 
  Eye, Edit3, Trash2, KeyRound, Users
} from 'lucide-react';
import { KpiCard, SectionHeader, AlertItem } from '../../componentes/DashboardUI';
import ModalConfirmacao from '../../componentes/ModalConfirmacao';

const GestaoAcessos = () => {
  const [activeTab, setActiveTab] = useState('usuarios');
  const [modalDeletar, setModalDeletar] = useState<{aberto: boolean, usuario: any | null}>({
    aberto: false,
    usuario: null
  });

  const handleDeletarUsuario = (usuario: any) => {
    setModalDeletar({ aberto: true, usuario });
  };

  const confirmarExclusao = () => {
    // Lógica real de exclusão viria aqui
    console.log(`Excluindo usuário: ${modalDeletar.usuario?.name}`);
    setModalDeletar({ aberto: false, usuario: null });
    alert('Usuário removido da base de governança.');
  };

  return (
    <div className="p-4 lg:p-10 space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter leading-none">Gestão de Acessos & Delegação</h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">Controle de privilégios institucionais e conformidade de acesso.</p>
        </div>
        <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl flex items-center gap-2 hover:bg-slate-800 transition-all">
          <UserPlus size={18} /> Novo Usuário Delegado
        </button>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
         <KpiCard title="Usuários Ativos" value="58" icon={<Users />} color="blue" />
         <KpiCard title="Acessos Delegados" value="12" icon={<KeyRound />} color="violet" />
         <KpiCard title="Tentativas de Bloqueio" value="03" icon={<ShieldAlert />} color="rose" />
         <KpiCard title="Auditoria LGPD" value="OK" icon={<ShieldCheck />} color="emerald" />
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/30">
           <div className="flex gap-1 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
              {['Usuarios', 'Delegacoes', 'Seguranca'].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.toLowerCase() ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-700'}`}
                >
                  {tab === 'Delegacoes' ? 'Delegações' : tab === 'Seguranca' ? 'Segurança' : 'Usuários'}
                </button>
              ))}
           </div>
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input type="text" placeholder="Buscar por nome ou cargo..." className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none w-full md:w-80 shadow-sm focus:ring-2 focus:ring-blue-500 transition-all" />
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
             <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <tr>
                   <th className="px-8 py-6">Funcionário</th>
                   <th className="px-6 py-6">Cargo Base</th>
                   <th className="px-6 py-6">Funções Delegadas</th>
                   <th className="px-6 py-6 text-center">Último Acesso</th>
                   <th className="px-8 py-6"></th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
                <TableRow 
                  name="Sra. Maria Auxiliadora" 
                  role="Serviços Gerais" 
                  delegation="Estoque da Cozinha (Full)" 
                  time="Há 10 min" 
                  img="https://picsum.photos/id/64/48/48"
                  status="ativo"
                  onDelete={() => handleDeletarUsuario({name: "Sra. Maria Auxiliadora"})}
                />
                <TableRow 
                  name="Sr. Cláudio Rocha" 
                  role="Vigia" 
                  delegation="Inventário & Patrimônio" 
                  time="Ontem, 14:20" 
                  img="https://picsum.photos/id/65/48/48"
                  status="ativo"
                  onDelete={() => handleDeletarUsuario({name: "Sr. Cláudio Rocha"})}
                />
             </tbody>
          </table>
        </div>
      </div>

      <ModalConfirmacao 
        aberto={modalDeletar.aberto}
        tipo="excluir"
        titulo="Revogar Acesso"
        itemNome={modalDeletar.usuario?.name || ''}
        onConfirmar={confirmarExclusao}
        onFechar={() => setModalDeletar({ aberto: false, usuario: null })}
      />
    </div>
  );
};

const TableRow = ({ name, role, delegation, time, img, status, onDelete }: any) => (
  <tr className="hover:bg-slate-50 transition-colors group">
     <td className="px-8 py-5">
        <div className="flex items-center gap-4">
           <img src={img} className="w-10 h-10 rounded-xl object-cover" alt="" />
           <div>
              <p className="text-sm font-black text-slate-800 leading-none">{name}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 leading-none">Matrícula: 2024-0012</p>
           </div>
        </div>
     </td>
     <td className="px-6 py-5">
        <span className="text-xs font-bold text-slate-600 uppercase tracking-tighter">{role}</span>
     </td>
     <td className="px-6 py-5">
        <div className="flex items-center gap-2">
           <div className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg border border-blue-100 flex items-center gap-2">
              <KeyRound size={12} />
              <span className="text-[9px] font-black uppercase tracking-widest">{delegation}</span>
           </div>
        </div>
     </td>
     <td className="px-6 py-5 text-center text-slate-400">
        <div className="flex items-center justify-center gap-2">
           <Clock size={12} />
           <span className="text-[10px] font-black uppercase tracking-widest">{time}</span>
        </div>
     </td>
     <td className="px-8 py-5 text-right">
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
           <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-slate-100 transition-all"><Edit3 size={16} /></button>
           <button onClick={onDelete} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-slate-100 transition-all"><Trash2 size={16} /></button>
           <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-slate-100 transition-all"><MoreHorizontal size={16} /></button>
        </div>
     </td>
  </tr>
);

export default GestaoAcessos;