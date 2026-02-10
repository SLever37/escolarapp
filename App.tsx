
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Bell, Search, Building2 } from 'lucide-react';

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
import RequireAuth from './components/RequireAuth';

// Auth
import { useAuth } from './context/AuthContext';

const App: React.FC = () => {
  const { usuario, signOut } = useAuth();

  if (!usuario) {
    return <Login />;
  }

  // Controlador de Dashboard Raiz baseado no Papel
  const renderDashboardPrincipal = () => {
    switch (usuario.papel) {
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
      <NavegacaoLateral usuario={usuario} aoSair={signOut} />

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-10 shrink-0 z-40">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-2 rounded-2xl">
              <Building2 size={16} className="text-blue-600" />
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-blue-600 uppercase tracking-tighter">Instância Ativa</span>
                <span className="text-xs font-bold text-slate-700">{usuario.unidade}</span>
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
              <Route path="/" element={<RequireAuth><>{renderDashboardPrincipal()}</></RequireAuth>} />
              <Route path="/secretaria" element={<RequireAuth><GuardiaoPermissao modulo="secretaria_legal"><SecretariaLegal /></GuardiaoPermissao></RequireAuth>} />
              <Route path="/professor" element={<RequireAuth><GuardiaoPermissao modulo="diario_classe"><DiarioProfessor /></GuardiaoPermissao></RequireAuth>} />
              <Route path="/pedagogia" element={<RequireAuth><GuardiaoPermissao modulo="pedagogia_central"><DashboardPedagogo /></GuardiaoPermissao></RequireAuth>} />
              <Route path="/portaria" element={<RequireAuth><GuardiaoPermissao modulo="portaria_acesso"><PortariaAcesso /></GuardiaoPermissao></RequireAuth>} />
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
