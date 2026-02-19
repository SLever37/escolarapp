
import React from 'react';
import { History, BookOpen, GraduationCap, TrendingUp, Search, Calendar, FileText, ChevronRight } from 'lucide-react';

/**
 * PÁGINA: Histórico Pedagógico Longitudinal
 * Finalidade: Ver a jornada de aprendizagem do aluno ao longo dos anos.
 */
const HistoricoPedagogico = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <History className="text-violet-600" /> Registro Longitudinal
          </h2>
          <p className="text-slate-500 text-sm">Histórico pedagógico completo e evolução multianual.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input type="text" placeholder="Nome ou Matrícula..." className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none w-64" />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
           <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
              <div className="flex items-center gap-4 mb-10">
                 <img src="https://picsum.photos/id/65/128/128" className="w-20 h-20 rounded-[1.5rem] object-cover border-2 border-slate-100 shadow-md" alt="" />
                 <div>
                    <h3 className="text-xl font-black text-slate-900 leading-none">Ana Beatriz Silva</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Jornada Escolar: 2021 - 2024</p>
                 </div>
              </div>

              <div className="space-y-10 relative before:absolute before:inset-y-0 before:left-6 before:w-1 before:bg-slate-50">
                 <TimelineBlock 
                  year="2024" 
                  grade="8º Ano" 
                  result="EM CURSO" 
                  desc="Participação ativa em Robótica. Média parcial 8.5. Sem ocorrências." 
                  color="blue"
                 />
                 <TimelineBlock 
                  year="2023" 
                  grade="7º Ano" 
                  result="APROVADO" 
                  desc="Destaque em Língua Portuguesa. Representante de turma no 2º semestre." 
                  color="emerald"
                 />
                 <TimelineBlock 
                  year="2022" 
                  grade="6º Ano" 
                  result="APROVADO" 
                  desc="Adaptação bem-sucedida ao ensino fundamental II. Foco em Ciências." 
                  color="emerald"
                 />
              </div>
           </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="bg-slate-900 text-white p-8 rounded-[3rem] shadow-xl overflow-hidden relative group">
              <div className="absolute right-[-20px] top-[-20px] opacity-10 group-hover:scale-110 transition-transform duration-700">
                 <TrendingUp size={200} />
              </div>
              <h4 className="text-lg font-black leading-tight mb-4 relative z-10">Evolução Sistêmica</h4>
              <p className="text-slate-400 text-xs leading-relaxed mb-8 relative z-10">
                O histórico longitudinal permite identificar quedas de rendimento sazonais e antecipar padrões de comportamento antes que se tornem evasão.
              </p>
              <button className="w-full bg-blue-600 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-900/50 hover:bg-blue-500 transition-all relative z-10">
                 Emitir Relatório Longitudinal
              </button>
           </div>
           
           <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Arquivos Anexos</h4>
              <div className="space-y-3">
                 <DocAnexo name="Boletim_Consolidado_2023.pdf" date="15/12/23" />
                 <DocAnexo name="Ficha_Psicopedagogica_2022.pdf" date="20/06/22" />
                 <DocAnexo name="Portifolio_Artes_2021.pdf" date="10/11/21" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const TimelineBlock = ({ year, grade, result, desc, color }: any) => {
  const styles: any = {
    blue: 'bg-blue-600 text-white',
    emerald: 'bg-emerald-500 text-white',
    amber: 'bg-amber-500 text-white'
  };
  return (
    <div className="relative pl-14 group">
       <div className={`absolute left-0 top-0 w-12 h-12 rounded-2xl ${styles[color]} z-10 shadow-lg flex flex-col items-center justify-center border-4 border-white`}>
          <span className="text-[8px] font-black uppercase opacity-70">ANO</span>
          <span className="text-sm font-black leading-none">{year}</span>
       </div>
       <div className="p-6 bg-slate-50/50 border border-slate-100 rounded-[2rem] hover:bg-white hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-2">
             <h4 className="text-base font-black text-slate-800">{grade}</h4>
             <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg border uppercase tracking-widest ${result === 'APROVADO' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>{result}</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">{desc}</p>
       </div>
    </div>
  );
};

const DocAnexo = ({ name, date }: any) => (
  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 hover:bg-white transition-all cursor-pointer group">
    <div className="flex items-center gap-2">
      <FileText size={14} className="text-slate-400 group-hover:text-violet-600" />
      <span className="text-[10px] font-bold text-slate-600 truncate max-w-[150px]">{name}</span>
    </div>
    <span className="text-[9px] font-black text-slate-400">{date}</span>
  </div>
);

export default HistoricoPedagogico;
