
import React from 'react';
import { BookOpen, Users, ClipboardCheck, FilePlus, MessageCircle, AlertTriangle, ChevronRight, Accessibility } from 'lucide-react';

/**
 * PÁGINA: DIÁRIO DE CLASSE (Professor)
 * Finalidade: Registro de frequência, conteúdos e avaliações.
 */
const DiarioProfessor = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">Diário de Classe Digital</h2>
          <p className="text-slate-500 text-sm mt-1">Lançamento de frequência, planos de aula e avaliações do bimestre.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-blue-600 text-white px-5 py-2.5 rounded-2xl text-xs font-bold shadow-lg shadow-blue-200 flex items-center gap-2 hover:bg-blue-700 transition-all">
            <FilePlus size={16} /> Novo Plano de Aula
          </button>
        </div>
      </header>

      {/* Seleção de Turma Ativa */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TurmaCard name="8º Ano B" subject="Matemática" students={32} active />
        <TurmaCard name="9º Ano C" subject="Matemática" students={28} />
        <TurmaCard name="7º Ano A" subject="Geometria" students={30} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controle de Frequência e Notas */}
        <div className="lg:col-span-8 bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
               <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Frequência e Avaliação: 22/04</h3>
               <p className="text-[10px] font-bold text-blue-600 mt-1 uppercase tracking-tighter">Conteúdo: Álgebra Linear e Funções</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
               <Accessibility size={12} className="text-blue-500" />
               <span className="uppercase">AEE Sinalizado na Turma</span>
            </div>
          </div>
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 text-[9px] uppercase font-black tracking-widest border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Estudante</th>
                <th className="px-6 py-4 text-center">Presença</th>
                <th className="px-6 py-4 text-center">Nota Atividade</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <ProfessorStudentRow name="Ana Beatriz Silva" isPCD />
              <ProfessorStudentRow name="Bruno Oliveira" />
              <ProfessorStudentRow name="Carla Souza" />
              <ProfessorStudentRow name="Daniel Mendes" isPCD />
            </tbody>
          </table>
          <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">O salvamento gera registro de auditoria institucional.</p>
            <button className="w-full sm:w-auto bg-emerald-600 text-white px-8 py-3 rounded-xl text-xs font-black shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all">FINALIZAR E SALVAR DIÁRIO</button>
          </div>
        </div>

        {/* Notificações e Suporte Pedagógico */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-amber-50 border border-amber-100 p-8 rounded-[2rem]">
            <h4 className="flex items-center gap-2 text-amber-900 font-black text-xs uppercase tracking-widest mb-4">
              <AlertTriangle size={18} /> Alertas Críticos
            </h4>
            <div className="space-y-4">
              <p className="text-xs text-amber-800 font-medium leading-relaxed">3 estudantes atingiram o limite de 20% de ausências não justificadas. Requer busca ativa.</p>
              <div className="h-px bg-amber-200/50" />
              <p className="text-xs text-amber-800 font-medium leading-relaxed">Prazo para lançamento das notas parciais do 1º Bimestre encerra em 48 horas.</p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-6">Suporte Pedagógico</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white transition-all cursor-pointer">
                <MessageCircle size={18} className="text-blue-600 mt-1" />
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Coordenadora Helena</p>
                  <p className="text-[11px] text-slate-600 font-bold leading-snug">Lembrete: Acompanhamento de adaptação curricular para estudantes do AEE amanhã.</p>
                </div>
              </div>
            </div>
            <button className="mt-8 text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] hover:translate-x-1 transition-transform flex items-center gap-2">
               SOLICITAR APOIO PEDAGÓGICO <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TurmaCard = ({ name, subject, students, active }: any) => (
  <div className={`p-6 rounded-[2rem] border transition-all cursor-pointer group ${active ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-200' : 'bg-white border-slate-200 hover:border-blue-300'}`}>
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2.5 rounded-xl ${active ? 'bg-white/20' : 'bg-blue-50 text-blue-600'}`}>
        <Users size={18} />
      </div>
      <span className={`text-[10px] font-black uppercase tracking-widest ${active ? 'text-blue-100' : 'text-slate-400'}`}>{students} Estudantes</span>
    </div>
    <h4 className="text-lg font-black tracking-tight leading-tight">{name}</h4>
    <p className={`text-[10px] font-bold uppercase tracking-widest mt-1.5 ${active ? 'text-blue-100/70' : 'text-slate-400'}`}>{subject}</p>
  </div>
);

const ProfessorStudentRow = ({ name, isPCD }: any) => (
  <tr className="hover:bg-slate-50/50 transition-colors group">
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        <span className="text-sm font-bold text-slate-700 leading-tight">{name}</span>
        {isPCD && (
          <div className="bg-blue-50 text-blue-600 p-1 rounded-lg border border-blue-100" title="Possui Necessidades Específicas">
             <Accessibility size={12} />
          </div>
        )}
      </div>
    </td>
    <td className="px-6 py-4 text-center">
      <div className="flex justify-center">
        <input type="checkbox" defaultChecked className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
      </div>
    </td>
    <td className="px-6 py-4 text-center">
      <div className="flex justify-center">
        <input type="text" placeholder="--" className="w-14 text-center py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-slate-700 outline-none focus:border-blue-500" />
      </div>
    </td>
    <td className="px-6 py-4 text-right">
      <button className="p-2 text-slate-300 hover:text-blue-600 transition-colors"><ChevronRight size={18} /></button>
    </td>
  </tr>
);

export default DiarioProfessor;
