import React, { useEffect, useMemo, useState } from 'react';
import { UserPlus, KeyRound, ClipboardList, ShieldCheck } from 'lucide-react';
import { AcaoPermissao, Delegacao, NomeModulo, PapelUsuario } from '../../tipos';
import { PresetDelegacao } from '../../src/utils/delegacoes';
import {
  ACOES_DELEGAVEIS,
  MODULOS_DELEGAVEIS,
  UsuarioInterno,
  aplicarPresetDelegacao,
  criarUsuarioInterno,
  listarUsuariosInternos,
  salvarDelegacoesUsuario,
} from '../../src/services/usuariosService';

const GestaoAcessos: React.FC = () => {
  const [usuarios, setUsuarios] = useState<UsuarioInterno[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [nome, setNome] = useState('');
  const [papel, setPapel] = useState<PapelUsuario>('servicos_gerais');
  const [conectadoAoBanco, setConectadoAoBanco] = useState(false);

  const [usuarioSelecionadoId, setUsuarioSelecionadoId] = useState<string>('');
  const [preset, setPreset] = useState<PresetDelegacao>('merendeira');
  const [matrizDelegacoes, setMatrizDelegacoes] = useState<Record<NomeModulo, AcaoPermissao[]>>({} as Record<NomeModulo, AcaoPermissao[]>);

  const totalDelegacoes = useMemo(
    () => usuarios.reduce((acc, usuario) => acc + usuario.delegacoes.length, 0),
    [usuarios]
  );

  const carregar = async () => {
    const resposta = await listarUsuariosInternos();
    setUsuarios(resposta.usuarios);
    setConectadoAoBanco(resposta.conectadoAoBanco);

    if (!usuarioSelecionadoId && resposta.usuarios[0]) {
      setUsuarioSelecionadoId(resposta.usuarios[0].id);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  useEffect(() => {
    const usuario = usuarios.find((u) => u.id === usuarioSelecionadoId);
    if (!usuario) return;
    const base = {} as Record<NomeModulo, AcaoPermissao[]>;
    MODULOS_DELEGAVEIS.forEach((m) => {
      const d = usuario.delegacoes.find((x) => x.moduloId === m);
      base[m] = d?.acoes || [];
    });
    setMatrizDelegacoes(base);
  }, [usuarioSelecionadoId, usuarios]);

  const criarUsuario = async () => {
    const resultado = await criarUsuarioInterno(nome, papel);
    setLogs((atual) => [`${new Date().toLocaleString('pt-BR')} — ${resultado.mensagem}`, ...atual]);
    if (resultado.sucesso) {
      setNome('');
      await carregar();
    }
  };

  const alternarAcao = (modulo: NomeModulo, acao: AcaoPermissao) => {
    const atuais = matrizDelegacoes[modulo] || [];
    const existe = atuais.includes(acao);
    const proximas = existe ? atuais.filter((a) => a !== acao) : [...atuais, acao];
    setMatrizDelegacoes({ ...matrizDelegacoes, [modulo]: proximas });
  };

  const aplicarPreset = () => {
    const delegacoes = aplicarPresetDelegacao(preset);
    const nova = {} as Record<NomeModulo, AcaoPermissao[]>;
    MODULOS_DELEGAVEIS.forEach((m) => { nova[m] = []; });
    delegacoes.forEach((d) => { nova[d.moduloId] = d.acoes; });
    setMatrizDelegacoes(nova);
  };

  const salvarDelegacoes = async () => {
    if (!usuarioSelecionadoId) return;
    const payload: Delegacao[] = MODULOS_DELEGAVEIS.map((m) => ({ moduloId: m, acoes: matrizDelegacoes[m] || [] }));
    const resultado = await salvarDelegacoesUsuario(usuarioSelecionadoId, payload);
    setLogs((atual) => [`${new Date().toLocaleString('pt-BR')} — ${resultado.mensagem}`, ...atual]);
    if (resultado.sucesso) await carregar();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col gap-2">
        <h2 className="text-3xl font-black text-slate-900 tracking-tighter leading-none">Gestão de Acessos</h2>
        <p className="text-slate-500 text-sm font-medium">Criar usuários e delegar funções por módulo e ação com trilha de auditoria.</p>
        <div>
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${conectadoAoBanco ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
            {conectadoAoBanco ? 'Banco conectado (Supabase)' : 'Modo local (sem conexão de banco)'}
          </span>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Indicador titulo="Usuários" valor={`${usuarios.length}`} icone={<UserPlus size={18} />} />
        <Indicador titulo="Delegações Ativas" valor={`${totalDelegacoes}`} icone={<KeyRound size={18} />} />
        <Indicador titulo="Presets Oficiais" valor="4" icone={<ClipboardList size={18} />} />
        <Indicador titulo="Status" valor={conectadoAoBanco ? 'Conectado' : 'Local'} icone={<ShieldCheck size={18} />} />
      </section>

      <section className="bg-white rounded-[2rem] border border-slate-200 p-6 space-y-4">
        <h3 className="text-lg font-black text-slate-800">Criar usuário (cargo-base)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome do usuário" className="px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium" />
          <select value={papel} onChange={(e) => setPapel(e.target.value as PapelUsuario)} className="px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium">
            <option value="servicos_gerais">Serviços Gerais</option>
            <option value="portaria">Vigia/Portaria</option>
            <option value="secretaria">Secretaria</option>
            <option value="pedagogia">Supervisão/Pedagogia</option>
            <option value="professor">Professor</option>
          </select>
          <button onClick={criarUsuario} className="bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest">Criar usuário</button>
        </div>
      </section>

      <section className="bg-white rounded-[2rem] border border-slate-200 p-6 space-y-4">
        <h3 className="text-lg font-black text-slate-800">Delegações por módulo e ação</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <select value={usuarioSelecionadoId} onChange={(e) => setUsuarioSelecionadoId(e.target.value)} className="px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium md:col-span-2">
            {usuarios.map((u) => <option key={u.id} value={u.id}>{u.nome} ({u.papel.replace('_', ' ')})</option>)}
          </select>
          <select value={preset} onChange={(e) => setPreset(e.target.value as PresetDelegacao)} className="px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium">
            <option value="merendeira">Preset: Merendeira / Estoque Cozinha</option>
            <option value="vigia_patrimonio">Preset: Vigia / Patrimônio</option>
            <option value="bibliotecario">Preset: Bibliotecário / Biblioteca</option>
            <option value="almoxarife">Preset: Almoxarife / Estoque Geral</option>
          </select>
          <button onClick={aplicarPreset} className="bg-slate-700 text-white rounded-xl font-black text-xs uppercase tracking-widest">Aplicar preset</button>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
          <table className="w-full text-xs">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-3 font-black uppercase tracking-widest text-slate-500">Módulo</th>
                {ACOES_DELEGAVEIS.map((acao) => <th key={acao} className="p-3 font-black uppercase tracking-widest text-slate-500">{acao}</th>)}
              </tr>
            </thead>
            <tbody>
              {MODULOS_DELEGAVEIS.map((modulo) => (
                <tr key={modulo} className="border-t border-slate-100">
                  <td className="p-3 font-bold text-slate-700 uppercase">{modulo.replace('_', ' ')}</td>
                  {ACOES_DELEGAVEIS.map((acao) => (
                    <td key={`${modulo}-${acao}`} className="p-3 text-center">
                      <input type="checkbox" checked={(matrizDelegacoes[modulo] || []).includes(acao)} onChange={() => alternarAcao(modulo, acao)} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button onClick={salvarDelegacoes} className="bg-blue-600 text-white px-5 py-3 rounded-xl font-black text-xs uppercase tracking-widest">Salvar delegações</button>
      </section>

      <section className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">Usuários e delegações atuais</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {usuarios.map((usuario) => (
            <div key={usuario.id} className="px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <p className="font-black text-slate-800">{usuario.nome}</p>
                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Cargo base: {usuario.papel.replace('_', ' ')} • Nível {usuario.nivel}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {usuario.delegacoes.length === 0 ? <span className="text-xs text-slate-400 font-bold">Sem delegações</span> : usuario.delegacoes.map((d) => (
                  <span key={`${usuario.id}-${d.moduloId}`} className="px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-widest">
                    {d.moduloId.replace('_', ' ')} ({d.acoes.join(', ')})
                  </span>
                ))}
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
