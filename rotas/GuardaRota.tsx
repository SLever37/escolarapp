import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../servicos/contexto/AuthContext';
import { PapelUsuario } from '../tipos';

interface Props {
  papeisPermitidos: PapelUsuario[];
}

export const GuardaRota: React.FC<Props> = ({ papeisPermitidos }) => {
  const { usuario, loading } = useAuth();

  // Se estiver carregando mas NÃO temos usuário no cache, retornamos null (ou loader)
  // Se JÁ TEMOS o usuário no cache, deixamos passar para evitar tela branca
  if (loading && !usuario) return null;

  if (!usuario) return <Navigate to="/acesso" replace />;

  if (!papeisPermitidos.includes(usuario.papel)) {
    return <Navigate to="/acesso-negado" replace />;
  }

  return <Outlet />;
};