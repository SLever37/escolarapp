
import React from 'react';
import { TrendingUp, TrendingDown, ChevronRight } from 'lucide-react';

/**
 * COMPONENTES DE UI - DASHBOARDS
 * Padronização visual para cards de indicadores e seções de alertas.
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
      className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm group hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between h-40"
    >
      <div className="flex items-center justify-between mb-4">
        {/* Fix: cast icon to any for cloneElement since we expect a Lucide icon component element */}
        <div className={`p-3 rounded-2xl ${styles[color]} group-hover:scale-110 transition-transform`}>
          {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 20 }) : icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-[10px] font-black ${trend.startsWith('-') ? 'text-rose-500' : 'text-emerald-500'}`}>
            {trend.startsWith('-') ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
            {trend}
          </div>
        )}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
        <p className="text-3xl font-black text-slate-900 tracking-tighter">{value}</p>
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
  <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-white hover:shadow-md transition-all cursor-pointer group">
    <div className="flex flex-col">
       <span className={`text-[10px] font-black uppercase tracking-widest ${critical ? 'text-rose-600' : 'text-slate-400'}`}>
         {label}
       </span>
       <span className="text-sm font-bold text-slate-800 mt-1">{desc}</span>
    </div>
    <div className="flex items-center gap-4">
       {time && <span className="text-[10px] font-black text-slate-300 uppercase">{time}</span>}
       <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
    </div>
  </div>
);

export const SectionHeader = ({ title, subtitle, icon }: any) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="p-2.5 bg-slate-100 text-slate-500 rounded-xl">{icon}</div>
    <div>
      <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest leading-none">{title}</h3>
      <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">{subtitle}</p>
    </div>
  </div>
);
