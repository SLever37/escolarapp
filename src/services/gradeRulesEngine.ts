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

export interface DiagnosticoGrade {
  conflitos: string[];
  avisosSoft: string[];
}

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

      if (!regras.permitirSobreposicaoTurma) conflitos.push(`Conflito: turma com aulas sobrepostas (${a.dia_semana} ${a.horario_inicio}-${a.horario_fim} e ${b.horario_inicio}-${b.horario_fim}).`);
      if (chaveConflito(a.professor_id) && chaveConflito(a.professor_id) === chaveConflito(b.professor_id)) conflitos.push(`Conflito: professor ${a.professor_id} em dois horários (${a.dia_semana} ${a.horario_inicio}-${a.horario_fim} e ${b.horario_inicio}-${b.horario_fim}).`);
      if (chaveConflito(a.sala) && chaveConflito(a.sala) === chaveConflito(b.sala)) conflitos.push(`Conflito: sala ${a.sala} duplicada (${a.dia_semana} ${a.horario_inicio}-${a.horario_fim} e ${b.horario_inicio}-${b.horario_fim}).`);
    }
  }

  regras.restricoesAgenda.forEach((restricao) => {
    const alvo = itens.find((item) => item.dia_semana === restricao.dia_semana
      && sobrepoe(item.horario_inicio, item.horario_fim, restricao.horario_inicio, restricao.horario_fim)
      && (restricao.recurso_tipo === 'professor' ? chaveConflito(item.professor_id) === chaveConflito(restricao.recurso_id) : chaveConflito(item.sala) === chaveConflito(restricao.recurso_id)));
    if (alvo) conflitos.push(`Conflito: ${restricao.recurso_tipo} ${restricao.recurso_id} indisponível em ${restricao.dia_semana} ${restricao.horario_inicio}-${restricao.horario_fim}.`);
  });

  regras.restricoesRecorrentes.forEach((restricao) => {
    if (restricao.semanas_excecao.includes(semanaRef)) return;
    const achou = itens.find((item) => restricao.dias_semana.includes(item.dia_semana)
      && sobrepoe(item.horario_inicio, item.horario_fim, restricao.horario_inicio, restricao.horario_fim)
      && (restricao.recurso_tipo === 'professor' ? chaveConflito(item.professor_id) === chaveConflito(restricao.recurso_id) : chaveConflito(item.sala) === chaveConflito(restricao.recurso_id)));
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
    if (totalJanelas > regras.maximoJanelasProfessorDia) conflitos.push(`Conflito: professor ${professor} com janelas em excesso (${totalJanelas}/${regras.maximoJanelasProfessorDia}) em ${dia}.`);

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
    if (totalJanelasTurma > regras.maximoJanelasTurmaDia) conflitos.push(`Conflito: turma com muitos furos (${totalJanelasTurma}/${regras.maximoJanelasTurmaDia}) em ${dia}.`);
  });

  regras.maximoAulasSemanaisDisciplina.forEach((r) => {
    const total = cargaDisciplina.get(chaveConflito(r.disciplina)) || 0;
    if (total > r.maximo) conflitos.push(`Conflito: disciplina ${r.disciplina} excedeu máximo semanal (${total}/${r.maximo}).`);
  });

  regras.maximoAulasSemanaisProfessor.forEach((r) => {
    const total = cargaProfessor.get(chaveConflito(r.professor_id)) || 0;
    if (total > r.maximo) conflitos.push(`Conflito: professor ${r.professor_id} excedeu máximo semanal (${total}/${r.maximo}).`);
  });

  if (cargaTurno.manha < regras.distribuicaoTurnoMinima.manha) conflitos.push(`Conflito: distribuição mínima da manhã não atendida (${cargaTurno.manha}/${regras.distribuicaoTurnoMinima.manha}).`);
  if (cargaTurno.tarde < regras.distribuicaoTurnoMinima.tarde) conflitos.push(`Conflito: distribuição mínima da tarde não atendida (${cargaTurno.tarde}/${regras.distribuicaoTurnoMinima.tarde}).`);

  regras.preferenciasSoftProfessor.forEach((pref) => {
    const prof = chaveConflito(pref.professor_id);
    const fora = itens.filter((i) => chaveConflito(i.professor_id) === prof && turno(i.horario_inicio) !== pref.turno_preferido);
    if (fora.length > 0) avisosSoft.push(`Aviso: professor ${pref.professor_id} tem ${fora.length} aula(s) fora do turno preferido (${pref.turno_preferido}).`);
  });

  return { conflitos, avisosSoft };
};

export const validarConflitosGrade = (itens: ItemGradeHorario[], regras: RegrasGrade = regrasPadrao, semanaRef = '') => diagnosticarGrade(itens, semanaRef, regras).conflitos;
