
import React from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AcessoNegado = () => {
  const navigate = useNavigate();
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
      <div className="w-24 h-24 bg-rose-50 text-rose-500 rounded-[2rem] flex items-center justify-center mb-6 shadow-xl shadow-rose-100">
        <ShieldAlert size={48} />
      </div>
      <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">Acesso Restrito</h2>
      <p className="text-slate-500 max-w-md font-medium mb-8">
        Seu perfil atual não possui permissão para visualizar este módulo. Esta tentativa de acesso foi registrada em nossa auditoria de segurança.
      </p>
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all"
      >
        <ArrowLeft size={16} /> Voltar ao meu Painel
      </button>
    </div>
  );
};

export default AcessoNegado;
