import { AcaoPermissao, NomeModulo, PapelUsuario, Usuario } from '../../tipos';

type MatrizPermissao = Record<PapelUsuario, NomeModulo[]>;

const matrizPermissoesBase: MatrizPermissao = {
  admin_plataforma: ['painel_estrategico', 'backup_institucional', 'auditoria_forense'],
  gestor: [
    'painel_estrategico',
    'secretaria_legal',
    'pedagogia_central',
    'grade_horarios',
    'diario_classe',
    'portal_familia',
    'portaria_acesso',
    'estoque_geral',
    'estoque_cozinha',
    'patrimonio',
    'biblioteca',
    'auditoria_forense',
    'backup_institucional',
  ],
  pedagogia: ['pedagogia_central', 'grade_horarios', 'diario_classe'],
  secretaria: ['secretaria_legal', 'portal_familia'],
  professor: ['diario_classe'],
  familia: ['portal_familia'],
  portaria: ['portaria_acesso'],
  servicos_gerais: [],
};

export const temPermissaoModulo = (usuario: Usuario, modulo: NomeModulo, acao: AcaoPermissao = 'ver') => {
  if (matrizPermissoesBase[usuario.papel].includes(modulo)) return true;

  const delegacao = usuario.delegacoes.find((d) => d.moduloId === modulo && d.acoes.includes(acao));
  return Boolean(delegacao);
};

export const podeVerDadosPCD = (usuario: Usuario, autorizadoParaProfessor = false) => {
  if (usuario.papel === 'gestor' || usuario.papel === 'pedagogia') return true;
  if (usuario.papel === 'professor' && autorizadoParaProfessor) return true;
  return false;
};

export const registrarLogSensivel = (usuario: Usuario, contexto: string) => {
  // mock de auditoria LGPD
  console.info(`[LGPD-PCD] ${new Date().toISOString()} | ${usuario.nome} (${usuario.papel}) | ${contexto}`);
};
