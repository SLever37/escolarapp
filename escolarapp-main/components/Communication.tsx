
import React, { useState } from 'react';
import { MessageSquare, Send, Users, User, ShieldCheck, Search, MoreVertical, Paperclip, ChevronLeft } from 'lucide-react';

const Communication: React.FC = () => {
  const [activeChat, setActiveChat] = useState<string | null>('cp');
  const [showMobileList, setShowMobileList] = useState(true);

  const handleSelectChat = (id: string) => {
    setActiveChat(id);
    setShowMobileList(false);
  };

  return (
    <div className="h-[calc(100vh-12rem)] min-h-[500px] flex bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-700 relative">
      
      {/* Sidebar: Chats */}
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
        <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar no-scrollbar lg:block">
           <ChatGroup label="Equipes & Redes" />
           <ChatItem 
            icon={<Users size={16} />} 
            name="Conselho Pedagógico" 
            msg="Ata da reunião ok." 
            time="10:30" 
            unread={2} 
            active={activeChat === 'cp'} 
            onClick={() => handleSelectChat('cp')}
          />
           <ChatItem 
            icon={<Users size={16} />} 
            name="Professores 8º Ano" 
            msg="Reforço agendado." 
            time="Ontem" 
            active={activeChat === 'p8'} 
            onClick={() => handleSelectChat('p8')}
          />
           
           <ChatGroup label="Família & Direção" />
           <ChatItem 
            icon={<User size={16} />} 
            name="Sra. Maria (Mãe Ana)" 
            msg="Obrigada!" 
            time="11:45" 
            active={activeChat === 'sm'} 
            onClick={() => handleSelectChat('sm')}
          />
           <ChatItem 
            icon={<User size={16} />} 
            name="Prof. Marcos" 
            msg="Chamada pronta." 
            time="09:15" 
            unread={1} 
            active={activeChat === 'pm'} 
            onClick={() => handleSelectChat('pm')}
          />
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`
        flex-1 flex flex-col bg-slate-50/20 transition-transform duration-300
        ${!showMobileList ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        {/* Chat Header */}
        <div className="p-5 bg-white border-b border-slate-100 flex items-center justify-between shrink-0 shadow-sm z-20">
           <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowMobileList(true)}
                className="lg:hidden p-2 -ml-2 text-slate-400 hover:bg-slate-50 rounded-xl"
              >
                <ChevronLeft size={24} />
              </button>
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-[1.2rem] bg-blue-600 text-white flex items-center justify-center font-black shadow-lg shadow-blue-200">
                CP
              </div>
              <div>
                <h4 className="font-black text-slate-800 text-sm md:text-base leading-none">Conselho Pedagógico</h4>
                <div className="flex items-center gap-1.5 text-[9px] text-emerald-500 font-black uppercase tracking-widest mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Ativo Agora
                </div>
              </div>
           </div>
           <div className="flex items-center gap-1">
              <button className="hidden sm:flex p-2.5 text-slate-400 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-all">
                <ShieldCheck size={20} />
              </button>
              <button className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
                <MoreVertical size={20} />
              </button>
           </div>
        </div>

        {/* Message Viewport */}
        <div className="flex-1 overflow-y-auto p-5 md:p-8 space-y-6 custom-scrollbar">
           <div className="flex justify-center">
              <span className="px-5 py-1.5 bg-white border border-slate-100 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-widest shadow-sm">Segunda, 22 de Abril</span>
           </div>
           
           <MsgBubble sender="Carlos (Diretor)" text="Bom dia equipe! Conferiram os dados do Bolsa Família?" time="08:30 AM" mine />
           <MsgBubble sender="Ana (Secretaria)" text="Bom dia Carlos! Finalizando aqui. Envio em 5 minutos." time="08:45 AM" />
           <MsgBubble sender="Prof. Helena" text="Lembrando que temos reunião de conselho às 14h hoje no auditório principal." time="09:12 AM" />
        </div>

        {/* Chat Input */}
        <div className="p-4 md:p-6 bg-white border-t border-slate-100 shrink-0">
           <div className="flex items-center gap-2 md:gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
              <button className="p-2.5 text-slate-400 hover:text-blue-600 transition-colors">
                 <Paperclip size={20} />
              </button>
              <input 
                type="text" 
                placeholder="Mensagem..." 
                className="flex-1 bg-transparent border-none outline-none text-sm font-bold py-2.5"
              />
              <button className="bg-blue-600 text-white p-2.5 md:p-3 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all">
                 <Send size={18} />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

const ChatGroup = ({ label }: { label: string }) => (
  <h5 className="px-3 mt-6 mb-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</h5>
);

const ChatItem = ({ icon, name, msg, time, unread, active, onClick }: any) => (
  <div 
    onClick={onClick}
    className={`
      flex items-center gap-4 p-3.5 rounded-2xl transition-all cursor-pointer group relative
      ${active ? 'bg-blue-50 border border-blue-100' : 'hover:bg-slate-50 border border-transparent'}
    `}
  >
    <div className={`w-11 h-11 rounded-[1.1rem] flex items-center justify-center shadow-sm ${active ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-white transition-all'}`}>
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-center mb-0.5">
        <span className={`text-[13px] font-black truncate ${active ? 'text-blue-900' : 'text-slate-800'}`}>{name}</span>
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{time}</span>
      </div>
      <p className={`text-[11px] truncate font-bold ${active ? 'text-blue-700/60' : 'text-slate-400'}`}>{msg}</p>
    </div>
    {unread && (
      <div className="w-5 h-5 rounded-full bg-blue-600 text-white text-[9px] font-black flex items-center justify-center shadow-lg shadow-blue-200 ml-1">
        {unread}
      </div>
    )}
  </div>
);

const MsgBubble = ({ sender, text, time, mine }: any) => (
  <div className={`flex flex-col gap-1.5 ${mine ? 'items-end' : 'items-start'} group animate-in slide-in-from-bottom-2`}>
    {!mine && <span className="text-[10px] font-black text-slate-400 ml-2 tracking-widest uppercase">{sender}</span>}
    <div className={`
      max-w-[85%] sm:max-w-[70%] p-4 rounded-[1.8rem] text-sm font-bold shadow-sm
      ${mine ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'}
    `}>
      {text}
    </div>
    <span className="text-[9px] font-black text-slate-300 uppercase tracking-tighter px-2 group-hover:text-slate-500 transition-colors">{time}</span>
  </div>
);

export default Communication;
