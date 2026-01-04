"use client";

import { Loader2 } from "lucide-react";

export const CategoriesDashboardLoading = () => (
  <div className="flex min-h-100 flex-col items-center justify-center gap-4">
    <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />

    <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
      Mapeando Estrutura...
    </p>
  </div>
);
