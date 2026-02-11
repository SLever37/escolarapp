import React, { useState } from 'react';
import { GraduationCap, ShieldCheck, ArrowRight, Lock, User as IconeUsuario, AlertCircle } from 'lucide-react';

interface LoginProps {
  aoEntrar: (email: string, senha: string) => Promise<void>;
  supabaseConfigurado: boolean;
}

const Login: React.FC<LoginProps> = ({ aoEntrar, supabaseConfigurado }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const lidarComEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    setErro(null);

    try {
      await aoEntrar(email.trim(), senha.trim());
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Falha ao autenticar.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafc] p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-50" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[120px] opacity-50" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white p-10 md:p-12 rounded-[3.5rem] shadow-2xl shadow-blue-900/10 border border-slate-100">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-blue-600 p-4 rounded-3xl shadow-xl shadow-blue-200 mb-6">
              <GraduationCap className="text-white w-10 h-10" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter text-center">EscolarApp</h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Plataforma de Governança</p>
          </div>

          {!supabaseConfigurado && (
            <div className="mb-5 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-[11px] font-bold">
              Modo DEV ativo: Supabase não configurado. O login usará perfil mock por prefixo de e-mail.
            </div>
          )}

          {erro && (
            <div className="mb-5 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-[11px] font-bold flex items-start gap-2">
              <AlertCircle size={16} className="mt-0.5" />
              <span>{erro}</span>
            </div>
          )}

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
        </div>
      </div>
    </div>
  );
};

export default Login;
