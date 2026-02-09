
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Bell, Search, Building2, Menu } from 'lucide-react';

// Paginas
import Login from './paginas/Login';
import DashboardMaster from './paginas/master/DashboardMaster';
import DashboardGestor from './pages/DashboardGestor';
import DashboardPedagogo from './pages/DashboardPedagogo';
import SecretariaLegal from './pages/SecretariaLegal';
import DiarioProfessor from './pages/DiarioProfessor';
import PortariaAcesso from './pages/PortariaAcesso';
import AcessoNegado from './pages/AcessoNegado';

// Componentes
import NavegacaoLateral from './componentes/NavegacaoLateral';

// Tipos e Servicos
import { Usuario } from './tipos';
import { bd } from './servicos/bancoDeDados';

const App: React.FC = () => {
  const [estaAutenticado, setEstaAutenticado] = useState(false);
  const [usuarioAtual, setUsuarioAtual] = useState<Usuario | null>(null);
  const location = useLocation();

  const lidarComLogin = (usuario: Usuario) => {
    setUsuarioAtual(usuario);
    setEstaAutenticado(true);
  };

  const lidarComLogoff = () => {
    setEstaAutenticado(false);
    setUsuarioAtual(null);
  };

  if (!estaAutenticado || !usuarioAtual) {
    return <Login aoLogarUsuario={lidarComLogin} />;
  }

  // Controlador de Dashboard Raiz baseado no Papel
  const renderDashboardPrincipal = () => {
    switch (usuarioAtual.papel) {
      case 'admin_plataforma': return <DashboardMaster />;
      case 'gestor': return <DashboardGestor />;
      case 'pedagogia': return <DashboardPedagogo />;
      case 'professor': return <DiarioProfessor />;
      case 'secretaria': return <SecretariaLegal />;
      case 'portaria': return <PortariaAcesso />;
      default: return <DashboardPedagogo />;
    }
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-inter">
      <NavegacaoLateral usuario={usuarioAtual} aoSair={lidarComLogoff} />

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-10 shrink-0 z-40">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-2 rounded-2xl">
              <Building2 size={16} className="text-blue-600" />
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-blue-600 uppercase tracking-tighter">Instância Ativa</span>
                <span className="text-xs font-bold text-slate-700">{usuarioAtual.unidade}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center bg-slate-50 border border-slate-100 px-4 py-2 rounded-2xl w-80">
              <Search size={16} className="text-slate-400" />
              <input placeholder="Busca global inteligente..." className="bg-transparent border-none outline-none text-xs font-medium ml-3 w-full" />
            </div>
            
            <button className="relative p-2.5 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-xl transition-all">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
            </button>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={renderDashboardPrincipal()} />
              <Route path="/secretaria" element={<SecretariaLegal />} />
              <Route path="/professor" element={<DiarioProfessor />} />
              <Route path="/pedagogia" element={<DashboardPedagogo />} />
              <Route path="/portaria" element={<PortariaAcesso />} />
              <Route path="/acesso-negado" element={<AcessoNegado />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
