import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, GraduationCap, Globe,
  LogOut, Eye, ShieldCheck, LifeBuoy, MessageSquare, X, Activity,
  FileText, UserSquare2, School, Database, Users, Network
} from 'lucide-react';
import { useAuth } from '../servicos/contexto/AuthContext';

interface Props {
  aberta: boolean;
  aoFechar: () => void;
}

const NavegacaoLateral: React.FC<Props> = ({ aberta, aoFechar }) => {
  const location = useLocation();
  const { usuario, sair } = useAuth();

  if (!usuario) return null;

  const LinkMenu = ({ para, icone, label }: any) => {
    const ativo = location.pathname === para;
    return (
      <Link 
        to={para} 
        onClick={() => {
          if (window.innerWidth < 1024) aoFechar();
        }}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all
          ${ativo ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-blue-100/60 hover:bg-white/5 hover:text-white'}`}
      >
        {React.cloneElement(icone as React.ReactElement<any>, { size: 18 })}
        <span className="truncate">{label}</span>
      </Link>
    );
  };

  return (
    <aside className={`
      fixed inset-y-0 left-0 w-72 bg-[#0f172a] text-white flex flex-col h-full z-[70] transition-transform duration-300 ease-in-out border-r border-white/5
      lg:relative lg:translate-x-0
      ${aberta ? 'translate-x-0' : '-translate-x-full'}
    `}>
      <div className="p-6 lg:p-8 border-b border-white/5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4 min-w-0">
          <div className="bg-blue-600 p-2 rounded-lg shadow-xl shrink-0">
            < GraduationCap className="text-white" size={24} />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-black tracking-tighter leading-none truncate">EscolarApp</h1>
            <p className="text-[9px] uppercase tracking-widest text-blue-400 font-black mt-1">Plataforma Core</p>
          </div>
        </div>
        <button onClick={aoFechar} className="lg:hidden p-2 text-slate-400 hover:text-white">
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-8 custom-scrollbar">
        {usuario.papel === 'admin_plataforma' && (
          <>
            <div className="space-y-1">
              <h3 className="px-4 mb-4 text-[9px] font-black text-slate-500 uppercase tracking-widest">Dashboard Master</h3>
              <LinkMenu para="/master" icone={<LayoutDashboard />} label="Painel de Controle" />
            </div>
            <div className="space-y-1">
              <h3 className="px-4 mb-4 text-[9px] font-black text-slate-500 uppercase tracking-widest">Governança Global</h3>
              <LinkMenu para="/master/rede" icone={<Network />} label="Rede Federada" />
              <LinkMenu para="/master/gestores" icone={<Users />} label="Gestores Master" />
              <LinkMenu para="/master/resiliencia" icone={<Activity />} label="Uptime Cluster" />
              <LinkMenu para="/master/integridade" icone={<Database />} label="Integridade DB" />
            </div>
            <div className="space-y-1">
              <h3 className="px-4 mb-4 text-[9px] font-black text-slate-500 uppercase tracking-widest">Segurança</h3>
              <LinkMenu para="/master/auditoria" icone={<Eye />} label="Auditoria Forense" />
              <LinkMenu para="/master/suporte" icone={<LifeBuoy />} label="Chamados Direção" />
            </div>
          </>
        )}

        {usuario.papel === 'gestor' && (
          <>
            <div className="space-y-1">
              <h3 className="px-4 mb-4 text-[9px] font-black text-slate-500 uppercase tracking-widest">Estratégico</h3>
              <LinkMenu para="/gestao" icone={<LayoutDashboard />} label="Painel Unidade" />
              <LinkMenu para="/mensagens" icone={<MessageSquare />} label="Mensageiro Central" />
            </div>
            <div className="space-y-1">
              <h3 className="px-4 mb-4 text-[9px] font-black text-slate-500 uppercase tracking-widest">Operacional</h3>
              <LinkMenu para="/secretaria" icone={<FileText />} label="Secretaria" />
              <LinkMenu para="/supervisao/grade-horarios" icone={<Activity />} label="Grades" />
              <LinkMenu para="/professor" icone={<UserSquare2 />} label="Diários" />
              <LinkMenu para="/portaria" icone={<School />} label="Portaria" />
            </div>
          </>
        )}
      </nav>

      <div className="p-6 bg-slate-900/50 border-t border-white/5 mt-auto shrink-0">
        <div className="flex items-center gap-4">
          <img src={`https://ui-avatars.com/api/?name=${usuario.nome}&background=3b82f6&color=fff`} className="w-10 h-10 rounded-lg" alt="Avatar" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-black truncate">{usuario.nome}</p>
            <p className="text-[9px] text-blue-400 uppercase font-black truncate">Nível de Acesso {usuario.nivel}</p>
          </div>
          <button onClick={sair} className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default NavegacaoLateral;