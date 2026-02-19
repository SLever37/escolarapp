
import React from 'react';
import { Home, User, Bell, Download, FileText, CheckCircle2, ShieldCheck, ChevronRight } from 'lucide-react';

/**
 * PÁGINA: PORTAL DA FAMÍLIA (Módulo 6)
 * Finalidade: Interface simplificada para pais e responsáveis.
 */
const PortalFamilia = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 leading-none">Olá, Sr. José Silva</h2>
          <p className="text-slate-500 text-sm mt-1">Acompanhe o desempenho e comunicados de seus filhos.</p>
        </div>
        <div className="flex -space-x-3">
          <img src="https://picsum.photos/id/65/48/48" className="w-10 h-10 rounded-full border-2 border-white shadow-sm ring-2 ring-blue-100" title="Ana Beatriz" />
          <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-black text-slate-500 ring-2 ring-blue-50 ring-offset-2">+1</div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Resumo do Aluno Principal */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                 <img src="https://picsum.photos/id/65/128/128" className="w-16 h-16 rounded-3xl object-cover border-2 border-blue-100" />
                 <div>
                    <h3 className="text-xl font-black text-slate-800">Ana Beatriz Silva</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">8º Ano B • Matutino</p>
                 </div>
              </div>
              <span className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-xl text-[10px] font-black border border-emerald-100 uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck size={14} /> Regular na Escola
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <MetricItem label="Frequência" value="98%" color="emerald" />
              <MetricItem label="Notas" value="8.5" color="blue" />
              <MetricItem label="Bolsa Família" value="Ativo" color="amber" />
              <MetricItem label="Documentos" value="OK" color="slate" />
            </div>
          </div>

          {/* Últimos Comunicados */}
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Comunicados Escolares</h3>
              <Bell size={18} className="text-blue-500" />
            </div>
            <div className="divide-y divide-slate-50">
               <ComunicadoItem title="Reunião de Pais e Mestres" date="25/04 às 18:30" important />
               <ComunicadoItem title="Campanha de Vacinação" date="30/04 - Auditório" />
               <ComunicadoItem title="Novo Cardápio da Merenda" date="Vigência Maio/2024" />
            </div>
          </div>
        </div>

        {/* Serviços Rápidos para Pais */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-200">
            <h4 className="text-lg font-black leading-tight">Secretaria Online</h4>
            <p className="text-blue-100 text-[11px] font-medium mt-2 leading-relaxed">Emita documentos e autorizações sem sair de casa.</p>
            <div className="space-y-3 mt-8">
               <ServiceAction label="Declaração de Matrícula" icon={<Download size={14} />} />
               <ServiceAction label="Autorizar Passeio Escolar" icon={<CheckCircle2 size={14} />} />
               <ServiceAction label="Histórico Simplificado" icon={<FileText size={14} />} />
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-6 rounded-[2.5rem]">
             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Suporte à Família</h4>
             <button className="w-full bg-white border border-slate-200 py-3 rounded-2xl text-[11px] font-black text-slate-700 uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm">
                Falar com a Coordenação
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricItem = ({ label, value, color }: any) => (
  <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 text-center">
    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className={`text-xl font-black ${color === 'emerald' ? 'text-emerald-600' : color === 'blue' ? 'text-blue-600' : color === 'amber' ? 'text-amber-600' : 'text-slate-800'}`}>{value}</p>
  </div>
);

const ComunicadoItem = ({ title, date, important }: any) => (
  <div className="p-5 hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-between group">
    <div className="flex-1 pr-4">
      <div className="flex items-center gap-2 mb-1">
        {important && <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />}
        <h4 className={`text-sm font-bold ${important ? 'text-slate-900' : 'text-slate-700'}`}>{title}</h4>
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{date}</p>
    </div>
    <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
  </div>
);

const ServiceAction = ({ label, icon }: any) => (
  <button className="w-full bg-white/10 hover:bg-white/20 transition-all border border-white/10 p-3 rounded-2xl flex items-center justify-between group">
    <span className="text-[11px] font-bold">{label}</span>
    <span className="text-white/60 group-hover:text-white transition-colors">{icon}</span>
  </button>
);

export default PortalFamilia;
