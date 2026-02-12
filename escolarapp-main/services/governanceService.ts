
import { User, ModuleName, PermissionAction } from '../types';

export const hasPermission = (user: User, module: ModuleName, action: PermissionAction): boolean => {
  // Admin Plataforma (Master) tem acesso total a infraestrutura e auditoria global
  if (user.role === 'admin_plataforma') {
    const masterModules: ModuleName[] = ['painel_estrategico', 'backup_institucional', 'auditoria_forense'];
    return masterModules.includes(module);
  }

  // Gestor tem acesso total de visualização e gerência dentro da sua unidade
  if (user.role === 'gestor') return true;

  // Papéis Base
  const basePermissions: Record<string, ModuleName[]> = {
    pedagogia: ['pedagogia_central', 'grade_horarios', 'diario_classe'],
    secretaria: ['secretaria_legal', 'portal_familia'],
    professor: ['diario_classe'],
    familia: ['portal_familia'],
    portaria: ['portaria_acesso'],
  };

  if (basePermissions[user.role]?.includes(module)) return true;

  // Delegação Específica
  const delegation = user.delegations.find(d => d.moduleId === module);
  if (delegation && delegation.actions.includes(action)) {
    const now = new Date();
    if (delegation.startDate && new Date(delegation.startDate) > now) return false;
    if (delegation.endDate && new Date(delegation.endDate) < now) return false;
    return true;
  }

  return false;
};

export const createAuditLog = (action: string, module: ModuleName, details: string) => {
  console.log(`[AUDITORIA] ${new Date().toISOString()} | Módulo: ${module} | Ação: ${action} | Detalhes: ${details}`);
};
