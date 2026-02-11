import React, { useEffect, useMemo, useState } from 'react';
import {
  Calendar, AlertTriangle, Settings2,
  Layout, History, Save, PlusCircle
} from 'lucide-react';
import {
  carregarGradePorId,
  carregarGradePorTurma,
  definirVersaoAtivaLocal,
  diagnosticarGrade,
  GradeHorario,
  ItemGradeHorario,
  listarVersoesGradePorTurma,
  obterVersaoAtivaLocal,
  RegrasGrade,
  regrasPadrao,
  ResumoVersaoGrade,
  RestricaoAgenda,
  salvarGrade,
} from '../../src/services/gradeHorariosService';

const TURMAS = ['8º Ano B', '9º Ano A', '7º Ano C'];
const DIAS = ['SEG', 'TER', 'QUA', 'QUI', 'SEX'];

const novoItemPadrao: ItemGradeHorario = {
  dia_semana: 'SEG',
  horario_inicio: '07:00',
  horario_fim: '07:50',
  disciplina: '',
  professor_id: '',
  sala: '',
};

const novaRestricaoPadrao: RestricaoAgenda = {
  recurso_tipo: 'professor',
  recurso_id: '',
  dia_semana: 'SEG',
  horario_inicio: '07:00',
  horario_fim: '07:50',
};

