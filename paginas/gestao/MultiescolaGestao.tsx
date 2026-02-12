
import React from 'react';
import { Building2, Users, MapPin, TrendingUp, BarChart3, ShieldCheck, Search, Filter, ChevronRight } from 'lucide-react';

const MultiescolaGestao = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <Building2 size={24} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Gestão de Rede Municipal</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Consolidado de Unidades</h2>
          <p className="text-slate-500 text-sm mt-2 max-w-xl">Supervisão técnica de todas as escolas da rede. Auditoria de frequência e conformidade legal em tempo real.</p>
        </div>
        <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex gap-2">
          <button className="bg-slate-900 text-white px-6 py-3 rounded-xl text-xs font-bold hover:bg-slate-800 transition-all">Relatório Municipal</button>
          <button className="bg-slate-100 text-slate-600 px-6 py-3 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all">Auditoria Global</button>
        </div>
      </header>

      {/* Métricas Agregadas da Rede */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricBox label="Alunos na Rede" value="4.250" trend="+2.4%" icon={<Users />} />
        <MetricBox label="Escolas Ativas" value="12" trend="0" icon={<Building2 />} />
        <MetricBox label="Frequência Média" value="91.2%" trend="-0.5%" icon={<TrendingUp />} />
        <MetricBox label="Conformidade MEC" value="98%" trend="OK" icon={<ShieldCheck />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Status por Unidade</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input type="text" placeholder="Filtrar unidade..." className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none w-64" />
              </div>
           </div>
           
           <div className="space-y-4">
              <UnitCard name="E.M. Presidente Vargas" students={850} performance={92} status="REGULAR" />
              <UnitCard name="E.M. Dom Pedro II" students={420} performance={78} status="ALERTA" critical />
              <UnitCard name="Centro Educ. Infantil Arco-Íris" students={210} performance={96} status="EXCELENTE" />
              <UnitCard name="E.M. Rural Santa Maria" students={120} performance={84} status="REGULAR" />
           </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="bg-slate-900 text-white p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute right-[-10%] top-[-10%] opacity-10 group-hover:scale-110 transition-transform duration-700">
                <BarChart3 size={200} />
              </div>
              <h4 className="text-xl font-black mb-4 relative z-10">Inteligência de Rede</h4>
              <p className="text-slate-400 text-xs leading-relaxed mb-8 relative z-10">Detectamos uma queda de 15% na frequência na Unidade Rural devido às chuvas. Protocolo de contingência sugerido.</p>
              <button className="w-full bg-blue-600 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-900/50 hover:bg-blue-500 transition-all relative z-10">Acionar Transportes</button>
           </div>
           
           <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Próximas Auditorias</h4>
              <div className="space-y-4">
                 <AuditItem school="Vargas" date="24 Abr" label="Censo" />
                 <AuditItem school="Rural SM" date="26 Abr" label="Merenda" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const MetricBox = ({ label, value, trend, icon }: any) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all cursor-pointer group">
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform">{icon}</div>
      <span className={`text-[10px] font-black ${trend.startsWith('-') ? 'text-rose-500' : 'text-emerald-500'}`}>{trend}</span>
    </div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
    <p className="text-3xl font-black text-slate-900 tracking-tighter mt-1">{value}</p>
  </div>
);

const UnitCard = ({ name, students, performance, status, critical }: any) => (
  <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between hover:bg-white hover:shadow-lg transition-all cursor-pointer group">
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${critical ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'}`}>
        {name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
      </div>
      <div>
        <p className="text-sm font-black text-slate-800">{name}</p>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{students} Alunos • {performance}% Rendimento</p>
      </div>
    </div>
    <div className="flex items-center gap-6">
      <span className={`text-[9px] font-black px-3 py-1.5 rounded-lg border uppercase tracking-widest ${critical ? 'bg-rose-50 border-rose-100 text-rose-600' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}`}>
        {status}
      </span>
      <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
    </div>
  </div>
);

const AuditItem = ({ school, date, label }: any) => (
  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
    <div className="flex items-center gap-3">
       <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">{date}</span>
       <span className="text-xs font-bold text-slate-700">{school}</span>
    </div>
    <span className="text-[9px] font-black text-slate-400 uppercase">{label}</span>
  </div>
);

export default MultiescolaGestao;
