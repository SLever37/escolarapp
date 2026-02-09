
import React, { useState } from 'react';
import { Building2, Building, LayoutGrid, Info, ShieldCheck, Save, Settings2 } from 'lucide-react';

/**
 * PÁGINA: Modos de Operação
 * Finalidade: Ajustar a interface e os fluxos conforme o porte da instituição.
 */
const ModosDeOperacao = () => {
  const [selected, setSelected] = useState('rede_municipal');

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
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
        <ModeCard 
          id="pequena" 
          title="Escola Individual" 
          desc="Ideal para unidades únicas de pequeno porte. Simplifica a navegação e remove filtros de rede." 
          icon={<Building size={32} />} 
          active={selected === 'pequena'} 
          onClick={() => setSelected('pequena')}
        />
        <ModeCard 
          id="media" 
          title="Grande Unidade" 
          desc="Para escolas com múltiplos prédios e grande volume de alunos. Foco em logística e portaria." 
          icon={<Building2 size={32} />} 
          active={selected === 'media'} 
          onClick={() => setSelected('media')}
        />
        <ModeCard 
          id="rede_municipal" 
          title="Rede Municipal / Grupo" 
          desc="Habilita o módulo Multiescola, governança centralizada e consolidação de dados da rede." 
          icon={<LayoutGrid size={32} />} 
          active={selected === 'rede_municipal'} 
          onClick={() => setSelected('rede_municipal')}
        />
      </div>

      <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
         <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
            <Info size={24} className="text-blue-600" /> 
            Impacto no Ecossistema
         </h3>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ImpactInfo 
              title="Visibilidade de Dados" 
              desc={selected === 'rede_municipal' ? 'Gestores da Secretaria visualizam métricas de todas as unidades.' : 'Os dados são isolados para a unidade local, garantindo privacidade.'} 
            />
            <ImpactInfo 
              title="Módulo Multiescola" 
              desc={selected === 'rede_municipal' ? 'Habilitado: Menu de rede municipal visível na sidebar.' : 'Desabilitado: Foco apenas na gestão local.'} 
            />
            <ImpactInfo 
              title="Governança Legal" 
              desc="Adaptação automática para relatórios do Censo Escolar e fluxos do Bolsa Família." 
            />
            <ImpactInfo 
              title="Permissões de Usuário" 
              desc="Perfis de Diretor Municipal e Secretário de Educação disponíveis apenas em modo Rede." 
            />
         </div>

         <div className="mt-12 p-6 bg-emerald-50 border border-emerald-100 rounded-[2.5rem] flex items-center gap-4">
            <ShieldCheck className="text-emerald-600" size={32} />
            <p className="text-sm font-bold text-emerald-800 leading-relaxed">
               As configurações de perfil institucional não apagam dados existentes, apenas otimizam a interface e os filtros para o seu cenário de uso.
            </p>
         </div>
      </div>
    </div>
  );
};

const ModeCard = ({ id, title, desc, icon, active, onClick }: any) => (
  <div 
    onClick={onClick}
    className={`p-8 rounded-[3rem] border transition-all cursor-pointer flex flex-col items-center text-center group ${active ? 'bg-blue-600 border-blue-600 text-white shadow-2xl shadow-blue-200' : 'bg-white border-slate-200 hover:border-blue-300'}`}
  >
    <div className={`mb-6 p-4 rounded-3xl transition-all ${active ? 'bg-white/20 text-white' : 'bg-slate-50 text-blue-600 group-hover:scale-110'}`}>
       {icon}
    </div>
    <h4 className="text-lg font-black uppercase tracking-tighter leading-none mb-4">{title}</h4>
    <p className={`text-xs font-medium leading-relaxed ${active ? 'text-blue-100' : 'text-slate-400'}`}>{desc}</p>
  </div>
);

const ImpactInfo = ({ title, desc }: any) => (
  <div className="flex flex-col gap-1.5 p-6 bg-slate-50 border border-slate-100 rounded-3xl">
     <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</h5>
     <p className="text-sm font-bold text-slate-700 leading-relaxed">{desc}</p>
  </div>
);

export default ModosDeOperacao;
