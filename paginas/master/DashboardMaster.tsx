
import React, { useState, useEffect } from 'react';
import { 
  Building2, Users, Plus, ShieldCheck, Globe, 
  Search, MoreVertical, CheckCircle2, 
  UserPlus, ExternalLink, Activity, Database, Server, Cpu, AlertTriangle, Zap, X
} from 'lucide-react';
import { supabase, estaConfigurado } from '../../supabaseClient';

const DashboardMaster = () => {
  const [unidades, setUnidades] = useState([
    { id: '1', nome: 'E.M. Presidente Vargas', gestor: 'Dr. Roberto Magalhães', status: 'ativo', alunos: 1240, versao: '2.4.1' },
    { id: '2', nome: 'C.E. Arco-Íris', gestor: 'Profa. Helena Souza', status: 'ativo', alunos: 210, versao: '2.4.1' },
  ]);
  
  const [modalAberto, setModalAberto] = useState(false);
  const [novaUnidade, setNovaUnidade] = useState({ nome: '', gestor: '', email: '', senha: '' });
  const [erroConexao, setErroConexao] = useState(!estaConfigurado);

  const handleAddUnidade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!estaConfigurado) {
      alert("Erro: Banco de dados não configurado.");
      return;
    }
    // Lógica de inserção no banco (Exemplo Supabase)
    const { data, error } = await supabase.from('unidades').insert([{
      nome: novaUnidade.nome,
      gestor_nome: novaUnidade.gestor,
      status: 'ativo'
    }]);

    if (error) {
      alert("Erro ao conectar ao banco: " + error.message);
    } else {
      setUnidades([...unidades, { ...novaUnidade, id: Math.random().toString(), status: 'ativo', alunos: 0, versao: '2.5.0' } as any]);
      setModalAberto(false);
      setNovaUnidade({ nome: '', gestor: '', email: '', senha: '' });
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-8 animate-in fade-in duration-700">
      {erroConexao && (
        <div className="bg-rose-500 text-white p-4 rounded-2xl flex items-center justify-between shadow-lg animate-bounce">
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} />
            <span className="text-xs font-bold uppercase tracking-widest">Atenção: Sistema operando em modo offline. Banco de dados não detectado.</span>
          </div>
        </div>
      )}

      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 mb-2">
            <Globe size={24} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Master Core Control</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Gestão de Escolas</h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">Controle centralizado da rede municipal, provisionamento e segurança de dados.</p>
        </div>
        <button 
          onClick={() => setModalAberto(true)}
          className="bg-blue-600 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2 active:scale-95"
        >
          <Plus size={18} /> Adicionar Nova Escola
        </button>
      </header>

      {/* IA AUTÔNOMA: Núcleo de Inteligência */}
      <div className="bg-slate-900 rounded-[3rem] p-8 text-white relative overflow-hidden shadow-2xl border border-white/5">
        <div className="absolute top-0 right-0 p-8 opacity-10"><Zap size={120} className="text-amber-400" /></div>
        <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-amber-400/20 p-2 rounded-xl"><Zap size={20} className="text-amber-400" /></div>
              <h3 className="text-sm font-black uppercase tracking-[0.2em]">IA Estratégica: Análise em Tempo Real</h3>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-amber-400 text-[10px] font-black uppercase mb-1">Dica de Otimização</p>
                <p className="text-sm text-slate-300 font-medium">A unidade "Presidente Vargas" apresenta um pico de tráfego incomum às 07:15. Sugiro escalar o proxy da IA para evitar latência nos diários de classe.</p>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-emerald-400 text-[10px] font-black uppercase mb-1">Mensagens & Notificações</p>
                <p className="text-sm text-slate-300 font-medium">O Gestor Roberto enviou uma solicitação de suporte técnico via Suporte Master. Backup da Unidade 02 concluído com 100% de integridade.</p>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-72 space-y-4">
            <div className="bg-indigo-600/20 p-6 rounded-[2rem] border border-indigo-500/30">
              <p className="text-[10px] font-black text-indigo-400 uppercase mb-2">Saúde Global</p>
              <div className="text-3xl font-black">98.4%</div>
              <p className="text-[9px] text-slate-400 mt-2">IA detectou estabilidade em 12 instâncias ativas.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPICardMaster label="Escolas Ativas" valor={unidades.length} icone={<Building2 />} cor="indigo" status="OK" />
        <KPICardMaster label="Usuários em Rede" valor="4.850" icone={<Users />} cor="blue" status="+12%" />
        <KPICardMaster label="Uptime Cluster" valor="99.99%" icone={<Cpu />} cor="emerald" status="ESTÁVEL" />
        <KPICardMaster label="Status Backups" valor="Seguro" icone={<Database />} cor="blue" status="SYNCED" />
      </div>

      <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Escolas sob Gestão</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
              type="text" 
              placeholder="Buscar por nome ou gestor..." 
              className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none w-64 text-slate-800" 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {unidades.map((u) => (
            <div key={u.id} className="p-6 bg-slate-50 border border-slate-100 rounded-[2.5rem] flex flex-col lg:flex-row lg:items-center justify-between group hover:bg-white hover:shadow-xl transition-all gap-4">
              <div className="flex items-center gap-6">
                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center shadow-sm border border-slate-100 ${u.status === 'provisionando' ? 'bg-amber-50 text-amber-500 animate-pulse' : 'bg-white text-indigo-600'}`}>
                  <Server size={28} />
                </div>
                <div>
                  <h4 className="text-xl font-black text-slate-800 leading-none">{u.nome}</h4>
                  <div className="flex items-center gap-4 mt-3">
                     <span className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1.5"><Users size={12}/> {u.gestor}</span>
                     <span className="text-[10px] font-bold text-blue-500 uppercase bg-blue-50 px-2 py-0.5 rounded">Core {u.versao}</span>
                     <span className="text-[11px] font-bold text-slate-400 uppercase">{u.alunos} Alunos</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 border-t lg:border-t-0 pt-4 lg:pt-0">
                 <span className="bg-emerald-50 text-emerald-600 px-5 py-2 rounded-2xl text-[10px] font-black border border-emerald-100 flex items-center gap-2">
                   <CheckCircle2 size={12} /> ATIVA
                 </span>
                 <button className="p-4 text-slate-400 hover:text-blue-600 hover:bg-white rounded-2xl shadow-sm border border-transparent hover:border-slate-100 transition-all"><ExternalLink size={20} /></button>
                 <button className="p-4 text-slate-400 hover:text-slate-600"><MoreVertical size={20} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Adicionar Escola */}
      {modalAberto && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-xl font-black uppercase tracking-tighter">Cadastrar Nova Escola</h3>
              <button onClick={() => setModalAberto(false)} className="text-slate-400 hover:text-white"><X size={24}/></button>
            </div>
            <form onSubmit={handleAddUnidade} className="p-8 space-y-5 text-slate-800">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Nome da Unidade Escolar</label>
                <input 
                  required
                  placeholder="Ex: E.M. Machado de Assis"
                  className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800 font-bold"
                  value={novaUnidade.nome}
                  onChange={e => setNovaUnidade({...novaUnidade, nome: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Gestor Responsável</label>
                  <input 
                    required
                    placeholder="Nome completo"
                    className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800 font-bold"
                    value={novaUnidade.gestor}
                    onChange={e => setNovaUnidade({...novaUnidade, gestor: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">E-mail Institucional</label>
                  <input 
                    required
                    type="email"
                    placeholder="gestor@escola.gov.br"
                    className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800 font-bold"
                    value={novaUnidade.email}
                    onChange={e => setNovaUnidade({...novaUnidade, email: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Senha de Acesso Mestre</label>
                <input 
                  required
                  type="password"
                  placeholder="Defina uma senha segura"
                  className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800 font-bold"
                  value={novaUnidade.senha}
                  onChange={e => setNovaUnidade({...novaUnidade, senha: e.target.value})}
                />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all mt-4">
                Finalizar Provisionamento
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const KPICardMaster = ({ label, valor, icone, cor, status }: any) => (
  <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col justify-between h-40">
    <div className="flex items-center justify-between mb-2">
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
