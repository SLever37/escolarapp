
import React, { useState, useEffect } from 'react';
import { 
  Building2, Users, Plus, Globe, 
  Search, MoreVertical, CheckCircle2, 
  ExternalLink, Activity, Database, Zap, X, Trash2, Archive, KeyRound, Mail, User
} from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { UnidadeEscolar } from '../../tipos';

const DashboardMaster = () => {
  const [unidades, setUnidades] = useState<UnidadeEscolar[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [novaUnidade, setNovaUnidade] = useState({ 
    nome: '', 
    gestorNome: '', 
    gestorEmail: '', 
    gestorSenha: '' 
  });
  const [menuAtivo, setMenuAtivo] = useState<string | null>(null);

  const fetchUnidades = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('unidades')
      .select('*')
      .neq('status', 'arquivado')
      .order('nome');
    
    if (data) setUnidades(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUnidades();
  }, []);

  const handleAddUnidade = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Criar a Unidade no Supabase
    const { data: escolaCriada, error: erroEscola } = await supabase
      .from('unidades')
      .insert([{
        nome: novaUnidade.nome,
        gestor_nome: novaUnidade.gestorNome,
        status: 'ativo',
        alunos_count: 0,
        versao_core: '3.1.0'
      }])
      .select()
      .single();

    if (erroEscola) {
      alert("Erro ao criar escola: " + erroEscola.message);
      return;
    }

    // 2. Criar o Perfil do Gestor vinculado à escola criada
    const { error: erroUsuario } = await supabase
      .from('usuarios')
      .insert([{
        nome: novaUnidade.gestorNome,
        email: novaUnidade.gestorEmail,
        papel: 'gestor',
        unidade_id: escolaCriada.id,
        unidade: escolaCriada.nome,
        nivel: 5,
        delegacoes: []
      }]);

    if (erroUsuario) {
      alert("Escola criada, mas erro ao vincular gestor: " + erroUsuario.message);
    } else {
      setModalAberto(false);
      setNovaUnidade({ nome: '', gestorNome: '', gestorEmail: '', gestorSenha: '' });
      fetchUnidades();
      alert("Sucesso: Escola provisionada e Gestor vinculado!");
    }
  };

  const excluirUnidade = async (id: string) => {
    if (!confirm("Confirmar exclusão definitiva da instância?")) return;
    const { error } = await supabase.from('unidades').delete().eq('id', id);
    if (error) alert(error.message);
    else fetchUnidades();
    setMenuAtivo(null);
  };

  const arquivarUnidade = async (id: string) => {
    const { error } = await supabase.from('unidades').update({ status: 'arquivado' }).eq('id', id);
    if (error) alert(error.message);
    else fetchUnidades();
    setMenuAtivo(null);
  };

  const abrirEscola = (unidade: UnidadeEscolar) => {
    alert(`Carregando ambiente administrativo de: ${unidade.nome}...`);
  };

  return (
    <div className="p-6 md:p-10 space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 mb-2">
            <Globe size={24} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Master Core Engine</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">Gestão de Escolas</h2>
          <p className="text-slate-500 text-sm mt-2 font-medium">Provisionamento de rede e vinculação de gestores municipais.</p>
        </div>
        <button 
          onClick={() => setModalAberto(true)}
          className="bg-blue-600 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-blue-700 transition-all flex items-center gap-2 active:scale-95"
        >
          <Plus size={18} /> Adicionar Escola
        </button>
      </header>

      {/* Grid de KPIs da Rede */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPICardMaster label="Escolas Ativas" valor={unidades.length} icone={<Building2 />} cor="indigo" status="OK" />
        <KPICardMaster label="Alunos em Rede" valor="4.8k" icone={<Users />} cor="blue" status="+12%" />
        <KPICardMaster label="Uptime Core" valor="99.9%" icone={<Activity />} cor="emerald" status="ONLINE" />
        <KPICardMaster label="Snapshot DB" valor="Safe" icone={<Database />} cor="blue" status="HOJE" />
      </div>

      <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm relative">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter leading-none">Unidades sob Supervisão</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
              type="text" 
              placeholder="Filtrar rede municipal..." 
              className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none w-64 text-slate-800" 
            />
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center animate-pulse text-slate-400 text-xs font-black uppercase tracking-widest">Sincronizando Rede...</div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {unidades.map((u) => (
              <div key={u.id} className="p-6 bg-slate-50 border border-slate-100 rounded-[2.5rem] flex flex-col lg:flex-row lg:items-center justify-between group hover:bg-white hover:shadow-xl transition-all gap-4">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-3xl bg-white text-indigo-600 flex items-center justify-center shadow-sm border border-slate-100">
                    <Database size={28} />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-slate-800 leading-none">{u.nome}</h4>
                    <div className="flex items-center gap-4 mt-3">
                       <span className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1.5"><Users size={12}/> {u.gestor_nome}</span>
                       <span className="text-[10px] font-bold text-blue-500 uppercase bg-blue-50 px-2 py-0.5 rounded">Core {u.versao_core}</span>
                       <span className="text-[11px] font-bold text-slate-400 uppercase">{u.alunos_count} Alunos</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 relative">
                   <span className="bg-emerald-50 text-emerald-600 px-5 py-2 rounded-2xl text-[10px] font-black border border-emerald-100 flex items-center gap-2">
                     <CheckCircle2 size={12} /> ATIVA
                   </span>
                   <button 
                    onClick={() => abrirEscola(u)}
                    className="p-4 text-slate-400 hover:text-blue-600 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-90"
                   >
                      <ExternalLink size={20} />
                   </button>
                   <div className="relative">
                      <button 
                        onClick={() => setMenuAtivo(menuAtivo === u.id ? null : u.id)}
                        className="p-4 text-slate-400 hover:text-slate-600"
                      >
                        <MoreVertical size={20} />
                      </button>
                      
                      {menuAtivo === u.id && (
                        <div className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-bottom-2">
                           <button onClick={() => arquivarUnidade(u.id)} className="w-full flex items-center gap-3 p-3 text-[10px] font-black uppercase text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
                             <Archive size={14} className="text-blue-500" /> Arquivar Unidade
                           </button>
                           <button onClick={() => excluirUnidade(u.id)} className="w-full flex items-center gap-3 p-3 text-[10px] font-black uppercase text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
                             <Trash2 size={14} className="text-rose-500" /> Excluir Unidade
                           </button>
                        </div>
                      )}
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Adicionar Escola + Gestor */}
      {modalAberto && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black uppercase tracking-tighter leading-none">Adicionar Escola e Gestor</h3>
                <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mt-2">Provisionamento de nova instância core municipal</p>
              </div>
              <button onClick={() => setModalAberto(false)} className="text-slate-400 hover:text-white"><X size={24}/></button>
            </div>
            
            <form onSubmit={handleAddUnidade} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-5">
                <h4 className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
                  <Building2 size={16} /> Dados da Unidade
                </h4>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Nome da Instituição</label>
                  <input 
                    required 
                    placeholder="Ex: E.M. Machado de Assis"
                    className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800 font-bold" 
                    value={novaUnidade.nome} 
                    onChange={e => setNovaUnidade({...novaUnidade, nome: e.target.value})} 
                  />
                </div>
              </div>

              <div className="space-y-5">
                <h4 className="text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                  <User size={16} /> Dados do Gestor
                </h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Nome Completo</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                      <input 
                        required 
                        placeholder="Nome do Diretor"
                        className="w-full bg-slate-50 border border-slate-100 pl-12 pr-4 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800 font-bold" 
                        value={novaUnidade.gestorNome} 
                        onChange={e => setNovaUnidade({...novaUnidade, gestorNome: e.target.value})} 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2">E-mail Institucional</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                      <input 
                        required 
                        type="email"
                        placeholder="direcao@escolar.app"
                        className="w-full bg-slate-50 border border-slate-100 pl-12 pr-4 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800 font-bold" 
                        value={novaUnidade.gestorEmail} 
                        onChange={e => setNovaUnidade({...novaUnidade, gestorEmail: e.target.value})} 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Senha de Acesso</label>
                    <div className="relative">
                      <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                      <input 
                        required 
                        type="password"
                        placeholder="••••••••"
                        className="w-full bg-slate-50 border border-slate-100 pl-12 pr-4 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800 font-bold" 
                        value={novaUnidade.gestorSenha} 
                        onChange={e => setNovaUnidade({...novaUnidade, gestorSenha: e.target.value})} 
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 pt-4">
                <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl hover:bg-blue-700 transition-all active:scale-[0.98]">
                  Confirmar Cadastro e Vincular Gestor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const KPICardMaster = ({ label, valor, icone, cor, status }: any) => (
  <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col justify-between h-40">
    <div className="flex items-center justify-between">
      <div className={`p-3 rounded-2xl ${cor === 'indigo' ? 'bg-indigo-50 text-indigo-600' : cor === 'emerald' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
         {React.cloneElement(icone, { size: 20 })}
      </div>
      <span className="text-[9px] font-black text-slate-400 border px-2 py-1 rounded-lg uppercase tracking-tighter">{status}</span>
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
      <p className="text-3xl font-black text-slate-900 tracking-tighter">{valor}</p>
    </div>
  </div>
);

export default DashboardMaster;
