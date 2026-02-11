import React, { useEffect, useState } from 'react';
import {
  History, Clock, GraduationCap,
  MapPin, Phone, ShieldCheck, Mail, FileCheck,
  BrainCircuit, Accessibility, FileWarning, Lock
} from 'lucide-react';
import { Usuario } from '../tipos';
import { carregarDadosPCD, DadosPCD, podeVisualizarPCD, registrarLogPCD, salvarDadosPCD } from '../src/services/pcdService';

interface PerfilAlunoHubProps {
  usuarioAtual: Usuario;
}

const alunoIdMock = 'aluno-ana-beatriz';

const dadosPadrao: DadosPCD = {
  pcd: true,
  tipos: ['TEA', 'Altas Habilidades'],
  laudo: 'Laudo pedagógico validado e anexado no prontuário escolar.',
  adaptacoes: ['Atendimento especializado', 'Material adaptado'],
};

const PerfilAlunoHub: React.FC<PerfilAlunoHubProps> = ({ usuarioAtual }) => {
  const [podeVerPCD, setPodeVerPCD] = useState(false);
  const [pcdData, setPcdData] = useState<DadosPCD>(dadosPadrao);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    const carregar = async () => {
      const autorizado = await podeVisualizarPCD(usuarioAtual);
      setPodeVerPCD(autorizado);

      if (autorizado) {
        await registrarLogPCD('VER_PCD', { aluno_id: alunoIdMock, papel: usuarioAtual.papel });
        const dadosBanco = await carregarDadosPCD(alunoIdMock);
        if (dadosBanco) setPcdData(dadosBanco);
      }
    };

    carregar();
  }, [usuarioAtual]);

  const aoSalvarPCD = async () => {
    setSalvando(true);
    const ok = await salvarDadosPCD(alunoIdMock, pcdData);
    if (ok) {
      await registrarLogPCD('EDITAR_PCD', { aluno_id: alunoIdMock, papel: usuarioAtual.papel, dados: pcdData });
    }
    setSalvando(false);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-8 duration-700">
      <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full translate-x-32 -translate-y-32 -z-0 opacity-50" />
        <div className="relative z-10 shrink-0">
          <img src="https://picsum.photos/id/65/200/200" className="w-32 h-32 md:w-48 md:h-48 rounded-[3rem] object-cover border-4 border-white shadow-2xl" alt="Aluno" />
          <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2.5 rounded-2xl border-4 border-white shadow-lg">
            <ShieldCheck size={24} />
          </div>
          <div className="absolute -top-2 -left-2 bg-blue-600 text-white p-2.5 rounded-2xl border-4 border-white shadow-lg" title="Educação Especial">
            <Accessibility size={20} />
          </div>
        </div>

        <div className="flex-1 relative z-10 text-center md:text-left">
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter leading-none">Ana Beatriz Silva</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-4">
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
          {podeVerPCD ? (
            <div className="bg-blue-50/50 border border-blue-100 p-8 rounded-[3rem] relative overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg"><Accessibility size={20} /></div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none">Educação Especial / PCD</h3>
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">Acesso autorizado para {usuarioAtual.papel.replace('_', ' ')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-blue-100">
                  <Lock size={12} className="text-blue-400" />
                  <span className="text-[9px] font-black text-blue-400 uppercase">Protegido por LGPD</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <PcdDetail label="PCD" value={pcdData.pcd ? 'Sim' : 'Não'} />
                  <PcdDetail label="Tipo(s)" value={pcdData.tipos.join(', ')} />
                  <PcdDetail label="Laudo" value={pcdData.laudo} />
                </div>
                <div className="space-y-4">
                  <div className="bg-white/60 p-4 rounded-2xl border border-white">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Adaptações Pedagógicas</p>
                    <div className="flex flex-wrap gap-2">
                      {pcdData.adaptacoes.map((type, idx) => (
                        <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase">{type}</span>
                      ))}
                    </div>
                  </div>
                  <button onClick={aoSalvarPCD} disabled={salvando} className="w-full bg-blue-600 text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest">
                    {salvando ? 'Salvando...' : 'Salvar dados PCD'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-rose-50 border border-rose-200 p-8 rounded-[3rem]">
              <h3 className="text-lg font-black text-rose-700">Acesso restrito</h3>
              <p className="text-sm text-rose-600 mt-2 font-medium">
                Os dados de Educação Especial / PCD são sensíveis. Para seu perfil, o acesso só é permitido quando houver autorização específica.
              </p>
            </div>
          )}

          <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 mb-6">Linha do Tempo Escolar</h3>
            <div className="space-y-5">
              <TimelineItem title="Acesso confirmado na Unidade" time="Hoje, 07:45" desc="Entrada registrada na portaria." />
              <TimelineItem title="Lançamento de Avaliação: Matemática" time="Ontem, 14:20" desc="Nota 8,5 registrada no diário." />
              <TimelineItem title="Parecer Pedagógico Semestral" time="15 Abr, 2024" desc="Progresso pedagógico positivo." />
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6">Indicadores de Evolução</h4>
            <MetricBar label="Frequência Escolar" value={98} color="emerald" />
            <MetricBar label="Rendimento Acadêmico" value={85} color="blue" />
            <MetricBar label="Cumprimento de Atividades" value={92} color="violet" />
          </div>

          <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl flex items-center gap-4">
            <FileWarning className="text-amber-600 shrink-0" size={24} />
            <p className="text-[10px] font-bold text-amber-800 leading-tight">Dados sensíveis: visualização e edição geram logs de auditoria.</p>
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
  const colors: any = { emerald: 'bg-emerald-500', blue: 'bg-blue-600', violet: 'bg-violet-600' };
  return (
    <div className="space-y-2 mb-4">
      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
        <span className="text-slate-400">{label}</span>
        <span className="text-slate-800">{value}%</span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${colors[color]} rounded-full`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
};

const TimelineItem = ({ title, time, desc }: any) => (
  <div>
    <div className="flex justify-between items-center">
      <span className="text-sm font-black text-slate-800">{title}</span>
      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{time}</span>
    </div>
    <p className="text-xs text-slate-500 mt-1">{desc}</p>
  </div>
);

export default PerfilAlunoHub;
