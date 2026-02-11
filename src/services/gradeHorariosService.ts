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

export interface RestricaoAgenda {
  recurso_tipo: 'professor' | 'sala';
  recurso_id: string;
  dia_semana: string;
  horario_inicio: string;
  horario_fim: string;
}

export interface RestricaoAgendaRecorrente {
  recurso_tipo: 'professor' | 'sala';
  recurso_id: string;
  dias_semana: string[];
  horario_inicio: string;
  horario_fim: string;
  semanas_excecao: string[];
}

export interface LimiteSemanalDisciplina {
  disciplina: string;
  maximo: number;
}

export interface LimiteSemanalProfessor {
  professor_id: string;
  maximo: number;
}

export interface PreferenciaSoftProfessor {
  professor_id: string;
  turno_preferido: 'manha' | 'tarde';
}

export interface RegrasGrade {
  cargaMaximaProfessorDia: number;
  restricoesAgenda: RestricaoAgenda[];
  restricoesRecorrentes: RestricaoAgendaRecorrente[];
  permitirSobreposicaoTurma: boolean;
  maximoJanelasProfessorDia: number;
  maximoJanelasTurmaDia: number;
  maximoAulasConsecutivasProfessor: number;
  maximoAulasSemanaisProfessor: LimiteSemanalProfessor[];
  maximoAulasSemanaisDisciplina: LimiteSemanalDisciplina[];
  distribuicaoTurnoMinima: { manha: number; tarde: number };
  preferenciasSoftProfessor: PreferenciaSoftProfessor[];
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

export interface ResumoVersaoGrade {
  id: string;
  versao: number;
  status: 'rascunho' | 'publicada';
  semana_ref: string;
}

export interface DiagnosticoGrade {
  conflitos: string[];
  avisosSoft: string[];
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

export const regrasPadrao: RegrasGrade = {
  cargaMaximaProfessorDia: 6,
  restricoesAgenda: [],
  restricoesRecorrentes: [],
  permitirSobreposicaoTurma: false,
  maximoJanelasProfessorDia: 2,
  maximoJanelasTurmaDia: 2,
  maximoAulasConsecutivasProfessor: 4,
  maximoAulasSemanaisProfessor: [],
  maximoAulasSemanaisDisciplina: [],
  distribuicaoTurnoMinima: { manha: 0, tarde: 0 },
  preferenciasSoftProfessor: [],
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
const minutos = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};
const turno = (inicio: string) => (minutos(inicio) < 12 * 60 ? 'manha' : 'tarde');
const janelas = (aulas: ItemGradeHorario[]) => {
  const ordenadas = [...aulas].sort((a, b) => minutos(a.horario_inicio) - minutos(b.horario_inicio));
  let total = 0;
  for (let i = 0; i < ordenadas.length - 1; i++) {
    const gap = minutos(ordenadas[i + 1].horario_inicio) - minutos(ordenadas[i].horario_fim);
    if (gap > 0) total += 1;
  }
  return total;
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

export const diagnosticarGrade = (itens: ItemGradeHorario[], semanaRef: string, regras: RegrasGrade = regrasPadrao): DiagnosticoGrade => {
  const conflitos: string[] = [];
  const avisosSoft: string[] = [];

  itens.forEach((item) => {
    if (!item.horario_inicio || !item.horario_fim || item.horario_inicio >= item.horario_fim) {
      conflitos.push(`Conflito: faixa de horário inválida para ${item.disciplina || 'aula sem disciplina'} (${item.dia_semana} ${item.horario_inicio || '--:--'}-${item.horario_fim || '--:--'}).`);
    }
  });

  for (let i = 0; i < itens.length; i++) {
    for (let j = i + 1; j < itens.length; j++) {
      const a = itens[i];
      const b = itens[j];
      if (a.dia_semana !== b.dia_semana) continue;
      if (!sobrepoe(a.horario_inicio, a.horario_fim, b.horario_inicio, b.horario_fim)) continue;

      if (!regras.permitirSobreposicaoTurma) {
        conflitos.push(`Conflito: turma com aulas sobrepostas (${a.dia_semana} ${a.horario_inicio}-${a.horario_fim} e ${b.horario_inicio}-${b.horario_fim}).`);
      }
      if (chaveConflito(a.professor_id) && chaveConflito(a.professor_id) === chaveConflito(b.professor_id)) {
        conflitos.push(`Conflito: professor ${a.professor_id} em dois horários (${a.dia_semana} ${a.horario_inicio}-${a.horario_fim} e ${b.horario_inicio}-${b.horario_fim}).`);
      }
      if (chaveConflito(a.sala) && chaveConflito(a.sala) === chaveConflito(b.sala)) {
        conflitos.push(`Conflito: sala ${a.sala} duplicada (${a.dia_semana} ${a.horario_inicio}-${a.horario_fim} e ${b.horario_inicio}-${b.horario_fim}).`);
      }
    }
  }

  regras.restricoesAgenda.forEach((restricao) => {
    const alvo = itens.find((item) => item.dia_semana === restricao.dia_semana
      && sobrepoe(item.horario_inicio, item.horario_fim, restricao.horario_inicio, restricao.horario_fim)
      && (restricao.recurso_tipo === 'professor'
        ? chaveConflito(item.professor_id) === chaveConflito(restricao.recurso_id)
        : chaveConflito(item.sala) === chaveConflito(restricao.recurso_id)));

    if (alvo) conflitos.push(`Conflito: ${restricao.recurso_tipo} ${restricao.recurso_id} indisponível em ${restricao.dia_semana} ${restricao.horario_inicio}-${restricao.horario_fim}.`);
  });

  regras.restricoesRecorrentes.forEach((restricao) => {
    if (restricao.semanas_excecao.includes(semanaRef)) return;
    const achou = itens.find((item) => restricao.dias_semana.includes(item.dia_semana)
      && sobrepoe(item.horario_inicio, item.horario_fim, restricao.horario_inicio, restricao.horario_fim)
      && (restricao.recurso_tipo === 'professor'
        ? chaveConflito(item.professor_id) === chaveConflito(restricao.recurso_id)
        : chaveConflito(item.sala) === chaveConflito(restricao.recurso_id)));
    if (achou) conflitos.push(`Conflito: ${restricao.recurso_tipo} ${restricao.recurso_id} possui indisponibilidade recorrente.`);
  });

  const cargaPorProfessorDia = new Map<string, number>();
  const itensPorProfessorDia = new Map<string, ItemGradeHorario[]>();
  const itensPorDia = new Map<string, ItemGradeHorario[]>();
  const cargaDisciplina = new Map<string, number>();
  const cargaProfessor = new Map<string, number>();
  const cargaTurno = { manha: 0, tarde: 0 };

  itens.forEach((item) => {
    const professor = chaveConflito(item.professor_id);
    const keyProfDia = `${professor}_${item.dia_semana}`;
    if (professor) {
      cargaPorProfessorDia.set(keyProfDia, (cargaPorProfessorDia.get(keyProfDia) || 0) + 1);
      itensPorProfessorDia.set(keyProfDia, [...(itensPorProfessorDia.get(keyProfDia) || []), item]);
      cargaProfessor.set(professor, (cargaProfessor.get(professor) || 0) + 1);
    }

    itensPorDia.set(item.dia_semana, [...(itensPorDia.get(item.dia_semana) || []), item]);
    const disc = chaveConflito(item.disciplina);
    if (disc) cargaDisciplina.set(disc, (cargaDisciplina.get(disc) || 0) + 1);
    cargaTurno[turno(item.horario_inicio)] += 1;
  });

  if (regras.cargaMaximaProfessorDia > 0) {
    cargaPorProfessorDia.forEach((total, chave) => {
      if (total <= regras.cargaMaximaProfessorDia) return;
      const [professor, dia] = chave.split('_');
      conflitos.push(`Conflito: professor ${professor} excedeu limite diário (${total}/${regras.cargaMaximaProfessorDia}) em ${dia}.`);
    });
  }

  itensPorProfessorDia.forEach((aulas, chave) => {
    const [professor, dia] = chave.split('_');
    const totalJanelas = janelas(aulas);
    if (totalJanelas > regras.maximoJanelasProfessorDia) {
      conflitos.push(`Conflito: professor ${professor} com janelas em excesso (${totalJanelas}/${regras.maximoJanelasProfessorDia}) em ${dia}.`);
    }

    const ord = [...aulas].sort((a, b) => minutos(a.horario_inicio) - minutos(b.horario_inicio));
    let sequencia = 1;
    for (let i = 1; i < ord.length; i++) {
      const emSequencia = ord[i - 1].horario_fim === ord[i].horario_inicio;
      sequencia = emSequencia ? sequencia + 1 : 1;
      if (sequencia > regras.maximoAulasConsecutivasProfessor) {
        conflitos.push(`Conflito: professor ${professor} excedeu aulas consecutivas (${sequencia}/${regras.maximoAulasConsecutivasProfessor}) em ${dia}.`);
        break;
      }
    }
  });

  itensPorDia.forEach((aulas, dia) => {
    const totalJanelasTurma = janelas(aulas);
    if (totalJanelasTurma > regras.maximoJanelasTurmaDia) {
      conflitos.push(`Conflito: turma com muitos furos (${totalJanelasTurma}/${regras.maximoJanelasTurmaDia}) em ${dia}.`);
    }
  });

  regras.maximoAulasSemanaisDisciplina.forEach((r) => {
    const total = cargaDisciplina.get(chaveConflito(r.disciplina)) || 0;
    if (total > r.maximo) conflitos.push(`Conflito: disciplina ${r.disciplina} excedeu máximo semanal (${total}/${r.maximo}).`);
  });

  regras.maximoAulasSemanaisProfessor.forEach((r) => {
    const total = cargaProfessor.get(chaveConflito(r.professor_id)) || 0;
    if (total > r.maximo) conflitos.push(`Conflito: professor ${r.professor_id} excedeu máximo semanal (${total}/${r.maximo}).`);
  });

  if (cargaTurno.manha < regras.distribuicaoTurnoMinima.manha) {
    conflitos.push(`Conflito: distribuição mínima da manhã não atendida (${cargaTurno.manha}/${regras.distribuicaoTurnoMinima.manha}).`);
  }
  if (cargaTurno.tarde < regras.distribuicaoTurnoMinima.tarde) {
    conflitos.push(`Conflito: distribuição mínima da tarde não atendida (${cargaTurno.tarde}/${regras.distribuicaoTurnoMinima.tarde}).`);
  }

  regras.preferenciasSoftProfessor.forEach((pref) => {
    const prof = chaveConflito(pref.professor_id);
    const fora = itens.filter((i) => chaveConflito(i.professor_id) === prof && turno(i.horario_inicio) !== pref.turno_preferido);
    if (fora.length > 0) avisosSoft.push(`Aviso: professor ${pref.professor_id} tem ${fora.length} aula(s) fora do turno preferido (${pref.turno_preferido}).`);
  });

  return { conflitos, avisosSoft };
};

export const validarConflitosGrade = (itens: ItemGradeHorario[], regras: RegrasGrade = regrasPadrao, semanaRef = '') => diagnosticarGrade(itens, semanaRef, regras).conflitos;

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

  const diagnostico = diagnosticarGrade(grade.itens, grade.semana_ref, regras);
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
