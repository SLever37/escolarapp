
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

      <div className="w-full max-w-[380px] relative z-10 animate-in fade-in zoom-in duration-500">
        <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-2xl border border-white/20">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-[#2563eb] p-4 rounded-2xl shadow-xl shadow-blue-500/20 mb-6">
              < GraduationCap className="text-white w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter text-center leading-none">EscolarApp</h1>
            <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.3em] mt-3">Governança Institucional</p>
          </div>

          <form onSubmit={lidarComEnvio} className="space-y-6">
            {erro && (
              <div className="bg-rose-50 border border-rose-100 p-3 rounded-xl flex items-center gap-3 text-rose-700 text-[11px] font-bold">
                <AlertCircle className="shrink-0 text-rose-500" size={16} />
                <p>{erro}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">E-mail Institucional</label>
              <div className="relative">
                <IconeUsuario className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email"
                  className="w-full pl-14 pr-6 py-3.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white transition-all text-sm font-bold text-slate-800"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Senha de Acesso</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input
                  type={mostrarSenha ? 'text' : 'password'}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="senha"
                  className="w-full pl-14 pr-12 py-3.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white transition-all text-sm font-bold text-slate-800"
                  required
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                >
                  {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={carregando}
              className="w-full bg-[#2563eb] text-white py-4 rounded-xl font-black text-[11px] shadow-xl shadow-blue-500/20 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
            >
              {carregando ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span className="uppercase tracking-widest">Autenticar Ambiente</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-50 flex flex-col items-center">
            <div className="flex items-center gap-2 text-emerald-500 mb-1.5">
              <ShieldCheck size={16} />
              <span className="text-[9px] font-black uppercase tracking-[0.15em]">Acesso Criptografado</span>
            </div>
            <p className="text-slate-400 text-[8px] font-bold text-center leading-relaxed">
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
