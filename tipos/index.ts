
export type PapelUsuario = 'admin_plataforma' | 'gestor' | 'pedagogia' | 'secretaria' | 'professor' | 'familia' | 'portaria' | 'servicos_gerais';

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
  | 'pcd';

export interface Delegacao {
  moduloId: NomeModulo;
  acoes: AcaoPermissao[];
  dataInicio?: string;
  dataFim?: string;
}

export interface Usuario {
  id: string;
  nome: string;
  cpf: string;
  papel: PapelUsuario;
  unidade: string;
  delegacoes: Delegacao[];
}

export interface UnidadeEscolar {
  id: string;
  nome: string;
  gestorNome: string;
  status: 'ativo' | 'suspenso';
  totalAlunos: number;
}
