
import React, { useState } from 'react';
import { 
  Search, Filter, MoreHorizontal, GraduationCap, MapPin, 
  AlertCircle, ChevronRight, Mail, Phone, Calendar, 
  History, Bookmark, ShieldAlert, FileCheck, Clock, UserPlus
} from 'lucide-react';
import { Student } from '../types';

// Fix: Add missing isPCD and sensitiveData properties to mockStudents
const mockStudents: Student[] = [
  { 
    id: '1', name: 'Ana Beatriz Silva', grade: '8º Ano B', shift: 'Matutino', status: 'regular', 
    attendance: 98, averageGrade: 8.5, photo: 'https://picsum.photos/id/65/128/128',
    bolsaFamilia: true, docsPending: [], legalStatus: 'validado',
    isPCD: false, sensitiveData: { bolsaFamilia: true }
  },
  { 
    id: '2', name: 'Bruno Oliveira', grade: '7º Ano A', shift: 'Vespertino', status: 'risco', 
    attendance: 75, averageGrade: 6.2, photo: 'https://picsum.photos/id/66/128/128',
    bolsaFamilia: false, docsPending: ['Histórico'], legalStatus: 'em_analise',
    isPCD: false, sensitiveData: { bolsaFamilia: false }
  },
  { 
    id: '3', name: 'Carla Souza', grade: '9º Ano C', shift: 'Matutino', status: 'crítico', 
    attendance: 62, averageGrade: 4.8, photo: 'https://picsum.photos/id/67/128/128',
    bolsaFamilia: true, docsPending: ['Vacinação'], legalStatus: 'pendente',
    isPCD: true, sensitiveData: { bolsaFamilia: true, medicalNotes: 'TEA (Transtorno do Espectro Autista)' }
  },
];

