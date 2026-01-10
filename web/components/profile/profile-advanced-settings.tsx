"use client";

import { AlertTriangle, Trash2 } from "lucide-react";

export const ProfileAdvancedSettings = () => {
  const handleDelete = () => {};

  return (
    <section className="rounded-[2.5rem] border border-red-100 bg-red-50/30 p-8 md:p-12">
      <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <div className="flex items-center gap-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-red-600 shadow-sm border border-red-100">
            <Trash2 size={28} />
          </div>

          <div>
            <div className="mb-1 flex items-center gap-2">
              <AlertTriangle size={12} className="text-red-500" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-red-500">
                Ação Irreversível
              </span>
            </div>

            <h2 className="text-2xl font-black tracking-tighter text-slate-950 uppercase italic">
              Encerrar <span className="text-red-600">Conta.</span>
            </h2>

            <p className="mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed max-w-sm">
              Ao confirmar, todos os seus dados e históricos serão removidos
              permanentemente de nossos servidores.
            </p>
          </div>
        </div>

        <button
          onClick={handleDelete}
          className="group flex items-center gap-3 rounded-xl border-2 border-red-600 px-8 py-4 text-[10px] font-black tracking-widest text-red-600 uppercase transition-all hover:bg-red-600 hover:text-white active:scale-95"
        >
          <Trash2 size={16} />
          APAGAR MINHA CONTA
        </button>
      </div>
    </section>
  );
};
