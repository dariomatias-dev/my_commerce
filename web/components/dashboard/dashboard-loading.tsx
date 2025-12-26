import { Loader2 } from "lucide-react";

export const DashboardLoading = () => (
  <div className="flex min-h-100 flex-col items-center justify-center gap-8">
    <Loader2 className="h-14 w-14 animate-spin text-indigo-600" />

    <p className="text-[10px] font-black tracking-[0.5em] text-slate-400 uppercase">
      Obtendo lojas...
    </p>
  </div>
);
