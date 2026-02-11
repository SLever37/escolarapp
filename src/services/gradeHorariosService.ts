import { buscarPerfilPorAuthUserId, obterSessaoSalva, supabaseConfigurado } from '../lib/supabase';

export interface ItemGradeHorario {
  id?: string;
  dia_semana: string;
  horario_inicio: string;
  horario_fim: string;
  disciplina: string;
  professor_id: string;
  sala: string;
}

export interface GradeHorario {
  id?: string;
  unidade_id: string;
  turma: string;
  semana_ref: string;
  versao: number;
  status: 'rascunho' | 'publicada';
  itens: ItemGradeHorario[];
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

const sobrepoe = (aIni: string, aFim: string, bIni: string, bFim: string) => aIni < bFim && bIni < aFim;
const chaveConflito = (valor: string) => valor.trim().toLowerCase();

export const validarConflitosGrade = (itens: ItemGradeHorario[]) => {
  const conflitos: string[] = [];

  for (let i = 0; i < itens.length; i++) {
    for (let j = i + 1; j < itens.length; j++) {
      const a = itens[i];
      const b = itens[j];
      if (a.dia_semana !== b.dia_semana) continue;
      if (!sobrepoe(a.horario_inicio, a.horario_fim, b.horario_inicio, b.horario_fim)) continue;

      if (chaveConflito(a.professor_id) && chaveConflito(a.professor_id) === chaveConflito(b.professor_id)) {
        conflitos.push(`Conflito: professor ${a.professor_id} em dois horários (${a.dia_semana} ${a.horario_inicio}-${a.horario_fim} e ${b.horario_inicio}-${b.horario_fim}).`);
      }
      if (chaveConflito(a.sala) && chaveConflito(a.sala) === chaveConflito(b.sala)) {
        conflitos.push(`Conflito: sala ${a.sala} duplicada (${a.dia_semana} ${a.horario_inicio}-${a.horario_fim} e ${b.horario_inicio}-${b.horario_fim}).`);
      }
    }
  }

  return conflitos;
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

export const salvarGrade = async (grade: GradeHorario): Promise<{ sucesso: boolean; mensagem: string }> => {
  if (!grade.semana_ref.trim()) return { sucesso: false, mensagem: 'Informe a semana de referência da grade.' };

  const conflitos = validarConflitosGrade(grade.itens);
  if (conflitos.length > 0) return { sucesso: false, mensagem: conflitos[0] };

  if (!supabaseConfigurado) return { sucesso: true, mensagem: 'Grade salva em modo local.' };

  try {
    const ctx = await contexto();
    if (!ctx?.perfil.unidade_id) return { sucesso: false, mensagem: 'Não foi possível identificar unidade da supervisão.' };

    let gradeId = grade.id;

    if (gradeId) {
      const atualizarResp = await fetch(`${baseUrl()}/rest/v1/grade_horarios?id=eq.${gradeId}&unidade_id=eq.${ctx.perfil.unidade_id}`, {
        method: 'PATCH',
        headers: { ...headersAuth(ctx.token), Prefer: 'return=representation' },
        body: JSON.stringify({
          turma: grade.turma,
          semana_ref: grade.semana_ref,
          versao: grade.versao,
          status: grade.status,
        }),
      });
      if (!atualizarResp.ok) throw new Error(await atualizarResp.text());
    } else {
      const gradeResp = await fetch(`${baseUrl()}/rest/v1/grade_horarios`, {
        method: 'POST',
        headers: { ...headersAuth(ctx.token), Prefer: 'return=representation' },
        body: JSON.stringify({
          unidade_id: ctx.perfil.unidade_id,
          turma: grade.turma,
          semana_ref: grade.semana_ref,
          versao: grade.versao,
          status: grade.status,
          criado_por: ctx.perfil.id,
        }),
      });
      if (!gradeResp.ok) throw new Error(await gradeResp.text());
      const nova = await gradeResp.json() as Array<{ id: string }>;
      gradeId = nova[0]?.id;
    }

    if (!gradeId) throw new Error('Não foi possível obter id da grade salva.');

    const limparItensResp = await fetch(`${baseUrl()}/rest/v1/grade_horarios_itens?grade_id=eq.${gradeId}`, {
      method: 'DELETE',
      headers: { ...headersAuth(ctx.token), Prefer: 'return=minimal' },
    });
    if (!limparItensResp.ok) throw new Error(await limparItensResp.text());

    const itens = grade.itens.map((i) => {
      const { id, ...semId } = i;
      return { ...semId, grade_id: gradeId };
    });

    if (itens.length === 0) return { sucesso: true, mensagem: 'Grade salva sem aulas para esta turma.' };

    const itensResp = await fetch(`${baseUrl()}/rest/v1/grade_horarios_itens`, {
      method: 'POST',
      headers: { ...headersAuth(ctx.token), Prefer: 'return=minimal' },
      body: JSON.stringify(itens),
    });
    if (!itensResp.ok) throw new Error(await itensResp.text());

    return { sucesso: true, mensagem: 'Grade de Horários salva com sucesso.' };
  } catch (erro) {
    return { sucesso: false, mensagem: `Erro ao salvar grade: ${String(erro)}` };
  }
};
