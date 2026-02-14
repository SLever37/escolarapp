
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { escolasService } from "../../servicos/escolas.service";
import { usuariosService } from "../../servicos/usuarios.service";
import { UnidadeEscolar } from "../../tipos";
import { 
  Building2, Users, ShieldCheck, Link as LinkIcon, 
  ChevronLeft, Copy, Check, ExternalLink, Globe,
  Edit3, Trash2, X, Save, Loader2, AlertTriangle
} from "lucide-react";

export default function EscolaAmbiente() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [escola, setEscola] = useState<UnidadeEscolar | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiado, setCopiado] = useState(false);
  
  const [editandoUser, setEditandoUser] = useState<any | null>(null);
  const [excluindoUser, setExcluindoUser] = useState<any | null>(null);
  const [processandoAcao, setProcessandoAcao] = useState(false);

  const carregarEscola = async () => {
    if (id) {
      const data = await escolasService.fetchUnidadeById(id);
      setEscola(data);
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarEscola();
  }, [id]);

  const copiarLink = () => {
    const url = `${window.location.origin}/#/cadastro-gestor?unidade_id=${id}`;
    navigator.clipboard.writeText(url);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const handleSalvarEdicaoUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editandoUser || processandoAcao) return;
    setProcessandoAcao(true);
    try {
      await usuariosService.atualizarUsuario(editandoUser.id, {
        nome: editandoUser.nome,
        papel: editandoUser.papel
      });
      await carregarEscola();
      setEditandoUser(null);
    } catch (err) {
      alert("Falha ao atualizar usuário.");
    } finally {
      setProcessandoAcao(false);
    }
  };

  const handleExcluirUsuario = async () => {
    if (!excluindoUser || processandoAcao) return;
    setProcessandoAcao(true);
    try {
      await usuariosService.excluirUsuario(excluindoUser.id);
      await carregarEscola();
      setExcluindoUser(null);
    } catch (err) {
      alert("Falha ao remover acesso do usuário.");
    } finally {
      setProcessandoAcao(false);
    }
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
                  <div className="flex items-center gap-2">
                     <button 
                       onClick={() => setEditandoUser(u)}
                       className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                       title="Editar Usuário"
                     >
                       <Edit3 size={18} />
                     </button>
                     <button 
                       onClick={() => setExcluindoUser(u)}
                       className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                       title="Excluir Usuário"
                     >
                       <Trash2 size={18} />
                     </button>
                  </div>
               </div>
             )) : (
               <div className="py-20 text-center border-4 border-dashed border-slate-100 rounded-[2rem]">
                  <p className="text-slate-300 font-black uppercase tracking-widest text-xs">Aguardando cadastro do gestor...</p>
               </div>
             )}
          </div>
        </div>
      </div>

      {/* Modal de Edição de Usuário */}
      {editandoUser && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-8 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-xl font-black uppercase tracking-tighter">Editar Perfil</h3>
              <button onClick={() => setEditandoUser(null)}><X size={24} /></button>
            </div>
            <form onSubmit={handleSalvarEdicaoUsuario} className="p-10 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Nome do Gestor</label>
                <input 
                  value={editandoUser.nome} 
                  onChange={e => setEditandoUser({...editandoUser, nome: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl font-bold outline-none focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Nível de Acesso</label>
                <select 
                  value={editandoUser.papel} 
                  onChange={e => setEditandoUser({...editandoUser, papel: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl font-bold outline-none focus:ring-4 focus:ring-blue-500/10"
                >
                  <option value="gestor">Gestor da Unidade</option>
                  <option value="pedagogia">Coordenação Pedagógica</option>
                  <option value="secretaria">Secretaria Escolar</option>
                </select>
              </div>
              <button 
                type="submit" 
                disabled={processandoAcao}
                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3"
              >
                {processandoAcao ? <Loader2 className="animate-spin" size={20} /> : <><Save size={18} /> Salvar Alterações</>}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {excluindoUser && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-rose-100">
            <div className="p-8 bg-rose-50 text-rose-600 border-b border-rose-100 flex items-center justify-between">
              <h3 className="text-xl font-black uppercase tracking-tighter">Revogar Acesso</h3>
              <button onClick={() => setExcluindoUser(null)}><X size={24} /></button>
            </div>
            <div className="p-10 text-center space-y-6">
              <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-[1.5rem] flex items-center justify-center mx-auto">
                <AlertTriangle size={40} />
              </div>
              <div className="space-y-2">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Você está prestes a excluir:</p>
                <p className="text-xl font-black text-slate-900">{excluindoUser.nome}</p>
                <p className="text-xs text-slate-400 font-medium leading-relaxed mt-4">Isso removerá permanentemente o acesso deste usuário a esta unidade escolar no core do sistema.</p>
              </div>
              <div className="flex gap-4 pt-4">
                <button onClick={() => setExcluindoUser(null)} className="flex-1 py-4 bg-slate-50 text-slate-500 rounded-xl font-black text-[10px] uppercase tracking-widest">Cancelar</button>
                <button 
                  onClick={handleExcluirUsuario}
                  disabled={processandoAcao}
                  className="flex-1 py-4 bg-rose-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-rose-200"
                >
                  {processandoAcao ? <Loader2 className="animate-spin mx-auto" size={18} /> : 'Confirmar Exclusão'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
