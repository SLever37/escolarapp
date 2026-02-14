import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { escolasService } from "../../servicos/escolas.service";
import { UnidadeEscolar } from "../../tipos";
import { 
  Building2, Users, ShieldCheck, Link as LinkIcon, 
  ChevronLeft, Copy, Check, ExternalLink, Globe 
} from "lucide-react";

export default function EscolaAmbiente() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [escola, setEscola] = useState<UnidadeEscolar | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    if (id) {
      escolasService.fetchUnidadeById(id).then(data => {
        setEscola(data);
        setLoading(false);
      });
    }
  }, [id]);

  const copiarLink = () => {
    const url = `${window.location.origin}/#/cadastro-gestor?unidade_id=${id}`;
    navigator.clipboard.writeText(url);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  if (loading) return <div className="p-10 text-slate-400">Carregando instância...</div>;
  if (!escola) return <div className="p-10 text-rose-500">Unidade não encontrada.</div>;

  return (
    <div className="p-4 md:p-10 space-y-8 animate-in fade-in duration-500">
      <button onClick={() => navigate('/master')} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-all">
        <ChevronLeft size={20} /> Voltar ao Master
      </button>

      <header className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl">
            <Building2 size={40} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{escola.nome}</h1>
            <p className="text-slate-500 text-sm mt-2 font-medium">Status: <span className="text-emerald-600 font-bold uppercase">{escola.status}</span> • INEP: {escola.codigo_inep || 'Não informado'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-slate-100 text-slate-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">Versão Core {escola.versao_core}</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute right-[-10%] top-[-10%] opacity-10 group-hover:scale-110 transition-transform duration-700">
               <Globe size={180} />
            </div>
            <h3 className="text-xl font-black mb-2 relative z-10">Convite de Gestão</h3>
            <p className="text-slate-400 text-xs mb-8 relative z-10 leading-relaxed">Envie o link abaixo para o diretor da unidade. Ele poderá criar sua própria senha de acesso.</p>
            
            <button 
              onClick={copiarLink}
              className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-widest transition-all
                ${copiado ? 'bg-emerald-600 text-white' : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'}`}
            >
              {copiado ? <Check size={18} /> : <Copy size={18} />}
              {copiado ? 'Link Copiado!' : 'Copiar Link de Convite'}
            </button>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
             <div className="flex items-center gap-3 mb-6">
                <Users className="text-blue-600" size={24} />
                <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Pessoas Vinculadas</h4>
             </div>
             <p className="text-4xl font-black text-slate-900 tracking-tighter">{(escola as any).usuarios?.length || 0}</p>
             <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Usuários com acesso ativo</p>
          </div>
        </div>

        <div className="lg:col-span-8 bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
          <div className="flex items-center justify-between border-b border-slate-100 pb-6">
             <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Diretório de Acessos</h3>
             <ShieldCheck size={20} className="text-slate-300" />
          </div>
          
          <div className="space-y-4">
             {(escola as any).usuarios?.length > 0 ? (escola as any).usuarios.map((u: any) => (
               <div key={u.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between group hover:bg-white hover:shadow-lg transition-all">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-black text-blue-600 uppercase">{u.nome[0]}</div>
                     <div>
                        <p className="text-sm font-black text-slate-800">{u.nome}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">{u.email} • {u.papel}</p>
                     </div>
                  </div>
                  <span className="text-[9px] font-black px-2 py-1 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase">ATIVO</span>
               </div>
             )) : (
               <div className="py-20 text-center border-4 border-dashed border-slate-100 rounded-[2rem]">
                  <p className="text-slate-300 font-black uppercase tracking-widest text-xs">Aguardando cadastro do gestor...</p>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}