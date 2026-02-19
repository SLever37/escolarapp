// src/paginas/auth/CadastroGestor.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import {
  GraduationCap,
  Building2,
  User,
  Mail,
  Lock,
  CheckCircle2,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
} from 'lucide-react';

export default function CadastroGestor() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const unidadeIdUrl = searchParams.get('unidade_id');
  const inepUrl = searchParams.get('inep');

  const [codigoInep, setCodigoInep] = useState(inepUrl || '');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [loading, setLoading] = useState(false);
  const [loadingEscola, setLoadingEscola] = useState(false);

  const [escolaPrevia, setEscolaPrevia] = useState<any | null>(null);

  const [erro, setErro] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  // ✅ Validação do convite via RPC (SEM RLS)
  useEffect(() => {
    if (!unidadeIdUrl || !inepUrl) {
      setErro('Link de convite inválido.');
      return;
    }

    const validarConvite = async () => {
      setLoadingEscola(true);
      setErro(null);

      try {
        const { data, error } = await supabase.rpc(
          'get_unidade_por_convite',
          {
            p_unidade_id: unidadeIdUrl,
            p_inep: String(inepUrl),
          }
        );

        if (error) throw error;

        const escola = Array.isArray(data) ? data[0] : data;

        if (!escola?.id) {
          setErro(
            'O link de convite utilizado é inválido ou a escola não está ativa.'
          );
          return;
        }

        setEscolaPrevia(escola);
        setCodigoInep(escola.codigo_inep ?? '');
      } catch (err) {
        console.error(err);
        setErro('Erro ao validar convite.');
      } finally {
        setLoadingEscola(false);
      }
    };

    validarConvite();
  }, [unidadeIdUrl, inepUrl]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setOk(null);

    const nomeTrim = nome.trim();
    const emailTrim = email.trim();

    if (!escolaPrevia || !nomeTrim || !emailTrim || !senha) {
      setErro('Preencha todos os campos obrigatórios.');
      return;
    }

    setLoading(true);

    try {
      const escolaId = escolaPrevia.id;
      const escolaNome = escolaPrevia.nome;

      // 🔐 1️⃣ Criar usuário no Auth
      const { data: signUpData, error: signUpErr } =
        await supabase.auth.signUp({
          email: emailTrim,
          password: senha,
          options: {
            data: {
              nome: nomeTrim,
              papel: 'gestor',
              unidade_id: escolaId,
            },
          },
        });

      if (signUpErr) {
        if (
          signUpErr.message.toLowerCase().includes('already')
        ) {
          throw new Error(
            'Este e-mail já está cadastrado. Faça login.'
          );
        }
        throw new Error(signUpErr.message);
      }

      const authUserId = signUpData.user?.id ?? null;

      if (!authUserId) {
        throw new Error('Erro ao criar usuário.');
      }

      // 🏛 2️⃣ Criar registro institucional
      const { error: usuarioError } = await supabase
        .from('usuarios')
        .insert({
          auth_user_id: authUserId,
          nome: nomeTrim,
          email: emailTrim,
          papel: 'gestor',
          nivel: 5,
          unidade_id: escolaId,
          ativo: true,
          delegacoes: [],
        });

      if (usuarioError) {
        throw new Error(usuarioError.message);
      }

      setOk(
        `Gestor vinculado à escola: ${escolaNome}. Agora faça login.`
      );

      await supabase.auth.signOut();

      setTimeout(() => navigate('/acesso'), 2000);
    } catch (err: any) {
      setErro(err?.message || 'Falha no cadastro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px]" />

      <div className="w-full max-w-[400px] relative z-10">
        <div className="bg-white border border-slate-200 rounded-[2rem] p-8 md:p-10 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-blue-600 p-4 rounded-2xl mb-6">
              <GraduationCap className="text-white w-8 h-8" />
            </div>

            <h1 className="text-2xl font-black text-slate-900 text-center">
              Cadastro de Gestor
            </h1>

            <p className="text-[10px] text-slate-400 mt-3 text-center font-black uppercase tracking-widest">
              Vínculo Institucional
            </p>
          </div>

          {loadingEscola && (
            <div className="mb-4 flex items-center gap-2 text-sm justify-center">
              <Loader2 size={16} className="animate-spin" />
              Validando convite...
            </div>
          )}

          {escolaPrevia && (
            <div className="mb-6 text-center text-blue-700 font-bold text-sm">
              {escolaPrevia.nome}
            </div>
          )}

          {erro && (
            <div className="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-sm font-bold">
              {erro}
            </div>
          )}

          {ok && (
            <div className="mb-6 p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-bold flex items-center gap-2">
              <CheckCircle2 size={16} />
              {ok}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-5">
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome completo"
              className="w-full p-3 border rounded-xl"
              required
            />

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="email@dominio.com"
              className="w-full p-3 border rounded-xl"
              required
            />

            <div className="relative">
              <input
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                type={mostrarSenha ? 'text' : 'password'}
                placeholder="Crie sua senha"
                className="w-full p-3 border rounded-xl"
                required
              />

              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                className="absolute right-3 top-3"
              >
                {mostrarSenha ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            <button
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold"
              type="submit"
            >
              {loading ? 'Processando...' : 'Provisionar Acesso'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}