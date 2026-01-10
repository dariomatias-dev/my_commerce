import { AlertCircle, RefreshCcw } from "lucide-react";
import Link from "next/link";

interface ErrorFeedbackProps {
  title: string;
  highlightedTitle: string;
  errorMessage?: string | null;
  onRetry: () => void;
  backPath: string;
  backLabel: string;
}

export const ErrorFeedback = ({
  title,
  highlightedTitle,
  errorMessage,
  onRetry,
  backPath,
  backLabel,
}: ErrorFeedbackProps) => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white p-6 text-center">
      <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-red-50 text-red-500 shadow-xl shadow-red-100">
        <AlertCircle size={48} />
      </div>

      <h2 className="text-4xl font-black uppercase italic tracking-tighter text-slate-950">
        {title} <span className="text-red-500">{highlightedTitle}.</span>
      </h2>

      {errorMessage && (
        <p className="mt-4 max-w-xs mx-auto text-sm text-slate-500 font-medium">
          {errorMessage}
        </p>
      )}

      <div className="mt-10 flex flex-col gap-4">
        <button
          onClick={onRetry}
          className="flex items-center justify-center gap-3 rounded-2xl bg-slate-950 px-10 py-5 text-[10px] font-black uppercase tracking-widest text-white hover:bg-indigo-600 transition-all active:scale-95"
        >
          <RefreshCcw size={16} /> REESTABELECER CONEXÃO
        </button>

        <Link
          href={backPath}
          className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
        >
          {backLabel}
        </Link>
      </div>
    </main>
  );
};
