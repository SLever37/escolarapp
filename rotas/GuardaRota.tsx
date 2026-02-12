import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../servicos/contexto/AuthContext';
import { PapelUsuario } from '../tipos';

interface Props {
  papeisPermitidos: PapelUsuario[];
}

export const GuardaRota: React.FC<Props> = ({ papeisPermitidos }) => {
  const { usuario, loading } = useAuth();

  if (loading) return null;

  if (!usuario) return <Navigate to="/acesso" replace />;

  if (!papeisPermitidos.includes(usuario.papel)) {
    return <Navigate to="/acesso-negado" replace />;
  }

  return <Outlet />;
};