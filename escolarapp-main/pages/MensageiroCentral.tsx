
import React, { useState } from 'react';
import { MessageSquare, Send, Users, User, ShieldCheck, Search, MoreVertical, Paperclip, ChevronLeft } from 'lucide-react';

/**
 * PÁGINA: MENSAGEIRO CENTRAL (Módulo 12)
 * Finalidade: Chat interno para equipe e portal de mensagens com a família.
 */
const MensageiroCentral = () => {
  const [activeChat, setActiveChat] = useState<string | null>('conselho');
  const [showMobileList, setShowMobileList] = useState(true);

  return (
    <div className="h-[calc(100vh-10rem)] min-h-[500px] flex bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-700 relative">
      
      {/* Sidebar de Conversas */}
      <div className={`
        absolute inset-0 z-30 bg-white transition-transform duration-300 lg:relative lg:translate-x-0 lg:w-80 lg:border-r lg:border-slate-100 flex flex-col
        ${showMobileList ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-slate-50 shrink-0">
          <h3 className="text-xl font-black text-slate-900 mb-4">Mensagens</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Buscar..." 
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold outline-none focus:ring-1 focus:ring-blue-500" 
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
           <ChatGroupHeader label="Equipes & Redes" />
           <ChatItem name="Conselho Pedagógico" msg="Pauta da reunião ok." time="10:30" active={activeChat === 'conselho'} onClick={() => { setActiveChat('conselho'); setShowMobileList(false); }} />
           <ChatItem name="Coordenação Central" msg="Dados Bolsa Família." time="09:15" unread={3} active={activeChat === 'coord'} onClick={() => { setActiveChat('coord'); setShowMobileList(false); }} />
           
           <ChatGroupHeader label="Comunicação Família" />
           <ChatItem name="Sra. Maria (Mãe Ana)" msg="Confirmado!" time="Ontem" active={activeChat === 'maria'} onClick={() => { setActiveChat('maria'); setShowMobileList(false); }} />
           <ChatItem name="Sr. José (Pai Bruno)" msg="Preciso de ajuda." time="Ontem" active={activeChat === 'jose'} onClick={() => { setActiveChat('jose'); setShowMobileList(false); }} />
        </div>
      </div>

      {/* Área do Chat Ativo */}
      <div className={`
        flex-1 flex flex-col bg-slate-50/20 transition-transform duration-300
        ${!showMobileList ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        {/* Header do Chat */}
        <div className="p-5 bg-white border-b border-slate-100 flex items-center justify-between shrink-0 shadow-sm z-20">
           <div className="flex items-center gap-4">
              <button onClick={() => setShowMobileList(true)} className="lg:hidden p-2 -ml-2 text-slate-400"><ChevronLeft size={24} /></button>
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-[1.2rem] bg-blue-600 text-white flex items-center justify-center font-black shadow-lg shadow-blue-200">
                CP
              </div>
              <div>
                <h4 className="font-black text-slate-800 text-sm md:text-base leading-none">Conselho Pedagógico</h4>
                <div className="flex items-center gap-1.5 text-[9px] text-emerald-500 font-black uppercase tracking-widest mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Ativo Agora
                </div>
              </div>
           </div>
           <button className="p-2.5 text-slate-400 hover:text-slate-600 rounded-xl transition-all"><MoreVertical size={20} /></button>
        </div>

        {/* Mensagens */}
        <div className="flex-1 overflow-y-auto p-5 md:p-8 space-y-6 custom-scrollbar">
           <div className="flex justify-center"><span className="px-5 py-1.5 bg-white border border-slate-100 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-widest shadow-sm">Segunda, 22 de Abril</span></div>
           <ChatMessage sender="Carlos (Diretor)" text="Equipe, todos os diários foram fechados?" time="08:30" mine />
           <ChatMessage sender="Ana (Secretaria)" text="Falta apenas o 9º Ano C. Estou aguardando o Prof. Marcos." time="08:45" />
           <ChatMessage sender="Prof. Marcos" text="Lançando agora mesmo!" time="09:12" />
        </div>

        {/* Input */}
        <div className="p-4 md:p-6 bg-white border-t border-slate-100">
           <div className="flex items-center gap-2 md:gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
              <button className="p-2.5 text-slate-400 hover:text-blue-600"><Paperclip size={20} /></button>
              <input type="text" placeholder="Mensagem..." className="flex-1 bg-transparent border-none outline-none text-sm font-bold py-2" />
              <button className="bg-blue-600 text-white p-2.5 md:p-3 rounded-xl shadow-lg shadow-blue-200"><Send size={18} /></button>
           </div>
        </div>
      </div>
    </div>
  );
};

const ChatGroupHeader = ({ label }: any) => <h5 className="px-3 mt-6 mb-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</h5>;

const ChatItem = ({ name, msg, time, unread, active, onClick }: any) => (
  <div onClick={onClick} className={`flex items-center gap-4 p-3.5 rounded-2xl transition-all cursor-pointer group border ${active ? 'bg-blue-50 border-blue-100 shadow-sm' : 'border-transparent hover:bg-slate-50'}`}>
    <div className={`w-11 h-11 rounded-[1.1rem] flex items-center justify-center font-black ${active ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-white transition-all'}`}>{name.charAt(0)}</div>
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-center mb-0.5">
        <span className={`text-[13px] font-black truncate ${active ? 'text-blue-900' : 'text-slate-800'}`}>{name}</span>
        <span className="text-[9px] font-bold text-slate-400 uppercase">{time}</span>
      </div>
      <p className={`text-[11px] truncate ${active ? 'text-blue-700/60' : 'text-slate-400'}`}>{msg}</p>
    </div>
    {unread && <div className="w-5 h-5 rounded-full bg-blue-600 text-white text-[9px] font-black flex items-center justify-center shadow-lg">{unread}</div>}
  </div>
);

const ChatMessage = ({ sender, text, time, mine }: any) => (
  <div className={`flex flex-col gap-1.5 ${mine ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2`}>
    {!mine && <span className="text-[10px] font-black text-slate-400 ml-2 uppercase tracking-widest">{sender}</span>}
    <div className={`max-w-[85%] sm:max-w-[70%] p-4 rounded-[1.8rem] text-sm font-bold shadow-sm ${mine ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'}`}>{text}</div>
    <span className="text-[9px] font-black text-slate-300 uppercase px-2">{time}</span>
  </div>
);

export default MensageiroCentral;
