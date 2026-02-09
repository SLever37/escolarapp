
export type UserRole = 'admin_plataforma' | 'gestor' | 'pedagogia' | 'secretaria' | 'professor' | 'familia' | 'portaria' | 'servicos_gerais';

export type PermissionAction = 'ver' | 'criar' | 'editar' | 'excluir' | 'imprimir' | 'exportar';

export type ModuleName = 
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
  | 'backup_institucional';

export interface Delegation {
  moduleId: ModuleName;
  actions: PermissionAction[];
  startDate?: string;
  endDate?: string;
}

export interface User {
  id: string;
  name: string;
  cpf: string;
  role: UserRole;
  unit: string;
  delegations: Delegation[];
}

// Updated Student interface with missing fields required by UI components
export interface Student {
  id: string;
  name: string;
  isPCD: boolean;
  grade: string;
  shift: string;
  status: 'regular' | 'risco' | 'crítico';
  attendance: number;
  averageGrade: number;
  photo: string;
  bolsaFamilia: boolean;
  docsPending: string[];
  legalStatus: string;
  sensitiveData: {
    bolsaFamilia: boolean;
    medicalNotes?: string;
  };
}

export interface LogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  module: ModuleName;
  details: string;
  severity: 'baixa' | 'media' | 'alta' | 'critica';
}

// Added missing timetable types for service support
export type DayOfWeek = 'SEG' | 'TER' | 'QUA' | 'QUI' | 'SEX' | 'SAB';

export interface TimetableSlot {
  id: string;
  day: DayOfWeek;
  period: number;
  subjectId: string;
  teacherId: string;
  classId: string;
}

export interface TimetableConflict {
  id: string;
  type: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  slots: string[];
}
