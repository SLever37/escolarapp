import React, { useState } from 'react';
import { 
  Calendar, Clock, AlertTriangle, Settings2, 
  Sparkles, Layout, ShieldAlert, History, Microscope,
  RefreshCw, Save, CheckCircle2, ChevronRight
} from 'lucide-react';

const GradeDeHorarios = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-violet-700 mb-2">
            <Calendar size={24} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Módulo de Carga Horária Superior</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Grade de Horários</h2>
          <p className="text-slate-600 text-sm mt-1 font-medium">Motor heurístico de alocação de disciplinas e otimização de janelas docentes.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleGenerate}
            className="bg-violet-600 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-violet-200 hover:bg-violet-700 transition-all flex items-center gap-2"
          >
            {isGenerating ? <RefreshCw className="animate-spin" size={16} /> : <Sparkles size={16} />}
            {isGenerating ? 'Calculando Malha...' : 'Gerar Grade Global'}
          </button>
        </div>
      </header>

      {/* Navegação de Submódulos */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <GradeNavButton label="Editor Manual" icon={<Layout />} />
        <GradeNavButton label="Diagnóstico" icon={<ShieldAlert />} badge="3" />
        <GradeNavButton label="Regras MEC" icon={<Settings2 />} />
        <GradeNavButton label="Simulador" icon={<Microscope />} />
        <GradeNavButton label="Histórico" icon={<History />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Painel de Saúde da Grade */}
        <div className="lg:col-span-3 space-y-4">
           <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Saúde da Grade 2024.1</h3>
           <HealthCard label="Conformidade MEC" value="94.2%" color="emerald" />
           <HealthCard label="Conflitos Ativos" value="03" color="rose" />
           <HealthCard label="Aulas Alocadas" value="340 / 340" color="blue" />
        </div>

        {/* Grade Visual (Mock) */}
        <div className="lg:col-span-9 bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm overflow-x-auto min-h-[500px]">
           <div className="flex items-center justify-between mb-10">
              <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-none">Visão por Turma: 8º Ano B</h4>
              <div className="flex gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
                 <button className="px-4 py-2 text-[10px] font-black uppercase text-blue-700 bg-white shadow-sm rounded-lg">SEG-SEX</button>
                 <button className="px-4 py-2 text-[10px] font-black uppercase text-slate-500">SÁBADO</button>
              </div>
           </div>

           <table className="w-full border-separate border-spacing-2">
              <thead>
                <tr>
                   <th className="w-20"></th>
                   {['SEG', 'TER', 'QUA', 'QUI', 'SEX'].map(dia => (
                     <th key={dia} className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] pb-4">{dia}</th>
                   ))}
                </tr>
              </thead>
              <tbody>
                 {[1, 2, 3, 4, 5].map(h => (
                   <tr key={h}>
                      <td className="text-center">
                         <span className="text-[10px] font-black text-slate-500 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl">{h}º Hor.</span>
                      </td>
                      {[1, 2, 3, 4, 5].map(d => (
                        <td key={d}>
                           <div className={`p-4 rounded-2xl border min-h-[70px] flex flex-col justify-center transition-all cursor-pointer hover:shadow-lg ${h === 2 && d === 3 ? 'bg-rose-50 border-rose-200 shadow-inner' : 'bg-slate-50/50 border-slate-100 hover:bg-white hover:border-blue-200'}`}>
                              {h === 2 && d === 3 ? (
                                <div className="flex flex-col items-center gap-1">
                                   <AlertTriangle size={14} className="text-rose-600" />
                                   <span className="text-[8px] font-black text-rose-700 uppercase">Conflito</span>
                                </div>
                              ) : (
                                <>
                                  <span className="text-[11px] font-black text-slate-900 leading-none mb-1">MATEMÁTICA</span>
                                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter truncate">Prof. Marcos V.</span>
                                </>
                              )}
                           </div>
                        </td>
                      ))}
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </div>
    </div>
  );
};

const GradeNavButton = ({ label, icon, badge }: any) => (
  <button className="flex flex-col items-center justify-center p-6 bg-white border border-slate-200 rounded-[2rem] hover:shadow-xl hover:border-violet-400 transition-all group relative">
    <div className="text-slate-500 group-hover:text-violet-700 transition-colors mb-2">
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest text-center leading-tight group-hover:text-slate-900">{label}</span>
    {badge && <span className="absolute top-4 right-4 bg-rose-600 text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-lg">{badge}</span>}
  </button>
);

const HealthCard = ({ label, value, color }: any) => {
  const styles: any = {
    emerald: 'border-emerald-600 text-emerald-700 bg-emerald-50/50',
    rose: 'border-rose-600 text-rose-700 bg-rose-50/50',
    blue: 'border-blue-600 text-blue-700 bg-blue-50/50'
  };
  return (
    <div className={`p-6 rounded-3xl border-l-4 ${styles[color]} bg-white shadow-sm border border-slate-100`}>
       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-2">{label}</p>
       <p className="text-2xl font-black text-slate-900 tracking-tighter">{value}</p>
    </div>
  );
};

export default GradeDeHorarios;