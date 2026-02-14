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

export interface Usuario {
  id: string;
  auth_user_id: string;
  nome: string;
  email: string;
  cpf: string;
  papel: PapelUsuario;
  unidade_id?: string;
  unidade?: string;
  nivel: number;
  delegacoes: any[];
}

export interface UnidadeEscolar {
  id: string;
  nome: string;
  gestor_nome: string;
  status: 'ativo' | 'arquivado' | 'suspenso';
  alunos_count: number;
  versao_core: string;
  codigo_inep?: string | null;
  criado_em?: string;
}

export interface Notificacao {
  id: string;
  titulo: string;
  mensagem: string;
  lida: boolean;
  tipo: 'alerta' | 'sucesso' | 'info' | 'erro';
  criado_em: string;
}

export interface GradeItem {
  id: string;
  dia_semana: 'SEG' | 'TER' | 'QUA' | 'QUI' | 'SEX' | 'SAB';
  horario_inicio: string;
  horario_fim: string;
  disciplina: string;
  professor_id: string;
  sala: string;
}