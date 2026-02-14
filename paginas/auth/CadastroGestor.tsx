import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { GraduationCap, ShieldCheck, ArrowRight, User, Mail, Lock, AlertCircle, Building2, CheckCircle2 } from 'lucide-react';

const CadastroGestor: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const unidadeId = searchParams.get('unidade_id');

  const [escola, setEscola] = useState<any>(null);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!unidadeId) {
      setErro('O link de convite é inválido ou expirou. Solicite um novo link ao Master da plataforma.');
      return;
    }

    const buscarEscola = async () => {
      const { data, error } = await supabase
        .from('unidades_escolares')
        .select('nome')
        .eq('id', unidadeId)
        .single();
      
      if (error || !data) {
        setErro('Unidade não localizada. Verifique se o link está correto.');
      } else {
        setEscola(data);
      }
    };
    buscarEscola();
  }, [unidadeId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (carregando || !escola) return;
    setCarregando(true);
    setErro(null);

    try {
      // 1. SignUp no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: senha,
        options: {
          data: { nome, papel: 'gestor', unidade_id: unidadeId }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Falha ao criar conta de autenticação.");

      // 2. Insert/Upsert no public.usuarios
      const { error: perfilError } = await supabase
        .from('usuarios')
        .insert([{
          auth_user_id: authData.user.id,
          nome,
          email,
          papel: 'gestor',
          nivel: 5,
          unidade_id: unidadeId,
          unidade: escola.nome,
          ativo: true,
          delegacoes: []
        }]);

      if (perfilError) throw perfilError;

      setSucesso(true);
      setTimeout(() => navigate('/acesso'), 3000);
    } catch (err: any) {
      setErro(err.message || 'Ocorreu um erro ao processar seu cadastro.');
    } finally {
      setCarregando(false);
    }
  };

  if (sucesso) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white p-12 rounded-[3rem] shadow-2xl text-center space-y-6 max-w-md animate-in zoom-in">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
             <CheckCircle2 size={40} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Cadastro Concluído!</h2>
          <p className="text-slate-500 font-medium leading-relaxed">Sua conta de Gestor Institucional foi criada com sucesso. Redirecionando para o login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/20 rounded-full blur-[120px]" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white p-10 md:p-12 rounded-[2.5rem] shadow-2xl border border-slate-200">
          <header className="flex flex-col items-center mb-10">
            <div className="bg-blue-600 p-4 rounded-2xl shadow-xl shadow-blue-200 mb-6">
              <GraduationCap className="text-white w-10 h-10" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter text-center leading-none">Cadastro Gestor</h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-3">Soberania Educacional</p>
          </header>

          {erro ? (
            <div className="bg-rose-50 border border-rose-100 p-6 rounded-2xl text-rose-700 text-center space-y-4">
               <AlertCircle size={32} className="mx-auto opacity-50" />
               <p className="text-xs font-bold leading-relaxed">{erro}</p>
               <button onClick={() => navigate('/acesso')} className="text-xs font-black uppercase tracking-widest text-rose-900 underline">Voltar</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-center gap-3">
                 <Building2 className="text-blue-600 shrink-0" size={20} />
                 <p className="text-[11px] font-black text-blue-900 uppercase truncate">Escola: {escola?.nome || '...'}</p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    placeholder="Seu Nome Completo"
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-sm font-bold text-slate-800"
                    required
                    value={nome}
                    onChange={e => setNome(e.target.value)}
                  />
                </div>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="email"
                    placeholder="E-mail Institucional"
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-sm font-bold text-slate-800"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="password"
                    placeholder="Criar Senha de Acesso"
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-sm font-bold text-slate-800"
                    required
                    value={senha}
                    onChange={e => setSenha(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={carregando}
                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {carregando ? "CRIANDO AMBIENTE..." : (
                  <>
                    <span>CONCLUIR CADASTRO</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-10 pt-8 border-t border-slate-100 flex flex-col items-center">
             <div className="flex items-center gap-2 text-emerald-600 mb-2">
               <ShieldCheck size={16} />
               <span className="text-[10px] font-black uppercase tracking-widest">Governança Verificada</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CadastroGestor;