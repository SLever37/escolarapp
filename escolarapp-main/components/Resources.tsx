
import React from 'react';
import { Package, Library, Search, AlertTriangle, FileText, ChevronRight, Bookmark, ArrowUpRight } from 'lucide-react';

const Resources: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Recursos & Logística</h2>
          <p className="text-slate-500">Gestão de Estoque, Patrimônio e Acervo da Biblioteca.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Inventory Section */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
             <div className="flex items-center gap-3">
               <div className="bg-blue-600 text-white p-2.5 rounded-2xl shadow-lg shadow-blue-200">
                 <Package size={20} />
               </div>
               <h3 className="text-xl font-bold text-slate-800">Estoque Crítico</h3>
             </div>
             <button className="text-xs font-bold text-blue-600 bg-white px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all">Ver Tudo</button>
          </div>
          <div className="p-8 space-y-4 flex-1">
             {[
               { name: 'Papel A4 - 500fls', stock: 5, min: 10, unit: 'Resmas' },
               { name: 'Toner HP Laserjet', stock: 2, min: 5, unit: 'Unidades' },
               { name: 'Sabão Líquido 5L', stock: 1, min: 4, unit: 'Galoões' },
             ].map((item, i) => (
               <div key={i} className="flex items-center justify-between p-4 bg-rose-50/50 rounded-2xl border border-rose-100/50">
                 <div className="flex flex-col">
                   <span className="text-sm font-bold text-slate-800">{item.name}</span>
                   <span className="text-[10px] font-bold text-rose-500 uppercase tracking-tighter">Abaixo do Mínimo</span>
                 </div>
                 <div className="flex items-center gap-4 text-right">
                    <div className="flex flex-col">
                      <span className="text-lg font-black text-rose-600">{item.stock}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">{item.unit}</span>
                    </div>
                    <AlertTriangle size={20} className="text-rose-500 animate-pulse" />
                 </div>
               </div>
             ))}
          </div>
        </div>

        {/* Library Section */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
             <div className="flex items-center gap-3">
               <div className="bg-emerald-600 text-white p-2.5 rounded-2xl shadow-lg shadow-emerald-200">
                 <Library size={20} />
               </div>
               <h3 className="text-xl font-bold text-slate-800">Biblioteca Central</h3>
             </div>
             <button className="text-xs font-bold text-emerald-600 bg-white px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all">Novo Empréstimo</button>
          </div>
          <div className="p-8 space-y-4 flex-1">
             <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 mb-4">
                <Search size={18} className="text-slate-400" />
                <input type="text" placeholder="Buscar livro no acervo..." className="bg-transparent text-sm font-medium outline-none w-full" />
             </div>
             <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Devoluções Pendentes</h4>
             {[
               { title: 'Dom Casmurro', student: 'Ana Beatriz', date: 'Venceu em 15/04' },
               { title: 'Harry Potter e a Pedra Filosofal', student: 'Pedro Ramos', date: 'Venceu em 18/04' },
             ].map((book, i) => (
               <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all cursor-pointer group">
                 <div className="flex items-center gap-4">
                   <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                     <Bookmark size={16} fill="currentColor" />
                   </div>
                   <div>
                     <p className="text-sm font-bold text-slate-800">{book.title}</p>
                     <p className="text-[10px] text-slate-400 font-bold uppercase">{book.student}</p>
                   </div>
                 </div>
                 <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black text-rose-500 uppercase">{book.date}</span>
                    <ArrowUpRight size={16} className="text-slate-300 group-hover:text-emerald-600" />
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;
