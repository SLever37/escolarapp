
import React, { useState } from 'react';
import { GraduationCap, ShieldCheck, ArrowRight, Lock, User as IconeUsuario, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { supabase, estaConfigurado } from '../supabaseClient';
import { useAuth } from '../servicos/contexto/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  
  const { usuario } = useAuth();

  const lidarComEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (carregando) return;

    setCarregando(true);
    setErro(null);

    if (!estaConfigurado) {
      setErro('Infraestrutura Supabase não detectada.');
      setCarregando(false);
      return;
    }

    try {
      const { error } = await (supabase.auth as any).signInWithPassword({
        email: email.trim(),
        password: senha,
      });

      if (error) {
        setErro('Credenciais inválidas. Verifique seu e-mail institucional.');
        setCarregando(false);
        return;
      }
    } catch (err: any) {
      setErro('Ocorreu um erro inesperado ao autenticar ambiente.');
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0f172a] p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px]" />

      <div className="w-full max-w-[440px] relative z-10 animate-in fade-in zoom-in duration-500">
        <div className="bg-white p-10 md:p-14 rounded-[3rem] shadow-2xl border border-white/20">
          <div className="flex flex-col items-center mb-12">
            <div className="bg-[#2563eb] p-5 rounded-3xl shadow-2xl shadow-blue-500/20 mb-8">
              < GraduationCap className="text-white w-10 h-10" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter text-center leading-none">EscolarApp</h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mt-4">Governança Institucional</p>
          </div>

          <form onSubmit={lidarComEnvio} className="space-y-8">
            {erro && (
              <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center gap-3 text-rose-700 text-xs font-bold">
                <AlertCircle className="shrink-0 text-rose-500" size={18} />
                <p>{erro}</p>
              </div>
            )}

            <div className="space-y-2.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-5">E-mail Institucional</label>
              <div className="relative">
                <IconeUsuario className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email"
                  className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.2rem] outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white transition-all text-sm font-bold text-slate-800"
                  required
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-5">Senha de Acesso</label>
              <div className="relative">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input
                  type={mostrarSenha ? 'text' : 'password'}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="senha"
                  className="w-full pl-16 pr-14 py-5 bg-slate-50 border border-slate-100 rounded-[1.2rem] outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white transition-all text-sm font-bold text-slate-800"
                  required
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                >
                  {mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={carregando}
              className="w-full bg-[#2563eb] text-white py-5 rounded-[1.2rem] font-black text-xs shadow-2xl shadow-blue-500/30 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 mt-4"
            >
              {carregando ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span className="uppercase tracking-widest">Autenticar Ambiente</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-14 pt-10 border-t border-slate-50 flex flex-col items-center">
            <div className="flex items-center gap-2 text-emerald-500 mb-2">
              <ShieldCheck size={18} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Acesso Criptografado</span>
            </div>
            <p className="text-slate-400 text-[9px] font-bold text-center leading-relaxed">
              Monitoramento Forense Ativo. <br />
              Protegido por políticas de governança municipal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
