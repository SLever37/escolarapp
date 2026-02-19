import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import {
  GraduationCap,
  Eye,
  EyeOff,
  Loader2,
} from 'lucide-react';

export default function CadastroGestor() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const unidadeIdUrl = searchParams.get('unidade_id');
  const inepUrl = searchParams.get('inep');

  const [escolaPrevia, setEscolaPrevia] = useState<any | null>(null);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [loadingEscola, setLoadingEscola] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  /* ===============================
     1️⃣ VALIDAR CONVITE VIA RPC
  =============================== */
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
          setErro('O link de convite é inválido ou a escola não está ativa.');
          return;
        }

        setEscolaPrevia(escola);
      } catch (err) {
        console.error(err);
        setErro('Erro ao validar convite.');
      } finally {
        setLoadingEscola(false);
      }
    };

    validarConvite();
  }, [unidadeIdUrl, inepUrl]);

  /* ===============================
     2️⃣ SUBMIT DEFINITIVO
  =============================== */
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setOk(null);

    if (!escolaPrevia || !nome || !email || !senha) {
      setErro('Preencha todos os campos.');
      return;
    }

    setLoading(true);

    try {
      const escolaId = escolaPrevia.id;
      const escolaNome = escolaPrevia.nome;

      /* 🔐 2.1 CRIAR USUÁRIO AUTH */
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email: email.trim(),
          password: senha,
          options: {
            data: {
              nome: nome.trim(),
              papel: 'gestor',
              unidade_id: escolaId,
            },
          },
        });

      if (signUpError) {
        if (signUpError.message.includes('User already registered')) {
          setOk('Usuário já cadastrado. Faça login.');
          setTimeout(() => navigate('/acesso'), 2000);
          return;
        }
        throw new Error(signUpError.message);
      }

      const authUserId = signUpData?.user?.id;
      if (!authUserId) {
        throw new Error('Falha ao criar usuário.');
      }

      /* 🔎 2.2 VERIFICAR SE USUARIO JÁ EXISTE EM public.usuarios */
      const { data: usuarioExistente } = await supabase
        .from('usuarios')
        .select('id')
        .eq('auth_user_id', authUserId)
        .maybeSingle();

      if (!usuarioExistente) {
        const { error: usuarioError } = await supabase
          .from('usuarios')
          .insert({
            auth_user_id: authUserId,
            nome: nome.trim(),
            email: email.trim(),
            papel: 'gestor',
            nivel: 5,
            unidade_id: escolaId,
            ativo: true,
            delegacoes: [],
          });

        if (usuarioError) throw usuarioError;
      }

      /* 🏫 2.3 ATUALIZAR gestor_nome */
      await supabase
        .from('unidades_escolares')
        .update({ gestor_nome: nome.trim() })
        .eq('id', escolaId);

      setOk(`Gestor vinculado à escola ${escolaNome}.`);

      setTimeout(() => navigate('/acesso'), 2000);

    } catch (err: any) {
      setErro(err?.message || 'Erro no cadastro.');
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     UI
  =============================== */
  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl">

        <div className="flex flex-col items-center mb-6">
          <div className="bg-blue-600 p-4 rounded-2xl mb-4">
            <GraduationCap className="text-white w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">
            Cadastro de Gestor
          </h1>
        </div>

        {loadingEscola && (
          <div className="text-center mb-4 flex items-center justify-center gap-2">
            <Loader2 size={16} className="animate-spin" />
            Validando convite...
          </div>
        )}

        {escolaPrevia && (
          <div className="text-center mb-4 font-bold text-blue-700">
            {escolaPrevia.nome}
          </div>
        )}

        {erro && (
          <div className="text-rose-600 text-sm mb-4">{erro}</div>
        )}

        {ok && (
          <div className="text-emerald-600 text-sm mb-4">{ok}</div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">

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
              {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
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
  );
}