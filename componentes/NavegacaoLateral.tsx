
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, UserSquare2, 
  GraduationCap, FileText, Database, Globe,
  ShieldCheck, LogOut, BrainCircuit, KeyRound,
  ClipboardList, School
} from 'lucide-react';
import { Usuario } from '../tipos';
import { temPermissao } from '../servicos/governanca';

interface SidebarProps {
  usuario: Usuario;
  aoSair: () => void;
}

const NavegacaoLateral: React.FC<SidebarProps> = ({ usuario, aoSair }) => {
  const location = useLocation();

  const LinkMenu = ({ para, icone, label, modulo }: any) => {
    const ativo = location.pathname === para;
    
    // Verifica permissão no serviço de governança
    if (!temPermissao(usuario, modulo, 'ver')) return null;

    return (
      <Link 
        to={para} 
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all
          ${ativo ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-blue-100/70 hover:bg-blue-800/40 hover:text-white'}`}
      >
        {React.cloneElement(icone, { size: 18 })}
        <span className="truncate">{label}</span>
      </Link>
    );
  };

  return (
    <aside className="w-72 bg-[#1e3a8a] text-white flex flex-col h-full shrink-0 transition-all duration-300">
      <div className="p-8 border-b border-blue-800/50 flex items-center gap-4">
        <div className="bg-white p-2 rounded-2xl shadow-lg">
          <GraduationCap className="text-[#1e3a8a]" size={28} />
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tighter leading-none">EscolarApp</h1>
          <p className="text-[9px] uppercase tracking-widest opacity-60 mt-1">Governança Digital</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-8 custom-scrollbar">
        
        {/* NÍVEL 0: MASTER */}
        {usuario.papel === 'admin_plataforma' && (
          <div className="space-y-1">
            <h3 className="px-4 mb-4 text-[9px] font-black text-blue-300 opacity-50 uppercase tracking-[0.2em]">Painel Master</h3>
            <LinkMenu para="/" icone={<Globe />} label="Ecossistema" modulo="painel_estrategico" />
            <LinkMenu para="/backup" icone={<Database />} label="Servidores" modulo="backup_institucional" />
            <LinkMenu para="/auditoria" icone={<ShieldCheck />} label="Auditoria Global" modulo="auditoria_forense" />
          </div>
        )}

        {/* NÍVEL 1: GESTOR (Vê tudo da unidade) */}
        {usuario.papel === 'gestor' && (
          <>
            <div className="space-y-1">
              <h3 className="px-4 mb-4 text-[9px] font-black text-blue-300 opacity-50 uppercase tracking-[0.2em]">Estratégico</h3>
              <LinkMenu para="/" icone={<LayoutDashboard />} label="Torre de Controle" modulo="painel_estrategico" />
              <LinkMenu para="/acessos" icone={<KeyRound />} label="Gestão de Acessos" modulo="painel_estrategico" />
            </div>
            <div className="space-y-1">
              <h3 className="px-4 mb-4 text-[9px] font-black text-blue-300 opacity-50 uppercase tracking-[0.2em]">Departamentos</h3>
              <LinkMenu para="/pedagogia" icone={<BrainCircuit />} label="Pedagogia" modulo="pedagogia_central" />
              <LinkMenu para="/secretaria" icone={<FileText />} label="Secretaria" modulo="secretaria_legal" />
              <LinkMenu para="/portaria" icone={<School />} label="Portaria" modulo="portaria_acesso" />
            </div>
          </>
        )}

        {/* NÍVEL 2: PEDAGOGIA */}
        {usuario.papel === 'pedagogia' && (
          <div className="space-y-1">
            <h3 className="px-4 mb-4 text-[9px] font-black text-blue-300 opacity-50 uppercase tracking-[0.2em]">Coordenação</h3>
            <LinkMenu para="/" icone={<BrainCircuit />} label="Painel Pedagógico" modulo="pedagogia_central" />
            <LinkMenu para="/grade" icone={<ClipboardList />} label="Grade Horária" modulo="grade_horarios" />
            <LinkMenu para="/diarios" icone={<UserSquare2 />} label="Supervisão Diários" modulo="diario_classe" />
          </div>
        )}

        {/* NÍVEL 3: SECRETARIA */}
        {usuario.papel === 'secretaria' && (
          <div className="space-y-1">
            <h3 className="px-4 mb-4 text-[9px] font-black text-blue-300 opacity-50 uppercase tracking-[0.2em]">Administrativo</h3>
            <LinkMenu para="/" icone={<FileText />} label="Secretaria Digital" modulo="secretaria_legal" />
            <LinkMenu para="/familia" icone={<Users />} label="Portal Família" modulo="portal_familia" />
          </div>
        )}

        {/* NÍVEL 4: PROFESSOR */}
        {usuario.papel === 'professor' && (
          <div className="space-y-1">
            <h3 className="px-4 mb-4 text-[9px] font-black text-blue-300 opacity-50 uppercase tracking-[0.2em]">Docência</h3>
            <LinkMenu para="/" icone={<UserSquare2 />} label="Meu Diário" modulo="diario_classe" />
          </div>
        )}

      </nav>

      <div className="p-6 bg-blue-900/40 border-t border-blue-800">
        <div className="flex items-center gap-4">
          <img src={`https://ui-avatars.com/api/?name=${usuario.nome}&background=0D8ABC&color=fff`} className="w-10 h-10 rounded-xl border-2 border-blue-400" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-black truncate">{usuario.nome}</p>
            <p className="text-[9px] opacity-60 uppercase font-bold truncate">{usuario.papel.replace('_', ' ')}</p>
          </div>
          <button onClick={aoSair} className="text-blue-300 hover:text-white transition-colors"><LogOut size={16} /></button>
        </div>
      </div>
    </aside>
  );
};

export default NavegacaoLateral;
