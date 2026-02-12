
import React from 'react';
import { Clock, UserCheck, ShieldCheck, History, ArrowRight, ArrowLeft, Building2, UserPlus } from 'lucide-react';

const Attendance: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Portaria & Acesso</h2>
          <p className="text-slate-500">Controle Digital de Entrada e Saída em Tempo Real.</p>
        </div>
        <div className="flex gap-3">
           <button className="bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-2xl font-bold shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2">
             <UserPlus size={18} />
             <span>Visitante / QR Code</span>
           </button>
           <button className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all">
             Check-in Manual
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Real-time Monitor */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[500px]">
           <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 text-white p-2.5 rounded-2xl shadow-lg shadow-blue-200">
                  <ShieldCheck size={20} />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Fluxo de Hoje</h3>
              </div>
              <div className="flex gap-4">
                <div className="text-right">
                   <p className="text-[10px] font-bold text-slate-400 uppercase">Entradas</p>
                   <p className="text-lg font-black text-emerald-600">842</p>
                </div>
                <div className="text-right border-l border-slate-200 pl-4">
                   <p className="text-[10px] font-bold text-slate-400 uppercase">Ainda na Escola</p>
                   <p className="text-lg font-black text-blue-600">790</p>
                </div>
              </div>
           </div>
           
           <div className="flex-1 overflow-y-auto p-8 space-y-4 custom-scrollbar">
              {[
                { name: 'Ana Beatriz Silva', type: 'in', time: '07:15', role: 'Aluno' },
                { name: 'Ricardo Santos', type: 'in', time: '07:22', role: 'Professor' },
                { name: 'Bruna Mendes', type: 'out', time: '07:35', role: 'Funcionário' },
                { name: 'Lucas Oliveira', type: 'in', time: '07:42', role: 'Aluno' },
                { name: 'Maria Helena', type: 'in', time: '07:45', role: 'Visitante' },
                { name: 'Joaquim Silva', type: 'out', time: '08:10', role: 'Aluno' },
              ].map((log, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50 hover:bg-white hover:shadow-md transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl ${log.type === 'in' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      {log.type === 'in' ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{log.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">{log.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-slate-700">{log.time}</span>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">CONFIRMADO</p>
                  </div>
                </div>
              ))}
           </div>
        </div>

        {/* Portaria Stats & Alarms */}
        <div className="space-y-6">
           <div className="bg-[#1e3a8a] text-white p-8 rounded-[2.5rem] shadow-xl shadow-blue-900/40 relative overflow-hidden">
              <Building2 className="absolute right-[-20px] bottom-[-20px] w-48 h-48 opacity-10" />
              <h4 className="text-lg font-bold mb-2 relative z-10">Status Portaria A</h4>
              <p className="text-sm opacity-70 mb-8 relative z-10">Unidade Escolar Principal</p>
              
              <div className="grid grid-cols-1 gap-4 relative z-10">
                 <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
                    <p className="text-[10px] font-bold uppercase opacity-60">Pico de Acesso</p>
                    <p className="text-2xl font-black">07:00 - 07:30</p>
                 </div>
                 <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
                    <p className="text-[10px] font-bold uppercase opacity-60">Monitor Ativo</p>
                    <p className="text-lg font-bold">Cláudio Rocha</p>
                 </div>
              </div>
           </div>

           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                <History size={18} className="text-blue-600" />
                Alertas de Atraso
              </h4>
              <div className="space-y-4">
                 {[
                   { name: 'Ana Julia', delay: '15 min', time: '08:15' },
                   { name: 'Marcos P.', delay: '22 min', time: '08:22' },
                 ].map((item, i) => (
                   <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-rose-50 border border-rose-100">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-800">{item.name}</span>
                        <span className="text-[9px] font-bold text-rose-500 uppercase tracking-tighter">Atraso: {item.delay}</span>
                      </div>
                      <span className="text-xs font-black text-rose-600">{item.time}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
