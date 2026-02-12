
import { Usuario, UnidadeEscolar, PapelUsuario } from '../tipos';

const CHAVE_UNIDADES = 'escolarapp_unidades';
const CHAVE_USUARIOS = 'escolarapp_usuarios';

// Dados Iniciais (Seed)
// Fix: Changed property names and added missing fields for UnidadeEscolar
const unidadesIniciais: UnidadeEscolar[] = [
  { id: '1', nome: 'E.M. Presidente Vargas', gestor_nome: 'Dr. Roberto Magalhães', status: 'ativo', alunos_count: 1240, versao_core: '3.1.0' },
  { id: '2', nome: 'C.E. Arco-Íris', gestor_nome: 'Profa. Helena Souza', status: 'ativo', alunos_count: 210, versao_core: '3.1.0' },
];

// Fix: Added missing properties (auth_user_id, email, nivel) to Usuario objects
const usuariosIniciais: Usuario[] = [
  {
    id: 'u-master',
    auth_user_id: 'master-uuid',
    nome: 'Administrador Master',
    email: 'master@escolar.app',
    cpf: '000.000.000-00',
    papel: 'admin_plataforma',
    unidade: 'Plataforma Central',
    nivel: 10,
    delegacoes: []
  },
  {
    id: 'u-gestor-1',
    auth_user_id: 'gestor-uuid',
    nome: 'Dr. Roberto Magalhães',
    email: 'gestor@escolar.app',
    cpf: '123.456.789-00',
    papel: 'gestor',
    unidade: 'E.M. Presidente Vargas',
    nivel: 5,
    delegacoes: []
  }
];

export const bd = {
  // --- GESTÃO DE UNIDADES ---
  getUnidades: (): UnidadeEscolar[] => {
    const dados = localStorage.getItem(CHAVE_UNIDADES);
    if (!dados) {
      localStorage.setItem(CHAVE_UNIDADES, JSON.stringify(unidadesIniciais));
      return unidadesIniciais;
    }
    return JSON.parse(dados);
  },

  // Fix: Corrected property names and added versao_core in adding unit
  adicionarUnidade: (nome: string): UnidadeEscolar => {
    const unidades = bd.getUnidades();
    const nova: UnidadeEscolar = {
      id: Math.random().toString(36).substr(2, 9),
      nome,
      gestor_nome: 'Pendente',
      status: 'ativo',
      alunos_count: 0,
      versao_core: '3.1.0'
    };
    const novasUnidades = [...unidades, nova];
    localStorage.setItem(CHAVE_UNIDADES, JSON.stringify(novasUnidades));
    return nova;
  },

  removerUnidade: (id: string): void => {
    const unidades = bd.getUnidades();
    const novasUnidades = unidades.filter(u => u.id !== id);
    localStorage.setItem(CHAVE_UNIDADES, JSON.stringify(novasUnidades));
  },

  // --- GESTÃO DE USUÁRIOS ---
  getUsuarios: (): Usuario[] => {
    const dados = localStorage.getItem(CHAVE_USUARIOS);
    if (!dados) {
      localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(usuariosIniciais));
      return usuariosIniciais;
    }
    return JSON.parse(dados);
  },

  // Fix: Added missing properties (auth_user_id, email, nivel) when creating a new user
  adicionarUsuario: (nome: string, papel: PapelUsuario, unidade: string): Usuario => {
    const usuarios = bd.getUsuarios();
    const novo: Usuario = {
      id: Math.random().toString(36).substr(2, 9),
      auth_user_id: Math.random().toString(36).substr(2, 9),
      nome,
      email: `${nome.toLowerCase().replace(/\s/g, '.')}@escolar.app`,
      cpf: '000.000.000-00',
      papel,
      unidade,
      nivel: papel === 'admin_plataforma' ? 10 : papel === 'gestor' ? 5 : 1,
      delegacoes: []
    };
    const novosUsuarios = [...usuarios, novo];
    localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(novosUsuarios));

    // Se for gestor, atualiza o nome do gestor na unidade correspondente
    if (papel === 'gestor') {
      const unidades = bd.getUnidades();
      const unidIdx = unidades.findIndex(u => u.nome === unidade);
      if (unidIdx !== -1) {
        // Fix: Changed property name from gestorNome to gestor_nome
        unidades[unidIdx].gestor_nome = nome;
        localStorage.setItem(CHAVE_UNIDADES, JSON.stringify(unidades));
      }
    }

    return novo;
  },

  validarLogin: (email: string): Usuario | null => {
    const usuarios = bd.getUsuarios();
    // Simulação: o ID de login é o prefixo do email antes do @
    const loginDesejado = email.split('@')[0];
    
    // Busca simplificada por nome ou id para o mock
    const user = usuarios.find(u => 
      u.id === loginDesejado || 
      u.papel === loginDesejado ||
      (loginDesejado === 'master' && u.papel === 'admin_plataforma')
    );
    
    return user || null;
  }
};
