
import { TimetableSlot, TimetableConflict, DayOfWeek } from '../types';

/**
 * SERVIÇO: Timetable Engine (Mock)
 * Simula a lógica de um gerador ASC e detecção de conflitos.
 */

const DAYS: DayOfWeek[] = ['SEG', 'TER', 'QUA', 'QUI', 'SEX'];

export const timetableService = {
  // Gera uma grade inicial baseada em heurísticas simples
  generateMockGrade: (classId: string): TimetableSlot[] => {
    const slots: TimetableSlot[] = [];
    const subjects = ['MAT', 'PORT', 'HIS', 'GEO', 'CIE', 'ART', 'EF'];
    
    DAYS.forEach(day => {
      for (let p = 1; p <= 5; p++) {
        slots.push({
          id: `slot-${day}-${p}-${classId}`,
          day,
          period: p,
          subjectId: subjects[Math.floor(Math.random() * subjects.length)],
          teacherId: 'Prof. Exemplo',
          classId
        });
      }
    });
    return slots;
  },

  // Detecta conflitos na grade atual
  checkConflicts: (slots: TimetableSlot[]): TimetableConflict[] => {
    const conflicts: TimetableConflict[] = [];
    
    // Simulação: se houver MAT e MAT no mesmo dia seguidos, é uma "aula dupla" (OK)
    // Se houver MAT espalhado em 4 períodos no mesmo dia, é um conflito de densidade
    if (slots.length > 10) {
      conflicts.push({
        id: 'c1',
        type: 'professor_overlap',
        description: 'Prof. Ricardo Santos já está alocado no 8º Ano A neste mesmo horário.',
        severity: 'high',
        slots: ['s1', 's2']
      });
      conflicts.push({
        id: 'c2',
        type: 'subject_density',
        description: 'A disciplina de Educação Física deve ser preferencialmente no último horário.',
        severity: 'medium',
        slots: ['s5']
      });
    }
    
    return conflicts;
  }
};
