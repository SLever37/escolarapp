
import React from 'react';
import { LifeBuoy, Send, Paperclip, Image, Video, File, ShieldCheck, ChevronRight } from 'lucide-react';

const SuporteMaster = () => {
  return (
    <div className="p-6 md:p-10 space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 mb-2">
            <LifeBuoy size={24} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Help Desk Core / Master</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Ajuda da Plataforma</h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">Canal direto de suporte técnico para diretores de unidade.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
           <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center font-black">M</div>
                 <div>
                    <h4 className="font-black text-base leading-none">Suporte Master Central</h4>
                    <p className="text-[9px] text-indigo-400 font-black uppercase tracking-widest mt-1.5">Conectado via Core Engine</p>
                 </div>
              </div>
              <ShieldCheck className="text-indigo-400" size={24} />
           </div>
           
           <div className="flex-1 overflow-y-auto p-10 space-y-8 bg-slate-50/20 custom-scrollbar">
              <div className="flex flex-col gap-2 items-end ml-auto max-w-[80%]">
                 <div className="bg-blue-600 p-5 rounded-[2rem] rounded-tr-none shadow-xl text-sm font-bold text-white leading-relaxed">
                   Olá Suporte Master. Preciso de auxílio na configuração do backup da minha unidade Presidente Vargas. 
                   Pode me guiar na exportação dos dados forenses?
                 </div>
                 <span className="text-[9px] font-black text-slate-300 uppercase px-2">14:20</span>
              </div>

              <div className="flex flex-col gap-2 items-start max-w-[80%]">
                 <div className="bg-white p-5 rounded-[2rem] rounded-tl-none shadow-sm border border-slate-100 text-sm font-bold text-slate-700 leading-relaxed">
                   Boa tarde, Diretor. Recebemos seu pedido. Vou iniciar o espelhamento da tela para te ajudar. 
                   Aguarde 1 minuto.
                 </div>
                 <span className="text-[9px] font-black text-slate-300 uppercase px-2">14:25</span>
              </div>
           </div>

           <div className="p-6 bg-white border-t border-slate-100">
              <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-[2.5rem] border border-slate-200">
                 <div className="flex gap-1 pr-2 border-r border-slate-200">
                    <button className="p-3 text-slate-400 hover:text-indigo-600 transition-all hover:bg-white rounded-xl" title="Enviar Foto"><Image size={18} /></button>
                    <button className="p-3 text-slate-400 hover:text-indigo-600 transition-all hover:bg-white rounded-xl" title="Enviar Arquivo"><File size={18} /></button>
                    <button className="p-3 text-slate-400 hover:text-indigo-600 transition-all hover:bg-white rounded-xl" title="Enviar Vídeo"><Video size={18} /></button>
                 </div>
                 <input type="text" placeholder="Descreva sua dúvida técnica..." className="flex-1 bg-transparent border-none outline-none text-sm font-bold py-2" />
                 <button className="bg-indigo-600 text-white p-4 rounded-3xl shadow-xl shadow-indigo-200 hover:bg-indigo-700">
                    <Send size={20} />
                 </button>
              </div>
           </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
           <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute right-[-10%] top-[-10%] opacity-10 group-hover:scale-110 transition-transform duration-700"><LifeBuoy size={200} /></div>
              <h4 className="text-xl font-black mb-4 relative z-10">Artigos de Ajuda</h4>
              <p className="text-slate-400 text-xs leading-relaxed mb-8 relative z-10">Tire dúvidas rápidas sem precisar abrir um chamado no suporte master.</p>
              <div className="space-y-3 relative z-10">
                 <HelpLink label="Como Provisionar Usuários" />
                 <HelpLink label="Auditoria de Notas PCD" />
                 <HelpLink label="Exportação Censo Escolar" />
              </div>
           </div>

           <div className="bg-indigo-50 border border-indigo-100 p-8 rounded-[3rem]">
              <h4 className="text-sm font-black text-indigo-900 uppercase tracking-widest mb-4">Uptime Unidade</h4>
              <div className="flex justify-between items-center text-[10px] font-black uppercase text-indigo-600 mb-2">
                <span>Servidor Local</span>
                <span>99.9%</span>
              </div>
              <div className="h-2 w-full bg-indigo-200 rounded-full overflow-hidden">
                 <div className="w-[99.9%] h-full bg-indigo-600 rounded-full" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const HelpLink = ({ label }: any) => (
  <button className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-sm font-bold">
    <span>{label}</span>
    <ChevronRight size={16} className="text-slate-500" />
  </button>
);

export default SuporteMaster;
