
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './servicos/contexto/AuthContext';
import NavegacaoLateral from './componentes/NavegacaoLateral';
import { Menu, Bell, Search, Building2 } from 'lucide-react';
import { supabase } from './supabaseClient';
import { Notificacao } from './tipos';

// Paginas
import Login from './paginas/Login';
import CadastroGestor from './paginas/auth/CadastroGestor';
import AcessoNegado from './paginas/AcessoNegado';
import DashboardMaster from './paginas/master/DashboardMaster';
import RedeFederadaPage from './paginas/master/RedeFederadaPage';
import GestoresMasterPage from './paginas/master/GestoresMasterPage';
import ResilienciaSistema from './paginas/master/ResilienciaSistema';
import IntegridadeDBPage from './paginas/master/IntegridadeDBPage';
import AuditoriaGlobal from './paginas/master/AuditoriaGlobal';
import SuporteCentral from './paginas/master/SuporteCentral';
import PoliticaBackupInstitucional from './paginas/master/PoliticaBackupInstitucional';
import EscolaAmbiente from './paginas/escola/EscolaAmbiente';

import PainelGestor from './paginas/gestao/PainelGestor';
import SuporteMaster from './paginas/gestao/SuporteMaster';
import MensageiroCentral from './paginas/MensageiroCentral';
import GradeHorarios from './paginas/pedagogia/GradeDeHorarios';
import SecretariaLegal from './paginas/secretaria/SecretariaLegal';
import DiarioProfessor from './paginas/professor/DiarioProfessor';
import PortariaAcesso from './paginas/portaria/PortariaAcesso';

import ModosDeOperacao from './paginas/configuracoes/ModosDeOperacao';
import RastreabilidadeCompleta from './paginas/seguranca/RastreabilidadeCompleta';

import { GuardaRota } from './rotas/GuardaRota';

const App: React.FC = () => {
  const { usuario, loading } = useAuth();
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);

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

  // Se estiver carregando mas JÁ TIVERMOS o usuário (cache), não bloqueamos a tela
  const mostrarLoader = loading && !usuario;

  if (mostrarLoader) return (
    <div className="h-screen flex items-center justify-center bg-slate-900 text-white">
      <div className="animate-pulse font-black text-2xl text-blue-400 tracking-tighter">EscolarApp...</div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden relative">
      {usuario && <NavegacaoLateral aberta={sidebarAberta} aoFechar={() => setSidebarAberta(false)} />}
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {usuario && (
          <header className="h-16 lg:h-20 bg-white border-b border-slate-100 flex items-center justify-between px-4 lg:px-10 shrink-0 z-40">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarAberta(true)} className="p-2 lg:hidden text-slate-600">
                <Menu size={24} />
              </button>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
                <Building2 size={16} className="text-blue-600 shrink-0" />
                <span className="text-xs font-bold text-slate-700">{usuario.unidade || "Core Central"}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
               <Bell size={20} className="text-slate-400" />
            </div>
          </header>
        )}

        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#f8fafc]">
          <Routes>
            <Route 
              path="/acesso" 
              element={usuario ? <Navigate to="/" replace /> : <Login />} 
            />
            
            <Route path="/cadastro-gestor" element={<CadastroGestor />} />
            <Route path="/acesso-negado" element={<AcessoNegado />} />

            <Route element={<GuardaRota papeisPermitidos={['admin_plataforma']} />}>
              <Route path="/master" element={<DashboardMaster />} />
              <Route path="/escola/:id" element={<EscolaAmbiente />} />
              <Route path="/master/rede" element={<RedeFederadaPage />} />
              <Route path="/master/gestores" element={<GestoresMasterPage />} />
              <Route path="/master/resiliencia" element={<ResilienciaSistema />} />
              <Route path="/master/integridade" element={<IntegridadeDBPage />} />
              <Route path="/master/auditoria" element={<AuditoriaGlobal />} />
              <Route path="/master/suporte" element={<SuporteCentral />} />
              <Route path="/master/backup" element={<PoliticaBackupInstitucional />} />
            </Route>

            <Route element={<GuardaRota papeisPermitidos={['gestor']} />}>
              <Route path="/gestao" element={<PainelGestor />} />
              <Route path="/mensagens" element={<MensageiroCentral />} />
              <Route path="/secretaria" element={<SecretariaLegal />} />
              <Route path="/supervisao/grade-horarios" element={<GradeHorarios />} />
              <Route path="/professor" element={<DiarioProfessor />} />
              <Route path="/portaria" element={<PortariaAcesso />} />
            </Route>

            <Route path="/" element={<Navigate to={usuario ? (usuario.papel === 'admin_plataforma' ? '/master' : '/gestao') : '/acesso'} />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default App;
