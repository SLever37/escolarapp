
import React, { useState } from 'react';
import { LifeBuoy, Send, Paperclip, Image, Video, File, Search, ChevronLeft, MoreVertical, CheckCircle } from 'lucide-react';

const SuporteCentral = () => {
  const [activeChat, setActiveChat] = useState<string | null>('gestor1');
  const [showMobileList, setShowMobileList] = useState(true);

  const gestores = [
    { id: 'gestor1', nome: 'Dr. Roberto Magalhães', escola: 'E.M. Pres. Vargas', msg: 'Preciso de ajuda com o backup.', time: '14:20', unread: 1 },
    { id: 'gestor2', nome: 'Profa. Helena Souza', escola: 'C.E. Arco-Íris', msg: 'Solicitação de nova turma.', time: '11:05', unread: 0 },
    { id: 'gestor3', nome: 'Marcio Silva', escola: 'E.M. Dom Pedro II', msg: 'Erro no reconhecimento facial.', time: 'Ontem', unread: 0 },
  ];

  return (
    <div className="h-[calc(100vh-4rem)] md:h-[calc(100vh-6rem)] flex bg-white rounded-[2.5rem] md:rounded-none border-t border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-700 relative m-4 md:m-0">
      
      {/* Sidebar: Lista de Gestores */}
      <div className={`
        absolute inset-0 z-30 bg-white transition-transform duration-300 lg:relative lg:translate-x-0 lg:w-96 lg:border-r lg:border-slate-100 flex flex-col
        ${showMobileList ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-8 border-b border-slate-50 shrink-0">
          <div className="flex items-center gap-3 mb-6">
            <LifeBuoy className="text-indigo-600" size={24} />
            <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Atendimento Gestor</h3>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Buscar chamado..." 
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500/20" 
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
           {gestores.map(g => (
             <div 
                key={g.id} 
                onClick={() => { setActiveChat(g.id); setShowMobileList(false); }}
                className={`flex items-center gap-4 p-5 rounded-3xl transition-all cursor-pointer group border ${activeChat === g.id ? 'bg-indigo-50 border-indigo-100 shadow-sm' : 'border-transparent hover:bg-slate-50'}`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black shadow-sm ${activeChat === g.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-white'}`}>
                  {g.nome.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-sm font-black truncate ${activeChat === g.id ? 'text-indigo-900' : 'text-slate-800'}`}>{g.nome}</span>
                    <span className="text-[9px] font-black text-slate-400 uppercase">{g.time}</span>
                  </div>
                  <p className="text-[10px] text-indigo-500 font-black uppercase tracking-widest mb-1">{g.escola}</p>
                  <p className={`text-[11px] truncate font-bold ${activeChat === g.id ? 'text-indigo-700/60' : 'text-slate-400'}`}>{g.msg}</p>
                </div>
                {g.unread > 0 && <div className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[9px] font-black flex items-center justify-center shadow-lg">{g.unread}</div>}
             </div>
           ))}
        </div>
      </div>

      {/* Area do Chat */}
      <div className={`
        flex-1 flex flex-col bg-slate-50/20 transition-transform duration-300
        ${!showMobileList ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="p-6 bg-white border-b border-slate-100 flex items-center justify-between shrink-0 shadow-sm z-20">
           <div className="flex items-center gap-4">
              <button onClick={() => setShowMobileList(true)} className="lg:hidden p-2 -ml-2 text-slate-400"><ChevronLeft size={24} /></button>
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-lg shadow-indigo-200">
                RM
              </div>
              <div>
                <h4 className="font-black text-slate-800 text-base leading-none">Dr. Roberto Magalhães</h4>
                <div className="flex items-center gap-1.5 text-[9px] text-indigo-500 font-black uppercase tracking-widest mt-1.5">
                  <CheckCircle size={10} /> Diretor Municipal Ativo
                </div>
              </div>
           </div>
           <button className="p-3 text-slate-400 hover:text-slate-600 rounded-2xl hover:bg-slate-50 transition-all"><MoreVertical size={20} /></button>
        </div>

        {/* Mensagens */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 custom-scrollbar">
           <div className="flex justify-center"><span className="px-6 py-2 bg-white border border-slate-100 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest shadow-sm">Suporte Prioritário</span></div>
           
           <div className="flex flex-col gap-2 items-start max-w-[70%]">
              <span className="text-[10px] font-black text-indigo-500 ml-2 uppercase tracking-widest">Roberto (Gestor)</span>
              <div className="bg-white p-5 rounded-[2rem] rounded-tl-none shadow-sm border border-slate-100 text-sm font-bold text-slate-700 leading-relaxed">
                Master, estou com uma dúvida sobre a nova versão do motor de horários. 
                Ele está acusando conflito na sala 04 mas ela está livre. Pode analisar?
              </div>
              <span className="text-[9px] font-black text-slate-300 uppercase px-2">14:20</span>
           </div>

           <div className="flex flex-col gap-2 items-end ml-auto max-w-[70%]">
              <div className="bg-indigo-600 p-5 rounded-[2rem] rounded-tr-none shadow-xl text-sm font-bold text-white leading-relaxed">
                Boa tarde Roberto. Vamos analisar agora o log da sala 04 na sua unidade. 
                Pode me enviar o print da configuração da sala?
              </div>
              <span className="text-[9px] font-black text-slate-300 uppercase px-2">14:25</span>
           </div>
        </div>

        {/* Input: Simples com anexo */}
        <div className="p-6 bg-white border-t border-slate-100">
           <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-[2.5rem] border border-slate-200">
              <div className="flex gap-1 border-r border-slate-200 pr-2">
                <button className="p-3 text-slate-400 hover:text-indigo-600 transition-all hover:bg-white rounded-xl"><Image size={20} /></button>
                <button className="p-3 text-slate-400 hover:text-indigo-600 transition-all hover:bg-white rounded-xl"><Video size={20} /></button>
                <button className="p-3 text-slate-400 hover:text-indigo-600 transition-all hover:bg-white rounded-xl"><File size={20} /></button>
              </div>
              <input type="text" placeholder="Responder ao gestor..." className="flex-1 bg-transparent border-none outline-none text-sm font-bold py-2" />
              <button className="bg-indigo-600 text-white p-4 rounded-3xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95">
                <Send size={20} />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SuporteCentral;
