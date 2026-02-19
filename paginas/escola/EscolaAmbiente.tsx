
import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { escolasService } from "../../servicos/escolas.service";
import { usuariosService } from "../../servicos/usuarios.service";
import { UnidadeEscolar } from "../../tipos";
import { 
  Building2, Users, ShieldCheck, 
  ChevronLeft, Copy, Check, ExternalLink, Globe,
  Edit3, Trash2, X, Save, Loader2, AlertTriangle,
  ArrowRightLeft, UserX, KeyRound
} from "lucide-react";
import { ModalTransferirGestor } from "../../componentes/master/ModalTransferirGestor";
import ModalConfirmacao from "../../componentes/ModalConfirmacao";

export default function EscolaAmbiente() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [escola, setEscola] = useState<UnidadeEscolar | null>(null);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiado, setCopiado] = useState(false);
  
  const [abaAtiva, setAbaAtiva] = useState<'todos' | 'gestores'>('todos');
  const [editandoUser, setEditandoUser] = useState<any | null>(null);
  const [modalTransferir, setModalTransferir] = useState<{aberto: boolean, gestor: any | null}>({
    aberto: false,
    gestor: null
  });
  const [modalConfirma, setModalConfirma] = useState<{
    aberto: boolean, 
    tipo: 'exonerar' | 'excluir' | 'reset', 
    usuario: any | null
  }>({
    aberto: false,
    tipo: 'exonerar',
    usuario: null
  });
  const [processandoAcao, setProcessandoAcao] = useState(false);

  const carregarDados = async () => {
    if (id) {
      try {
        const [escolaData, usuariosData] = await Promise.all([
          escolasService.fetchUnidadeById(id),
          usuariosService.fetchUsuariosPorUnidade(id)
        ]);
        setEscola(escolaData);
        setUsuarios(usuariosData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    carregarDados();
  }, [id]);

  const copiarLink = () => {
    const inepParam = escola?.codigo_inep ? `&inep=${escola.codigo_inep}` : '';
    const url = `${window.location.origin}/#/cadastro-gestor?unidade_id=${id}${inepParam}`;
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
        papel: editandoUser.papel,
        ativo: editandoUser.ativo
      });
      await carregarDados();
      setEditandoUser(null);
    } catch (err) {
      alert("Falha ao atualizar usuário.");
    } finally {
      setProcessandoAcao(false);
    }
  };

  const handleAcaoConfirmada = async () => {
    const { tipo, usuario } = modalConfirma;
    if (!usuario || processandoAcao) return;
    setProcessandoAcao(true);
    try {
      if (tipo === 'exonerar') {
        await usuariosService.exonerarUsuario(usuario.id);
      } else if (tipo === 'excluir') {
        await usuariosService.excluirUsuario(usuario.id);
      } else if (tipo === 'reset') {
        await usuariosService.resetarSenhaGestor(usuario.email);
        alert('E-mail de reset enviado.');
      }
      await carregarDados();
      setModalConfirma({ ...modalConfirma, aberto: false });
    } catch (err) {
      alert("Erro na operação: " + err);
    } finally {
      setProcessandoAcao(false);
    }
  };

  const usuariosFiltrados = useMemo(() => {
    if (abaAtiva === 'gestores') return usuarios.filter(u => u.papel === 'gestor');
    return usuarios;
  }, [usuarios, abaAtiva]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-full p-20 gap-4">
      <Loader2 className="animate-spin text-blue-600" size={48} />
      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Sincronizando Instância Escola...</p>
    </div>
  );
  
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
             <p className="text-4xl font-black text-slate-900 tracking-tighter">{usuarios.length}</p>
             <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Usuários com acesso ativo</p>
          </div>
        </div>

        <div className="lg:col-span-8 bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8 min-h-[500px] flex flex-col">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-6 gap-6">
             <div className="flex gap-1 bg-slate-50 p-1 rounded-2xl border border-slate-200">
                <button 
                  onClick={() => setAbaAtiva('todos')}
                  className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${abaAtiva === 'todos' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-700'}`}
                >
                  Todos Usuários
                </button>
                <button 
                  onClick={() => setAbaAtiva('gestores')}
                  className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${abaAtiva === 'gestores' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-700'}`}
                >
                  Somente Gestores
                </button>
             </div>
             <ShieldCheck size={20} className="text-slate-300 hidden md:block" />
          </div>
          
          <div className="space-y-4 flex-1">
             {usuariosFiltrados.length > 0 ? usuariosFiltrados.map((u: any) => (
               <div key={u.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between group hover:bg-white hover:shadow-lg transition-all">
                  <div className="flex items-center gap-4">
                     <div className={`w-12 h-12 rounded-xl border flex items-center justify-center font-black uppercase text-lg group-hover:bg-blue-600 group-hover:text-white transition-all ${u.ativo ? 'bg-white border-slate-200 text-blue-600' : 'bg-rose-50 border-rose-100 text-rose-400'}`}>
                        {u.nome[0]}
                     </div>
                     <div>
                        <div className="flex items-center gap-2">
                           <p className="text-sm font-black text-slate-800">{u.nome}</p>
                           {!u.ativo && <span className="bg-rose-50 text-rose-500 text-[8px] font-black px-1.5 py-0.5 rounded border border-rose-100 uppercase">Inativo</span>}
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{u.email} • {u.papel}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-1">
                     {u.papel === 'gestor' && (
                        <button 
                          onClick={() => setModalTransferir({ aberto: true, gestor: u })}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                          title="Transferir para outra unidade"
                        >
                          <ArrowRightLeft size={18} />
                        </button>
                     )}
                     <button 
                       onClick={() => setModalConfirma({ aberto: true, tipo: 'reset', usuario: u })}
                       className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all"
                       title="Resetar Senha"
                     >
                       <KeyRound size={18} />
                     </button>
                     <button 
                       onClick={() => setEditandoUser(u)}
                       className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
                       title="Editar Dados"
                     >
                       <Edit3 size={18} />
                     </button>
                     <button 
                       onClick={() => setModalConfirma({ aberto: true, tipo: 'exonerar', usuario: u })}
                       className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                       title="Exonerar / Inativar"
                     >
                       <UserX size={18} />
                     </button>
                  </div>
               </div>
             )) : (
               <div className="py-20 text-center border-4 border-dashed border-slate-50 rounded-[2rem]">
                  <p className="text-slate-300 font-black uppercase tracking-widest text-xs">Nenhum usuário encontrado nesta visualização</p>
               </div>
             )}
          </div>
        </div>
      </div>

      {/* Modais de Edição */}
      {editandoUser && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-8 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-xl font-black uppercase tracking-tighter">Editar Perfil</h3>
              <button onClick={() => setEditandoUser(null)} className="p-2 hover:bg-white/10 rounded-xl"><X size={24} /></button>
            </div>
            <form onSubmit={handleSalvarEdicaoUsuario} className="p-10 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Nome Completo</label>
                <input 
                  value={editandoUser.nome} 
                  onChange={e => setEditandoUser({...editandoUser, nome: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl font-bold outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Papel Institucional</label>
                <select 
                  value={editandoUser.papel} 
                  onChange={e => setEditandoUser({...editandoUser, papel: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl font-bold outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                >
                  <option value="gestor">Gestor da Unidade</option>
                  <option value="pedagogia">Coordenação Pedagógica</option>
                  <option value="secretaria">Secretaria Escolar</option>
                  <option value="professor">Professor</option>
                  <option value="portaria">Portaria</option>
                </select>
              </div>
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <input 
                  type="checkbox" 
                  checked={editandoUser.ativo} 
                  onChange={e => setEditandoUser({...editandoUser, ativo: e.target.checked})}
                  className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                />
                <span className="text-xs font-black uppercase text-slate-700 tracking-widest">Usuário Ativo no Sistema</span>
              </div>
              <button 
                type="submit" 
                disabled={processandoAcao}
                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-3"
              >
                {processandoAcao ? <Loader2 className="animate-spin" size={20} /> : <><Save size={18} /> Salvar Alterações</>}
              </button>
            </form>
          </div>
        </div>
      )}

      <ModalTransferirGestor 
        aberto={modalTransferir.aberto}
        onClose={() => setModalTransferir({ aberto: false, gestor: null })}
        onConfirmar={async (unidId, nomeUnid) => {
          await usuariosService.transferirUsuarioDeUnidade(modalTransferir.gestor.id, unidId, nomeUnid);
          await carregarDados();
        }}
        gestorNome={modalTransferir.gestor?.nome || ''}
        unidadeAtualId={id}
      />

      <ModalConfirmacao 
        aberto={modalConfirma.aberto}
        tipo={modalConfirma.tipo === 'excluir' ? 'excluir' : 'arquivar'}
        titulo={
          modalConfirma.tipo === 'exonerar' ? 'Confirmar Exoneração' :
          modalConfirma.tipo === 'reset' ? 'Confirmar Reset de Senha' : 'Excluir Usuário'
        }
        itemNome={modalConfirma.usuario?.nome || ''}
        onConfirmar={handleAcaoConfirmada}
        onFechar={() => setModalConfirma({ ...modalConfirma, aberto: false })}
        loading={processandoAcao}
      />
    </div>
  );
}
