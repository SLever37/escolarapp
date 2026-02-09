
import React, { useState } from 'react';
import { Microscope, Play, Save, History, AlertCircle, Info, ArrowRight } from 'lucide-react';

/**
 * PÁGINA: Simulador de Grade (Sandbox)
 * Finalidade: Permitir testes de cenários antes da aplicação real.
 */
const TimetableSimulador = () => {
  const [activeScenario, setActiveScenario] = useState('Reforma Laboratório');

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Microscope className="text-blue-600" /> Simulador de Cenários
          </h2>
          <p className="text-slate-500 text-sm">Ambiente de testes para ajustes e contingências no horário.</p>
        </div>
        <div className="flex gap-2">
           <button className="bg-slate-50 border border-slate-200 text-slate-600 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-100">Clonar Produção</button>
           <button className="bg-blue-600 text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-200 hover:bg-blue-700">Aplicar na Produção</button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Lista de Cenários */}
        <div className="lg:col-span-4 space-y-4">
           <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Cenários em Teste</h3>
           <ScenarioCard 
            title="Reforma Laboratório" 
            desc="Simular bloqueio da Sala 05 por 15 dias." 
            active={activeScenario === 'Reforma Laboratório'} 
            onClick={() => setActiveScenario('Reforma Laboratório')}
           />
           <ScenarioCard 
            title="Saída Prof. Ricardo" 
            desc="Impacto da redistribuição de 12h de Matemática." 
            active={activeScenario === 'Saída Prof. Ricardo'} 
            onClick={() => setActiveScenario('Saída Prof. Ricardo')}
           />
           <ScenarioCard 
            title="Inclusão Itinerário Informativo" 
            desc="Adição de 2h semanais de Tecnologia." 
            active={activeScenario === 'Inclusão Itinerário Informativo'} 
            onClick={() => setActiveScenario('Inclusão Itinerário Informativo')}
           />
           
           <button className="w-full border-2 border-dashed border-slate-200 p-6 rounded-[2rem] text-slate-400 font-black text-xs uppercase flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
             Novo Cenário de Teste
           </button>
        </div>

        {/* Dashboard de Impacto */}
        <div className="lg:col-span-8 space-y-6">
           <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-xl font-black text-slate-800">Análise de Impacto: {activeScenario}</h3>
                 <div className="flex gap-4">
                    <div className="text-right">
                       <p className="text-[10px] font-black text-slate-400 uppercase">Eficiência</p>
                       <p className="text-lg font-black text-emerald-600">92.4%</p>
                    </div>
                    <div className="text-right border-l border-slate-100 pl-4">
                       <p className="text-[10px] font-black text-slate-400 uppercase">Novos Conflitos</p>
                       <p className="text-lg font-black text-rose-600">02</p>
                    </div>
                 </div>
              </div>

              <div className="space-y-6">
                 <ImpactItem 
                  label="Carga Horária Professores" 
                  status="ALTERADO" 
                  desc="Redistribuição de 15 slots para outros 3 professores da área." 
                  color="amber"
                 />
                 <ImpactItem 
                  label="Logística de Salas" 
                  status="CRÍTICO" 
                  desc="Sala 02 atinge 100% de ocupação. Sem folga para manutenção." 
                  color="rose"
                 />
                 <ImpactItem 
                  label="Conformidade Pedagógica" 
                  status="MANTIDO" 
                  desc="Todas as turmas mantêm as 30h semanais obrigatórias." 
                  color="emerald"
                 />
              </div>

              <div className="mt-10 p-6 bg-blue-50 border border-blue-100 rounded-[2rem] flex items-start gap-4">
                 <Info className="text-blue-600 shrink-0" />
                 <div>
                    <h4 className="text-sm font-black text-blue-900">Nota do Simulador</h4>
                    <p className="text-xs text-blue-800 leading-relaxed font-medium">Este cenário exige a criação de 2 novos horários de substituição externa. Recomendamos validar a disponibilidade financeira para horas extras antes de aplicar.</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const ScenarioCard = ({ title, desc, active, onClick }: any) => (
  <div 
    onClick={onClick}
    className={`p-6 rounded-[2rem] border transition-all cursor-pointer group ${active ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-200' : 'bg-white border-slate-200 hover:border-blue-300'}`}
  >
    <h4 className="font-black text-sm uppercase tracking-widest leading-none mb-3">{title}</h4>
    <p className={`text-xs leading-relaxed font-medium ${active ? 'text-blue-100/70' : 'text-slate-400'}`}>{desc}</p>
  </div>
);

const ImpactItem = ({ label, status, desc, color }: any) => {
  const styles: any = {
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100'
  };
  return (
    <div className="flex items-start gap-4 group">
      <div className={`shrink-0 w-2.5 h-2.5 rounded-full mt-1.5 ${color === 'rose' ? 'bg-rose-500' : color === 'amber' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-1">
           <h5 className="text-sm font-black text-slate-800">{label}</h5>
           <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg border uppercase tracking-widest ${styles[color]}`}>{status}</span>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed font-medium">{desc}</p>
      </div>
    </div>
  );
};

export default TimetableSimulador;
