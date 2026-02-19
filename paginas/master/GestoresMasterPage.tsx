
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Search, Mail, ShieldCheck, UserPlus, 
  MoreHorizontal, ExternalLink, Loader2, 
  ArrowRightLeft, UserX, Trash2, KeyRound 
} from 'lucide-react';
import { useGestoresMaster } from '../../hooks/useGestoresMaster';
import { ModalTransferirGestor } from '../../componentes/master/ModalTransferirGestor';
import ModalConfirmacao from '../../componentes/ModalConfirmacao';

const GestoresMasterPage = () => {
  const navigate = useNavigate();
  const { 
    gestores, loading, busca, setBusca, 
    transferirGestor, exonerarGestor, excluirGestor, resetarSenha 
  } = useGestoresMaster();

  const [menuAberto, setMenuAberto] = useState<string | null>(null);
  const [modalTransferir, setModalTransferir] = useState<{aberto: boolean, gestor: any | null}>({
    aberto: false,
    gestor: null
  });
  const [modalConfirma, setModalConfirma] = useState<{
    aberto: boolean, 
    tipo: 'exonerar' | 'excluir' | 'reset', 
    gestor: any | null
  }>({
    aberto: false,
    tipo: 'exonerar',
    gestor: null
  });

  const handleAcao = async () => {
    const { tipo, gestor } = modalConfirma;
    if (!gestor) return;

    try {
      if (tipo === 'exonerar') {
        await exonerarGestor(gestor.id);
        alert('Gestor exonerado com sucesso.');
      } else if (tipo === 'excluir') {
        await excluirGestor(gestor.id);
        alert('Registro removido permanentemente.');
      } else if (tipo === 'reset') {
        await resetarSenha(gestor.email);
        alert('Instruções de reset enviadas para ' + gestor.email);
      }
    } catch (err) {
      alert("Falha na operação: " + err);
    } finally {
      setModalConfirma({ ...modalConfirma, aberto: false });
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <Users size={24} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Diretório de Governança Municipal</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">Gestores Master</h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">Controle centralizado de todos os responsáveis institucionais da rede.</p>
        </div>
      </header>

      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[60vh]">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
           <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Localizar gestor por nome, e-mail ou escola..." 
                value={busca}
                onChange={e => setBusca(e.target.value)}
                className="pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none w-full shadow-sm focus:ring-4 focus:ring-blue-500/10 transition-all" 
              />
           </div>
           <div className="hidden md:block">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{gestores.length} Gestores Localizados</span>
           </div>
        </div>

        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-20 gap-4">
            <Loader2 className="animate-spin text-blue-600" size={40} />
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Sincronizando Base Global...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                 <tr>
                    <th className="px-8 py-6">Gestor Institucional</th>
                    <th className="px-6 py-6">Unidade Federada</th>
                    <th className="px-6 py-6">Status</th>
                    <th className="px-8 py-6"></th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                 {gestores.map((g) => (
                   <tr key={g.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-8 py-5">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-blue-600 uppercase text-lg group-hover:bg-blue-600 group-hover:text-white transition-all">
                               {g.nome.charAt(0)}
                            </div>
                            <div>
                               <p className="text-base font-black text-slate-800 leading-none">{g.nome}</p>
                               <p className="text-[10px] text-slate-400 font-bold mt-1.5 uppercase tracking-tighter">{g.email}</p>
                            </div>
                         </div>
                      </td>
                      <td className="px-6 py-5">
                         <div className="flex items-center gap-2">
                           <div>
                              <p className="text-sm font-black text-slate-700 leading-none">{g.unidade_ref?.nome || 'Não Vinculado'}</p>
                              {g.unidade_id && (
                                <button 
                                  onClick={() => navigate(`/escola/${g.unidade_id}`)}
                                  className="text-[9px] font-black text-blue-500 uppercase mt-2 flex items-center gap-1 hover:underline"
                                >
                                  Abrir Unidade <ExternalLink size={10}/>
                                </button>
                              )}
                           </div>
                         </div>
                      </td>
                      <td className="px-6 py-5">
                         <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-xl text-[9px] font-black uppercase border ${g.ativo ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${g.ativo ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                            {g.ativo ? 'Ativo' : 'Inativo'}
                         </div>
                      </td>
                      <td className="px-8 py-5 text-right relative">
                         <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => setMenuAberto(menuAberto === g.id ? null : g.id)}
                              className="p-3 text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-slate-100 transition-all"
                            >
                              <MoreHorizontal size={20} />
                            </button>
                            
                            {menuAberto === g.id && (
                              <div className="absolute right-8 top-16 w-56 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
                                 <button 
                                   onClick={() => { setModalTransferir({ aberto: true, gestor: g }); setMenuAberto(null); }}
                                   className="w-full px-5 py-4 text-left text-[11px] font-black uppercase text-slate-600 hover:bg-slate-50 flex items-center gap-3"
                                 >
                                    <ArrowRightLeft size={16} className="text-blue-500"/> Transferir Escola
                                 </button>
                                 <button 
                                   onClick={() => { setModalConfirma({ aberto: true, tipo: 'reset', gestor: g }); setMenuAberto(null); }}
                                   className="w-full px-5 py-4 text-left text-[11px] font-black uppercase text-slate-600 hover:bg-slate-50 flex items-center gap-3"
                                 >
                                    <KeyRound size={16} className="text-amber-500"/> Resetar Senha
                                 </button>
                                 <button 
                                   onClick={() => { setModalConfirma({ aberto: true, tipo: 'exonerar', gestor: g }); setMenuAberto(null); }}
                                   className="w-full px-5 py-4 text-left text-[11px] font-black uppercase text-rose-600 hover:bg-rose-50 flex items-center gap-3"
                                 >
                                    <UserX size={16} /> Exonerar / Inativar
                                 </button>
                                 <div className="h-px bg-slate-100" />
                                 <button 
                                   onClick={() => { setModalConfirma({ aberto: true, tipo: 'excluir', gestor: g }); setMenuAberto(null); }}
                                   className="w-full px-5 py-4 text-left text-[11px] font-black uppercase text-rose-700 bg-rose-50/50 hover:bg-rose-100 flex items-center gap-3"
                                 >
                                    <Trash2 size={16} /> Excluir Registro
                                 </button>
                              </div>
                            )}
                         </div>
                      </td>
                   </tr>
                 ))}

                 {gestores.length === 0 && (
                   <tr>
                     <td colSpan={4} className="py-20 text-center text-slate-400 text-xs font-black uppercase tracking-widest">Nenhum gestor encontrado na base global</td>
                   </tr>
                 )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ModalTransferirGestor 
        aberto={modalTransferir.aberto}
        onClose={() => setModalTransferir({ aberto: false, gestor: null })}
        onConfirmar={(unidId, nomeUnid) => transferirGestor(modalTransferir.gestor.id, unidId, nomeUnid)}
        gestorNome={modalTransferir.gestor?.nome || ''}
        unidadeAtualId={modalTransferir.gestor?.unidade_id}
      />

      <ModalConfirmacao 
        aberto={modalConfirma.aberto}
        tipo={modalConfirma.tipo === 'excluir' ? 'excluir' : 'arquivar'}
        titulo={
          modalConfirma.tipo === 'exonerar' ? 'Confirmar Exoneração' :
          modalConfirma.tipo === 'reset' ? 'Confirmar Reset de Senha' : 'Excluir Gestor'
        }
        itemNome={modalConfirma.gestor?.nome || ''}
        onConfirmar={handleAcao}
        onFechar={() => setModalConfirma({ ...modalConfirma, aberto: false })}
      />
    </div>
  );
};

export default GestoresMasterPage;
