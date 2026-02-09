
import { Usuario, NomeModulo, AcaoPermissao } from '../tipos';

export const temPermissao = (usuario: Usuario, modulo: NomeModulo, acao: AcaoPermissao): boolean => {
  if (usuario.papel === 'admin_plataforma') {
    const modulosMaster: NomeModulo[] = ['painel_estrategico', 'backup_institucional', 'auditoria_forense'];
    return modulosMaster.includes(modulo);
  }

  if (usuario.papel === 'gestor') return true;

  const permissoesBase: Record<string, NomeModulo[]> = {
    pedagogia: ['pedagogia_central', 'grade_horarios', 'diario_classe'],
    secretaria: ['secretaria_legal', 'portal_familia'],
    professor: ['diario_classe'],
    familia: ['portal_familia'],
    portaria: ['portaria_acesso'],
  };

  if (permissoesBase[usuario.papel]?.includes(modulo)) return true;

  const delegacao = usuario.delegacoes.find(d => d.moduloId === modulo);
  if (delegacao && delegacao.acoes.includes(acao)) {
    const agora = new Date();
    if (delegacao.dataInicio && new Date(delegacao.dataInicio) > agora) return false;
    if (delegacao.dataFim && new Date(delegacao.dataFim) < agora) return false;
    return true;
  }

  return false;
};

export const registrarAuditoria = (acao: string, modulo: NomeModulo, detalhes: string) => {
  console.debug(`[AUDITORIA] ${new Date().toISOString()} | ${modulo} | ${acao} | ${detalhes}`);
};
