
import React, { useState } from 'react';
import { 
  History, Clock, GraduationCap, AlertCircle, 
  MapPin, Phone, ShieldCheck, Mail, FileCheck,
  BrainCircuit, Accessibility, FileWarning, Eye, Lock
} from 'lucide-react';

const PerfilAlunoHub = () => {
  // Simulação de dados PCD
  const [pcdData] = useState({
    isPCD: true,
    deficiencyTypes: ['TEA', 'Altas Habilidades'],
    hasMedicalReport: true,
    pedagogicalNotes: 'Aluna demonstra facilidade em lógica matemática, mas requer suporte em interações de grupo prolongadas.',
    needsAdaptation: true,
    adaptationTypes: ['Atendimento especializado', 'Material adaptado'],
    consentSigned: true
  });

  return (
    <div className="space-y-8 animate-in slide-in-from-right-8 duration-700">
      {/* Cabeçalho do Aluno */}
      <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full translate-x-32 -translate-y-32 -z-0 opacity-50" />
        <div className="relative z-10 shrink-0">
          <img src="https://picsum.photos/id/65/200/200" className="w-32 h-32 md:w-48 md:h-48 rounded-[3rem] object-cover border-4 border-white shadow-2xl" alt="Aluno" />
          <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2.5 rounded-2xl border-4 border-white shadow-lg">
            <ShieldCheck size={24} />
          </div>
          {pcdData.isPCD && (
             <div className="absolute -top-2 -left-2 bg-blue-600 text-white p-2.5 rounded-2xl border-4 border-white shadow-lg" title="Educação Especial">
               <Accessibility size={20} />
             </div>
          )}
        </div>

        <div className="flex-1 relative z-10 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter leading-none">Ana Beatriz Silva</h2>
            <div className="flex gap-2 justify-center md:justify-start">
              <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-xl text-[10px] font-black border border-emerald-100 uppercase tracking-widest">Situação: Regular</span>
              {pcdData.isPCD && <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-xl text-[10px] font-black border border-blue-100 uppercase tracking-widest">Educação Especial</span>}
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <InfoItem label="Série / Turma" value="8º Ano B" />
            <InfoItem label="Registro Interno" value="2024.0012" />
            <InfoItem label="Turno" value="Matutino" />
            <InfoItem label="Bolsa Família" value="Beneficiário" />
          </div>
          <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-8">
            <ContactIcon icon={<Phone />} label="Responsável" />
            <ContactIcon icon={<Mail />} label="Mensagem" />
            <ContactIcon icon={<MapPin />} label="Endereço" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          
          {/* SEÇÃO: EDUCAÇÃO ESPECIAL / PCD */}
          {/* LGPD: Visibilidade restrita e monitorada. Adicionar log de acesso no backend. */}
          <div className="bg-blue-50/50 border border-blue-100 p-8 rounded-[3rem] relative overflow-hidden group">
             <div className="absolute right-[-20px] top-[-20px] opacity-10 group-hover:scale-110 transition-transform">
                <Accessibility size={120} />
             </div>
             <div className="flex items-center justify-between mb-8 relative z-10">
               <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg">
                    <Accessibility size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none">Educação Especial / PCD</h3>
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">Acesso Restrito: Pedagogia e Gestão</p>
                  </div>
               </div>
               <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-blue-100">
                  <Lock size={12} className="text-blue-400" />
                  <span className="text-[9px] font-black text-blue-400 uppercase">Protegido por LGPD</span>
               </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                <div className="space-y-4">
                   <PcdDetail label="Tipo de Atendimento" value={pcdData.deficiencyTypes.join(', ')} />
                   <PcdDetail label="Laudo Médico" value={pcdData.hasMedicalReport ? 'Validado pela Secretaria' : 'Pendente'} />
                   <PcdDetail label="Consentimento de Dados" value={pcdData.consentSigned ? 'Registrado e Assinado' : 'Não localizado'} />
                </div>
                <div className="space-y-4">
                   <div className="bg-white/60 p-4 rounded-2xl border border-white">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Adaptações Necessárias</p>
                      <div className="flex flex-wrap gap-2">
                         {pcdData.adaptationTypes.map((type, idx) => (
                           <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase">{type}</span>
                         ))}
                      </div>
                   </div>
                   <div className="bg-white/60 p-4 rounded-2xl border border-white">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Observações Pedagógicas</p>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">{pcdData.pedagogicalNotes}</p>
                   </div>
                </div>
             </div>
          </div>

          <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter leading-none">Jornada Escolar Longitudinal</h3>
              <button className="text-[10px] font-black text-blue-600 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 uppercase tracking-widest">Ver Histórico Completo</button>
            </div>
            
            <div className="space-y-8 relative before:absolute before:inset-y-0 before:left-6 before:w-1 before:bg-slate-100">
              <TimelineItem 
                title="Acesso confirmado na Unidade" 
                time="Hoje, 07:45" 
                type="attendance" 
                desc="Entrada realizada via biometria facial na Portaria Principal. Responsável notificado." 
              />
              <TimelineItem 
                title="Lançamento de Avaliação: Matemática" 
                time="Ontem, 14:20" 
                type="grade" 
                desc="Nota: 8.5. Rendimento acima da média institucional para o 8º Ano B." 
              />
              <TimelineItem 
                title="Parecer Pedagógico Semestral" 
                time="15 Abr, 2024" 
                type="pedagogical" 
                desc="Aluna mantém excelente foco e engajamento. Adaptação curricular com progresso positivo." 
              />
              <TimelineItem 
                title="Validação de Matrícula Digital" 
                time="05 Jan, 2024" 
                type="legal" 
                desc="Documentação digital processada e assinada via portal Gov.br." 
              />
            </div>
          </div>
        </div>

        {/* Indicadores do Aluno */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
             <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6">Indicadores de Evolução</h4>
             <div className="space-y-6">
                <MetricBar label="Frequência Escolar" value={98} color="emerald" />
                <MetricBar label="Rendimento Acadêmico" value={85} color="blue" />
                <MetricBar label="Cumprimento de Atividades" value={92} color="violet" />
             </div>
           </div>

           <div className="bg-slate-900 p-8 rounded-[3rem] text-white overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-110 transition-transform"><BrainCircuit size={64} /></div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Análise Preditiva</p>
              <h4 className="text-xl font-black leading-tight">Sugestão de Estímulo Pedagógico</h4>
              <p className="text-slate-400 text-xs mt-4 leading-relaxed">Detectado alto potencial em Raciocínio Lógico. Recomendada inscrição no Itinerário de Programação e Robótica.</p>
              <button className="mt-8 w-full bg-blue-600 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-900/50 hover:bg-blue-500 transition-all">Iniciar Inscrição em Projeto</button>
           </div>
           
           <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl flex items-center gap-4">
             <FileWarning className="text-amber-600 shrink-0" size={24} />
             <p className="text-[10px] font-bold text-amber-800 leading-tight">Documentação Sensível: O acesso a este perfil gera registro de auditoria em tempo real.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ label, value }: any) => (
  <div className="flex flex-col">
    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</span>
    <span className="text-sm font-bold text-slate-800">{value}</span>
  </div>
);

const PcdDetail = ({ label, value }: any) => (
  <div className="flex flex-col border-b border-blue-200/50 pb-2">
    <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-1">{label}</span>
    <span className="text-xs font-bold text-slate-800 leading-tight">{value}</span>
  </div>
);

const ContactIcon = ({ icon, label }: any) => (
  <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 cursor-pointer hover:bg-white transition-all group">
    <span className="text-blue-600 group-hover:scale-110 transition-transform">{React.cloneElement(icon, { size: 14 })}</span>
    <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{label}</span>
  </div>
);

const MetricBar = ({ label, value, color }: any) => {
  const colors: any = {
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-600',
    violet: 'bg-violet-600'
  };
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
        <span className="text-slate-400">{label}</span>
        <span className="text-slate-800">{value}%</span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${colors[color]} rounded-full transition-all duration-1000`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
};

const TimelineItem = ({ title, time, type, desc }: any) => {
  const icons: any = {
    attendance: { bg: 'bg-blue-100', text: 'text-blue-600', icon: Clock },
    grade: { bg: 'bg-emerald-100', text: 'text-emerald-600', icon: GraduationCap },
    pedagogical: { bg: 'bg-violet-100', text: 'text-violet-600', icon: BrainCircuit },
    legal: { bg: 'bg-amber-100', text: 'text-amber-600', icon: FileCheck },
  };
  const Style = icons[type];

  return (
    <div className="relative pl-12 group">
      <div className={`absolute left-0 top-0 p-2.5 rounded-2xl ${Style.bg} ${Style.text} z-10 shadow-lg shadow-${Style.text}/20 group-hover:scale-110 transition-transform border-4 border-white`}>
        {React.cloneElement(Style.icon, { size: 18 })}
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <span className="text-sm font-black text-slate-800 leading-tight">{title}</span>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{time}</span>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed font-medium">{desc}</p>
      </div>
    </div>
  );
};

export default PerfilAlunoHub;
