import { PapelUsuario } from '../../tipos';

export enum NivelAcesso {
  N0_MASTER = 0,
  N1_GESTOR = 1,
  N2_SUPERVISAO = 2,
  N3_SECRETARIA = 3,
  N4_PROFESSOR = 4,
  N5_FAMILIA = 5,
  N6_PORTARIA = 6,
}

export interface PerfilConfig {
  papel: PapelUsuario;
  label: string;
  nivel: NivelAcesso;
  rotaInicial: string;
}

export const PERFIS_CONFIG: Record<PapelUsuario, PerfilConfig> = {
  admin_plataforma: {
    papel: 'admin_plataforma',
    label: 'Acesso Master',
    nivel: NivelAcesso.N0_MASTER,
    rotaInicial: '/painel/master',
  },
  gestor: {
    papel: 'gestor',
    label: 'Gestor/Diretor',
    nivel: NivelAcesso.N1_GESTOR,
    rotaInicial: '/painel/gestor',
  },
  pedagogia: {
    papel: 'pedagogia',
    label: 'Supervisão/Pedagogia',
    nivel: NivelAcesso.N2_SUPERVISAO,
    rotaInicial: '/painel/supervisao',
  },
  secretaria: {
    papel: 'secretaria',
    label: 'Secretaria',
    nivel: NivelAcesso.N3_SECRETARIA,
    rotaInicial: '/painel/secretaria',
  },
  professor: {
    papel: 'professor',
    label: 'Professor',
    nivel: NivelAcesso.N4_PROFESSOR,
    rotaInicial: '/painel/professor',
  },
  familia: {
    papel: 'familia',
    label: 'Família',
    nivel: NivelAcesso.N5_FAMILIA,
    rotaInicial: '/painel/familia',
  },
  portaria: {
    papel: 'portaria',
    label: 'Vigia/Portaria',
    nivel: NivelAcesso.N6_PORTARIA,
    rotaInicial: '/painel/portaria',
  },
  servicos_gerais: {
    papel: 'servicos_gerais',
    label: 'Serviços Gerais',
    nivel: NivelAcesso.N6_PORTARIA,
    rotaInicial: '/painel/portaria',
  },
};

export const rotaInicialPorPerfil = (papel: PapelUsuario) => PERFIS_CONFIG[papel].rotaInicial;
