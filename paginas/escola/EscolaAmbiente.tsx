import React from "react";
import { useParams } from "react-router-dom";

export default function EscolaAmbiente() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="p-6 md:p-10 animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Ambiente da Escola</h1>
        <p className="mt-2 text-slate-500 text-sm font-medium">
          Dashboard operacional da instância: <span className="font-mono text-blue-600 font-bold">{id}</span>
        </p>
        
        <div className="mt-10 p-20 border-4 border-dashed border-slate-100 rounded-lg flex items-center justify-center">
           <p className="text-slate-300 font-black uppercase tracking-[0.2em]">Módulos da Unidade em Carregamento...</p>
        </div>
      </div>
    </div>
  );
}