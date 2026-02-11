import { LucideIcon, Globe, ShieldCheck, Database, LayoutDashboard, KeyRound, BrainCircuit, FileText, UserSquare2, Users, School, MessageSquare, Accessibility } from 'lucide-react';
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
    { para: '/master', label: 'Acesso Master', modulo: 'painel_estrategico', icone: Globe },
    { para: '/backup', label: 'Cópia de Segurança', modulo: 'backup_institucional', icone: Database },
    { para: '/auditoria', label: 'Auditoria', modulo: 'auditoria_forense', icone: ShieldCheck },
  ],
  gestor: [
    { para: '/gestao', label: 'Painel do Gestor', modulo: 'painel_estrategico', icone: LayoutDashboard },
    { para: '/gestao-acessos', label: 'Gestão de Acessos', modulo: 'painel_estrategico', icone: KeyRound },
    { para: '/supervisao', label: 'Supervisão e Pedagogia', modulo: 'pedagogia_central', icone: BrainCircuit },
    { para: '/secretaria', label: 'Secretaria', modulo: 'secretaria_legal', icone: FileText },
    { para: '/portaria', label: 'Portaria', modulo: 'portaria_acesso', icone: School },
    { para: '/mensagens', label: 'Mensageiro', modulo: 'painel_estrategico', icone: MessageSquare },
  ],
  pedagogia: [
    { para: '/supervisao', label: 'Painel Supervisão/Pedagogia', modulo: 'pedagogia_central', icone: BrainCircuit },
    { para: '/supervisao/grade-de-horarios', label: 'Grade de Horários', modulo: 'grade_horarios', icone: BrainCircuit },
    { para: '/aluno/perfil', label: 'Aluno e PCD', modulo: 'pcd', icone: Accessibility },
    { para: '/mensagens', label: 'Mensageiro', modulo: 'pedagogia_central', icone: MessageSquare },
  ],
  secretaria: [
    { para: '/secretaria', label: 'Secretaria', modulo: 'secretaria_legal', icone: FileText },
    { para: '/familia', label: 'Portal da Família', modulo: 'portal_familia', icone: Users },
    { para: '/aluno/perfil', label: 'Dados PCD (delegado)', modulo: 'pcd', icone: Accessibility },
  ],
  professor: [
    { para: '/professor', label: 'Painel do Professor', modulo: 'diario_classe', icone: UserSquare2 },
    { para: '/mensagens', label: 'Mensageiro', modulo: 'diario_classe', icone: MessageSquare },
  ],
  familia: [
    { para: '/familia', label: 'Portal da Família', modulo: 'portal_familia', icone: Users },
  ],
  portaria: [
    { para: '/portaria', label: 'Portaria e Vigia', modulo: 'portaria_acesso', icone: School },
    { para: '/portaria', label: 'Patrimônio (delegado)', modulo: 'patrimonio', icone: School },
  ],
  servicos_gerais: [
    { para: '/portaria', label: 'Operações Delegadas', modulo: 'portaria_acesso', icone: School },
    { para: '/portaria', label: 'Estoque Cozinha (delegado)', modulo: 'estoque_cozinha', icone: School },
    { para: '/portaria', label: 'Patrimônio (delegado)', modulo: 'patrimonio', icone: School },
  ],
};

export const obterMenuPorPerfil = (usuario: Usuario) =>
  MENU_POR_PERFIL[usuario.papel].filter((item) => temPermissaoModulo(usuario, item.modulo, 'ver'));
