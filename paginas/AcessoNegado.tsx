
import React from 'react';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AcessoNegado = () => {
  const navigate = useNavigate();
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
      <div className="relative mb-8">
        <div className="w-32 h-32 bg-rose-50 text-rose-500 rounded-[2.5rem] flex items-center justify-center shadow-xl shadow-rose-100">
          <ShieldAlert size={56} />
        </div>
        <div className="absolute -bottom-2 -right-2 bg-slate-900 text-white p-3 rounded-2xl border-4 border-white shadow-lg">
           <Lock size={20} />
        </div>
      </div>
      
      <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">Acesso Restrito</h2>
      <p className="text-slate-500 max-w-md font-medium text-sm leading-relaxed mb-10">
        Você tentou acessar um módulo que exige privilégios superiores ou uma delegação específica do Gestor Institucional. 
        Esta tentativa foi registrada em nosso log de auditoria forense por segurança.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center justify-center gap-3 bg-slate-900 text-white px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
        >
          <ArrowLeft size={16} /> Voltar ao Painel
        </button>
        <button className="flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
          Solicitar Delegação
        </button>
      </div>
    </div>
  );
};

export default AcessoNegado;
