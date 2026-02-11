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
import GradeDeHorarios from './pages/pedagogia/GradeDeHorarios';

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

              <Route path="/master" element={<GuardiaoDeRota usuario={usuarioAtual} perfisPermitidos={['admin_plataforma']} moduloNecessario="painel_estrategico"><PainelMaster /></GuardiaoDeRota>} />
              <Route path="/gestao" element={<GuardiaoDeRota usuario={usuarioAtual} perfisPermitidos={['gestor']} moduloNecessario="painel_estrategico"><DashboardGestor /></GuardiaoDeRota>} />
              <Route path="/supervisao" element={<GuardiaoDeRota usuario={usuarioAtual} perfisPermitidos={['pedagogia']} moduloNecessario="pedagogia_central"><PainelSupervisor /></GuardiaoDeRota>} />
              <Route path="/secretaria" element={<GuardiaoDeRota usuario={usuarioAtual} perfisPermitidos={['secretaria', 'gestor']} moduloNecessario="secretaria_legal"><PainelSecretaria /></GuardiaoDeRota>} />
              <Route path="/professor" element={<GuardiaoDeRota usuario={usuarioAtual} perfisPermitidos={['professor']} moduloNecessario="diario_classe"><PainelProfessor /></GuardiaoDeRota>} />
              <Route path="/familia" element={<GuardiaoDeRota usuario={usuarioAtual} perfisPermitidos={['familia']} moduloNecessario="portal_familia"><PainelFamilia /></GuardiaoDeRota>} />
              <Route path="/portaria" element={<GuardiaoDeRota usuario={usuarioAtual} perfisPermitidos={['portaria', 'servicos_gerais']} moduloNecessario="portaria_acesso"><PainelPortaria /></GuardiaoDeRota>} />

              <Route path="/gestao-acessos" element={<GuardiaoDeRota usuario={usuarioAtual} perfisPermitidos={['gestor']} moduloNecessario="painel_estrategico"><GestaoAcessos /></GuardiaoDeRota>} />
              <Route path="/supervisao/pedagogia" element={<GuardiaoDeRota usuario={usuarioAtual} perfisPermitidos={['gestor', 'pedagogia']} moduloNecessario="pedagogia_central"><PedagogiaCentral /></GuardiaoDeRota>} />
              <Route path="/supervisao/grade-de-horarios" element={<GuardiaoDeRota usuario={usuarioAtual} perfisPermitidos={['pedagogia']} moduloNecessario="grade_horarios"><GradeDeHorarios /></GuardiaoDeRota>} />
              <Route path="/secretaria/modulo" element={<GuardiaoDeRota usuario={usuarioAtual} perfisPermitidos={['gestor', 'secretaria']} moduloNecessario="secretaria_legal"><SecretariaLegal /></GuardiaoDeRota>} />
              <Route path="/professor/diario" element={<GuardiaoDeRota usuario={usuarioAtual} perfisPermitidos={['professor']} moduloNecessario="diario_classe"><DiarioProfessor /></GuardiaoDeRota>} />
              <Route path="/familia/portal" element={<GuardiaoDeRota usuario={usuarioAtual} perfisPermitidos={['familia', 'secretaria']} moduloNecessario="portal_familia"><PortalFamilia /></GuardiaoDeRota>} />
              <Route path="/portaria/controle" element={<GuardiaoDeRota usuario={usuarioAtual} perfisPermitidos={['portaria', 'servicos_gerais']} moduloNecessario="portaria_acesso"><PortariaAcesso /></GuardiaoDeRota>} />
              <Route path="/mensagens" element={<GuardiaoDeRota usuario={usuarioAtual} perfisPermitidos={['gestor', 'pedagogia', 'secretaria', 'professor']} moduloNecessario="painel_estrategico"><MensageiroCentral /></GuardiaoDeRota>} />
              <Route path="/aluno/perfil" element={<GuardiaoDeRota usuario={usuarioAtual} perfisPermitidos={['gestor', 'pedagogia', 'secretaria']} moduloNecessario="pcd"><PerfilAlunoHub usuarioAtual={usuarioAtual} /></GuardiaoDeRota>} />

              <Route path="/pedagogia" element={<Navigate to="/supervisao/pedagogia" replace />} />
              <Route path="/secretaria-legal" element={<Navigate to="/secretaria/modulo" replace />} />
              <Route path="/diario-professor" element={<Navigate to="/professor/diario" replace />} />
              <Route path="/portal-familia" element={<Navigate to="/familia/portal" replace />} />
              <Route path="/portaria-acesso" element={<Navigate to="/portaria/controle" replace />} />

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
