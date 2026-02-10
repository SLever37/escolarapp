import { PapelUsuario } from '../../tipos';
import { PRESETS_DELEGACAO, PresetDelegacao } from '../utils/delegacoes';
import { supabaseAtivo, supabaseRest } from '../lib/supabaseClient';

export interface UsuarioInterno {
  id: string;
  nome: string;
  papel: PapelUsuario;
  delegacoes: string[];
}

const usuariosMock: UsuarioInterno[] = [
  { id: '1', nome: 'Sra. Maria Auxiliadora', papel: 'servicos_gerais', delegacoes: ['estoque_cozinha'] },
  { id: '2', nome: 'Sr. Cláudio Rocha', papel: 'portaria', delegacoes: ['portaria_acesso', 'patrimonio'] },
  { id: '3', nome: 'Joana Prado', papel: 'secretaria', delegacoes: [] },
];

export const listarUsuariosInternos = async (): Promise<{ usuarios: UsuarioInterno[]; conectadoAoBanco: boolean }> => {
  if (!supabaseAtivo) {
    return { usuarios: usuariosMock, conectadoAoBanco: false };
  }

  try {
    const usuarios = await supabaseRest.select<Array<{ id: string; nome: string; papel: PapelUsuario }>>('usuarios?select=id,nome,papel');
    const delegacoes = await supabaseRest.select<Array<{ usuario_id: string; modulo_id: string }>>('delegacoes?select=usuario_id,modulo_id');

    const porUsuario = delegacoes.reduce<Record<string, string[]>>((acc, item) => {
      acc[item.usuario_id] = [...(acc[item.usuario_id] || []), item.modulo_id];
      return acc;
    }, {});

    return {
      conectadoAoBanco: true,
      usuarios: usuarios.map((u) => ({ id: u.id, nome: u.nome, papel: u.papel, delegacoes: porUsuario[u.id] || [] })),
    };
  } catch {
    return { usuarios: usuariosMock, conectadoAoBanco: false };
  }
};

export const criarUsuarioInterno = async (
  nome: string,
  papel: PapelUsuario,
  preset: PresetDelegacao,
): Promise<{ sucesso: boolean; mensagem: string }> => {
  if (!nome.trim()) return { sucesso: false, mensagem: 'Informe o nome do usuário.' };

  if (!supabaseAtivo) {
    return { sucesso: true, mensagem: 'Usuário criado em modo local (sem conexão com banco).' };
  }

  try {
    const emailMock = `${nome.toLowerCase().replace(/\s+/g, '.')}@escolarapp.local`;

    const usuarioCriado = await supabaseRest.insert<Array<{ id: string }>>(
      'usuarios?select=id',
      {
        nome,
        email: emailMock,
        papel,
        nivel: papel === 'admin_plataforma' ? 0 : 1,
        ativo: true,
      },
      'representation'
    );

    const usuarioId = usuarioCriado[0]?.id;
    if (!usuarioId) return { sucesso: false, mensagem: 'Falha ao recuperar ID do usuário criado.' };

    const delegacoes = PRESETS_DELEGACAO[preset].delegacoes.map((d) => ({
      usuario_id: usuarioId,
      modulo_id: d.moduloId,
      acoes: d.acoes,
    }));

    await supabaseRest.insert('delegacoes', delegacoes, 'minimal');

    return { sucesso: true, mensagem: 'Usuário criado no banco com delegação aplicada.' };
  } catch (erro) {
    return { sucesso: false, mensagem: `Falha ao salvar no banco: ${String(erro)}` };
  }
};
