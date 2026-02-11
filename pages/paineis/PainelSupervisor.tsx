import React from 'react';
import { Link } from 'react-router-dom';
import DashboardPedagogo from '../DashboardPedagogo';

const PainelSupervisor: React.FC = () => (
  <div className="space-y-6">
    <div className="bg-violet-50 border border-violet-200 p-4 rounded-2xl flex items-center justify-between">
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-violet-600">Supervisão Pedagógica</p>
        <h3 className="text-lg font-black text-slate-900">Acesso rápido à Grade de Horários</h3>
      </div>
      <Link to="/painel/supervisao/grade-de-horarios" className="bg-violet-600 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest">Abrir grade</Link>
    </div>
    <DashboardPedagogo />
  </div>
);

export default PainelSupervisor;
