
import React, { useState } from 'react';
import { Sparkles, Play, RotateCcw, CheckCircle2, AlertTriangle, ListChecks } from 'lucide-react';

/**
 * PÁGINA: Gerador Automático de Grade
 * Funcionalidade: Aciona o motor mock de alocação de horários.
 */
const TimetableGeradorAutomatico = () => {
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setDone(false);
    setTimeout(() => {
      setGenerating(false);
      setDone(true);
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm text-center">
        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Sparkles size={40} className={generating ? 'animate-spin' : ''} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Gerador de Grade (Motor)</h2>
        <p className="text-slate-500 mt-2 max-w-md mx-auto">
          Nosso motor heurístico calcula a melhor distribuição de aulas respeitando disponibilidades de professores, carga horária e regras pedagógicas.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <button 
            onClick={handleGenerate}
            disabled={generating}
            className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-3"
          >
            {generating ? 'Processando Heurísticas...' : <><Play size={18} /> Iniciar Geração Global</>}
          </button>
          <button className="bg-slate-50 text-slate-600 px-8 py-4 rounded-2xl font-black text-sm border border-slate-200 flex items-center justify-center gap-3">
            <RotateCcw size={18} /> Resetar Grade Atual
          </button>
        </div>
      </div>

      {done && (
        <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-[2.5rem] animate-in zoom-in duration-500">
          <div className="flex items-center gap-4 mb-6">
            <CheckCircle2 className="text-emerald-500" size={32} />
            <div>
              <h3 className="text-xl font-black text-emerald-900">Geração Concluída!</h3>
              <p className="text-emerald-700 text-sm">A grade foi preenchida com 94% de eficiência pedagógica.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatResult label="Aulas Alocadas" value="340 / 340" />
            <StatResult label="Professores sem Janelas" value="38 / 45" />
            <StatResult label="Conflitos Críticos" value="0" />
            <StatResult label="Tempo de Processamento" value="1.4s" />
          </div>

          <button className="mt-8 w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2">
            <ListChecks size={18} /> Revisar Grade Gerada
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoBox title="Prioridade: Professores" desc="O motor evita horários vagos (janelas) na jornada do docente para garantir bem-estar e produtividade." />
        <InfoBox title="Prioridade: Aulas Duplas" desc="Matemática e Ciências recebem prioridade para blocos de 100min (aulas duplas) conforme diretriz pedagógica." />
      </div>
    </div>
  );
};

const StatResult = ({ label, value }: any) => (
  <div className="bg-white/60 p-4 rounded-2xl border border-emerald-100">
    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{label}</p>
    <p className="text-lg font-black text-emerald-900">{value}</p>
  </div>
);

const InfoBox = ({ title, desc }: any) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-200">
    <h4 className="text-sm font-black text-slate-800 uppercase tracking-tighter mb-2">{title}</h4>
    <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
  </div>
);

export default TimetableGeradorAutomatico;
