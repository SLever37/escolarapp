
import React, { useState } from 'react';
import { Settings2, ShieldCheck, AlertCircle, Clock, BookOpen, Users, Save } from 'lucide-react';

/**
 * PÁGINA: Regras de Timetable
 * Finalidade: Definir as restrições que o motor deve respeitar.
 */
const TimetableRegras = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Settings2 className="text-blue-600" /> Configuração de Regras
          </h2>
          <p className="text-slate-500 text-sm">Parâmetros pedagógicos para a geração da grade horária.</p>
        </div>
        <button className="bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-black text-xs shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2">
          <Save size={18} /> Salvar Regras Globais
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <RegraSection title="Restrições de Alocação">
            <RegraToggle 
              title="Evitar Janelas de Professores" 
              desc="O motor tentará manter as aulas do professor consecutivas no mesmo turno." 
              enabled 
            />
            <RegraToggle 
              title="Aulas Duplas (Matemática/Ciências)" 
              desc="Prioriza blocos de 100 minutos para disciplinas com alta carga teórica ou prática." 
              enabled 
            />
            <RegraToggle 
              title="Distribuição Semanal Equilibrada" 
              desc="Impede que uma disciplina com 3h ocorra toda no mesmo dia." 
              enabled 
            />
          </RegraSection>

          <RegraSection title="Restrições Físicas e Logísticas">
            <RegraToggle 
              title="Respeitar Capacidade de Sala" 
              desc="Bloqueia alocações se o número de alunos exceder a capacidade física." 
              enabled 
            />
            <RegraToggle 
              title="Tempo de Deslocamento de Professores" 
              desc="Adiciona 10min de intervalo entre prédios diferentes no campus." 
            />
          </RegraSection>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 text-white p-8 rounded-[3rem] shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="text-blue-400" size={24} />
              <h4 className="text-sm font-black uppercase tracking-widest">Compliance Pedagógico</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Nossas regras seguem as diretrizes do MEC para carga horária mínima e descanso interjornada dos docentes.
            </p>
            <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
              <p className="text-[10px] font-black text-blue-300 uppercase mb-2 tracking-tighter">Status de Configuração</p>
              <p className="text-sm font-bold">12 Regras Ativas</p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-100 p-8 rounded-[3rem]">
            <div className="flex items-center gap-3 mb-4 text-amber-700">
              <AlertCircle size={24} />
              <h4 className="text-sm font-black uppercase tracking-widest">Impacto da Rigidez</h4>
            </div>
            <p className="text-xs text-amber-800 font-medium">
              Regras muito restritivas podem diminuir a taxa de preenchimento automático para menos de 90%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const RegraSection = ({ title, children }: any) => (
  <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">{title}</h3>
    <div className="space-y-4">{children}</div>
  </div>
);

const RegraToggle = ({ title, desc, enabled = false }: any) => {
  const [isOn, setIsOn] = useState(enabled);
  return (
    <div className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white hover:border-blue-200 transition-all">
      <div className="flex-1 pr-8">
        <h4 className="text-sm font-black text-slate-800 leading-none">{title}</h4>
        <p className="text-xs text-slate-400 mt-2 font-medium">{desc}</p>
      </div>
      <button 
        onClick={() => setIsOn(!isOn)}
        className={`w-12 h-6 rounded-full transition-colors relative ${isOn ? 'bg-blue-600' : 'bg-slate-300'}`}
      >
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${isOn ? 'left-7' : 'left-1'}`} />
      </button>
    </div>
  );
};

export default TimetableRegras;
