
import { Usuario, UnidadeEscolar, PapelUsuario } from '../tipos';

const CHAVE_UNIDADES = 'escolarapp_unidades';
const CHAVE_USUARIOS = 'escolarapp_usuarios';

// Dados Iniciais (Seed)
const unidadesIniciais: UnidadeEscolar[] = [
  { id: '1', nome: 'E.M. Presidente Vargas', gestorNome: 'Dr. Roberto Magalhães', status: 'ativo', totalAlunos: 1240 },
  { id: '2', nome: 'C.E. Arco-Íris', gestorNome: 'Profa. Helena Souza', status: 'ativo', totalAlunos: 210 },
];

const usuariosIniciais: Usuario[] = [
  {
    id: 'u-master',
    nome: 'Administrador Master',
    cpf: '000.000.000-00',
    papel: 'admin_plataforma',
    unidade: 'Plataforma Central',
    delegacoes: []
  },
  {
    id: 'u-gestor-1',
    nome: 'Dr. Roberto Magalhães',
    cpf: '123.456.789-00',
    papel: 'gestor',
    unidade: 'E.M. Presidente Vargas',
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

  adicionarUnidade: (nome: string): UnidadeEscolar => {
    const unidades = bd.getUnidades();
    const nova: UnidadeEscolar = {
      id: Math.random().toString(36).substr(2, 9),
      nome,
      gestorNome: 'Pendente',
      status: 'ativo',
      totalAlunos: 0
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

  adicionarUsuario: (nome: string, papel: PapelUsuario, unidade: string): Usuario => {
    const usuarios = bd.getUsuarios();
    const novo: Usuario = {
      id: Math.random().toString(36).substr(2, 9),
      nome,
      cpf: '000.000.000-00',
      papel,
      unidade,
      delegacoes: []
    };
    const novosUsuarios = [...usuarios, novo];
    localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(novosUsuarios));

    // Se for gestor, atualiza o nome do gestor na unidade correspondente
    if (papel === 'gestor') {
      const unidades = bd.getUnidades();
      const unidIdx = unidades.findIndex(u => u.nome === unidade);
      if (unidIdx !== -1) {
        unidades[unidIdx].gestorNome = nome;
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
