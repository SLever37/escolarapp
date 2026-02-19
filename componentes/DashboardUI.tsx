import React from 'react';
import { TrendingUp, TrendingDown, ChevronRight } from 'lucide-react';

/**
 * COMPONENTES DE UI - DASHBOARDS
 * Padronização visual para cards de indicadores e seções de alertas.
 * Responsividade aprimorada para Mobile/iPhone.
 */

interface KpiCardProps {
  title: string;
  value: string | number;
  trend?: string;
  icon: React.ReactNode;
  color: 'blue' | 'emerald' | 'rose' | 'violet' | 'amber';
  onClick?: () => void;
}

export const KpiCard: React.FC<KpiCardProps> = ({ title, value, trend, icon, color, onClick }) => {
  const styles = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100 shadow-blue-100/50',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-100/50',
    rose: 'bg-rose-50 text-rose-600 border-rose-100 shadow-rose-100/50',
    violet: 'bg-violet-50 text-violet-600 border-violet-100 shadow-violet-100/50',
    amber: 'bg-amber-50 text-amber-600 border-amber-100 shadow-amber-100/50',
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white p-4 lg:p-6 rounded-lg border border-slate-200 shadow-sm group hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between h-32 lg:h-40"
    >
      <div className="flex items-center justify-between mb-2 lg:mb-4">
        <div className={`p-2 lg:p-3 rounded-lg ${styles[color]} group-hover:scale-110 transition-transform`}>
          {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 18 }) : icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-[9px] lg:text-[10px] font-black ${trend.startsWith('-') ? 'text-rose-500' : 'text-emerald-500'}`}>
            {trend.startsWith('-') ? <TrendingDown size={10} /> : <TrendingUp size={10} />}
            {trend}
          </div>
        )}
      </div>
      <div className="min-w-0">
        <p className="text-[9px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5 truncate">{title}</p>
        <p className="text-xl lg:text-3xl font-black text-slate-900 tracking-tighter truncate">{value}</p>
      </div>
    </div>
  );
};

interface AlertItemProps {
  label: string;
  desc: string;
  time?: string;
  critical?: boolean;
}

export const AlertItem: React.FC<AlertItemProps> = ({ label, desc, time, critical }) => (
  <div className="flex items-center justify-between p-3 lg:p-4 bg-slate-50 border border-slate-100 rounded-lg hover:bg-white hover:shadow-md transition-all cursor-pointer group min-w-0">
    <div className="flex flex-col min-w-0">
       <span className={`text-[8px] lg:text-[10px] font-black uppercase tracking-widest ${critical ? 'text-rose-600' : 'text-slate-400'} truncate`}>
         {label}
       </span>
       <span className="text-xs lg:text-sm font-bold text-slate-800 mt-0.5 truncate">{desc}</span>
    </div>
    <div className="flex items-center gap-2 lg:gap-4 shrink-0 ml-2">
       {time && <span className="text-[8px] lg:text-[10px] font-black text-slate-300 uppercase">{time}</span>}
       <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
    </div>
  </div>
);

export const SectionHeader = ({ title, subtitle, icon }: any) => (
  <div className="flex items-center gap-2 lg:gap-3 mb-4 lg:mb-6 min-w-0">
    <div className="p-2 lg:p-2.5 bg-slate-100 text-slate-500 rounded-lg shrink-0">
      {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 16 }) : icon}
    </div>
    <div className="min-w-0">
      <h3 className="text-xs lg:text-sm font-black text-slate-800 uppercase tracking-widest leading-none truncate">{title}</h3>
      <p className="text-[8px] lg:text-[10px] font-bold text-slate-400 uppercase mt-1 truncate">{subtitle}</p>
    </div>
  </div>
);