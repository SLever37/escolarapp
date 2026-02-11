import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Bell, Search, Building2 } from 'lucide-react';

import Login from './paginas/Login';
import AcessoNegado from './pages/AcessoNegado';
import GestaoAcessos from './pages/gestor/GestaoAcessos';
import PedagogiaCentral from './pages/PedagogiaCentral';
import SecretariaLegal from './pages/SecretariaLegal';
import DiarioProfessor from './pages/DiarioProfessor';
import PortalFamilia from './pages/PortalFamilia';
import PortariaAcesso from './pages/PortariaAcesso';
import MensageiroCentral from './pages/MensageiroCentral';
import PerfilAlunoHub from './pages/PerfilAlunoHub';

import PainelMaster from './pages/paineis/PainelMaster';
import DashboardGestor from './pages/DashboardGestor';
import PainelSupervisor from './pages/paineis/PainelSupervisor';
import PainelSecretaria from './pages/paineis/PainelSecretaria';
import PainelProfessor from './pages/paineis/PainelProfessor';
import PainelFamilia from './pages/paineis/PainelFamilia';
import PainelPortaria from './pages/paineis/PainelPortaria';

import NavegacaoLateral from './componentes/NavegacaoLateral';
import GuardiaoDeRota from './components/roteamento/GuardiaoDeRota';

import { PapelUsuario } from './tipos';
import { rotaInicialPorPerfil } from './src/utils/perfis';
import { useSessaoPerfil } from './src/features/auth/useSessaoPerfil';

const PERFIS_DEV: PapelUsuario[] = ['admin_plataforma', 'gestor', 'pedagogia', 'secretaria', 'professor', 'familia', 'portaria', 'servicos_gerais'];

const App: React.FC = () => {
  const {
    carregando,
    sessaoAtiva,
    usuarioAtual,
    entrar,
    sair,
    supabaseConfigurado,
    trocarPerfilDev,
  } = useSessaoPerfil();

  if (carregando) {
    return <div className="h-screen flex items-center justify-center text-slate-500 font-bold">Carregando sessão...</div>;
  }

  if (!sessaoAtiva || !usuarioAtual) {
    return <Login aoEntrar={entrar} supabaseConfigurado={supabaseConfigurado} />;
  }

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-inter">
      <NavegacaoLateral usuario={usuarioAtual} aoSair={sair} />

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

            {import.meta.env.DEV && (
              <select
                value={usuarioAtual.papel}
                onChange={(e) => trocarPerfilDev(e.target.value as PapelUsuario)}
                className="text-[10px] font-black uppercase border border-blue-100 bg-blue-50 text-blue-700 rounded-xl px-3 py-2"
              >
                {PERFIS_DEV.map((perfil) => (
                  <option key={perfil} value={perfil}>{perfil.replace('_', ' ')}</option>
                ))}
              </select>
            )}
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
              <Route path="/" element={<Navigate to={rotaInicialPorPerfil(usuarioAtual.papel)} replace />} />

              <Route path="/painel/master" element={<GuardiaoDeRota usuario={usuarioAtual} perfisPermitidos={['admin_plataforma']}><PainelMaster /></GuardiaoDeRota>} />
              <Route path="/painel/gestor" element={<GuardiaoDeRota usuario={usuarioAtual} perfisPermitidos={['gestor']}><DashboardGestor /></GuardiaoDeRota>} />
              <Route path="/painel/supervisao" element={<GuardiaoDeRota usuario={usuarioAtual} perfisPermitidos={['pedagogia']}><PainelSupervisor /></GuardiaoDeRota>} />
              <Route path="/painel/secretaria" element={<GuardiaoDeRota usuario={usuarioAtual} perfisPermitidos={['secretaria']}><PainelSecretaria /></GuardiaoDeRota>} />
              <Route path="/painel/professor" element={<GuardiaoDeRota usuario={usuarioAtual} perfisPermitidos={['professor']}><PainelProfessor /></GuardiaoDeRota>} />
              <Route path="/painel/familia" element={<GuardiaoDeRota usuario={usuarioAtual} perfisPermitidos={['familia']}><PainelFamilia /></GuardiaoDeRota>} />
              <Route path="/painel/portaria" element={<GuardiaoDeRota usuario={usuarioAtual} perfisPermitidos={['portaria', 'servicos_gerais']}><PainelPortaria /></GuardiaoDeRota>} />

              <Route path="/gestao-acessos" element={<GuardiaoDeRota usuario={usuarioAtual} perfisPermitidos={['gestor']}><GestaoAcessos /></GuardiaoDeRota>} />
              <Route path="/pedagogia" element={<GuardiaoDeRota usuario={usuarioAtual} perfisPermitidos={['gestor', 'pedagogia']}><PedagogiaCentral /></GuardiaoDeRota>} />
              <Route path="/secretaria" element={<GuardiaoDeRota usuario={usuarioAtual} perfisPermitidos={['gestor', 'secretaria']}><SecretariaLegal /></GuardiaoDeRota>} />
              <Route path="/professor" element={<GuardiaoDeRota usuario={usuarioAtual} perfisPermitidos={['professor']}><DiarioProfessor /></GuardiaoDeRota>} />
              <Route path="/familia" element={<GuardiaoDeRota usuario={usuarioAtual} perfisPermitidos={['familia', 'secretaria']}><PortalFamilia /></GuardiaoDeRota>} />
              <Route path="/portaria" element={<GuardiaoDeRota usuario={usuarioAtual} perfisPermitidos={['portaria', 'servicos_gerais']}><PortariaAcesso /></GuardiaoDeRota>} />
              <Route path="/mensagens" element={<GuardiaoDeRota usuario={usuarioAtual} perfisPermitidos={['gestor', 'pedagogia', 'secretaria', 'professor']}><MensageiroCentral /></GuardiaoDeRota>} />
              <Route path="/aluno/perfil" element={<GuardiaoDeRota usuario={usuarioAtual} perfisPermitidos={['gestor', 'pedagogia']}><PerfilAlunoHub /></GuardiaoDeRota>} />

              <Route path="/acesso-negado" element={<AcessoNegado />} />
              <Route path="*" element={<Navigate to={rotaInicialPorPerfil(usuarioAtual.papel)} replace />} />
            </Routes>
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
