import React, { useState } from 'react';
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

import { Usuario, PapelUsuario } from './tipos';
import { rotaInicialPorPerfil } from './src/utils/perfis';

const App: React.FC = () => {
  const [estaAutenticado, setEstaAutenticado] = useState(false);
  const [usuarioAtual, setUsuarioAtual] = useState<Usuario | null>(null);

  const lidarComLogin = (papel: PapelUsuario) => {
    const mockUsuarios: Record<PapelUsuario, Usuario> = {
      admin_plataforma: {
        id: 'u-master', nome: 'Administrador Master', cpf: '000.000.000-00', papel: 'admin_plataforma', unidade: 'Plataforma Central', delegacoes: [],
      },
      gestor: {
        id: 'u-gestor', nome: 'Dr. Roberto Magalhães', cpf: '111.111.111-11', papel: 'gestor', unidade: 'E.M. Presidente Vargas', delegacoes: [],
      },
      pedagogia: {
        id: 'u-ped', nome: 'Coordenação Pedagógica', cpf: '222.222.222-22', papel: 'pedagogia', unidade: 'E.M. Presidente Vargas', delegacoes: [],
      },
      secretaria: {
        id: 'u-sec', nome: 'Equipe da Secretaria', cpf: '333.333.333-33', papel: 'secretaria', unidade: 'E.M. Presidente Vargas', delegacoes: [],
      },
      professor: {
        id: 'u-prof', nome: 'Prof. Ricardo Santos', cpf: '444.444.444-44', papel: 'professor', unidade: 'E.M. Presidente Vargas', delegacoes: [],
      },
      familia: {
        id: 'u-fam', nome: 'Responsável Familiar', cpf: '555.555.555-55', papel: 'familia', unidade: 'E.M. Presidente Vargas', delegacoes: [],
      },
      portaria: {
        id: 'u-port', nome: 'Portaria Escolar', cpf: '666.666.666-66', papel: 'portaria', unidade: 'E.M. Presidente Vargas', delegacoes: [],
      },
      servicos_gerais: {
        id: 'u-serv', nome: 'Serviços Gerais', cpf: '777.777.777-77', papel: 'servicos_gerais', unidade: 'E.M. Presidente Vargas', delegacoes: [],
      },
    };

    setUsuarioAtual(mockUsuarios[papel]);
    setEstaAutenticado(true);
  };

  const lidarComLogoff = () => {
    setEstaAutenticado(false);
    setUsuarioAtual(null);
  };

  if (!estaAutenticado || !usuarioAtual) {
    return <Login aoLogar={lidarComLogin} />;
  }

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
              <Route path="/familia" element={<GuardiaoDeRota usuario={usuarioAtual} perfisPermitidos={['familia', 'secretaria', 'gestor']}><PortalFamilia /></GuardiaoDeRota>} />
              <Route path="/portaria" element={<GuardiaoDeRota usuario={usuarioAtual} perfisPermitidos={['gestor', 'portaria', 'servicos_gerais']}><PortariaAcesso /></GuardiaoDeRota>} />
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
