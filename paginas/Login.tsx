import React, { useState } from 'react';
import { GraduationCap, ShieldCheck, ArrowRight, Lock, User as IconeUsuario, AlertCircle, HelpCircle } from 'lucide-react';
import { PapelUsuario } from '../tipos';
import { supabase, estaConfigurado } from '../supabaseClient';

interface LoginProps {
  aoLogar?: (papel: PapelUsuario) => void;
}

const Login: React.FC<LoginProps> = ({ aoLogar }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const lidarComEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    setErro(null);

    if (!estaConfigurado) {
      SimularLogin();
      return;
    }

    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email: email,
        password: senha,
      });

      if (error) {
        switch (error.message) {
          case 'Invalid login credentials':
            setErro('Credenciais inválidas. Verifique seu e-mail e senha institucional.');
            break;
          case 'Email not confirmed':
            setErro('Seu e-mail institucional ainda não foi confirmado.');
            break;
          default:
            if (error.status === 400) {
              setErro('Dados de acesso incorretos ou usuário não localizado.');
            } else {
              setErro('Falha na comunicação com o servidor de governança.');
            }
        }
        setCarregando(false);
        return;
      }

      if (data?.user) {
        const { data: perfil, error: erroPerfil } = await supabase
          .from('usuarios')
          .select('papel')
          .eq('auth_user_id', data.user.id)
          .single();

        if (erroPerfil || !perfil) {
          await supabase.auth.signOut();
          setErro('Usuário autenticado, mas não cadastrado na base institucional do app.');
          setCarregando(false);
          return;
        }
      }
      
    } catch (error: any) {
      console.error('Erro de login:', error.message);
      setErro('Ocorreu um erro inesperado ao tentar autenticar.');
      setCarregando(false);
    }
  };

  const SimularLogin = () => {
    setTimeout(() => {
      if (email.startsWith('master')) aoLogar?.('admin_plataforma');
      else if (email.startsWith('gestor')) aoLogar?.('gestor');
      else if (email.startsWith('prof')) aoLogar?.('professor');
      else setErro('Usuário de demonstração não localizado. Use prefixos "master", "gestor" ou "prof".');
      setCarregando(false);
    }, 800);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0f172a] p-4 relative overflow-hidden">
      {/* Luzes de Fundo */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/20 rounded-full blur-[120px]" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white p-10 md:p-12 rounded-2xl shadow-2xl border border-slate-200">
          <div className="flex flex-col items-center mb-10">
            <div className="bg-blue-600 p-4 rounded-2xl shadow-xl shadow-blue-200 mb-6">
              <GraduationCap className="text-white w-10 h-10" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter text-center leading-none">EscolarApp</h1>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-3">Governança Institucional</p>
          </div>

          <form onSubmit={lidarComEnvio} className="space-y-6">
            {erro && (
              <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl flex items-start gap-3 text-rose-700 text-xs font-bold animate-in fade-in zoom-in duration-300">
                <AlertCircle className="shrink-0 text-rose-500" size={18} />
                <p className="leading-relaxed">{erro}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">E-mail Institucional</label>
              <div className="relative">
                <IconeUsuario className={`absolute left-5 top-1/2 -translate-y-1/2 ${erro ? 'text-rose-400' : 'text-slate-400'}`} size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErro(null); }}
                  placeholder="exemplo@escolar.app"
                  className={`w-full pl-14 pr-6 py-4 bg-slate-50 border ${erro ? 'border-rose-300 ring-rose-500/10' : 'border-slate-100'} rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-bold text-slate-800`}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Senha de Acesso</label>
              <div className="relative">
                <Lock className={`absolute left-5 top-1/2 -translate-y-1/2 ${erro ? 'text-rose-400' : 'text-slate-400'}`} size={18} />
                <input 
                  type="password" 
                  value={senha}
                  onChange={(e) => { setSenha(e.target.value); setErro(null); }}
                  placeholder="••••••••"
                  className={`w-full pl-14 pr-6 py-4 bg-slate-50 border ${erro ? 'border-rose-300 ring-rose-500/10' : 'border-slate-100'} rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-bold text-slate-800`}
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={carregando}
              className="w-full bg-blue-600 text-white py-5 rounded-xl font-black text-xs shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {carregando ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>AUTENTICAR AMBIENTE</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100 flex flex-col items-center">
            <div className="flex items-center gap-2 text-emerald-600 mb-2">
              <ShieldCheck size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Acesso Criptografado</span>
            </div>
            <p className="text-slate-400 text-[9px] font-bold text-center leading-relaxed">
              Monitoramento Forense Ativo. <br/>
              Protegido por políticas de governança municipal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;