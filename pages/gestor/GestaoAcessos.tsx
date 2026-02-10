import React, { useEffect, useMemo, useState } from 'react';
import { UserPlus, KeyRound, ClipboardList, ShieldCheck } from 'lucide-react';
import { PapelUsuario } from '../../tipos';
import { PresetDelegacao } from '../../src/utils/delegacoes';
import { criarUsuarioInterno, listarUsuariosInternos, UsuarioInterno } from '../../src/services/usuariosService';

const GestaoAcessos: React.FC = () => {
  const [usuarios, setUsuarios] = useState<UsuarioInterno[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [nome, setNome] = useState('');
  const [papel, setPapel] = useState<PapelUsuario>('servicos_gerais');
  const [preset, setPreset] = useState<PresetDelegacao>('merendeira');
  const [conectadoAoBanco, setConectadoAoBanco] = useState(false);

  const totalDelegacoes = useMemo(
    () => usuarios.reduce((acc, usuario) => acc + usuario.delegacoes.length, 0),
    [usuarios]
  );

  const carregar = async () => {
    const resposta = await listarUsuariosInternos();
    setUsuarios(resposta.usuarios);
    setConectadoAoBanco(resposta.conectadoAoBanco);
  };

  useEffect(() => {
    carregar();
  }, []);

  const criarUsuario = async () => {
    const resultado = await criarUsuarioInterno(nome, papel, preset);

    setLogs((atual) => [
      `${new Date().toLocaleString('pt-BR')} — ${resultado.mensagem}`,
      ...atual,
    ]);

    if (resultado.sucesso) {
      setNome('');
      await carregar();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col gap-2">
        <h2 className="text-3xl font-black text-slate-900 tracking-tighter leading-none">Gestão de Acessos</h2>
        <p className="text-slate-500 text-sm font-medium">Criar usuários e delegar funções por módulo com trilha de auditoria.</p>
        <div>
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${conectadoAoBanco ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
            {conectadoAoBanco ? 'Banco conectado (Supabase)' : 'Modo local (sem conexão de banco)'}
          </span>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Indicador titulo="Usuários" valor={`${usuarios.length}`} icone={<UserPlus size={18} />} />
        <Indicador titulo="Delegações Ativas" valor={`${totalDelegacoes}`} icone={<KeyRound size={18} />} />
        <Indicador titulo="Presets Oficiais" valor="3" icone={<ClipboardList size={18} />} />
        <Indicador titulo="Status" valor={conectadoAoBanco ? 'Conectado' : 'Local'} icone={<ShieldCheck size={18} />} />
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
                  usuario.delegacoes.map((modulo) => (
                    <span key={`${usuario.id}-${modulo}`} className="px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-widest">
                      {modulo.replace('_', ' ')}
                    </span>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-900 rounded-[2rem] p-6 text-white">
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-300 mb-3">Logs de criação/delegação</h3>
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
