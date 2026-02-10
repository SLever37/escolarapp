import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, LogOut } from 'lucide-react';
import { Usuario } from '../tipos';
import { obterMenuPorPerfil } from '../src/utils/menuConfig';

interface SidebarProps {
  usuario: Usuario;
  aoSair: () => void;
}

const NavegacaoLateral: React.FC<SidebarProps> = ({ usuario, aoSair }) => {
  const location = useLocation();
  const menu = obterMenuPorPerfil(usuario);

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

      <nav className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
        {menu.map((item) => {
          const Icone = item.icone;
          const ativo = location.pathname === item.para;
          return (
            <Link
              key={item.para}
              to={item.para}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all
                ${ativo ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-blue-100/70 hover:bg-blue-800/40 hover:text-white'}`}
            >
              <Icone size={18} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
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
