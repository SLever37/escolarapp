
import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

/**
 * COMPONENTES DE UI - TIMETABLE
 * Componentes atômicos extraídos para manter a legibilidade dos dashboards.
 */

interface HealthCardProps {
  label: string;
  value: string;
  status: 'success' | 'error' | 'warning' | 'info';
}

export const HealthCard: React.FC<HealthCardProps> = ({ label, value, status }) => {
  const colors = {
    success: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    error: 'bg-rose-50 text-rose-600 border-rose-100',
    warning: 'bg-amber-50 text-amber-600 border-amber-100',
    info: 'bg-blue-50 text-blue-600 border-blue-100'
  };
  return (
    <div className={`p-5 rounded-2xl border ${colors[status]} flex flex-col shadow-sm transition-all hover:shadow-md`}>
      <span className="text-[10px] font-black uppercase tracking-widest opacity-70">{label}</span>
      <span className="text-2xl font-black mt-1 tracking-tighter">{value}</span>
    </div>
  );
};

export const EntityItem = ({ name, info, complete, alert, warning }: any) => (
  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 group cursor-pointer hover:bg-white hover:shadow-md transition-all">
    <div>
      <p className="text-xs font-bold text-slate-800">{name}</p>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{info}</p>
    </div>
    {complete ? <CheckCircle2 size={14} className="text-emerald-500" /> : 
     alert ? <AlertTriangle size={14} className="text-rose-500 animate-pulse" /> :
     <div className="w-2 h-2 rounded-full bg-amber-400" />}
  </div>
);

export const TimeSlot = ({ discipline, teacher, conflict }: any) => (
  <div className={`
    p-3 rounded-xl border min-h-[60px] flex flex-col justify-center transition-all cursor-pointer
    ${conflict ? 'bg-rose-50 border-rose-200 shadow-inner' : 'bg-blue-50/50 border-blue-100 hover:bg-white hover:shadow-lg'}
  `}>
    {conflict ? (
      <div className="flex flex-col items-center">
        <AlertTriangle size={14} className="text-rose-500" />
        <span className="text-[8px] font-black text-rose-600 uppercase mt-1">Conflito</span>
      </div>
    ) : (
      <>
        <span className="text-[10px] font-black text-blue-700 leading-none">{discipline}</span>
        <span className="text-[8px] font-bold text-slate-400 mt-1 uppercase truncate">{teacher}</span>
      </>
    )}
  </div>
);
