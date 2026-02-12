
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, UserSquare2, 
  GraduationCap, FileText, FileSearch, Globe,
  ShieldCheck, LogOut, BrainCircuit, ClipboardList, 
  Server, LifeBuoy, MessageSquare, X, Settings, ShieldAlert
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
    const ativo = location.pathname === para || (para !== '/' && location.pathname.startsWith(para));
    return (
      <Link 
        to={para} 
        onClick={() => {
          if (window.innerWidth < 1024) aoFechar();
        }}
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all
          ${ativo ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-blue-100/80 hover:bg-blue-800/60 hover:text-white'}`}
      >
        {React.cloneElement(icone, { size: 18 })}
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
      <div className="p-6 lg:p-8 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4 min-w-0">
          <div className="bg-blue-600 p-2 rounded-2xl shadow-xl shrink-0">
            <GraduationCap className="text-white" size={24} />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-black tracking-tighter leading-none truncate">EscolarApp</h1>
            <p className="text-[9px] uppercase tracking-widest text-blue-400 font-black mt-1">Nível {usuario.nivel}</p>
          </div>
        </div>
        <button 
          onClick={aoFechar}
          className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-8 custom-scrollbar">
        {usuario.papel === 'admin_plataforma' && (
          <>
            <div className="space-y-1">
              <h3 className="px-4 mb-4 text-[9px] font-black text-slate-500 uppercase tracking-widest">Controle de Ecossistema</h3>
              <LinkMenu para="/master" icone={<Globe />} label="Gestão de Escolas" />
              <LinkMenu para="/master/auditoria" icone={<ShieldAlert />} label="Auditoria Forense" />
              <LinkMenu para="/master/resiliencia" icone={<Server />} label="Resiliência & Core" />
            </div>
            <div className="space-y-1">
              <h3 className="px-4 mb-4 text-[9px] font-black text-slate-500 uppercase tracking-widest">Suporte Master</h3>
              <LinkMenu para="/master/suporte" icone={<LifeBuoy />} label="Chamados Diretores" />
            </div>
          </>
        )}

        {usuario.papel === 'gestor' && (
          <>
            <div className="space-y-1">
              <h3 className="px-4 mb-4 text-[9px] font-black text-slate-500 uppercase tracking-widest">Estratégico</h3>
              <LinkMenu para="/gestao" icone={<LayoutDashboard />} label="Painel Unidade" />
              <LinkMenu para="/mensagens" icone={<MessageSquare />} label="Canais de Comunicação" />
            </div>
            <div className="space-y-1">
              <h3 className="px-4 mb-4 text-[9px] font-black text-slate-500 uppercase tracking-widest">Ajuda</h3>
              <LinkMenu para="/gestao/suporte" icone={<LifeBuoy />} label="Ajuda Master" />
            </div>
          </>
        )}

        {['pedagogia', 'secretaria', 'professor'].includes(usuario.papel) && (
          <div className="space-y-1">
             <h3 className="px-4 mb-4 text-[9px] font-black text-slate-500 uppercase tracking-widest">Geral</h3>
             <LinkMenu para="/mensagens" icone={<MessageSquare />} label="Mensagens" />
          </div>
        )}
        
        {usuario.papel === 'pedagogia' && (
          <div className="space-y-1">
            <h3 className="px-4 mb-4 text-[9px] font-black text-slate-500 uppercase tracking-widest">Pedagogia</h3>
            <LinkMenu para="/supervisao" icone={<BrainCircuit />} label="Monitoramento" />
            <LinkMenu para="/supervisao/grade-horarios" icone={<ClipboardList />} label="Grade de Horários" />
          </div>
        )}

        {usuario.papel === 'secretaria' && (
          <div className="space-y-1">
            <h3 className="px-4 mb-4 text-[9px] font-black text-slate-500 uppercase tracking-widest">Secretaria</h3>
            <LinkMenu para="/secretaria" icone={<FileText />} label="Governança Legal" />
          </div>
        )}

        {usuario.papel === 'professor' && (
          <div className="space-y-1">
            <h3 className="px-4 mb-4 text-[9px] font-black text-slate-500 uppercase tracking-widest">Docência</h3>
            <LinkMenu para="/professor" icone={<UserSquare2 />} label="Diário de Classe" />
          </div>
        )}
      </nav>

      <div className="p-6 bg-slate-900/50 border-t border-white/5 mt-auto">
        <div className="flex items-center gap-4">
          <img src={`https://ui-avatars.com/api/?name=${usuario.nome}&background=3b82f6&color=fff`} className="w-10 h-10 rounded-xl shrink-0" alt="Avatar" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-black truncate">{usuario.nome}</p>
            <p className="text-[9px] text-blue-400 uppercase font-black truncate">{usuario.papel.replace('_', ' ')}</p>
          </div>
          <button onClick={sair} className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg shrink-0">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default NavegacaoLateral;
