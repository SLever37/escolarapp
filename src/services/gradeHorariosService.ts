import { buscarPerfilPorAuthUserId, obterSessaoSalva, supabaseConfigurado } from '../lib/supabase';
import {
  DiagnosticoGrade,
  diagnosticarGrade,
  ItemGradeHorario,
  RegrasGrade,
  regrasPadrao,
  validarConflitosGrade,
} from './gradeRulesEngine';

export type { DiagnosticoGrade, ItemGradeHorario, RegrasGrade };
export { diagnosticarGrade, regrasPadrao, validarConflitosGrade };

export interface GradeHorario {
  id?: string;
  unidade_id: string;
  turma: string;
  semana_ref: string;
  versao: number;
  status: 'rascunho' | 'publicada';
  itens: ItemGradeHorario[];
}

export interface ResumoVersaoGrade {
  id: string;
  versao: number;
  status: 'rascunho' | 'publicada';
  semana_ref: string;
}

const mockGrade: GradeHorario = {
  unidade_id: 'dev',
  turma: '8º Ano B',
  semana_ref: '2026-S1',
  versao: 1,
  status: 'rascunho',
  itens: [
    { dia_semana: 'SEG', horario_inicio: '07:00', horario_fim: '07:50', disciplina: 'Matemática', professor_id: 'prof-marcos', sala: 'Sala 8B' },
    { dia_semana: 'SEG', horario_inicio: '08:00', horario_fim: '08:50', disciplina: 'Português', professor_id: 'prof-ana', sala: 'Sala 8B' },
  ],
};

const baseUrl = () => (import.meta.env.VITE_SUPABASE_URL || '').trim();
const headersAuth = (token: string) => ({
  apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
});

const contexto = async () => {
  const sessao = obterSessaoSalva();
  if (!sessao) return null;
  const perfil = await buscarPerfilPorAuthUserId(sessao.user.id, sessao.access_token);
  if (!perfil) return null;
  return { token: sessao.access_token, perfil };
};

const chaveAtiva = (unidadeId: string, turma: string) => `grade_ativa_${unidadeId}_${turma}`;

export const obterVersaoAtivaLocal = (unidadeId: string, turma: string): string | null => {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(chaveAtiva(unidadeId, turma));
};

export const definirVersaoAtivaLocal = (unidadeId: string, turma: string, gradeId: string) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(chaveAtiva(unidadeId, turma), gradeId);
};

export const carregarGradePorTurma = async (turma: string): Promise<{ grade: GradeHorario; conectado: boolean }> => {
  if (!supabaseConfigurado) return { grade: mockGrade, conectado: false };

  try {
    const ctx = await contexto();
    if (!ctx?.perfil.unidade_id) return { grade: mockGrade, conectado: false };

    const resp = await fetch(`${baseUrl()}/rest/v1/grade_horarios?select=id,unidade_id,turma,semana_ref,versao,status&unidade_id=eq.${ctx.perfil.unidade_id}&turma=eq.${encodeURIComponent(turma)}&order=versao.desc&limit=1`, { headers: headersAuth(ctx.token) });
    if (!resp.ok) throw new Error(await resp.text());
    const grades = await resp.json() as Array<{ id: string; unidade_id: string; turma: string; semana_ref: string; versao: number; status: 'rascunho' | 'publicada' }>;

    if (!grades[0]) return { grade: { ...mockGrade, turma, unidade_id: ctx.perfil.unidade_id }, conectado: true };

    const itensResp = await fetch(`${baseUrl()}/rest/v1/grade_horarios_itens?select=id,dia_semana,horario_inicio,horario_fim,disciplina,professor_id,sala&grade_id=eq.${grades[0].id}`, { headers: headersAuth(ctx.token) });
    if (!itensResp.ok) throw new Error(await itensResp.text());
    const itens = await itensResp.json() as ItemGradeHorario[];

    return { conectado: true, grade: { ...grades[0], itens } };
  } catch {
    return { grade: mockGrade, conectado: false };
  }
};

export const listarVersoesGradePorTurma = async (turma: string): Promise<{ versoes: ResumoVersaoGrade[]; conectado: boolean }> => {
  if (!supabaseConfigurado) {
    return { versoes: [{ id: 'mock', versao: 1, status: 'rascunho', semana_ref: mockGrade.semana_ref }], conectado: false };
  }

  try {
    const ctx = await contexto();
    if (!ctx?.perfil.unidade_id) return { versoes: [], conectado: false };

    const resp = await fetch(`${baseUrl()}/rest/v1/grade_horarios?select=id,versao,status,semana_ref&unidade_id=eq.${ctx.perfil.unidade_id}&turma=eq.${encodeURIComponent(turma)}&order=versao.desc&limit=20`, {
      headers: headersAuth(ctx.token),
    });
    if (!resp.ok) throw new Error(await resp.text());
    const versoes = await resp.json() as ResumoVersaoGrade[];
    return { versoes, conectado: true };
  } catch {
    return { versoes: [], conectado: false };
  }
};

