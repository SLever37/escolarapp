
import React, { useState } from 'react';
import { Calendar, Save, Trash2, Edit3, AlertCircle, Layout, User, Book } from 'lucide-react';

/**
 * PÁGINA: Editor de Timetable
 * Layout: Grid Turma x Horário com funcionalidade de edição.
 */
const TimetableEditor = () => {
  const [activeClass, setActiveClass] = useState('8º Ano B');
  
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Layout className="text-blue-600" /> Editor de Grade
          </h2>
          <p className="text-slate-500 text-sm">Edição manual e ajuste fino do horário escolar.</p>
        </div>
        <div className="flex gap-2">
          <select 
            value={activeClass}
            onChange={(e) => setActiveClass(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold outline-none"
          >
            <option>8º Ano A</option>
            <option>8º Ano B</option>
            <option>9º Ano C</option>
          </select>
          <button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-blue-200 flex items-center gap-2">
            <Save size={16} /> Salvar Alterações
          </button>
        </div>
      </header>

      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full border-separate border-spacing-2">
          <thead>
            <tr>
              <th className="w-20"></th>
              {['SEG', 'TER', 'QUA', 'QUI', 'SEX'].map(dia => (
                <th key={dia} className="text-[10px] font-black text-slate-400 uppercase tracking-widest pb-4">{dia}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map(periodo => (
              <tr key={periodo}>
                <td className="text-center">
                  <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">{periodo}º H</span>
                </td>
                {[1, 2, 3, 4, 5].map(col => (
                  <td key={col}>
                    <EditableSlot subject="MAT" teacher="Marcos V." />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-amber-50 border border-amber-100 p-6 rounded-[2rem] flex items-start gap-4">
        <AlertCircle className="text-amber-600 shrink-0" />
        <div>
          <h4 className="text-sm font-bold text-amber-900">Dica de Gestão</h4>
          <p className="text-xs text-amber-800 mt-1">
            Ao mover aulas de Português, certifique-se de manter a distribuição equilibrada ao longo da semana para evitar sobrecarga pedagógica da turma.
          </p>
        </div>
      </div>
    </div>
  );
};

const EditableSlot = ({ subject, teacher }: any) => (
  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl hover:bg-white hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group relative min-h-[70px] flex flex-col justify-center">
    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 flex gap-1">
      <button className="p-1 hover:bg-blue-50 text-blue-600 rounded"><Edit3 size={12} /></button>
    </div>
    <span className="text-[10px] font-black text-blue-700 block mb-1">{subject}</span>
    <span className="text-[8px] font-bold text-slate-400 uppercase truncate">{teacher}</span>
  </div>
);

export default TimetableEditor;