const GradeDeHorarios: React.FC = () => {
  const [turma, setTurma] = useState(TURMAS[0]);
  const [semanaRef, setSemanaRef] = useState('2026-S1');
  const [gradeId, setGradeId] = useState<string | undefined>(undefined);
  const [versao, setVersao] = useState(1);
  const [status, setStatus] = useState<'rascunho' | 'publicada'>('rascunho');
  const [itens, setItens] = useState<ItemGradeHorario[]>([]);
  const [novoItem, setNovoItem] = useState<ItemGradeHorario>(novoItemPadrao);
  const [statusBanco, setStatusBanco] = useState<'conectado' | 'local'>('local');
  const [mensagem, setMensagem] = useState('');
  const [regras, setRegras] = useState<RegrasGrade>(regrasPadrao);
  const [novaRestricao, setNovaRestricao] = useState<RestricaoAgenda>(novaRestricaoPadrao);
  const [versoes, setVersoes] = useState<ResumoVersaoGrade[]>([]);
  const [versaoAtivaId, setVersaoAtivaId] = useState<string | null>(null);

  useEffect(() => {
    const carregar = async () => {
      const { grade, conectado } = await carregarGradePorTurma(turma);
      setGradeId(grade.id);
      setVersao(grade.versao || 1);
      setStatus(grade.status || 'rascunho');
      setItens(grade.itens);
      setSemanaRef(grade.semana_ref);
      setStatusBanco(conectado ? 'conectado' : 'local');

      const historico = await listarVersoesGradePorTurma(turma);
      setVersoes(historico.versoes);
      if (grade.unidade_id) setVersaoAtivaId(obterVersaoAtivaLocal(grade.unidade_id, turma));
    };
    carregar();
  }, [turma]);

  const diagnostico = useMemo(() => diagnosticarGrade(itens, semanaRef, regras), [itens, semanaRef, regras]);

  const carregarVersao = async (id: string) => {
    const { grade, conectado } = await carregarGradePorId(id);
    if (!grade) {
      setMensagem('Não foi possível carregar a versão selecionada.');
      return;
    }
    setGradeId(grade.id);
    setVersao(grade.versao || 1);
    setStatus(grade.status || 'rascunho');
    setItens(grade.itens);
    setSemanaRef(grade.semana_ref);
    setStatusBanco(conectado ? 'conectado' : 'local');
    setMensagem(`Versão v${grade.versao} carregada para edição.`);
  };

  const definirAtiva = () => {
    if (!gradeId) {
      setMensagem('Carregue uma versão salva antes de ativar.');
      return;
    }
    definirVersaoAtivaLocal('dev', turma, gradeId);
    setVersaoAtivaId(gradeId);
    setMensagem(`Versão v${versao} definida como ativa para ${turma}.`);
  };

  const adicionarItem = () => {
    if (!novoItem.disciplina || !novoItem.professor_id || !novoItem.sala) {
      setMensagem('Preencha disciplina, professor e sala antes de adicionar.');
      return;
    }
    setItens((atual) => [...atual, novoItem]);
    setNovoItem(novoItemPadrao);
    setMensagem('Aula adicionada à grade.');
  };

  const editarItem = (indice: number, campo: keyof ItemGradeHorario, valor: string) => {
    setItens((atual) => atual.map((item, i) => (i === indice ? { ...item, [campo]: valor } : item)));
  };

  const removerItem = (indice: number) => {
    setItens((atual) => atual.filter((_, i) => i !== indice));
  };

  const adicionarRestricao = () => {
    if (!novaRestricao.recurso_id.trim()) {
      setMensagem('Informe o professor/sala da indisponibilidade.');
      return;
    }
    if (novaRestricao.horario_inicio >= novaRestricao.horario_fim) {
      setMensagem('A indisponibilidade precisa ter início menor que fim.');
      return;
    }
    setRegras((atual) => ({ ...atual, restricoesAgenda: [...atual.restricoesAgenda, novaRestricao] }));
    setNovaRestricao(novaRestricaoPadrao);
    setMensagem('Restrição de agenda adicionada.');
  };

  const removerRestricao = (indice: number) => {
    setRegras((atual) => ({
      ...atual,
      restricoesAgenda: atual.restricoesAgenda.filter((_, i) => i !== indice),
    }));
  };

  const salvar = async (novoStatus: 'rascunho' | 'publicada') => {
    const gradeParaSalvar: GradeHorario = {
      id: gradeId,
      unidade_id: 'auto',
      turma,
      semana_ref: semanaRef,
      versao,
      status: novoStatus,
      itens,
    };
    const resultado = await salvarGrade(gradeParaSalvar, regras);
    setMensagem(resultado.mensagem);

    if (resultado.sucesso) {
      const { grade, conectado } = await carregarGradePorTurma(turma);
      setGradeId(grade.id);
      setVersao(grade.versao || 1);
      setStatus(grade.status || novoStatus);
      setStatusBanco(conectado ? 'conectado' : 'local');
      const historico = await listarVersoesGradePorTurma(turma);
      setVersoes(historico.versoes);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-violet-600 mb-2">
            <Calendar size={24} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Supervisão Pedagógica</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Grade de Horários</h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">Editor com regras avançadas (hard/soft), versão ativa e histórico carregável.</p>
          <p className="text-slate-400 text-xs mt-1 font-bold uppercase tracking-wider">Versão: v{versao} · Status: {status.toUpperCase()} · Ativa: {versaoAtivaId === gradeId ? 'SIM' : 'NÃO'}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusBanco === 'conectado' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
            {statusBanco === 'conectado' ? 'Banco conectado' : 'Modo local'}
          </span>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <button onClick={() => salvar('rascunho')} disabled={diagnostico.conflitos.length > 0} className="bg-violet-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-violet-200 hover:bg-violet-700 transition-all flex items-center gap-2">
              <Save size={16} /> Salvar rascunho
            </button>
            <button onClick={() => salvar('publicada')} disabled={diagnostico.conflitos.length > 0} className="bg-emerald-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center gap-2">
              <Save size={16} /> Publicar grade
            </button>
            <button onClick={definirAtiva} disabled={status !== 'publicada'} className="bg-slate-800 disabled:bg-slate-300 text-white px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest">Definir ativa</button>
          </div>
        </div>
      </header>

      <section className="bg-white p-6 rounded-[2rem] border border-slate-200 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <select value={turma} onChange={(e) => setTurma(e.target.value)} className="px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium">
            {TURMAS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <input value={semanaRef} onChange={(e) => setSemanaRef(e.target.value)} className="px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium" placeholder="Semana (ex: 2026-S1)" />
          <div className="text-xs font-bold text-slate-500 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">Conflitos hard: <span className="text-rose-600">{diagnostico.conflitos.length}</span> · Avisos soft: <span className="text-amber-600">{diagnostico.avisosSoft.length}</span></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
          <select value={novoItem.dia_semana} onChange={(e) => setNovoItem({ ...novoItem, dia_semana: e.target.value })} className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium">
            {DIAS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <input type="time" value={novoItem.horario_inicio} onChange={(e) => setNovoItem({ ...novoItem, horario_inicio: e.target.value })} className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium" />
          <input type="time" value={novoItem.horario_fim} onChange={(e) => setNovoItem({ ...novoItem, horario_fim: e.target.value })} className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium" />
          <input value={novoItem.disciplina} onChange={(e) => setNovoItem({ ...novoItem, disciplina: e.target.value })} placeholder="Disciplina" className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium" />
          <input value={novoItem.professor_id} onChange={(e) => setNovoItem({ ...novoItem, professor_id: e.target.value })} placeholder="Professor" className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium" />
          <input value={novoItem.sala} onChange={(e) => setNovoItem({ ...novoItem, sala: e.target.value })} placeholder="Sala" className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium" />
          <button onClick={adicionarItem} className="bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-1"><PlusCircle size={14} />Adicionar</button>
        </div>
      </section>

      <section className="bg-white p-6 rounded-[2rem] border border-slate-200 space-y-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-700">Regras avançadas (ASC-like)</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <label className="text-xs font-bold text-slate-600">Carga máxima professor/dia<input type="number" min={1} value={regras.cargaMaximaProfessorDia} onChange={(e) => setRegras((a) => ({ ...a, cargaMaximaProfessorDia: Number(e.target.value || 0) }))} className="mt-1 w-full px-2 py-1 border rounded-lg" /></label>
          <label className="text-xs font-bold text-slate-600">Máximo furos professor/dia<input type="number" min={0} value={regras.maximoJanelasProfessorDia} onChange={(e) => setRegras((a) => ({ ...a, maximoJanelasProfessorDia: Number(e.target.value || 0) }))} className="mt-1 w-full px-2 py-1 border rounded-lg" /></label>
          <label className="text-xs font-bold text-slate-600">Máximo furos turma/dia<input type="number" min={0} value={regras.maximoJanelasTurmaDia} onChange={(e) => setRegras((a) => ({ ...a, maximoJanelasTurmaDia: Number(e.target.value || 0) }))} className="mt-1 w-full px-2 py-1 border rounded-lg" /></label>
          <label className="text-xs font-bold text-slate-600">Máximo aulas consecutivas/prof<input type="number" min={1} value={regras.maximoAulasConsecutivasProfessor} onChange={(e) => setRegras((a) => ({ ...a, maximoAulasConsecutivasProfessor: Number(e.target.value || 1) }))} className="mt-1 w-full px-2 py-1 border rounded-lg" /></label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
          <select value={novaRestricao.recurso_tipo} onChange={(e) => setNovaRestricao({ ...novaRestricao, recurso_tipo: e.target.value as 'professor' | 'sala' })} className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium">
            <option value="professor">Professor</option>
            <option value="sala">Sala</option>
          </select>
          <input value={novaRestricao.recurso_id} onChange={(e) => setNovaRestricao({ ...novaRestricao, recurso_id: e.target.value })} placeholder="ID recurso" className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium" />
          <select value={novaRestricao.dia_semana} onChange={(e) => setNovaRestricao({ ...novaRestricao, dia_semana: e.target.value })} className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium">{DIAS.map((d) => <option key={d} value={d}>{d}</option>)}</select>
          <input type="time" value={novaRestricao.horario_inicio} onChange={(e) => setNovaRestricao({ ...novaRestricao, horario_inicio: e.target.value })} className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium" />
          <input type="time" value={novaRestricao.horario_fim} onChange={(e) => setNovaRestricao({ ...novaRestricao, horario_fim: e.target.value })} className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium" />
          <button onClick={adicionarRestricao} className="md:col-span-2 bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-1">Adicionar indisponibilidade</button>
        </div>

        {regras.restricoesAgenda.length > 0 && (
          <ul className="space-y-2">
            {regras.restricoesAgenda.map((r, i) => (
              <li key={`${r.recurso_tipo}-${r.recurso_id}-${i}`} className="flex items-center justify-between text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                <span className="font-semibold text-slate-700">{r.recurso_tipo} {r.recurso_id} indisponível em {r.dia_semana} {r.horario_inicio}-{r.horario_fim}</span>
                <button onClick={() => removerRestricao(i)} className="text-rose-600 font-black">Remover</button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {diagnostico.conflitos.length > 0 && (
        <section className="bg-rose-50 border border-rose-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2 text-rose-700"><AlertTriangle size={16} /><span className="font-black text-sm">Conflitos hard</span></div>
          <ul className="text-xs text-rose-700 list-disc ml-5 space-y-1">{diagnostico.conflitos.map((c, i) => <li key={i}>{c}</li>)}</ul>
        </section>
      )}

      {diagnostico.avisosSoft.length > 0 && (
        <section className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2 text-amber-700"><AlertTriangle size={16} /><span className="font-black text-sm">Avisos soft (não bloqueiam)</span></div>
          <ul className="text-xs text-amber-700 list-disc ml-5 space-y-1">{diagnostico.avisosSoft.map((c, i) => <li key={i}>{c}</li>)}</ul>
        </section>
      )}

      <section className="bg-white p-6 rounded-[2rem] border border-slate-200 overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-3 text-left font-black uppercase tracking-widest text-slate-500">Dia</th>
              <th className="p-3 text-left font-black uppercase tracking-widest text-slate-500">Início</th>
              <th className="p-3 text-left font-black uppercase tracking-widest text-slate-500">Fim</th>
              <th className="p-3 text-left font-black uppercase tracking-widest text-slate-500">Disciplina</th>
              <th className="p-3 text-left font-black uppercase tracking-widest text-slate-500">Professor</th>
              <th className="p-3 text-left font-black uppercase tracking-widest text-slate-500">Sala</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {itens.map((item, idx) => (
              <tr key={`${item.dia_semana}-${item.horario_inicio}-${idx}`} className="border-t border-slate-100">
                <td className="p-2"><select value={item.dia_semana} onChange={(e) => editarItem(idx, 'dia_semana', e.target.value)} className="px-2 py-1 rounded border border-slate-200">{DIAS.map((d) => <option key={d} value={d}>{d}</option>)}</select></td>
                <td className="p-2"><input type="time" value={item.horario_inicio} onChange={(e) => editarItem(idx, 'horario_inicio', e.target.value)} className="px-2 py-1 rounded border border-slate-200" /></td>
                <td className="p-2"><input type="time" value={item.horario_fim} onChange={(e) => editarItem(idx, 'horario_fim', e.target.value)} className="px-2 py-1 rounded border border-slate-200" /></td>
                <td className="p-2"><input value={item.disciplina} onChange={(e) => editarItem(idx, 'disciplina', e.target.value)} className="px-2 py-1 rounded border border-slate-200" /></td>
                <td className="p-2"><input value={item.professor_id} onChange={(e) => editarItem(idx, 'professor_id', e.target.value)} className="px-2 py-1 rounded border border-slate-200" /></td>
                <td className="p-2"><input value={item.sala} onChange={(e) => editarItem(idx, 'sala', e.target.value)} className="px-2 py-1 rounded border border-slate-200" /></td>
                <td className="p-3 text-right"><button onClick={() => removerItem(idx)} className="text-rose-600 font-black">Remover</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="bg-white p-6 rounded-[2rem] border border-slate-200 space-y-3">
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-700">Histórico de versões</h3>
        {versoes.length === 0 ? <p className="text-xs text-slate-500 font-semibold">Nenhuma versão encontrada para esta turma.</p> : (
          <ul className="space-y-2">
            {versoes.map((v) => (
              <li key={v.id} className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs">
                <span className="font-semibold text-slate-700">v{v.versao} · {v.status.toUpperCase()} · {v.semana_ref} {versaoAtivaId === v.id ? '· ATIVA' : ''}</span>
                <button onClick={() => carregarVersao(v.id)} className="text-violet-700 font-black">Carregar</button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {mensagem && <div className="text-sm font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">{mensagem}</div>}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <GradeNavButton label="Editor Manual" icon={<Layout />} />
        <GradeNavButton label="Diagnóstico" icon={<AlertTriangle />} badge={`${diagnostico.conflitos.length}`} />
        <GradeNavButton label="Regras" icon={<Settings2 />} badge={`${regras.restricoesAgenda.length}`} />
        <GradeNavButton label="Histórico" icon={<History />} badge={`${versoes.length}`} />
      </div>
    </div>
  );
};

const GradeNavButton = ({ label, icon, badge }: any) => (
  <button className="flex flex-col items-center justify-center p-6 bg-white border border-slate-200 rounded-[2rem] hover:shadow-xl hover:border-violet-300 transition-all group relative">
    <div className="text-slate-400 group-hover:text-violet-600 transition-colors mb-2">{React.cloneElement(icon, { size: 24 })}</div>
    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest text-center leading-tight group-hover:text-slate-900">{label}</span>
    {badge && <span className="absolute top-4 right-4 bg-rose-500 text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-lg">{badge}</span>}
  </button>
);

export default GradeDeHorarios;
