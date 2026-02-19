
import { Usuario, NomeModulo, AcaoPermissao } from '../tipos';

export const temPermissao = (usuario: Usuario, modulo: NomeModulo, acao: AcaoPermissao): boolean => {
  // 1. Admin Plataforma: Acesso à infraestrutura e Suporte de Gestores
  if (usuario.papel === 'admin_plataforma') {
    const modulosMaster: NomeModulo[] = ['painel_estrategico', 'backup_institucional', 'auditoria_forense', 'multiescola_gestao', 'suporte_institucional'];
    return modulosMaster.includes(modulo);
  }

  // 2. Gestor: Visão Total + Suporte Master
  if (usuario.papel === 'gestor') return true;

  // 3. Silos Departamentais
  const permissoesBase: Record<string, NomeModulo[]> = {
    pedagogia: ['pedagogia_central', 'grade_horarios', 'diario_classe', 'ia_insights', 'biblioteca', 'mensageiro_central'],
    secretaria: ['secretaria_legal', 'portal_familia', 'rh_funcionarios', 'patrimonio', 'mensageiro_central'],
    professor: ['diario_classe', 'biblioteca', 'mensageiro_central'],
    familia: ['portal_familia', 'mensageiro_central'],
    portaria: ['portaria_acesso'],
    servicos_gerais: ['estoque_cozinha', 'estoque_geral']
  };

  if (permissoesBase[usuario.papel]?.includes(modulo)) return true;

  return false;
};

export const registrarAuditoria = (acao: string, modulo: NomeModulo, detalhes: string) => {
  console.debug(`[AUDIT] ${new Date().toISOString()} | ${modulo} | ${acao} | ${detalhes}`);
};
