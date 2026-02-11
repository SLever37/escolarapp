import { AcaoPermissao, Delegacao } from '../../tipos';

export type PresetDelegacao = 'merendeira' | 'vigia_patrimonio' | 'bibliotecario' | 'almoxarife';

interface PresetConfig {
  nome: string;
  delegacoes: Delegacao[];
}

const todasAcoes: AcaoPermissao[] = ['ver', 'criar', 'editar', 'excluir', 'imprimir', 'exportar'];

export const PRESETS_DELEGACAO: Record<PresetDelegacao, PresetConfig> = {
  merendeira: {
    nome: 'Merendeira: Estoque da Cozinha',
    delegacoes: [{ moduloId: 'estoque_cozinha', acoes: todasAcoes }],
  },
  vigia_patrimonio: {
    nome: 'Vigia: Portaria + Patrimônio e Inventário',
    delegacoes: [
      { moduloId: 'portaria_acesso', acoes: todasAcoes },
      { moduloId: 'patrimonio', acoes: todasAcoes },
    ],
  },
  bibliotecario: {
    nome: 'Bibliotecário: Biblioteca',
    delegacoes: [{ moduloId: 'biblioteca', acoes: todasAcoes }],
  },
  almoxarife: {
    nome: 'Almoxarife: Estoque Geral',
    delegacoes: [{ moduloId: 'estoque_geral', acoes: todasAcoes }],
  },
};
