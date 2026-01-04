import { AlertCircle, RefreshCw } from "lucide-react";

interface ProductDashboardErrorProps {
  message: string;
  onRetry: () => void;
}

export const ProductsDashboardError = ({
  message,
  onRetry,
}: ProductDashboardErrorProps) => (
  <div className="flex min-h-100 flex-col items-center justify-center gap-6 rounded-[3rem] border border-red-100 bg-red-50/30 p-12 text-center">
    <AlertCircle size={48} className="text-red-500" />

    <h2 className="text-xl font-black tracking-tighter text-slate-950 uppercase italic">
      Erro de Sincronização
    </h2>

    <p className="text-sm font-medium text-slate-500">{message}</p>

    <button
      onClick={onRetry}
      className="flex items-center gap-2 rounded-xl bg-slate-950 px-8 py-3 text-[10px] font-black tracking-widest text-white uppercase transition-all hover:bg-indigo-600"
    >
      <RefreshCw size={14} /> Tentar Novamente
    </button>
  </div>
);
