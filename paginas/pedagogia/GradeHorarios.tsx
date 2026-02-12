import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Save, Trash2, Clock, MapPin, User, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../servicos/supabase';
import { useAuth } from '../../servicos/contexto/AuthContext';
import { GradeItem } from '../../tipos';

const GradeHorarios = () => {
  const { usuario } = useAuth();
  const [turma, setTurma] = useState('8º Ano B');
  const [itens, setItens] = useState<GradeItem[]>([]);
  const [salvando, setSalvando] = useState(false);

  const adicionarLinha = () => {
    const novo: GradeItem = {
      id: Math.random().toString(36).substr(2, 9),
      dia_semana: 'SEG',
      horario_inicio: '07:00',
      horario_fim: '07:50',
      disciplina: '',
      professor_id: '',
      sala: ''
    };
    setItens([...itens, novo]);
  };

  const removerLinha = (id: string) => {
    setItens(itens.filter(i => i.id !== id));
  };

  const atualizarItem = (id: string, campo: keyof GradeItem, valor: string) => {
    setItens(itens.map(i => i.id === id ? { ...i, [campo]: valor } : i));
  };

  const salvarGrade = async () => {
    setSalvando(true);
    // Simulação de persistência
    setTimeout(() => {
      setSalvando(false);
      alert("Grade de Horários salva com sucesso!");
    }, 1000);
  };

  return (
    <div className="p-4 md:p-10 space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-violet-600 mb-1">
            <Calendar size={20} />
            <span className="text-[10px] font-black uppercase tracking-widest">Gestão Pedagógica</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Grade de Horários</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={adicionarLinha} className="bg-white border border-slate-200 px-6 py-3 rounded-2xl text-xs font-black uppercase flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
            <Plus size={16} /> Adicionar Slot
          </button>
          <button onClick={salvando ? undefined : salvarGrade} className="bg-violet-600 text-white px-8 py-3 rounded-2xl text-xs font-black uppercase flex items-center gap-2 shadow-lg shadow-violet-200 hover:bg-violet-700 transition-all">
            {salvando ? 'Processando...' : <><Save size={16} /> Salvar Grade</>}
          </button>
        </div>
      </header>

      <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-sm overflow-x-auto">
        <div className="mb-8 flex items-center gap-4">
          <label className="text-[10px] font-black text-slate-400 uppercase">Turma Selecionada:</label>
          <select value={turma} onChange={(e) => setTurma(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-violet-500/20">
            <option>8º Ano B</option>
            <option>9º Ano A</option>
            <option>7º Ano C</option>
          </select>
        </div>

        <table className="w-full text-left border-separate border-spacing-y-3">
          <thead>
            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <th className="px-4">Dia</th>
              <th className="px-4">Início</th>
              <th className="px-4">Fim</th>
              <th className="px-4">Disciplina</th>
              <th className="px-4">Professor</th>
              <th className="px-4">Sala</th>
              <th className="px-4"></th>
            </tr>
          </thead>
          <tbody>
            {itens.map((item) => (
              <tr key={item.id} className="bg-slate-50/50 hover:bg-slate-50 transition-colors group">
                <td className="px-4 py-3 first:rounded-l-2xl">
                  <select 
                    value={item.dia_semana} 
                    onChange={(e) => atualizarItem(item.id, 'dia_semana', e.target.value as any)}
                    className="bg-transparent text-sm font-bold outline-none"
                  >
                    <option>SEG</option><option>TER</option><option>QUA</option><option>QUI</option><option>SEX</option><option>SAB</option>
                  </select>
                </td>
                <td className="px-4 py-3"><input type="time" value={item.horario_inicio} onChange={(e) => atualizarItem(item.id, 'horario_inicio', e.target.value)} className="bg-transparent text-sm font-bold outline-none" /></td>
                <td className="px-4 py-3"><input type="time" value={item.horario_fim} onChange={(e) => atualizarItem(item.id, 'horario_fim', e.target.value)} className="bg-transparent text-sm font-bold outline-none" /></td>
                <td className="px-4 py-3"><input type="text" placeholder="Ex: Matemática" value={item.disciplina} onChange={(e) => atualizarItem(item.id, 'disciplina', e.target.value)} className="bg-transparent text-sm font-bold outline-none w-full" /></td>
                <td className="px-4 py-3"><input type="text" placeholder="Nome do Prof." value={item.professor_id} onChange={(e) => atualizarItem(item.id, 'professor_id', e.target.value)} className="bg-transparent text-sm font-bold outline-none w-full" /></td>
                <td className="px-4 py-3"><input type="text" placeholder="Sala 01" value={item.sala} onChange={(e) => atualizarItem(item.id, 'sala', e.target.value)} className="bg-transparent text-sm font-bold outline-none w-20" /></td>
                <td className="px-4 py-3 last:rounded-r-2xl text-right">
                  <button onClick={() => removerLinha(item.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {itens.length === 0 && (
              <tr>
                <td colSpan={7} className="py-20 text-center text-slate-400 font-medium italic">Nenhum slot definido para esta grade. Clique em "Adicionar Slot".</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GradeHorarios;