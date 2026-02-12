
/**
 * TIPOS DE DOMÍNIO - TIMETABLE (NÍVEL ASC)
 * Foco: Resolução de conflitos e governança de carga horária.
 */

export type DiaSemana = 'SEG' | 'TER' | 'QUA' | 'QUI' | 'SEX' | 'SAB';

export interface ProfessorTimetable {
  id: string;
  nome: string;
  disciplinasIds: string[];
  disponibilidade: {
    dia: DiaSemana;
    periodos: number[]; // Ex: [1, 2, 3] para os primeiros 3 horários
  }[];
  cargaHorariaMaxima: number;
}

export interface AulaSlot {
  id: string;
  turmaId: string;
  professorId: string;
  disciplinaId: string;
  salaId: string;
  dia: DiaSemana;
  periodo: number; // 1 a 6
  isDouble: boolean; // Aula dupla (pedagogicamente recomendada para certas matérias)
}

export interface Conflito {
  tipo: 'PROFESSOR_DUPLICADO' | 'TURMA_DUPLICADA' | 'SALA_OCUPADA' | 'RESTRIÇÃO_PEDAGÓGICA';
  descricao: string;
  slotsAfetados: string[];
  severidade: 'ALTA' | 'MEDIA' | 'BAIXA';
}

export interface RegraPedagogica {
  id: string;
  nome: string;
  descricao: string;
  ativa: boolean;
}
