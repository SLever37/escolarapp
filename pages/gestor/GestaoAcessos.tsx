import React, { useMemo, useState } from 'react';
import { UserPlus, KeyRound, ClipboardList, ShieldCheck } from 'lucide-react';
import { PapelUsuario, Usuario } from '../../tipos';
import { PRESETS_DELEGACAO, PresetDelegacao } from '../../src/utils/delegacoes';

interface UsuarioMock extends Pick<Usuario, 'id' | 'nome' | 'papel' | 'delegacoes'> {}

const usuariosIniciais: UsuarioMock[] = [
  { id: '1', nome: 'Sra. Maria Auxiliadora', papel: 'servicos_gerais', delegacoes: PRESETS_DELEGACAO.merendeira.delegacoes },
  { id: '2', nome: 'Sr. Cláudio Rocha', papel: 'portaria', delegacoes: PRESETS_DELEGACAO.vigia_patrimonio.delegacoes },
  { id: '3', nome: 'Joana Prado', papel: 'secretaria', delegacoes: [] },
];

const GestaoAcessos: React.FC = () => {
  const [usuarios, setUsuarios] = useState<UsuarioMock[]>(usuariosIniciais);
  const [logs, setLogs] = useState<string[]>([]);
  const [nome, setNome] = useState('');
  const [papel, setPapel] = useState<PapelUsuario>('servicos_gerais');
  const [preset, setPreset] = useState<PresetDelegacao>('merendeira');

  const totalDelegacoes = useMemo(
    () => usuarios.reduce((acc, usuario) => acc + usuario.delegacoes.length, 0),
    [usuarios]
  );

  const criarUsuario = () => {
    if (!nome.trim()) return;

    const novo: UsuarioMock = {
      id: `${Date.now()}`,
      nome,
      papel,
      delegacoes: PRESETS_DELEGACAO[preset].delegacoes,
    };

    setUsuarios((atual) => [novo, ...atual]);
    setLogs((atual) => [
      `${new Date().toLocaleString('pt-BR')} — Usuário ${nome} criado com preset ${PRESETS_DELEGACAO[preset].nome}.`,
      ...atual,
    ]);
    setNome('');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header>
        <h2 className="text-3xl font-black text-slate-900 tracking-tighter leading-none">Gestão de Acessos</h2>
        <p className="text-slate-500 text-sm mt-2 font-medium">Criar usuários e delegar funções por módulo com trilha de auditoria.</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Indicador titulo="Usuários" valor={`${usuarios.length}`} icone={<UserPlus size={18} />} />
        <Indicador titulo="Delegações Ativas" valor={`${totalDelegacoes}`} icone={<KeyRound size={18} />} />
        <Indicador titulo="Presets Oficiais" valor="3" icone={<ClipboardList size={18} />} />
        <Indicador titulo="Status" valor="Conforme" icone={<ShieldCheck size={18} />} />
      </section>

      <section className="bg-white rounded-[2rem] border border-slate-200 p-6 space-y-4">
        <h3 className="text-lg font-black text-slate-800">Criar usuário e delegar função</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome do usuário" className="px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium" />
          <select value={papel} onChange={(e) => setPapel(e.target.value as PapelUsuario)} className="px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium">
            <option value="servicos_gerais">Serviços Gerais</option>
            <option value="portaria">Vigia/Portaria</option>
            <option value="secretaria">Secretaria</option>
            <option value="pedagogia">Supervisão/Pedagogia</option>
          </select>
          <select value={preset} onChange={(e) => setPreset(e.target.value as PresetDelegacao)} className="px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium">
            <option value="merendeira">Merendeira: Estoque da Cozinha</option>
            <option value="vigia_patrimonio">Vigia: Patrimônio e Inventário</option>
            <option value="bibliotecario">Bibliotecário: Biblioteca</option>
          </select>
          <button onClick={criarUsuario} className="bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest">Criar usuário</button>
        </div>
      </section>

      <section className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">Usuários e delegações</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {usuarios.map((usuario) => (
            <div key={usuario.id} className="px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <p className="font-black text-slate-800">{usuario.nome}</p>
                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Cargo base: {usuario.papel.replace('_', ' ')}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {usuario.delegacoes.length === 0 ? (
                  <span className="text-xs text-slate-400 font-bold">Sem delegações</span>
                ) : (
                  usuario.delegacoes.map((delegacao) => (
                    <span key={`${usuario.id}-${delegacao.moduloId}`} className="px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-widest">
                      {delegacao.moduloId.replace('_', ' ')}
                    </span>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-900 rounded-[2rem] p-6 text-white">
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-300 mb-3">Logs mock de delegação</h3>
        <div className="space-y-2 text-xs">
          {logs.length === 0 ? <p className="text-slate-400">Nenhum log registrado.</p> : logs.map((log, idx) => <p key={idx}>• {log}</p>)}
        </div>
      </section>
    </div>
  );
};

const Indicador = ({ titulo, valor, icone }: { titulo: string; valor: string; icone: React.ReactNode }) => (
  <div className="bg-white border border-slate-200 rounded-2xl p-4">
    <div className="text-blue-600 mb-2">{icone}</div>
    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-black">{titulo}</p>
    <p className="text-2xl font-black text-slate-800 tracking-tight">{valor}</p>
  </div>
);

export default GestaoAcessos;
