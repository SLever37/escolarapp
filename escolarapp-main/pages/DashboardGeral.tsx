
import React from 'react';
import DashboardGestor from './DashboardGestor';
import DashboardPedagogo from './DashboardPedagogo';
import SecretariaLegal from './SecretariaLegal';
import DiarioProfessor from './DiarioProfessor';
import PortalFamilia from './PortalFamilia';
import PortariaAcesso from './PortariaAcesso';
import { UserRole } from '../types';

/**
 * PÁGINA: DashboardGeral (Controlador de Fluxo)
 * Finalidade: Redirecionar o usuário para seu painel de direito baseado no cargo.
 */
const DashboardGeral = () => {
  // Simulação de obtenção de perfil do contexto de autenticação
  const user: { role: UserRole } = {
    role: 'gestor' // Mudar aqui para testar as visões
  };

  switch (user.role) {
    case 'gestor':
      return <DashboardGestor />;
    case 'pedagogia':
      return <DashboardPedagogo />;
    case 'secretaria':
      return <SecretariaLegal />;
    case 'professor':
      return <DiarioProfessor />;
    case 'familia':
      return <PortalFamilia />;
    case 'portaria':
      return <PortariaAcesso />;
    default:
      return <DashboardPedagogo />;
  }
};

export default DashboardGeral;
