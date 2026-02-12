
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, Clock, AlertTriangle, Settings2, 
  Sparkles, Layout, ShieldAlert, History, Microscope,
  RefreshCw, Search
} from 'lucide-react';
import { HealthCard, EntityItem, TimeSlot } from '../../components/TimetableUI';

/**
 * PÁGINA: TimetableDashboard
 * Finalidade: Dashboard Central de Grade Horária.
 * Alinhamento: Gerador movido para "Motor", Navegação operacional implementada.
 */
const TimetableDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeFilter, setActiveFilter] = useState('TURMA');

  // Simulação de carregamento de dados da grade
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center space-y-4 animate-pulse">
        <RefreshCw className="text-blue-600 animate-spin" size={48} />
        <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Carregando Grade Municipal...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 p-10 rounded-[3rem] border border-rose-100 text-center space-y-4">
        <ShieldAlert className="text-rose-500 mx-auto" size={48} />
        <h3 className="text-xl font-black text-rose-900">Erro na Sincronização</h3>
        <p className="text-rose-700 text-sm">Não foi possível carregar os dados do motor de horários.</p>
        <button onClick={() => setError(false)} className="bg-rose-600 text-white px-6 py-2 rounded-xl font-bold">Tentar Novamente</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Header Operacional */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
            <Calendar className="text-blue-600" />
            Timetable Pedagógico 
            <span className="text-[10px] bg-slate-100 text-slate-500 px-3 py-1 rounded-full uppercase tracking-widest font-black border border-slate-200">
              Versão 2024.1
            </span>
          </h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">Controle centralizado de alocação e carga horária municipal.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => navigate('/supervisao/timetable/gerador')}
            aria-label="Ir para o motor de geração de grade"
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2"
          >
            <Sparkles size={16} /> Gerar Grade (Motor)
          </button>
          <button 
            onClick={() => navigate('/supervisao/timetable/regras')}
            className="bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50"
          >
            <Settings2 size={16} /> Regras
          </button>
        </div>
      </header>

      {/* Navegação Rápida entre Módulos */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        <NavButton label="Editor Manual" icon={<Layout />} onClick={() => navigate('/supervisao/timetable/editor')} />
        <NavButton label="Diagnóstico" icon={<ShieldAlert />} onClick={() => navigate('/supervisao/timetable/conflitos')} badge="3" color="rose" />
        <NavButton label="Simulador" icon={<Microscope />} onClick={() => navigate('/supervisao/timetable/simulador')} />
        <NavButton label="Histórico" icon={<History />} onClick={() => navigate('/supervisao/timetable/historico')} />
      </div>

      {/* KPIs de Saúde da Grade */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <HealthCard label="Conformidade MEC" value="94.2%" status="success" />
        <HealthCard label="Conflitos Ativos" value="03" status="error" />
        <HealthCard label="Janelas Docentes" value="12h" status="warning" />
        <HealthCard label="Slots Pendentes" value="08" status="info" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Painel Lateral de Entidades */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <div className="flex gap-1 bg-slate-100 p-1.5 rounded-2xl mb-6">
              <button 
                onClick={() => setActiveFilter('TURMA')}
                className={`flex-1 py-2 text-[10px] font-black rounded-xl transition-all ${activeFilter === 'TURMA' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
              >
                TURMAS
              </button>
              <button 
                onClick={() => setActiveFilter('PROF')}
                className={`flex-1 py-2 text-[10px] font-black rounded-xl transition-all ${activeFilter === 'PROF' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
              >
                DOCENTES
              </button>
            </div>
            
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input type="text" placeholder="Filtrar..." className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none" />
            </div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
              <EntityItem name="8º Ano A" info="30h / 30h" complete />
              <EntityItem name="8º Ano B" info="28h / 30h" alert />
              <EntityItem name="9º Ano A" info="30h / 30h" complete />
              <EntityItem name="9º Ano B" info="15h / 30h" warning />
              <EntityItem name="6º Ano C" info="00h / 30h" warning />
            </div>
          </div>
        </div>

        {/* Grade Visual Interativa */}
        <div className="lg:col-span-9 bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm overflow-x-auto min-h-[500px]">
          <div className="flex items-center justify-between mb-8">
             <h3 className="text-xl font-black text-slate-800 tracking-tighter uppercase">Visualização de Grade: {activeFilter}</h3>
             <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-100 rounded" />
                  <span className="text-[10px] font-black text-slate-400 uppercase">Alocado</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-rose-100 rounded" />
                  <span className="text-[10px] font-black text-slate-400 uppercase">Conflito</span>
                </div>
             </div>
          </div>

          <table className="w-full border-separate border-spacing-2">
            <thead>
              <tr>
                <th className="w-20"></th>
                {['SEG', 'TER', 'QUA', 'QUI', 'SEX'].map(dia => (
                  <th key={dia} className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pb-4">{dia}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map(periodo => (
                <tr key={periodo}>
                  <td className="text-center">
                    <span className="text-[10px] font-black text-slate-400 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl">{periodo}º H</span>
                  </td>
                  {[1, 2, 3, 4, 5].map(col => (
                    <td key={col} className="p-1">
                      <TimeSlot 
                        discipline={col === 1 ? 'MAT' : col === 2 ? 'PORT' : 'CIE'} 
                        teacher={col === 1 ? 'Marcos V.' : col === 2 ? 'Helena S.' : 'Paula R.'}
                        conflict={periodo === 2 && col === 3}
                      />
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

const NavButton = ({ label, icon, onClick, badge, color }: any) => (
  <button 
    onClick={onClick}
    className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all group relative"
  >
    <div className={`p-2 rounded-xl bg-slate-100 text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-all ${color === 'rose' ? 'text-rose-600' : ''}`}>
      {React.cloneElement(icon, { size: 18 })}
    </div>
    <span className="text-[11px] font-black text-slate-700 uppercase tracking-tighter truncate">{label}</span>
    {badge && (
      <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
        {badge}
      </span>
    )}
  </button>
);

export default TimetableDashboard;
