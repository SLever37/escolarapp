
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Bell, Search, Building2 } from 'lucide-react';

// Paginas
import Login from './paginas/Login';
import DashboardMaster from './paginas/master/DashboardMaster';
import DashboardGestor from './pages/DashboardGestor'; // Ajustaremos o nome no proximo passo se necessario
import AcessoNegado from './pages/AcessoNegado'; // Vamos criar/ajustar esse componente
import GestaoAcessos from './pages/gestor/GestaoAcessos'; // Nova página

// Componentes Reutilizados (Wrappers para os Módulos Existentes)
import DashboardPedagogo from './pages/DashboardPedagogo';
import SecretariaLegal from './pages/SecretariaLegal';
import DiarioProfessor from './pages/DiarioProfessor';
import PortariaAcesso from './pages/PortariaAcesso';

// Componentes UI
import NavegacaoLateral from './componentes/NavegacaoLateral';

// Tipos e Servicos
import { Usuario, PapelUsuario } from './tipos';

const App: React.FC = () => {
  const [estaAutenticado, setEstaAutenticado] = useState(false);
  const [usuarioAtual, setUsuarioAtual] = useState<Usuario | null>(null);

  // Função de Login Simulado com Mocks de Perfil
  const lidarComLogin = (papel: PapelUsuario) => {
    let mockUsuario: Usuario = {
      id: 'u1',
      nome: 'Usuário Padrão',
      cpf: '000.000.000-00',
      papel: papel,
      unidade: 'E.M. Presidente Vargas',
      delegacoes: []
    };

    // Personalizando o Mock baseado no papel
    if (papel === 'admin_plataforma') {
      mockUsuario.nome = "Administrador Master";
      mockUsuario.unidade = "Plataforma Central";
    } else if (papel === 'gestor') {
      mockUsuario.nome = "Dr. Roberto Magalhães";
    } else if (papel === 'professor') {
      mockUsuario.nome = "Prof. Ricardo Santos";
    }

    setUsuarioAtual(mockUsuario);
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
        {/* Header Global */}
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

        {/* Área de Conteúdo Rotativo */}
        <section className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            <Routes>
              {/* Rota Raiz: Redireciona para o Dashboard correto baseado no papel */}
              <Route path="/" element={
                usuarioAtual.papel === 'admin_plataforma' ? <DashboardMaster /> :
                usuarioAtual.papel === 'gestor' ? <DashboardGestor /> :
                usuarioAtual.papel === 'pedagogia' ? <DashboardPedagogo /> :
                usuarioAtual.papel === 'secretaria' ? <SecretariaLegal /> :
                usuarioAtual.papel === 'professor' ? <DiarioProfessor /> :
                <AcessoNegado />
              } />

              {/* Rotas Específicas do Gestor */}
              {usuarioAtual.papel === 'gestor' && (
                <>
                  <Route path="/acessos" element={<GestaoAcessos />} />
                  {/* Gestor tem visão de tudo, então pode acessar rotas dos departamentos */}
                  <Route path="/pedagogia" element={<DashboardPedagogo />} />
                  <Route path="/secretaria" element={<SecretariaLegal />} />
                  <Route path="/portaria" element={<PortariaAcesso />} />
                </>
              )}

              {/* Rotas Departamentais (Acessíveis se o usuário for do papel OU Gestor) */}
              <Route path="/pedagogia" element={
                ['gestor', 'pedagogia'].includes(usuarioAtual.papel) ? <DashboardPedagogo /> : <AcessoNegado />
              } />
              
              <Route path="/secretaria" element={
                ['gestor', 'secretaria'].includes(usuarioAtual.papel) ? <SecretariaLegal /> : <AcessoNegado />
              } />

              {/* Rota Universal de Erro */}
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
