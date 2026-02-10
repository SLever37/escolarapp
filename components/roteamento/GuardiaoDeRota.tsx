import React from 'react';
import { Navigate } from 'react-router-dom';
import { PapelUsuario, Usuario } from '../../tipos';
import { rotaInicialPorPerfil } from '../../src/utils/perfis';

interface GuardiaoDeRotaProps {
  usuario: Usuario;
  perfisPermitidos: PapelUsuario[];
  children: React.ReactElement;
}

const GuardiaoDeRota: React.FC<GuardiaoDeRotaProps> = ({ usuario, perfisPermitidos, children }) => {
  if (!perfisPermitidos.includes(usuario.papel)) {
    return <Navigate to={rotaInicialPorPerfil(usuario.papel)} replace />;
  }

  return children;
};

export default GuardiaoDeRota;
