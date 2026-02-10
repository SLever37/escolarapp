import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Props {
  children: React.ReactElement;
}

const RequireAuth: React.FC<Props> = ({ children }) => {
  const { usuario, carregando } = useAuth();
  if (carregando) return <div>Carregando...</div>;
  if (!usuario) return <Navigate to="/" replace />;
  return children;
};

export default RequireAuth;
