import assert from 'node:assert/strict';
import { diagnosticarGrade, regrasPadrao } from '../.tmp-test/services/gradeRulesEngine.js';

const base = [
  { dia_semana: 'SEG', horario_inicio: '07:00', horario_fim: '07:50', disciplina: 'Matemática', professor_id: 'p1', sala: 'S1' },
  { dia_semana: 'SEG', horario_inicio: '07:30', horario_fim: '08:20', disciplina: 'Português', professor_id: 'p2', sala: 'S2' },
];

const d1 = diagnosticarGrade(base, '2026-S1', regrasPadrao);
assert.ok(d1.conflitos.some((c) => c.includes('turma com aulas sobrepostas')));

const d2 = diagnosticarGrade([
  { dia_semana: 'TER', horario_inicio: '07:00', horario_fim: '07:50', disciplina: 'Ciências', professor_id: 'p3', sala: 'S3' },
], '2026-S1', { ...regrasPadrao, preferenciasSoftProfessor: [{ professor_id: 'p3', turno_preferido: 'tarde' }] });
assert.equal(d2.conflitos.length, 0);
assert.ok(d2.avisosSoft.some((a) => a.includes('fora do turno preferido')));

const d3 = diagnosticarGrade([
  { dia_semana: 'QUA', horario_inicio: '07:00', horario_fim: '07:50', disciplina: 'História', professor_id: 'p4', sala: 'S4' },
  { dia_semana: 'QUA', horario_inicio: '07:50', horario_fim: '08:40', disciplina: 'História', professor_id: 'p4', sala: 'S5' },
], '2026-S1', { ...regrasPadrao, maximoAulasConsecutivasProfessor: 1 });
assert.ok(d3.conflitos.some((c) => c.includes('aulas consecutivas')));

console.log('grade-rules-check: OK');