export const carregarGradePorId = async (gradeId: string): Promise<{ grade: GradeHorario | null; conectado: boolean }> => {
  if (!supabaseConfigurado) return { grade: null, conectado: false };

  try {
    const ctx = await contexto();
    if (!ctx?.perfil.unidade_id) return { grade: null, conectado: false };

    const resp = await fetch(`${baseUrl()}/rest/v1/grade_horarios?select=id,unidade_id,turma,semana_ref,versao,status&id=eq.${gradeId}&unidade_id=eq.${ctx.perfil.unidade_id}&limit=1`, {
      headers: headersAuth(ctx.token),
    });
    if (!resp.ok) throw new Error(await resp.text());
    const grades = await resp.json() as Array<{ id: string; unidade_id: string; turma: string; semana_ref: string; versao: number; status: 'rascunho' | 'publicada' }>;

    if (!grades[0]) return { grade: null, conectado: true };

    const itensResp = await fetch(`${baseUrl()}/rest/v1/grade_horarios_itens?select=id,dia_semana,horario_inicio,horario_fim,disciplina,professor_id,sala&grade_id=eq.${gradeId}`, {
      headers: headersAuth(ctx.token),
    });
    if (!itensResp.ok) throw new Error(await itensResp.text());
    const itens = await itensResp.json() as ItemGradeHorario[];

    return { grade: { ...grades[0], itens }, conectado: true };
  } catch {
    return { grade: null, conectado: false };
  }
};

export const salvarGrade = async (grade: GradeHorario, regras: RegrasGrade = regrasPadrao): Promise<{ sucesso: boolean; mensagem: string }> => {
  if (!grade.semana_ref.trim()) return { sucesso: false, mensagem: 'Informe a semana de referência da grade.' };

  const itensIncompletos = grade.itens.find((item) => !item.disciplina.trim() || !item.professor_id.trim() || !item.sala.trim());
  if (itensIncompletos) return { sucesso: false, mensagem: 'Toda aula precisa ter disciplina, professor e sala.' };

  const diagnostico: DiagnosticoGrade = diagnosticarGrade(grade.itens, grade.semana_ref, regras);
  if (diagnostico.conflitos.length > 0) return { sucesso: false, mensagem: diagnostico.conflitos[0] };

  if (!supabaseConfigurado) return { sucesso: true, mensagem: `Grade salva em modo local. ${diagnostico.avisosSoft[0] || ''}`.trim() };

  try {
    const ctx = await contexto();
    if (!ctx?.perfil.unidade_id) return { sucesso: false, mensagem: 'Não foi possível identificar unidade da supervisão.' };

    const rpcResp = await fetch(`${baseUrl()}/rest/v1/rpc/salvar_grade_horario_atomico`, {
      method: 'POST',
      headers: headersAuth(ctx.token),
      body: JSON.stringify({ p_unidade_id: ctx.perfil.unidade_id, p_turma: grade.turma, p_semana_ref: grade.semana_ref, p_status: grade.status, p_criado_por: ctx.perfil.id, p_itens: grade.itens }),
    });

    if (rpcResp.ok) {
      const rpcData = await rpcResp.json() as { versao: number };
      return { sucesso: true, mensagem: `Grade v${rpcData.versao} (${grade.status}) salva via RPC atômica com sucesso.` };
    }

    const ultimaResp = await fetch(`${baseUrl()}/rest/v1/grade_horarios?select=versao&unidade_id=eq.${ctx.perfil.unidade_id}&turma=eq.${encodeURIComponent(grade.turma)}&order=versao.desc&limit=1`, { headers: headersAuth(ctx.token) });
    if (!ultimaResp.ok) throw new Error(await ultimaResp.text());
    const ultima = await ultimaResp.json() as Array<{ versao: number }>;
    const proximaVersao = (ultima[0]?.versao || 0) + 1;

    const gradeResp = await fetch(`${baseUrl()}/rest/v1/grade_horarios`, {
      method: 'POST',
      headers: { ...headersAuth(ctx.token), Prefer: 'return=representation' },
      body: JSON.stringify({ unidade_id: ctx.perfil.unidade_id, turma: grade.turma, semana_ref: grade.semana_ref, versao: proximaVersao, status: grade.status, criado_por: ctx.perfil.id }),
    });
    if (!gradeResp.ok) throw new Error(await gradeResp.text());
    const nova = await gradeResp.json() as Array<{ id: string }>;
    const gradeId = nova[0]?.id;
    if (!gradeId) throw new Error('Não foi possível obter id da grade salva.');

    const itens = grade.itens.map((i) => {
      const { id, ...semId } = i;
      return { ...semId, grade_id: gradeId };
    });

    if (itens.length > 0) {
      const itensResp = await fetch(`${baseUrl()}/rest/v1/grade_horarios_itens`, {
        method: 'POST',
        headers: { ...headersAuth(ctx.token), Prefer: 'return=minimal' },
        body: JSON.stringify(itens),
      });
      if (!itensResp.ok) throw new Error(await itensResp.text());
    }

    return { sucesso: true, mensagem: `Grade v${proximaVersao} salva em modo fallback (sem RPC atômica).` };
  } catch (erro) {
    return { sucesso: false, mensagem: `Erro ao salvar grade: ${String(erro)}` };
  }
};
