
import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import { 
  Users, UserCheck, AlertCircle, ChevronRight, TrendingUp, 
  FileWarning, Brain, Activity, Filter, Download
} from 'lucide-react';

const frequencyData = [
  { name: 'Seg', presenca: 94, meta: 95 },
  { name: 'Ter', presenca: 96, meta: 95 },
  { name: 'Qua', presenca: 92, meta: 95 },
  { name: 'Qui', presenca: 89, meta: 95 },
  { name: 'Sex', presenca: 91, meta: 95 },
];

const riskData = [
  { name: 'Regular', value: 720, color: '#3b82f6' },
  { name: 'Risco', value: 85, color: '#f59e0b' },
  { name: 'Crítico', value: 45, color: '#ef4444' },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Strategic Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-2xl md:text-4xl font-black text-slate-900 leading-none">Operação Estratégica</h2>
          <p className="text-slate-500 text-sm md:text-base flex items-center gap-2">
            <Activity size={16} className="text-blue-500" />
            Visão centralizada da rede municipal.
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
            <Filter size={16} />
            <span>Filtros</span>
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-2xl text-xs font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
            <Download size={16} />
            <span className="hidden xs:inline">Relatório</span>
            <span className="xs:hidden">Relatório</span>
          </button>
        </div>
      </div>

      {/* Real-time KPIs */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <KpiCard title="Total Alunos" value="1.240" trend="+12%" icon={<Users />} color="blue" />
        <KpiCard title="Presença" value="92.4%" trend="-1.2%" icon={<UserCheck />} color="emerald" />
        <KpiCard title="Em Risco" value="130" trend="+5" icon={<AlertCircle />} color="rose" />
        <KpiCard title="IA Insight" value="8º Ano B" trend="Alerta" icon={<Brain />} color="violet" />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Frequency & Performance */}
        <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="text-lg md:text-xl font-black text-slate-800">Frequência Semanal</h3>
              <p className="text-xs md:text-sm text-slate-400 font-medium">Comparativo diário vs meta escolar</p>
            </div>
            <div className="flex gap-4">
               <div className="flex items-center gap-2">
                 <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                 <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Real</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                 <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Meta</span>
               </div>
            </div>
          </div>
          <div className="h-60 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={frequencyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} unit="%" />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -3px rgba(0,0,0,0.1)', padding: '12px'}}
                />
                <Bar dataKey="presenca" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="meta" fill="#f1f5f9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Classification */}
        <div className="lg:col-span-4 bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col items-center">
          <div className="w-full mb-6">
            <h3 className="text-lg font-black text-slate-800">Classificação IA</h3>
            <p className="text-xs text-slate-400 font-medium">Análise preditiva de risco</p>
          </div>
          <div className="h-48 sm:h-56 w-full relative mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pt-2">
              <span className="text-3xl font-black text-slate-800 leading-none">1.2k</span>
              <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest mt-1">Alunos</span>
            </div>
          </div>
          <div className="w-full grid grid-cols-1 gap-2">
             {riskData.map((d, i) => (
               <div key={i} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                 <div className="flex items-center gap-3">
                   <div className="w-3 h-3 rounded-full" style={{backgroundColor: d.color}} />
                   <span className="text-xs font-bold text-slate-600 uppercase tracking-tighter">{d.name}</span>
                 </div>
                 <span className="text-xs font-black text-slate-800">{d.value}</span>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* Critical Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AlertSection 
          title="Prazos Legais" 
          subtitle="Ações Críticas" 
          icon={<FileWarning size={20} />} 
          color="rose"
          alerts={[
            { label: "Censo Escolar 2024", time: "Expira em 3 dias" },
            { label: "Relatório Bolsa Família", time: "Pendência Unidade 2" },
            { label: "Documentos Alunos Novos", time: "15 pendentes" }
          ]}
        />

        <AlertSection 
          title="Pedagogia & IA" 
          subtitle="Inteligência" 
          icon={<Brain size={20} />} 
          color="violet"
          alerts={[
            { label: "Rendimento 9º Ano", time: "Sugestão de Reforço" },
            { label: "Evasão Turno Noite", time: "Alerta estratégico" },
            { label: "Planejamentos Atrasados", time: "4 Professores" }
          ]}
        />
      </div>
    </div>
  );
};

const KpiCard = ({ title, value, trend, icon, color }: any) => {
  const colors: any = {
    blue: 'text-blue-600 bg-blue-50 border-blue-100',
    emerald: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    rose: 'text-rose-600 bg-rose-50 border-rose-100',
    violet: 'text-violet-600 bg-violet-50 border-violet-100',
  };
  return (
    <div className="bg-white p-5 md:p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-lg hover:shadow-slate-200/50 transition-all cursor-pointer group h-36">
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2.5 rounded-2xl ${colors[color]} group-hover:scale-110 transition-transform`}>
          {React.cloneElement(icon, { size: 18 })}
        </div>
        <div className={`flex items-center gap-1 text-[10px] font-black tracking-tighter ${trend.includes('-') ? 'text-rose-500' : 'text-emerald-500'}`}>
          <TrendingUp size={12} className={trend.includes('-') ? 'rotate-180' : ''} />
          {trend}
        </div>
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{title}</p>
        <p className="text-2xl md:text-3xl font-black text-slate-800 mt-1">{value}</p>
      </div>
    </div>
  );
};

const AlertSection = ({ title, subtitle, icon, color, alerts }: any) => {
  const styles: any = {
    rose: { bg: 'bg-rose-50', border: 'border-rose-100', badge: 'bg-rose-500', text: 'text-rose-900', label: 'text-rose-600' },
    violet: { bg: 'bg-violet-50', border: 'border-violet-100', badge: 'bg-violet-600', text: 'text-violet-900', label: 'text-violet-600' }
  };
  const s = styles[color];
  return (
    <div className={`${s.bg} border ${s.border} p-6 md:p-8 rounded-[2.5rem] shadow-sm`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={`${s.badge} text-white p-2.5 rounded-2xl shadow-lg shadow-${color}-200`}>
            {icon}
          </div>
          <h4 className={`text-lg font-black ${s.text}`}>{title}</h4>
        </div>
        <span className={`text-[9px] font-black ${s.label} bg-white px-2.5 py-1.5 rounded-xl border border-white shadow-sm uppercase tracking-wider`}>{subtitle}</span>
      </div>
      <div className="space-y-3">
        {alerts.map((a: any, i: number) => (
          <div key={i} className="flex items-center justify-between group cursor-pointer bg-white/60 hover:bg-white p-4 rounded-[1.5rem] transition-all border border-transparent hover:border-slate-100 shadow-sm">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-800">{a.label}</span>
              <span className={`text-[10px] font-black ${s.label} uppercase tracking-tighter mt-0.5`}>{a.time}</span>
            </div>
            <ChevronRight size={18} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
