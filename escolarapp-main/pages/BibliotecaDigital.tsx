
import React from 'react';
import { Library, Search, Bookmark, History, Plus, ChevronRight, BookOpen, User } from 'lucide-react';

/**
 * PÁGINA: BIBLIOTECA DIGITAL (Módulo 11)
 * Finalidade: Controle de acervo, empréstimos e devoluções.
 */
const BibliotecaDigital = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 leading-none">Biblioteca Digital</h2>
          <p className="text-slate-500 text-sm mt-1">Gestão de acervo, circulação de obras e incentivo à leitura.</p>
        </div>
        <div className="flex gap-2">
           <button className="bg-emerald-600 text-white px-5 py-2.5 rounded-2xl text-xs font-bold shadow-lg shadow-emerald-200 flex items-center gap-2">
             <Plus size={16} /> Novo Empréstimo
           </button>
        </div>
      </header>

      {/* Busca e Filtros de Acervo */}
      <div className="bg-white p-4 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
         <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Buscar livro, autor ou código de barras..." className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none" />
         </div>
         <div className="flex gap-2">
            <button className="px-5 py-3 border border-slate-200 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white">Categorias</button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Devoluções Pendentes */}
        <div className="lg:col-span-8 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[500px]">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
             <div className="flex items-center gap-3">
               <History size={20} className="text-rose-500" />
               <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Atrasos e Devoluções</h3>
             </div>
             <span className="text-[10px] font-black text-rose-500 bg-rose-50 px-2 py-1 rounded-lg">12 Obras Atrasadas</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
             <LibraryLoanRow book="Dom Casmurro" student="Ana Beatriz Silva" date="15/04" status="delayed" />
             <LibraryLoanRow book="Harry Potter e a Pedra Filosofal" student="Pedro Ramos" date="18/04" status="delayed" />
             <LibraryLoanRow book="O Pequeno Príncipe" student="Maria Clara" date="20/04" status="due-today" />
             <LibraryLoanRow book="Memórias Póstumas" student="João Victor" date="22/04" status="active" />
          </div>
        </div>

        {/* Estatísticas de Leitura */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-indigo-600 p-8 rounded-[3rem] text-white shadow-xl shadow-indigo-200 relative overflow-hidden group">
              <div className="absolute -right-5 -bottom-5 opacity-10 group-hover:scale-110 transition-transform duration-700"><BookOpen size={160} /></div>
              <h4 className="text-lg font-black leading-tight mb-2">Engajamento Literário</h4>
              <p className="text-indigo-100 text-xs font-medium mb-8">Estatísticas do mês corrente.</p>
              
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                    <p className="text-[9px] font-bold opacity-60 uppercase tracking-widest">Empréstimos</p>
                    <p className="text-2xl font-black">156</p>
                 </div>
                 <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                    <p className="text-[9px] font-bold opacity-60 uppercase tracking-widest">Obra Top</p>
                    <p className="text-sm font-black truncate">Clarice L.</p>
                 </div>
              </div>
           </div>

           <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Ações Rápidas</h4>
              <div className="space-y-2">
                 <button className="w-full text-left p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between group hover:bg-white hover:shadow-md transition-all">
                    <span className="text-xs font-bold text-slate-700">Imprimir Etiquetas QR</span>
                    <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-600" />
                 </button>
                 <button className="w-full text-left p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between group hover:bg-white hover:shadow-md transition-all">
                    <span className="text-xs font-bold text-slate-700">Relatório de Extravios</span>
                    <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-600" />
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const LibraryLoanRow = ({ book, student, date, status }: any) => {
  const styles: any = {
    delayed: 'text-rose-600 bg-rose-50 border-rose-100',
    'due-today': 'text-amber-600 bg-amber-50 border-amber-100',
    active: 'text-emerald-600 bg-emerald-50 border-emerald-100'
  };
  return (
    <div className="p-4 bg-white border border-slate-100 rounded-[1.5rem] flex items-center justify-between hover:shadow-md transition-all group cursor-pointer">
       <div className="flex items-center gap-4">
          <div className={`p-2.5 rounded-xl ${styles[status]} group-hover:scale-110 transition-transform`}>
             <Bookmark size={18} fill="currentColor" />
          </div>
          <div>
             <h4 className="text-sm font-bold text-slate-800 leading-none mb-1.5">{book}</h4>
             <div className="flex items-center gap-2">
                <User size={10} className="text-slate-400" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{student}</span>
             </div>
          </div>
       </div>
       <div className="text-right">
          <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${styles[status]}`}>
            {status === 'delayed' ? `Vencido ${date}` : status === 'due-today' ? 'Vence Hoje' : `Devol: ${date}`}
          </span>
       </div>
    </div>
  );
};

export default BibliotecaDigital;
