
export type PapelUsuario = 
  | 'admin_plataforma' 
  | 'gestor' 
  | 'pedagogia' 
  | 'secretaria' 
  | 'professor' 
  | 'familia' 
  | 'portaria'
  | 'servicos_gerais';

export type AcaoPermissao = 'ver' | 'criar' | 'editar' | 'excluir' | 'imprimir' | 'exportar';

export type NomeModulo = 
  | 'painel_estrategico' 
  | 'secretaria_legal' 
  | 'pedagogia_central' 
  | 'grade_horarios' 
  | 'diario_classe' 
  | 'portal_familia' 
  | 'portaria_acesso' 
  | 'estoque_geral' 
  | 'estoque_cozinha' 
  | 'patrimonio' 
  | 'biblioteca' 
  | 'auditoria_forense' 
  | 'backup_institucional'
  | 'multiescola_gestao'
  | 'ia_insights'
  | 'rh_funcionarios'
  | 'mensageiro_central'
  | 'suporte_institucional';

export interface Delegacao {
  moduloId: NomeModulo;
  acoes: AcaoPermissao[];
  dataInicio?: string;
  dataFim?: string;
}

export interface Usuario {
  id: string;
  auth_user_id?: string;
  nome: string;
  email?: string;
  papel: PapelUsuario;
  nivel?: number; // 0 a 6
  unidade_id?: string | null;
  unidade?: string;
  cpf?: string;
  delegacoes: Delegacao[];
}

/**
 * Interface para representar uma unidade escolar.
 * Fix: Adicionada interface UnidadeEscolar requerida por servicos/bancoDeDados.ts
 */
export interface UnidadeEscolar {
  id: string;
  nome: string;
  gestorNome: string;
  status: 'ativo' | 'suspenso';
  totalAlunos: number;
}

/**
 * Interface para representar um item na grade de horários.
 * Fix: Adicionada interface GradeItem requerida por paginas/pedagogia/GradeHorarios.tsx
 */
export interface GradeItem {
  id: string;
  dia_semana: 'SEG' | 'TER' | 'QUA' | 'QUI' | 'SEX' | 'SAB';
  horario_inicio: string;
  horario_fim: string;
  disciplina: string;
  professor_id: string;
  sala: string;
}
