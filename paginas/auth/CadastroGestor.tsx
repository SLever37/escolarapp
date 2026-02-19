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

  // ✅ Carregar escola se vier ID na URL (via RPC para não bater no RLS)
  useEffect(() => {
    if (!unidadeIdUrl) return;

    const buscarEscola = async () => {
      setLoadingEscola(true);
      setErro(null);

      try {
        if (!inepUrl) {
          setErro('Convite inválido: código INEP ausente na URL.');
          return;
        }

        const { data, error } = await supabase.rpc('get_unidade_por_convite', {
          p_unidade_id: unidadeIdUrl,
          p_inep: String(inepUrl),
        });

        if (error) throw error;

        const escola = Array.isArray(data) ? data[0] : data;

        if (escola?.id) {
          // RPC já garante status = ativo e INEP confere
          setEscolaPrevia({ ...escola, status: 'ativo' });
          if (escola.codigo_inep) setCodigoInep(String(escola.codigo_inep));
        } else {
          setErro('O link de convite utilizado é inválido ou a escola não existe mais no sistema.');
        }
      } catch (err: any) {
        console.error(err);
        setErro('Ocorreu um erro técnico ao validar seu convite. Tente novamente mais tarde.');
      } finally {
        setLoadingEscola(false);
      }
    };

    buscarEscola();
  }, [unidadeIdUrl, inepUrl]); // ✅ dependências corretas

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setOk(null);

    const inep = (codigoInep || '').trim();
    const nomeTrim = (nome || '').trim();
    const emailTrim = (email || '').trim();

    if ((!inep && !escolaPrevia) || !nomeTrim || !emailTrim || !senha) {
      setErro('Preencha todos os campos obrigatórios.');
      return;
    }

    setLoading(true);

    try {
      let escolaId = escolaPrevia?.id as string | undefined;
      let escolaNome = escolaPrevia?.nome as string | undefined;

      // 1) Se não tiver escola prévia pelo link, buscar pelo INEP (OBS: pode ser bloqueado por RLS se sua policy não permitir)
      if (!escolaId) {
        if (!inep) {
          throw new Error('Informe o Código INEP ou utilize um link de convite válido.');
        }

        const inepLimpo = inep.replace(/\D/g, '');

        const { data: escola, error: eEscola } = await supabase
          .from('unidades_escolares')
          .select('id, nome, codigo_inep, status')
          .or(`codigo_inep.eq.${inep},codigo_inep.eq.${inepLimpo}`)
          .maybeSingle();

        if (eEscola) throw new Error(`Erro na busca: ${eEscola.message}`);

        if (!escola) {
          throw new Error(
            `Nenhuma escola encontrada com o código INEP "${inep}". Verifique se o código está correto no Dashboard Master.`
          );
        }

        if (escola.status !== 'ativo') {
          throw new Error(
            `A escola "${escola.nome}" foi localizada, mas seu status atual é "${escola.status}". Apenas escolas ativas podem receber novos gestores.`
          );
        }

        escolaId = escola.id;
        escolaNome = escola.nome;
      }

      if (!escolaId || !escolaNome) {
        throw new Error('Falha ao determinar a escola do gestor. Tente novamente.');
      }

      // 2) Gerenciar usuário no Auth (signUp ou signIn se já existir)
      let authUserId: string | null = null;

      const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
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
        const msg = signUpErr.message.toLowerCase();
        if (msg.includes('already registered') || msg.includes('already been registered')) {
          // Tenta logar para obter o ID
          const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
            email: emailTrim,
            password: senha,
          });

          if (signInErr) {
            throw new Error('Conta já existe. Verifique a senha e tente novamente.');
          }
          authUserId = signInData.user?.id ?? null;
        } else {
          throw new Error(signUpErr.message);
        }
      } else {
        authUserId = signUpData.user?.id ?? null;
      }

      if (!authUserId) {
        throw new Error('Não foi possível obter o usuário autenticado. Tente novamente.');
      }

      // 3) Criar ou atualizar registro institucional em public.usuarios (UPSERT)
      const payloadUsuario = {
        auth_user_id: authUserId,
        nome: nomeTrim,
        email: emailTrim,
        papel: 'gestor',
        nivel: 5,
        unidade_id: escolaId,
        ativo: true,
        delegacoes: [],
      };

      const { error: eUsuario } = await supabase
        .from('usuarios')
        .upsert(payloadUsuario, { onConflict: 'auth_user_id' });

      if (eUsuario) throw new Error(eUsuario.message);

      // 4) Atualizar a escola com o nome do gestor (se for o primeiro ou principal)
      const { error: eUpdateEscola } = await supabase
        .from('unidades_escolares')
        .update({ gestor_nome: nomeTrim })
        .eq('id', escolaId);

      if (eUpdateEscola) {
        console.warn('Falha ao atualizar gestor_nome:', eUpdateEscola.message);
      }

      setOk(`Gestor vinculado à escola: ${escolaNome}. Agora faça login.`);

      // Desloga para garantir fluxo limpo e redireciona
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
      {/* Background Blurs */}
      <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px]" />

      <div className="w-full max-w-[400px] relative z-10 animate-in fade-in zoom-in duration-500">
        <div className="bg-white border border-slate-200 rounded-[2rem] p-8 md:p-10 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-blue-600 p-4 rounded-2xl shadow-xl shadow-blue-500/20 mb-6">
              <GraduationCap className="text-white w-8 h-8" />
            </div>

            <h1 className="text-2xl font-black text-slate-900 tracking-tighter text-center leading-none">
              Cadastro de Gestor
            </h1>

            <p className="text-[10px] text-slate-400 mt-3 text-center font-black uppercase tracking-widest max-w-[240px]">
              Vínculo Institucional
            </p>
          </div>

          {erro && (
            <div className="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-[11px] font-bold flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              {erro}
            </div>
          )}

          {ok && (
            <div className="mb-6 p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-[11px] font-bold flex items-center gap-3">
              <CheckCircle2 className="text-emerald-500" size={16} />
              {ok}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 ml-4">
                Unidade Escolar
              </label>

              <div className="relative">
                <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />

                {loadingEscola ? (
                  <div className="w-full pl-14 pr-6 py-3 rounded-xl border border-slate-100 bg-slate-50 flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin text-blue-600" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Validando...</span>
                  </div>
                ) : escolaPrevia ? (
                  <div className="w-full pl-14 pr-6 py-3 rounded-xl border border-blue-100 bg-blue-50/50 flex flex-col">
                    <span className="text-[11px] font-black text-blue-700 uppercase truncate">
                      {escolaPrevia.nome}
                    </span>
                    <span className="text-[8px] font-bold text-blue-400 uppercase">
                      INEP: {escolaPrevia.codigo_inep || '---'}
                    </span>
                  </div>
                ) : (
                  <input
                    value={codigoInep}
                    onChange={(e) => setCodigoInep(e.target.value)}
                    className="w-full pl-14 pr-6 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white transition-all text-sm font-bold text-slate-800"
                    placeholder="Código INEP"
                    required
                  />
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 ml-4">
                Nome completo
              </label>

              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full pl-14 pr-6 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white transition-all text-sm font-bold text-slate-800"
                  placeholder="Seu nome"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 ml-4">
                E-mail Institucional
              </label>

              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  className="w-full pl-14 pr-6 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white transition-all text-sm font-bold text-slate-800"
                  placeholder="email@dominio.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 ml-4">
                Senha de Acesso
              </label>

              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  type={mostrarSenha ? 'text' : 'password'}
                  className="w-full pl-14 pr-12 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white transition-all text-sm font-bold text-slate-800"
                  placeholder="Crie sua senha"
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
              disabled={loading}
              className="w-full bg-blue-600 text-white rounded-xl py-4 font-black uppercase tracking-widest text-[11px] shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
              type="submit"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Provisionar Acesso</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 flex flex-col items-center border-t border-slate-50 pt-6">
            <button
              onClick={() => navigate('/acesso')}
              className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors"
            >
              Já possui conta? Voltar ao Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
