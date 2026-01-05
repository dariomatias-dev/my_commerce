"use client";

import { Trash2 } from "lucide-react";

export const ProfileDangerZone = () => {
  const handleDelete = () => {};

  return (
    <section className="rounded-[2.5rem] border border-red-100 bg-red-50/30 p-8 md:p-12">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">
            <Trash2 size={24} />
          </div>

          <div>
            <h2 className="text-xl font-black tracking-tighter text-red-600 uppercase italic">
              Excluir Conta
            </h2>

            <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest">
              Esta ação é irreversível e apagará todas as suas lojas
            </p>
          </div>
        </div>

        <button
          onClick={handleDelete}
          className="rounded-xl border-2 border-red-600 px-8 py-3 text-[10px] font-black tracking-widest text-red-600 uppercase transition-all hover:bg-red-600 hover:text-white"
        >
          APAGAR MINHA CONTA
        </button>
      </div>
    </section>
  );
};
