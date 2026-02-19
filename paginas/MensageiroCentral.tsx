
import React, { useState } from 'react';
import { MessageSquare, Send, Users, User, ShieldCheck, Search, MoreVertical, Paperclip, ChevronLeft, Plus, UsersRound, Home, School } from 'lucide-react';
import { useAuth } from '../servicos/contexto/AuthContext';

const MensageiroCentral = () => {
  const { usuario } = useAuth();
  const [activeChat, setActiveChat] = useState<string | null>('conselho');
  const [showMobileList, setShowMobileList] = useState(true);

  if (!usuario) return null;

  const isGestor = usuario.papel === 'gestor';

  return (
    <div className="h-[calc(100vh-4rem)] md:h-[calc(100vh-6rem)] flex bg-white rounded-[2.5rem] md:rounded-none border-t border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-700 relative m-4 md:m-0">
      
      {/* Sidebar de Conversas Elaboradas */}
      <div className={`
        absolute inset-0 z-30 bg-white transition-transform duration-300 lg:relative lg:translate-x-0 lg:w-96 lg:border-r lg:border-slate-100 flex flex-col
        ${showMobileList ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-slate-50 shrink-0">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Canais Escolares</h3>
            {isGestor && (
              <button className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all" title="Criar Novo Grupo ou Transmissão">
                <Plus size={20} />
              </button>
            )}
          </div>
          
          {/* Filtros Inteligentes para Gestor */}
          {isGestor && (
            <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
              <FilterChip icon={<UsersRound size={12}/>} label="Equipes" active />
              <FilterChip icon={<School size={12}/>} label="Turmas" />
              <FilterChip icon={<Home size={12}/>} label="Famílias" />
            </div>
          )}

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Pesquisar contatos..." 
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/20" 
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
           <ChatGroupHeader label="Coordenação & RH" />
           <ChatItem name="Conselho Pedagógico" msg="Ata da reunião enviada." time="10:30" active={activeChat === 'conselho'} onClick={() => { setActiveChat('conselho'); setShowMobileList(false); }} />
           <ChatItem name="RH - Folha de Ponto" msg="Relatório pronto." time="09:15" unread={3} active={activeChat === 'rh'} onClick={() => { setActiveChat('rh'); setShowMobileList(false); }} />
           
           {isGestor && (
             <>
               <ChatGroupHeader label="Hierarquia de Turmas" />
               <ChatItem name="8º Ano B (Grupo Oficial)" msg="Prof. Marcos: Alerta de faltas." time="Ontem" active={activeChat === 'turma8'} onClick={() => { setActiveChat('turma8'); setShowMobileList(false); }} />
               <ChatItem name="Plantão de Matrícula" msg="Novo aluno provisionado." time="Ontem" active={activeChat === 'matricula'} onClick={() => { setActiveChat('matricula'); setShowMobileList(false); }} />
               
               <ChatGroupHeader label="Canais de Família" />
               <ChatItem name="Responsáveis 9º Ano" msg="Comunicado reunião geral." time="Sex" active={activeChat === 'fam9'} onClick={() => { setActiveChat('fam9'); setShowMobileList(false); }} />
             </>
           )}
        </div>
      </div>

      {/* Área do Chat Ativo (Elaborada) */}
      <div className={`
        flex-1 flex flex-col bg-slate-50/10 transition-transform duration-300
        ${!showMobileList ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        {/* Header do Chat */}
        <div className="p-6 bg-white border-b border-slate-100 flex items-center justify-between shrink-0 shadow-sm z-20">
           <div className="flex items-center gap-4">
              <button onClick={() => setShowMobileList(true)} className="lg:hidden p-2 -ml-2 text-slate-400"><ChevronLeft size={24} /></button>
              <div className="w-12 h-12 rounded-[1.2rem] bg-blue-600 text-white flex items-center justify-center font-black shadow-lg shadow-blue-200">
                CP
              </div>
              <div>
                <h4 className="font-black text-slate-800 text-base leading-none">Conselho Pedagógico</h4>
                <div className="flex items-center gap-1.5 text-[9px] text-emerald-500 font-black uppercase tracking-widest mt-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Grupo: 12 Integrantes
                </div>
              </div>
           </div>
           <div className="flex gap-2">
              <button className="hidden sm:flex p-3 text-slate-400 hover:text-blue-600 rounded-2xl hover:bg-slate-50 transition-all"><UsersRound size={20}/></button>
              <button className="p-3 text-slate-400 hover:text-slate-600 rounded-2xl hover:bg-slate-50 transition-all"><MoreVertical size={20} /></button>
           </div>
        </div>

        {/* Mensagens */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 custom-scrollbar">
           <div className="flex justify-center"><span className="px-6 py-2 bg-white border border-slate-100 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest shadow-sm">Atividade Oficial</span></div>
           <ChatMessage sender="Carlos (Diretor)" text="Equipe, todos os diários do 8º Ano B foram homologados?" time="08:30" mine />
           <ChatMessage sender="Helena (Coordenação)" text="Sim, Diretor. Acabo de verificar. Notas do AEE também inclusas." time="08:45" />
        </div>

        {/* Input Elaborado */}
        <div className="p-6 bg-white border-t border-slate-100">
           <div className="flex items-center gap-3 md:gap-4 bg-slate-50 p-2 rounded-[2.5rem] border border-slate-200">
              <button className="p-3 text-slate-400 hover:text-blue-600 transition-all"><Paperclip size={20} /></button>
              <input type="text" placeholder="Escrever para o grupo..." className="flex-1 bg-transparent border-none outline-none text-sm font-bold py-3" />
              <button className="bg-blue-600 text-white p-4 rounded-3xl shadow-xl shadow-blue-200 hover:scale-105 transition-all">
                <Send size={20} />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

const FilterChip = ({ icon, label, active }: any) => (
  <button className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border shrink-0 ${active ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white border-slate-200 text-slate-400 hover:border-blue-300 hover:text-blue-600'}`}>
    {icon}
    {label}
  </button>
);

const ChatGroupHeader = ({ label }: any) => <h5 className="px-4 mt-8 mb-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</h5>;

const ChatItem = ({ name, msg, time, unread, active, onClick }: any) => (
  <div onClick={onClick} className={`flex items-center gap-4 p-4 rounded-3xl transition-all cursor-pointer group border ${active ? 'bg-blue-50 border-blue-100 shadow-sm' : 'border-transparent hover:bg-slate-50'}`}>
    <div className={`w-12 h-12 rounded-[1.1rem] flex items-center justify-center font-black shadow-sm ${active ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-white transition-all'}`}>{name.charAt(0)}</div>
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-center mb-0.5">
        <span className={`text-sm font-black truncate ${active ? 'text-blue-900' : 'text-slate-800'}`}>{name}</span>
        <span className="text-[9px] font-black text-slate-400 uppercase">{time}</span>
      </div>
      <p className={`text-[11px] truncate font-bold ${active ? 'text-blue-700/60' : 'text-slate-400'}`}>{msg}</p>
    </div>
    {unread && <div className="w-5 h-5 rounded-full bg-blue-600 text-white text-[9px] font-black flex items-center justify-center shadow-lg">{unread}</div>}
  </div>
);

const ChatMessage = ({ sender, text, time, mine }: any) => (
  <div className={`flex flex-col gap-2 ${mine ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2`}>
    {!mine && <span className="text-[10px] font-black text-slate-400 ml-3 uppercase tracking-widest">{sender}</span>}
    <div className={`max-w-[85%] sm:max-w-[70%] p-5 rounded-[2rem] text-sm font-bold shadow-sm ${mine ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'}`}>{text}</div>
    <span className="text-[9px] font-black text-slate-300 uppercase px-3">{time}</span>
  </div>
);

export default MensageiroCentral;
