import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './servicos/contexto/AuthContext';
import NavegacaoLateral from './componentes/NavegacaoLateral';
import { Menu, Bell, Search, Building2, BellOff } from 'lucide-react';
import { supabase } from './supabaseClient';
import { Notificacao } from './tipos';

// Paginas Organizadas
import Login from './paginas/Login';
import AcessoNegado from './paginas/AcessoNegado';
import DashboardMaster from './paginas/master/DashboardMaster';
import AuditoriaGlobal from './paginas/master/AuditoriaGlobal';
import ResilienciaSistema from './paginas/master/ResilienciaSistema';
import SuporteCentral from './paginas/master/SuporteCentral';
import RedeFederadaPage from './paginas/master/RedeFederadaPage';
import GestoresMasterPage from './paginas/master/GestoresMasterPage';
import IntegridadeDBPage from './paginas/master/IntegridadeDBPage';

import PainelGestor from './paginas/gestao/PainelGestor';
import SuporteMaster from './paginas/gestao/SuporteMaster';
import MensageiroCentral from './paginas/MensageiroCentral';
import GradeHorarios from './paginas/pedagogia/GradeHorarios';
import SecretariaLegal from './paginas/secretaria/SecretariaLegal';
import DiarioProfessor from './paginas/professor/DiarioProfessor';
import PortariaAcesso from './paginas/portaria/PortariaAcesso';
import EscolaAmbiente from './paginas/escola/EscolaAmbiente';

import ModosDeOperacao from './paginas/configuracoes/ModosDeOperacao';
import PoliticaBackupInstitucional from './paginas/master/PoliticaBackupInstitucional';
import RastreabilidadeCompleta from './paginas/seguranca/RastreabilidadeCompleta';

import { GuardaRota } from './rotas/GuardaRota';

const App: React.FC = () => {
  const { usuario, loading } = useAuth();
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [mostrarNotificacoes, setMostrarNotificacoes] = useState(false);

  useEffect(() => {
    if (usuario) {
      const carregarNotificacoes = async () => {
        const { data } = await supabase
          .from('notificacoes')
          .select('*')
          .eq('lida', false)
          .order('criado_em', { ascending: false });
        if (data) setNotificacoes(data);
      };
      carregarNotificacoes();
    }
  }, [usuario]);

  if (loading && !usuario) return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-6 text-center">
      <div className="animate-pulse flex flex-col items-center gap-3">
        <div className="font-black tracking-tighter text-2xl lg:text-4xl text-blue-400">EscolarApp</div>
        <div className="font-bold tracking-[0.3em] uppercase text-xs opacity-60">Sincronizando Sessão...</div>
      </div>
    </div>
  );

  const toggleSidebar = () => setSidebarAberta(!sidebarAberta);

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden relative">
      {usuario && (
        <>
          {sidebarAberta && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] lg:hidden" onClick={toggleSidebar} />
          )}
          <NavegacaoLateral aberta={sidebarAberta} aoFechar={toggleSidebar} />
        </>
      )}
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {usuario && (
          <header className="h-16 lg:h-20 bg-white border-b border-slate-100 flex items-center justify-between px-4 lg:px-10 shrink-0 z-40">
            <div className="flex items-center gap-3">
              <button onClick={toggleSidebar} className="p-2 lg:hidden text-slate-600 hover:bg-slate-50 rounded-lg">
                <Menu size={24} />
              </button>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
                <Building2 size={16} className="text-blue-600 shrink-0" />
                <span className="text-[10px] lg:text-xs font-bold text-slate-700 truncate">{usuario.unidade || "Core Central"}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 relative">
              <div className="hidden md:flex items-center bg-slate-50 border border-slate-100 px-4 py-2 rounded-lg w-64 lg:w-80">
                <Search size={16} className="text-slate-400" />
                <input placeholder="Busca inteligente..." className="bg-transparent border-none outline-none text-xs font-medium ml-3 w-full text-slate-800" />
              </div>
              <button onClick={() => setMostrarNotificacoes(!mostrarNotificacoes)} className="relative p-2.5 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-lg transition-all">
                <Bell size={20} />
                {notificacoes.length > 0 && <span className="absolute top-2 right-2 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full border-2 border-white flex items-center justify-center">{notificacoes.length}</span>}
              </button>
            </div>
          </header>
        )}

        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#f8fafc]">
          <Routes>
            <Route path="/acesso" element={!usuario ? <Login /> : <Navigate to="/" />} />
            <Route path="/acesso-negado" element={<AcessoNegado />} />

            <Route element={<GuardaRota papeisPermitidos={['admin_plataforma']} />}>
              <Route path="/master" element={<DashboardMaster />} />
              <Route path="/master/rede" element={<RedeFederadaPage />} />
              <Route path="/master/gestores" element={<GestoresMasterPage />} />
              <Route path="/master/resiliencia" element={<ResilienciaSistema />} />
              <Route path="/master/integridade" element={<IntegridadeDBPage />} />
              <Route path="/master/auditoria" element={<AuditoriaGlobal />} />
              <Route path="/master/suporte" element={<SuporteCentral />} />
              <Route path="/master/backup" element={<PoliticaBackupInstitucional />} />
              <Route path="/escola/:id" element={<EscolaAmbiente />} />
              <Route path="/configuracoes/modos" element={<ModosDeOperacao />} />
              <Route path="/seguranca/rastreabilidade" element={<RastreabilidadeCompleta />} />
            </Route>

            <Route element={<GuardaRota papeisPermitidos={['gestor']} />}>
              <Route path="/gestao" element={<PainelGestor />} />
              <Route path="/gestao/suporte" element={<SuporteMaster />} />
              <Route path="/secretaria" element={<SecretariaLegal />} />
              <Route path="/supervisao/grade-horarios" element={<GradeHorarios />} />
              <Route path="/professor" element={<DiarioProfessor />} />
              <Route path="/portaria" element={<PortariaAcesso />} />
            </Route>

            <Route path="/mensagens" element={<MensageiroCentral />} />
            <Route path="/" element={!usuario ? <Navigate to="/acesso" /> : usuario.papel === 'admin_plataforma' ? <Navigate to="/master" /> : <Navigate to="/gestao" />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default App;