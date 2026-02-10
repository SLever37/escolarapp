import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { podeAcessar } from '../servicos/permissoesService';

interface Props {
  modulo: string;
  acao?: 'ver' | 'criar' | 'editar' | 'excluir' | 'imprimir' | 'exportar';
  children: React.ReactElement;
}

const GuardiaoPermissao: React.FC<Props> = ({ modulo, acao = 'ver', children }) => {
  const { usuario, carregando } = useAuth();
  const [ok, setOk] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      if (!usuario) { if (mounted) setOk(false); return; }
      const res = await podeAcessar(usuario, modulo, acao as any);
      if (mounted) setOk(res);
    })();
    return () => { mounted = false; };
  }, [usuario, modulo, acao]);

  if (carregando || ok === null) return <div>Carregando...</div>;
  if (!ok) return <Navigate to="/acesso-negado" replace />;
  return children;
};

export default GuardiaoPermissao;
