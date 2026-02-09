
import React from 'react';
import { 
  ShieldCheck, Clock, ArrowRight, ArrowLeft, 
  Building2, UserPlus, History, ShieldAlert 
} from 'lucide-react';

const PortariaAcesso = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 leading-none">Portaria & Acesso</h2>
          <p className="text-slate-500 text-sm mt-1">Controle digital de fluxo, registro de visitantes e segurança perimetral.</p>
        </div>
        <div className="flex gap-2">
           <button className="bg-emerald-600 text-white px-5 py-2.5 rounded-2xl text-xs font-bold shadow-lg shadow-emerald-200 flex items-center gap-2">
             <UserPlus size={16} /> Registrar Visitante
           </button>
           <button className="bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-2xl text-xs font-bold">Check-in Manual</button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Monitor em Tempo Real */}
        <div className="lg:col-span-8 bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
           <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 text-white p-2.5 rounded-2xl shadow-lg shadow-blue-200">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter leading-none">Fluxo Ativo</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Conectado: Portaria Principal A</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-right">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Entradas Hoje</p>
                   <p className="text-2xl font-black text-emerald-600 tracking-tighter">842</p>
                </div>
                <div className="text-right border-l border-slate-200 pl-4">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ainda no Recinto</p>
                   <p className="text-2xl font-black text-blue-600 tracking-tighter">790</p>
                </div>
              </div>
           </div>
           
           <div className="flex-1 overflow-y-auto p-8 space-y-4 custom-scrollbar">
              <AccessRow name="Ana Beatriz Silva" role="Aluno" time="07:15" type="in" photo="65" />
              <AccessRow name="Ricardo Santos" role="Professor" time="07:22" type="in" photo="66" />
              <AccessRow name="Bruna Mendes" role="Funcionário" time="07:35" type="out" photo="67" />
              <AccessRow name="Lucas Oliveira" role="Aluno" time="07:42" type="in" photo="68" />
              <AccessRow name="Sra. Maria Helena" role="Visitante" time="07:45" type="in" photo="69" />
              <AccessRow name="Joaquim Silva" role="Aluno" time="08:10" type="out" photo="70" />
              <AccessRow name="Helena Ramos" role="Coordenadora" time="08:12" type="in" photo="71" />
           </div>
        </div>

        {/* Status e Alertas de Portaria */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-[#1e3a8a] text-white p-8 rounded-[3rem] shadow-xl shadow-blue-900/40 relative overflow-hidden group">
              <div className="absolute right-[-20px] bottom-[-20px] opacity-10 group-hover:scale-110 transition-transform"><Building2 size={200} /></div>
              <h4 className="text-lg font-black mb-2 uppercase tracking-tighter relative z-10">Configuração de Acesso</h4>
              <p className="text-blue-200 text-xs font-medium mb-8 relative z-10">Controle por Biometria Facial Ativo</p>
              
              <div className="space-y-3 relative z-10">
                 <ConfigItem label="Pico de Entrada" value="07:00 - 07:45" />
                 <ConfigItem label="Visitantes Hoje" value="05 Registros" />
                 <ConfigItem label="Funcionário de Turno" value="Cláudio Rocha" />
              </div>
           </div>

           <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <ShieldAlert className="text-rose-600" size={24} />
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest leading-none">Atrasos & Ocorrências</h3>
              </div>
              <div className="space-y-4 flex-1">
                 <LateItem name="Ana Julia" time="08:15" delay="15 min" />
                 <LateItem name="Marcos P." time="08:22" delay="22 min" />
                 <LateItem name="Fernanda L." time="08:30" delay="30 min" />
              </div>
              <button className="mt-8 flex items-center justify-between text-[10px] font-black text-blue-600 uppercase tracking-widest group">
                 <span>Relatório Diário de Presença</span>
                 <History size={16} className="group-hover:rotate-180 transition-transform duration-500" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

const AccessRow = ({ name, role, time, type, photo }: any) => (
  <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-[2rem] border border-slate-100 hover:bg-white hover:shadow-lg transition-all group cursor-pointer">
    <div className="flex items-center gap-4">
      <div className={`p-2.5 rounded-2xl ${type === 'in' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'} group-hover:scale-110 transition-transform`}>
        {type === 'in' ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
      </div>
      <img src={`https://picsum.photos/id/${photo}/48/48`} className="w-10 h-10 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all shadow-sm" alt="User" />
      <div>
        <p className="text-sm font-black text-slate-800 leading-none">{name}</p>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{role}</p>
      </div>
    </div>
    <div className="text-right">
      <span className="text-lg font-black text-slate-700 tracking-tighter leading-none">{time}</span>
      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-1">Confirmado</p>
    </div>
  </div>
);

const ConfigItem = ({ label, value }: any) => (
  <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
    <p className="text-[9px] font-bold opacity-60 uppercase tracking-widest">{label}</p>
    <p className="text-sm font-black mt-1">{value}</p>
  </div>
);

const LateItem = ({ name, time, delay }: any) => (
  <div className="flex items-center justify-between p-3 rounded-2xl bg-rose-50 border border-rose-100">
    <div>
      <p className="text-xs font-black text-slate-800 leading-none">{name}</p>
      <p className="text-[9px] font-bold text-rose-500 uppercase tracking-tighter mt-1">Atraso: {delay}</p>
    </div>
    <span className="text-[11px] font-black text-rose-600">{time}</span>
  </div>
);

export default PortariaAcesso;
