
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './servicos/contexto/AuthContext';
import NavegacaoLateral from './componentes/NavegacaoLateral';
import { Menu, X, Bell, Search, Building2 } from 'lucide-react';

// Paginas
import Login from './paginas/Login';
import AcessoNegado from './paginas/AcessoNegado';
import DashboardMaster from './paginas/master/DashboardMaster';
import AuditoriaGlobal from './paginas/master/AuditoriaGlobal';
import ResilienciaSistema from './paginas/master/ResilienciaSistema';
import SuporteCentral from './paginas/master/SuporteCentral';
import PainelGestor from './paginas/gestao/PainelGestor';
import SuporteMaster from './paginas/gestao/SuporteMaster';
import PedagogiaCentral from './paginas/pedagogia/PedagogiaCentral';
import GradeHorarios from './paginas/pedagogia/GradeHorarios';
import SecretariaLegal from './paginas/secretaria/SecretariaLegal';
import DiarioProfessor from './paginas/professor/DiarioProfessor';
import PortariaAcesso from './paginas/portaria/PortariaAcesso';
import PortalFamilia from './paginas/familia/PortalFamilia';
import MensageiroCentral from './paginas/MensageiroCentral';

import { GuardaRota } from './rotas/GuardaRota';

const App: React.FC = () => {
  const { usuario, loading } = useAuth();
  const [sidebarAberta, setSidebarAberta] = useState(false);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-900 text-white">
      <div className="animate-pulse font-black tracking-widest uppercase text-sm">SINCRO_SISTEMA_CORE...</div>
    </div>
  );

  const toggleSidebar = () => setSidebarAberta(!sidebarAberta);

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden relative">
      {usuario && (
        <>
          {/* Backdrop para Mobile */}
          {sidebarAberta && (
            <div 
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] lg:hidden transition-opacity"
              onClick={toggleSidebar}
            />
          )}
          <NavegacaoLateral aberta={sidebarAberta} aoFechar={toggleSidebar} />
        </>
      )}
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {usuario && (
          <header className="h-16 lg:h-20 bg-white border-b border-slate-100 flex items-center justify-between px-4 lg:px-10 shrink-0 z-40">
            <div className="flex items-center gap-3 lg:gap-4">
              <button 
                onClick={toggleSidebar}
                className="p-2 lg:hidden text-slate-600 hover:bg-slate-50 rounded-xl"
              >
                <Menu size={24} />
              </button>
              
              <div className="flex items-center gap-2 lg:gap-3 bg-slate-50 border border-slate-200 px-3 lg:px-4 py-1.5 lg:py-2 rounded-xl lg:rounded-2xl max-w-[180px] lg:max-w-none">
                <Building2 size={16} className="text-blue-600 shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className="text-[8px] lg:text-[9px] font-black text-blue-600 uppercase tracking-tighter truncate">Instância Ativa</span>
                  <span className="text-[10px] lg:text-xs font-bold text-slate-700 truncate">{usuario.unidade || "Core Central"}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 lg:gap-6">
              <div className="hidden md:flex items-center bg-slate-50 border border-slate-100 px-4 py-2 rounded-2xl w-64 lg:w-80">
                <Search size={16} className="text-slate-400" />
                <input placeholder="Busca global..." className="bg-transparent border-none outline-none text-xs font-medium ml-3 w-full" />
              </div>
              
              <button className="relative p-2 lg:p-2.5 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-xl transition-all">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
              </button>
            </div>
          </header>
        )}

        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#f8fafc]">
          <Routes>
            <Route path="/acesso" element={!usuario ? <Login /> : <Navigate to="/" />} />
            <Route path="/acesso-negado" element={<AcessoNegado />} />

            {/* Rotas Master (Nível 0) */}
            <Route element={<GuardaRota papeisPermitidos={['admin_plataforma']} />}>
              <Route path="/master" element={<DashboardMaster />} />
              <Route path="/master/auditoria" element={<AuditoriaGlobal />} />
              <Route path="/master/resiliencia" element={<ResilienciaSistema />} />
              <Route path="/master/suporte" element={<SuporteCentral />} />
            </Route>

            {/* Rotas Gestor (Nível 1) */}
            <Route element={<GuardaRota papeisPermitidos={['gestor']} />}>
              <Route path="/gestao" element={<PainelGestor />} />
              <Route path="/gestao/suporte" element={<SuporteMaster />} />
            </Route>

            {/* Chat Comum (Todos) */}
            <Route element={<GuardaRota papeisPermitidos={['gestor', 'pedagogia', 'secretaria', 'professor', 'familia']} />}>
              <Route path="/mensagens" element={<MensageiroCentral />} />
            </Route>

            <Route element={<GuardaRota papeisPermitidos={['pedagogia', 'gestor']} />}>
              <Route path="/supervisao" element={<PedagogiaCentral />} />
              <Route path="/supervisao/grade-horarios" element={<GradeHorarios />} />
            </Route>

            <Route element={<GuardaRota papeisPermitidos={['secretaria', 'gestor']} />}>
              <Route path="/secretaria" element={<SecretariaLegal />} />
            </Route>

            <Route element={<GuardaRota papeisPermitidos={['professor', 'gestor']} />}>
              <Route path="/professor" element={<DiarioProfessor />} />
            </Route>

            <Route element={<GuardaRota papeisPermitidos={['familia']} />}>
              <Route path="/familia/:cpf" element={<PortalFamilia />} />
            </Route>

            <Route element={<GuardaRota papeisPermitidos={['portaria', 'gestor']} />}>
              <Route path="/portaria" element={<PortariaAcesso />} />
            </Route>

            <Route path="/" element={
              !usuario ? <Navigate to="/acesso" /> :
              usuario.papel === 'admin_plataforma' ? <Navigate to="/master" /> :
              usuario.papel === 'gestor' ? <Navigate to="/gestao" /> :
              usuario.papel === 'pedagogia' ? <Navigate to="/supervisao" /> :
              usuario.papel === 'secretaria' ? <Navigate to="/secretaria" /> :
              usuario.papel === 'professor' ? <Navigate to="/professor" /> :
              usuario.papel === 'portaria' ? <Navigate to="/portaria" /> :
              <Navigate to="/acesso-negado" />
            } />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default App;
