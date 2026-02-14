
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { GraduationCap, Building2, User, Mail, Lock, CheckCircle2, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function CadastroGestor() {
  const navigate = useNavigate();

  const [codigoInep, setCodigoInep] = useState('');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setOk(null);

    const inep = codigoInep.trim();
    const nomeTrim = nome.trim();
    const emailTrim = email.trim();

    if (!inep || !nomeTrim || !emailTrim || !senha) {
      setErro('Preencha todos os campos.');
      return;
    }

    setLoading(true);
    try {
      // 1) Descobrir a escola pelo INEP
      const { data: escola, error: eEscola } = await supabase
        .from('unidades_escolares')
        .select('id, nome, codigo_inep, status')
        .eq('codigo_inep', inep)
        .eq('status', 'ativo')
        .maybeSingle();

      if (eEscola) throw new Error(eEscola.message);
      if (!escola?.id) throw new Error('Código INEP não encontrado ou escola inativa.');

      // 2) Criar usuário no Auth (self-signup)
      const { data: signUpData, error: eAuth } = await (supabase.auth as any).signUp({
        email: emailTrim,
        password: senha,
        options: {
          data: {
            nome: nomeTrim,
            papel: 'gestor',
            unidade_id: escola.id,
          },
        },
      });

      if (eAuth) throw new Error(eAuth.message);

      const authUserId = signUpData?.user?.id;
      if (!authUserId) {
        throw new Error('Cadastro criado, mas precisa confirmar e-mail para concluir.');
      }

      // 3) Criar registro institucional em public.usuarios
      const { error: eUsuario } = await supabase
        .from('usuarios')
        .insert({
          auth_user_id: authUserId,
          nome: nomeTrim,
          email: emailTrim,
          papel: 'gestor',
          nivel: 5,
          unidade_id: escola.id,
          unidade: escola.nome,
          ativo: true,
          delegacoes: [],
        });

      if (eUsuario) throw new Error(eUsuario.message);

      setOk(`Gestor vinculado à escola: ${escola.nome}. Agora faça login.`);
      
      // Desloga para garantir fluxo limpo e redireciona
      await (supabase.auth as any).signOut();
      setTimeout(() => navigate('/acesso'), 2000);
    } catch (err: any) {
      setErro(err?.message || 'Falha no cadastro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Blurs */}
      <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px]" />

      <div className="w-full max-w-lg relative z-10 animate-in fade-in zoom-in duration-500">
        <div className="bg-white border border-slate-200 rounded-[3rem] p-10 md:p-14 shadow-2xl">
          <div className="flex flex-col items-center mb-10">
            <div className="bg-blue-600 p-5 rounded-3xl shadow-2xl shadow-blue-500/20 mb-8">
              <GraduationCap className="text-white w-10 h-10" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter text-center leading-none">Cadastro de Gestor</h1>
            <p className="text-xs text-slate-500 mt-4 text-center font-medium leading-relaxed max-w-[280px]">
              Vincule seu acesso institucional informando o <b>Código INEP</b> da unidade.
            </p>
          </div>

          {erro && (
            <div className="mb-8 p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-700 text-xs font-bold flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              {erro}
            </div>
          )}

          {ok && (
            <div className="mb-8 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold flex items-center gap-3">
              <CheckCircle2 className="text-emerald-500" size={18} />
              {ok}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">
                Código INEP da Unidade
              </label>
              <div className="relative">
                <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input
                  value={codigoInep}
                  onChange={(e) => setCodigoInep(e.target.value)}
                  className="w-full pl-16 pr-6 py-4 rounded-[1.2rem] border border-slate-100 bg-slate-50 font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all text-sm text-slate-800"
                  placeholder="Ex: 12345678"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">
                Nome completo
              </label>
              <div className="relative">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full pl-16 pr-6 py-4 rounded-[1.2rem] border border-slate-100 bg-slate-50 font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all text-sm text-slate-800"
                  placeholder="Seu nome"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">
                E-mail Institucional
              </label>
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  className="w-full pl-16 pr-6 py-4 rounded-[1.2rem] border border-slate-100 bg-slate-50 font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all text-sm text-slate-800"
                  placeholder="email@dominio.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">
                Senha de Acesso
              </label>
              <div className="relative">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  type={mostrarSenha ? 'text' : 'password'}
                  className="w-full pl-16 pr-14 py-4 rounded-[1.2rem] border border-slate-100 bg-slate-50 font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all text-sm text-slate-800"
                  placeholder="Crie sua senha"
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
              disabled={loading}
              className="w-full mt-4 bg-blue-600 text-white rounded-[1.2rem] py-5 font-black uppercase tracking-widest text-xs shadow-2xl shadow-blue-500/30 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 disabled:opacity-60"
              type="submit"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Provisionar Acesso</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-10 flex flex-col items-center border-t border-slate-50 pt-8">
            <button onClick={() => navigate('/acesso')} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors">
              Já possui conta? Voltar ao Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
