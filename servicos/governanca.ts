
import { Usuario, NomeModulo, AcaoPermissao } from '../tipos';

/**
 * MOTOR DE GOVERNANÇA E ACESSO
 * Regra de Ouro: O Gestor vê tudo. Os outros veem seus silos + delegações.
 */

export const temPermissao = (usuario: Usuario, modulo: NomeModulo, acao: AcaoPermissao): boolean => {
  // 1. Nível 0: Admin Plataforma (Visão Infraestrutura)
  if (usuario.papel === 'admin_plataforma') {
    const modulosMaster: NomeModulo[] = ['painel_estrategico', 'backup_institucional', 'auditoria_forense'];
    return modulosMaster.includes(modulo);
  }

  // 2. Nível 1: Gestor (Visão Total "De Cima para Baixo")
  if (usuario.papel === 'gestor') return true;

  // 3. Definição de Silos (Permissões Inerentes ao Cargo)
  const permissoesBase: Record<string, NomeModulo[]> = {
    pedagogia: ['pedagogia_central', 'grade_horarios', 'diario_classe'], // Supervisão vê diários
    secretaria: ['secretaria_legal', 'portal_familia'], // Secretaria vê docs e portal
    professor: ['diario_classe'], // Professor vê APENAS diário
    familia: ['portal_familia'], // Família vê APENAS portal
    portaria: ['portaria_acesso'], // Portaria vê APENAS acesso
    servicos_gerais: [] // Base vazia, depende de delegação (ex: Estoque Cozinha)
  };

  // Verifica permissão base
  if (permissoesBase[usuario.papel]?.includes(modulo)) return true;

  // 4. Verificação de Delegação (Permissões Granulares Atribuídas)
  const delegacao = usuario.delegacoes.find(d => d.moduloId === modulo);
  if (delegacao && delegacao.acoes.includes(acao)) {
    // Validação Temporal da Delegação
    const agora = new Date();
    if (delegacao.dataInicio && new Date(delegacao.dataInicio) > agora) return false;
    if (delegacao.dataFim && new Date(delegacao.dataFim) < agora) return false;
    
    // Log de Auditoria de Acesso Delegado (Simulado)
    registrarAuditoria(acao, modulo, `Acesso via delegação para ${usuario.nome}`);
    return true;
  }

  return false;
};

export const registrarAuditoria = (acao: string, modulo: NomeModulo, detalhes: string) => {
  // Em produção, isso enviaria para um banco imutável (Blockchain ou WORM storage)
  console.debug(`[AUDITORIA FORENSE] ${new Date().toISOString()} | ${modulo} | ${acao} | ${detalhes}`);
};
