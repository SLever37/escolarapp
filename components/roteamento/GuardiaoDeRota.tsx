import React from 'react';
import { Navigate } from 'react-router-dom';
import { NomeModulo, PapelUsuario, Usuario } from '../../tipos';
import { rotaInicialPorPerfil } from '../../src/utils/perfis';
import { temPermissaoModulo } from '../../src/utils/permissoes';

interface GuardiaoDeRotaProps {
  usuario: Usuario;
  perfisPermitidos: PapelUsuario[];
  moduloNecessario?: NomeModulo;
  acaoNecessaria?: 'ver' | 'criar' | 'editar' | 'excluir' | 'imprimir' | 'exportar';
  children: React.ReactElement;
}

const GuardiaoDeRota: React.FC<GuardiaoDeRotaProps> = ({ usuario, perfisPermitidos, moduloNecessario, acaoNecessaria = 'ver', children }) => {
  if (!perfisPermitidos.includes(usuario.papel)) {
    return <Navigate to={rotaInicialPorPerfil(usuario.papel)} replace />;
  }

  if (moduloNecessario && !temPermissaoModulo(usuario, moduloNecessario, acaoNecessaria)) {
    return <Navigate to="/acesso-negado" replace />;
  }

  return children;
};

export default GuardiaoDeRota;
