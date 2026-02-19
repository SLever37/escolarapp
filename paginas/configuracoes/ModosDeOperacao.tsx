import React, { useState } from 'react';
import { Building2, Building, LayoutGrid, Info, ShieldCheck, Save, Settings2 } from 'lucide-react';

const ModosDeOperacao = () => {
  const [selected, setSelected] = useState('rede_municipal');
  return (
    <div className="p-4 md:p-10 space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Settings2 className="text-blue-600" /> Modos de Operação
          </h2>
          <p className="text-slate-500 text-sm">Configure o perfil institucional e adapte os módulos do sistema.</p>
        </div>
        <button className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black text-xs shadow-lg flex items-center gap-2">
          <Save size={18} /> Aplicar Perfil
        </button>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ModeCard id="pequena" title="Escola Individual" desc="Simplifica a navegação e remove filtros de rede." icon={<Building size={32} />} active={selected === 'pequena'} onClick={() => setSelected('pequena')} />
        <ModeCard id="media" title="Grande Unidade" desc="Foco em logística e portaria para múltiplos prédios." icon={<Building2 size={32} />} active={selected === 'media'} onClick={() => setSelected('media')} />
        <ModeCard id="rede_municipal" title="Rede Municipal / Grupo" desc="Habilita o módulo Multiescola e governança centralizada." icon={<LayoutGrid size={32} />} active={selected === 'rede_municipal'} onClick={() => setSelected('rede_municipal')} />
      </div>
    </div>
  );
};
const ModeCard = ({ title, desc, icon, active, onClick }: any) => (
  <div onClick={onClick} className={`p-8 rounded-[3rem] border transition-all cursor-pointer flex flex-col items-center text-center group ${active ? 'bg-blue-600 border-blue-600 text-white shadow-2xl' : 'bg-white border-slate-200 hover:border-blue-300'}`}>
    <div className={`mb-6 p-4 rounded-3xl transition-all ${active ? 'bg-white/20 text-white' : 'bg-slate-50 text-blue-600 group-hover:scale-110'}`}>{icon}</div>
    <h4 className="text-lg font-black uppercase tracking-tighter leading-none mb-4">{title}</h4>
    <p className={`text-xs font-medium leading-relaxed ${active ? 'text-blue-100' : 'text-slate-400'}`}>{desc}</p>
  </div>
);
export default ModosDeOperacao;