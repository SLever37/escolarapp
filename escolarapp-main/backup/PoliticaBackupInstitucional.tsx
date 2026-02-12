
import React from 'react';
// Import History explicitly from lucide-react to prevent collision with browser global History type
import { Database, ShieldCheck, Clock, Download, FileCheck, AlertTriangle, RotateCcw, FileText, History } from 'lucide-react';

/**
 * PÁGINA: Política de Backup Institucional
 * Finalidade: Configurar retenção e recuperação granular (jurídica).
 */
const PoliticaBackupInstitucional = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Database className="text-blue-600" /> Política de Backup
          </h2>
          <p className="text-slate-500 text-sm">Governança de retenção, exportação e recuperação parcial.</p>
        </div>
        <button className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black text-xs shadow-lg flex items-center gap-2">
          <FileCheck size={18} /> Exportar Auditoria MEC
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
           <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Políticas de Retenção Ativas</h3>
              <div className="space-y-4">
                 <RetentionPolicy label="Diários de Classe" duration="10 Anos" status="CRIPTO" />
                 <RetentionPolicy label="Históricos Escolares" duration="PERMANENTE" status="REDE_NACIONAL" />
                 <RetentionPolicy label="Frequência Diária" duration="02 Anos" status="COMPACTADO" />
                 <RetentionPolicy label="Imagens de CFTV/Portaria" duration="60 Dias" status="ROTATIVO" />
              </div>
           </div>

           <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Recuperação Parcial (Granular)</h3>
              <p className="text-sm text-slate-500 mb-6">Em caso de erro em matrícula ou histórico específico, use a recuperação parcial para evitar o rollback total do sistema.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <RecoveryButton label="Restaurar Aluno Específico" icon={<RotateCcw />} />
                 <RecoveryButton label="Recuperar Turma (Período)" icon={<History />} />
                 <RecoveryButton label="Snapshot de Secretaria" icon={<Database />} />
                 <RecoveryButton label="Boletins Consolidados" icon={<FileText />} />
              </div>
           </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="bg-blue-600 text-white p-8 rounded-[3rem] shadow-xl relative overflow-hidden group">
              <div className="absolute right-[-20px] bottom-[-20px] opacity-10 group-hover:scale-110 transition-transform duration-700">
                 <ShieldCheck size={200} />
              </div>
              <h4 className="text-lg font-black leading-tight mb-4 relative z-10">Resiliência Geográfica</h4>
              <p className="text-blue-100 text-xs font-medium leading-relaxed mb-8 relative z-10">
                Seus backups são replicados em 3 regiões diferentes para garantir continuidade em desastres naturais ou falhas críticas de infraestrutura.
              </p>
              <div className="bg-white/10 p-4 rounded-2xl border border-white/10 relative z-10">
                 <p className="text-[9px] font-black uppercase tracking-widest text-blue-200 mb-1">Status de Réplica</p>
                 <p className="text-sm font-bold">100% Sincronizado</p>
              </div>
           </div>

           <div className="bg-amber-50 border border-amber-100 p-8 rounded-[3rem]">
              <div className="flex items-center gap-3 mb-4 text-amber-700">
                 <AlertTriangle size={24} />
                 <h4 className="text-sm font-black uppercase tracking-widest leading-none">Aviso Jurídico</h4>
              </div>
              <p className="text-[11px] text-amber-900 font-medium leading-relaxed">
                A retenção de dados históricos permanentes é obrigatória por lei. O descarte de qualquer snapshot institucional exige aprovação em Ata de Governança.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

const RetentionPolicy = ({ label, duration, status }: any) => (
  <div className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-white hover:shadow-md transition-all cursor-pointer group">
    <div className="flex flex-col">
       <span className="text-sm font-black text-slate-800">{label}</span>
       <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest mt-0.5">{status}</span>
    </div>
    <div className="text-right">
       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Retenção</span>
       <p className="text-sm font-black text-slate-700">{duration}</p>
    </div>
  </div>
);

const RecoveryButton = ({ label, icon }: any) => (
  <button className="flex items-center gap-3 p-5 bg-slate-50 border border-slate-200 rounded-3xl text-left hover:bg-white hover:border-blue-300 hover:shadow-lg transition-all group">
     <div className="p-2.5 bg-white rounded-xl text-slate-400 group-hover:text-blue-600 transition-all shadow-sm border border-slate-100">
        {React.cloneElement(icon, { size: 18 })}
     </div>
     <span className="text-xs font-black text-slate-700 uppercase tracking-tighter leading-none">{label}</span>
  </button>
);

export default PoliticaBackupInstitucional;
