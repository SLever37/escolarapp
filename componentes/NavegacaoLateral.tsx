
import React from 'react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, UserSquare2, Library, Package, 
  GraduationCap, Building2, FileText, Database, Globe,
  ShieldCheck, LogOut, Search, BrainCircuit, Gavel
} from 'lucide-react';
import { Usuario } from '../tipos';
import { podeAcessar } from '../servicos/permissoesService';

interface SidebarProps {
  usuario: Usuario;
  aoSair: () => void;
}

const roleLabels: Record<string, string> = {
  admin_plataforma: 'Administrador Plataforma',
  gestor: 'Gestor / Diretor',
  supervisao: 'Supervisão / Pedagogia',
  secretaria: 'Secretaria',
  professor: 'Professor',
  familia: 'Família',
  portaria: 'Portaria'
};

const NavegacaoLateral: React.FC<SidebarProps> = ({ usuario, aoSair }) => {
  const location = useLocation();

  const LinkMenu = ({ para, icone, label, modulo }: any) => {
    const ativo = location.pathname === para;
    const [permitido, setPermitido] = useState<boolean | null>(null);

    useEffect(() => {
      let mounted = true;
      (async () => {
        if (!usuario) { if (mounted) setPermitido(false); return; }
        // Perfis administrativos rápidos
        if (usuario.papel === 'admin_plataforma' || usuario.papel === 'gestor') { if (mounted) setPermitido(true); return; }
        try {
          const ok = await podeAcessar(usuario, modulo, 'ver' as any);
          if (mounted) setPermitido(ok);
        } catch (e) {
          if (mounted) setPermitido(false);
        }
      })();
      return () => { mounted = false; };
    }, [usuario, modulo]);

    if (permitido === null) return null; // evita flicker
    if (!permitido) return null;

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
    <aside className="w-72 bg-[#1e3a8a] text-white flex flex-col h-full shrink-0">
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
        {usuario.papel === 'admin_plataforma' ? (
          <div className="space-y-1">
            <h3 className="px-4 mb-4 text-[9px] font-black text-blue-300 opacity-50 uppercase tracking-[0.2em]">Painel Master</h3>
            <LinkMenu para="/" icone={<Globe />} label="Ecossistema" modulo="painel_estrategico" />
            <LinkMenu para="/backup" icone={<Database />} label="Servidores" modulo="backup_institucional" />
            <LinkMenu para="/auditoria" icone={<ShieldCheck />} label="Auditoria" modulo="auditoria_forense" />
          </div>
        ) : (
          <>
            <div className="space-y-1">
              <h3 className="px-4 mb-4 text-[9px] font-black text-blue-300 opacity-50 uppercase tracking-[0.2em]">Estratégico</h3>
              <LinkMenu para="/" icone={<LayoutDashboard />} label="Painel" modulo="painel_estrategico" />
              <LinkMenu para="/secretaria" icone={<FileText />} label="Secretaria" modulo="secretaria_legal" />
            </div>
            <div className="space-y-1">
              <h3 className="px-4 mb-4 text-[9px] font-black text-blue-300 opacity-50 uppercase tracking-[0.2em]">Pedagógico</h3>
              <LinkMenu para="/pedagogia" icone={<BrainCircuit />} label="Núcleo Central" modulo="pedagogia_central" />
              <LinkMenu para="/professor" icone={<UserSquare2 />} label="Meu Diário" modulo="diario_classe" />
            </div>
          </>
        )}
      </nav>

      <div className="p-6 bg-blue-900/40 border-t border-blue-800">
        <div className="flex items-center gap-4">
          <img src={`https://ui-avatars.com/api/?name=${usuario.nome}&background=0D8ABC&color=fff`} className="w-10 h-10 rounded-xl border-2 border-blue-400" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-black truncate">{usuario.nome}</p>
            <p className="text-[9px] opacity-60 uppercase font-bold">{usuario.papel.replace('_', ' ')}</p>
          </div>
          <button onClick={aoSair} className="text-blue-300 hover:text-white transition-colors"><LogOut size={16} /></button>
        </div>
      </div>
    </aside>
  );
};

export default NavegacaoLateral;