const Students: React.FC = () => {
  const [view, setView] = useState<'list' | 'profile'>('list');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const handleOpenProfile = (student: Student) => {
    setSelectedStudent(student);
    setView('profile');
  };

  if (view === 'profile' && selectedStudent) {
    return <StudentProfile student={selectedStudent} onBack={() => setView('list')} />;
  }

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-2xl md:text-4xl font-black text-slate-900 leading-none">Gestão de Alunos</h2>
          <p className="text-slate-500 text-sm md:text-base">Ecossistema de secretaria e governança legal.</p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-3.5 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 text-sm">
          <UserPlus size={18} />
          <span>Matrícula Digital</span>
        </button>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Nome, matrícula ou CPF..." 
            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-bold"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3.5 border border-slate-200 rounded-2xl text-xs font-black text-slate-600 hover:bg-slate-50 shadow-sm uppercase tracking-tighter">
            <Filter size={16} />
            Filtros
          </button>
          <select className="flex-1 lg:flex-none px-4 py-3.5 border border-slate-200 rounded-2xl text-xs font-black text-slate-600 bg-white outline-none cursor-pointer uppercase tracking-tighter">
            <option>Todas Turmas</option>
            <option>8º Ano B</option>
          </select>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
        {mockStudents.map((student) => (
          <div 
            key={student.id} 
            onClick={() => handleOpenProfile(student)}
            className="bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-lg transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-4 mb-4">
              <img src={student.photo} className="w-16 h-16 rounded-[1.5rem] object-cover border-2 border-slate-100 shadow-sm" alt="" />
              <div className="min-w-0 flex-1">
                <p className="text-base font-black text-slate-800 truncate">{student.name}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">ID: #00{student.id}</p>
                <div className="mt-2">
                   <StatusBadge status={student.status} />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
               <div>
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Série & Turno</p>
                 <p className="text-xs font-bold text-slate-700">{student.grade} • {student.shift.charAt(0)}</p>
               </div>
               <div>
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Frequência</p>
                 <p className="text-xs font-black text-blue-600">{student.attendance}%</p>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-[10px] uppercase font-black tracking-widest">
            <tr>
              <th className="px-8 py-6">Aluno</th>
              <th className="px-6 py-6">Turma & Turno</th>
              <th className="px-6 py-6">Status IA</th>
              <th className="px-6 py-6 text-center">Bolsa Família</th>
              <th className="px-6 py-6 text-center">Frequência</th>
              <th className="px-8 py-6"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mockStudents.map((student) => (
              <tr 
                key={student.id} 
                className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                onClick={() => handleOpenProfile(student)}
              >
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <img src={student.photo} className="w-12 h-12 rounded-2xl object-cover border-2 border-slate-100 group-hover:border-blue-200 transition-all shadow-sm" alt="" />
                    <div>
                      <p className="text-sm font-black text-slate-800">{student.name}</p>
                      <p className="text-[10px] font-bold text-slate-400">MAT: 2024-00{student.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-700">{student.grade}</span>
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">{student.shift}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <StatusBadge status={student.status} />
                </td>
                <td className="px-6 py-5 text-center">
                  {student.bolsaFamilia ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-xl text-[9px] font-black border border-amber-100 uppercase tracking-wider">
                      <Bookmark size={10} fill="currentColor" />
                      ATIVO
                    </div>
                  ) : (
                    <span className="text-[10px] font-black text-slate-300">NÃO</span>
                  )}
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${student.attendance > 90 ? 'bg-emerald-500' : student.attendance > 75 ? 'bg-amber-500' : 'bg-rose-500'}`}
                        style={{ width: `${student.attendance}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-black text-slate-700">{student.attendance}%</span>
                  </div>
                </td>
                <td className="px-8 py-5 text-right">
                  <button className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 group-hover:text-blue-600">
                    <ChevronRight size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const StudentProfile = ({ student, onBack }: { student: Student; onBack: () => void }) => {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-3.5 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 transition-all text-slate-400 hover:text-slate-900 shadow-sm active:scale-95">
          <ChevronRight size={22} className="rotate-180" />
        </button>
        <div>
          <h2 className="text-xl md:text-3xl font-black text-slate-900 leading-none">Perfil do Aluno</h2>
          <p className="text-slate-500 text-xs md:text-base font-medium mt-1">Central de Governança Digital</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-br from-blue-600 to-indigo-800 -z-0"></div>
            <div className="relative z-10 flex flex-col items-center pt-10">
              <div className="relative mb-6">
                <img src={student.photo} className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] object-cover border-4 border-white shadow-2xl transition-transform group-hover:scale-105" alt="" />
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-2xl border-4 border-white shadow-lg">
                  <ShieldAlert size={20} />
                </div>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">{student.name}</h3>
              <p className="text-[11px] font-black text-slate-400 mb-8 uppercase tracking-[0.2em] mt-2">MATRÍCULA: 2024-00{student.id}</p>
              
              <div className="grid grid-cols-2 gap-4 w-full">
                 <div className="bg-slate-50 p-4 rounded-3xl text-left border border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Frequência</p>
                    <p className="text-xl font-black text-blue-600">{student.attendance}%</p>
                 </div>
                 <div className="bg-slate-50 p-4 rounded-3xl text-left border border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Média</p>
                    <p className="text-xl font-black text-slate-900">{student.averageGrade}</p>
                 </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
            <h4 className="font-black text-slate-800 flex items-center gap-3 text-sm md:text-base">
              <ShieldAlert size={20} className="text-rose-500" />
              STATUS LEGAL & BOLSA
            </h4>
            <div className="space-y-3">
               <StatusRow label="Bolsa Família" value={student.bolsaFamilia ? 'ATIVO' : 'NÃO'} active={student.bolsaFamilia} />
               <StatusRow label="Prazos Legais" value="OK" active />
               {/* Fixed property name from documentsPending to docsPending */}
               <StatusRow label="Documentos" value={student.docsPending.length > 0 ? 'PENDENTE' : 'OK'} active={student.docsPending.length === 0} critical={student.docsPending.length > 0} />
            </div>
          </div>
        </div>

        {/* Main Tabs Area */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-1.5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-1 overflow-x-auto no-scrollbar">
             {['Histórico', 'Pedagógico', 'Legal', 'Chat'].map((tab, i) => (
               <button 
                key={i} 
                onClick={() => setActiveTab(i)}
                className={`flex-1 min-w-[100px] py-3.5 px-4 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all ${activeTab === i ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'}`}
              >
                 {tab}
               </button>
             ))}
          </div>

          <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm min-h-[400px]">
             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                <h4 className="text-xl font-black text-slate-900">Linha do Tempo Central</h4>
                <button className="text-[10px] font-black text-blue-600 flex items-center justify-center gap-2 bg-blue-50 px-4 py-2.5 rounded-xl border border-blue-100 hover:bg-blue-100 transition-all uppercase tracking-widest">
                  <FileCheck size={16} />
                  Emitir Histórico Oficial
                </button>
             </div>
             
             <div className="space-y-10 relative before:absolute before:inset-y-0 before:left-6 before:w-1 before:bg-slate-50">
                <TimelineItem 
                  title="Acesso Escolar Confirmado" 
                  time="Hoje, 07:45 AM" 
                  type="attendance" 
                  desc="Entrada realizada via reconhecimento facial na portaria A. Responsáveis notificados." 
                />
                <TimelineItem 
                  title="Resultado: Matemática" 
                  time="Ontem, 14:20 PM" 
                  type="grade" 
                  desc="Lançamento da Avaliação Mensal: Nota 8.5 (Acima da média institucional)." 
                />
                <TimelineItem 
                  title="Ocorrência Disciplinar" 
                  time="15 Abr, 2024" 
                  type="alert" 
                  desc="Advertência verbal por uso de celular em sala. Registrado pela Prof. Helena." 
                />
                <TimelineItem 
                  title="Assinatura Digital de Documento" 
                  time="05 Jan, 2024" 
                  type="doc" 
                  desc="Renovação de matrícula assinada digitalmente via Gov.br pela responsável legal." 
                />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatusRow = ({ label, value, active, critical }: any) => (
  <div className="flex justify-between items-center p-4 rounded-2xl bg-slate-50/80 border border-slate-100/50">
    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
    <span className={`text-[11px] font-black tracking-widest px-3 py-1 rounded-lg ${critical ? 'bg-rose-100 text-rose-600' : active ? 'bg-emerald-100 text-emerald-600' : 'text-slate-400'}`}>
      {value}
    </span>
  </div>
);

const TimelineItem = ({ title, time, type, desc }: any) => {
  const icons: any = {
    attendance: { bg: 'bg-blue-600', text: 'text-white', icon: Clock },
    grade: { bg: 'bg-emerald-500', text: 'text-white', icon: GraduationCap },
    alert: { bg: 'bg-rose-500', text: 'text-white', icon: AlertCircle },
    doc: { bg: 'bg-amber-500', text: 'text-white', icon: History },
  };
  const Style = icons[type];

  return (
    <div className="relative pl-14">
      <div className={`absolute left-0 top-0 w-12 h-12 rounded-2xl ${Style.bg} ${Style.text} z-10 shadow-lg shadow-${Style.bg}/20 flex items-center justify-center border-4 border-white`}>
        <Style.icon size={20} />
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <span className="text-base font-black text-slate-800">{title}</span>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{time}</span>
        </div>
        <p className="text-sm text-slate-500 leading-relaxed font-medium">{desc}</p>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const styles: any = {
    regular: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    risco: 'bg-amber-50 text-amber-600 border-amber-100',
    crítico: 'bg-rose-50 text-rose-600 border-rose-100'
  };
  const label: any = {
    regular: 'REGULAR',
    risco: 'RISCO',
    crítico: 'CRÍTICO'
  };

  return (
    <span className={`px-2.5 py-1 rounded-xl text-[9px] font-black border tracking-widest ${styles[status]}`}>
      {label[status]}
    </span>
  );
};

export default Students;
