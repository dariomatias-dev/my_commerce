import { AlertCircle, RefreshCw } from "lucide-react";

interface DashboardErrorProps {
  message: string;
  onRetry: () => void;
}

export const DashboardError = ({ message, onRetry }: DashboardErrorProps) => (
  <div className="flex min-h-100 flex-col items-center justify-center gap-8 rounded-[3rem] border border-red-100 bg-red-50/30 p-16 text-center">
    <AlertCircle size={64} className="text-red-500" />

    <div className="max-w-xl space-y-4">
      <h2 className="text-4xl font-black tracking-tighter text-slate-950 uppercase italic">
        Erro Crítico de Rede.
      </h2>
      <p className="text-lg font-medium text-slate-500 italic leading-relaxed">
        {message}
      </p>
    </div>

    <button
      onClick={onRetry}
      className="flex items-center gap-3 rounded-2xl bg-slate-950 px-10 py-5 text-xs font-black tracking-widest text-white uppercase transition-all hover:bg-indigo-600 shadow-xl"
    >
      <RefreshCw size={20} /> RECONECTAR PROTOCOLO
    </button>
  </div>
);
