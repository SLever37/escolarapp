import React, { useState } from 'react';
import { GraduationCap, ShieldCheck, ArrowRight, Lock, User as IconeUsuario } from 'lucide-react';
import { PapelUsuario } from '../tipos';

interface LoginProps {
  aoLogar: (papel: PapelUsuario) => void;
}

const Login: React.FC<LoginProps> = ({ aoLogar }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  const lidarComEnvio = (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);

    setTimeout(() => {
      const emailNormalizado = email.trim().toLowerCase();
      const senhaNormalizada = senha.trim();

      // Acesso master enraizado
      if (emailNormalizado === 'socrates.lever@gmail.com' && senhaNormalizada === '123456') aoLogar('admin_plataforma');
      else if (emailNormalizado.startsWith('master')) aoLogar('admin_plataforma');
      else if (emailNormalizado.startsWith('gestor')) aoLogar('gestor');
      else if (emailNormalizado.startsWith('prof')) aoLogar('professor');
      else if (emailNormalizado.startsWith('sec')) aoLogar('secretaria');
      else if (emailNormalizado.startsWith('ped')) aoLogar('pedagogia');
      else if (emailNormalizado.startsWith('familia') || emailNormalizado.startsWith('cpf')) aoLogar('familia');
      else if (emailNormalizado.startsWith('vigia') || emailNormalizado.startsWith('port')) aoLogar('portaria');
      else aoLogar('professor');

      setCarregando(false);
    }, 800);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafc] p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-50" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[120px] opacity-50" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white p-10 md:p-12 rounded-[3.5rem] shadow-2xl shadow-blue-900/10 border border-slate-100">
          <div className="flex flex-col items-center mb-10">
            <div className="bg-blue-600 p-4 rounded-3xl shadow-xl shadow-blue-200 mb-6">
              <GraduationCap className="text-white w-10 h-10" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter text-center">EscolarApp</h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Plataforma de Governança</p>
          </div>

          <form onSubmit={lidarComEnvio} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">E-mail Institucional ou CPF</label>
              <div className="relative">
                <IconeUsuario className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ex.: gestor@..., ped@..., cpf@..."
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-bold"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Senha de Acesso</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-bold"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={carregando}
              className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xs shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
              {carregando ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>ACESSAR AMBIENTE</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-50 flex flex-col items-center">
            <div className="flex items-center gap-2 text-emerald-500 mb-2">
              <ShieldCheck size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Segurança Camada 7</span>
            </div>
            <p className="text-slate-300 text-[9px] font-bold text-center leading-relaxed">
              Sistema restrito a profissionais e famílias autorizadas. <br />
              Monitoramento forense ativo.
            </p>
          </div>

          <div className="mt-4 text-center">
            <p className="text-[9px] font-bold text-slate-400 uppercase">Perfis de teste:</p>
            <div className="flex flex-wrap justify-center gap-2 mt-1">
              {['socrates.lever@gmail.com / 123456', 'master@...', 'gestor@...', 'ped@...', 'sec@...', 'prof@...', 'cpf@...', 'vigia@...'].map((credencial) => (
                <span key={credencial} className="text-[9px] bg-slate-100 px-2 py-1 rounded">{credencial}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
