import { LucideIcon, Globe, ShieldCheck, Database, LayoutDashboard, KeyRound, BrainCircuit, FileText, UserSquare2, Users, School, MessageSquare } from 'lucide-react';
import { NomeModulo, PapelUsuario, Usuario } from '../../tipos';
import { temPermissaoModulo } from './permissoes';

export interface ItemMenu {
  para: string;
  label: string;
  modulo: NomeModulo;
  icone: LucideIcon;
}

const MENU_POR_PERFIL: Record<PapelUsuario, ItemMenu[]> = {
  admin_plataforma: [
    { para: '/painel/master', label: 'Painel Master', modulo: 'painel_estrategico', icone: Globe },
    { para: '/backup', label: 'Cópia de Segurança', modulo: 'backup_institucional', icone: Database },
    { para: '/auditoria', label: 'Auditoria', modulo: 'auditoria_forense', icone: ShieldCheck },
  ],
  gestor: [
    { para: '/painel/gestor', label: 'Painel do Gestor', modulo: 'painel_estrategico', icone: LayoutDashboard },
    { para: '/gestao-acessos', label: 'Gestão de Acessos', modulo: 'painel_estrategico', icone: KeyRound },
    { para: '/pedagogia', label: 'Módulo Pedagógico', modulo: 'pedagogia_central', icone: BrainCircuit },
    { para: '/secretaria', label: 'Módulo Secretaria', modulo: 'secretaria_legal', icone: FileText },
    { para: '/portaria', label: 'Módulo Portaria', modulo: 'portaria_acesso', icone: School },
    { para: '/mensagens', label: 'Mensageiro', modulo: 'painel_estrategico', icone: MessageSquare },
  ],
  pedagogia: [
    { para: '/painel/supervisao', label: 'Painel da Supervisão', modulo: 'pedagogia_central', icone: BrainCircuit },
    { para: '/pedagogia', label: 'Central Pedagógica', modulo: 'pedagogia_central', icone: BrainCircuit },
    { para: '/mensagens', label: 'Mensageiro', modulo: 'pedagogia_central', icone: MessageSquare },
  ],
  secretaria: [
    { para: '/painel/secretaria', label: 'Painel da Secretaria', modulo: 'secretaria_legal', icone: FileText },
    { para: '/secretaria', label: 'Secretaria Legal', modulo: 'secretaria_legal', icone: FileText },
    { para: '/mensagens', label: 'Mensageiro', modulo: 'secretaria_legal', icone: MessageSquare },
  ],
  professor: [
    { para: '/painel/professor', label: 'Painel do Professor', modulo: 'diario_classe', icone: UserSquare2 },
    { para: '/professor', label: 'Diário de Classe', modulo: 'diario_classe', icone: UserSquare2 },
    { para: '/mensagens', label: 'Mensageiro', modulo: 'diario_classe', icone: MessageSquare },
  ],
  familia: [
    { para: '/painel/familia', label: 'Painel da Família', modulo: 'portal_familia', icone: Users },
    { para: '/familia', label: 'Portal da Família', modulo: 'portal_familia', icone: Users },
  ],
  portaria: [
    { para: '/painel/portaria', label: 'Painel da Portaria', modulo: 'portaria_acesso', icone: School },
    { para: '/portaria', label: 'Controle de Portaria', modulo: 'portaria_acesso', icone: School },
  ],
  servicos_gerais: [
    { para: '/painel/portaria', label: 'Painel Operacional', modulo: 'portaria_acesso', icone: School },
  ],
};

export const obterMenuPorPerfil = (usuario: Usuario) =>
  MENU_POR_PERFIL[usuario.papel].filter((item) => temPermissaoModulo(usuario, item.modulo, 'ver'));
