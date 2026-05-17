import Link from "next/link";

import { AlertCircle, RefreshCcw } from "lucide-react";

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

      <h2 className="text-4xl font-black tracking-tighter text-slate-950 uppercase italic">
        {title} <span className="text-red-500">{highlightedTitle}.</span>
      </h2>

      {errorMessage && (
        <p className="mx-auto mt-4 max-w-xs text-sm font-medium text-slate-500">{errorMessage}</p>
      )}

      <div className="mt-10 flex flex-col gap-4">
        <button
          onClick={onRetry}
          className="flex items-center justify-center gap-3 rounded-2xl bg-slate-950 px-10 py-5 text-[10px] font-black tracking-widest text-white uppercase transition-all hover:bg-indigo-600 active:scale-95"
        >
          <RefreshCcw size={16} /> REESTABELECER CONEXÃO
        </button>

        <Link
          href={backPath}
          className="text-[10px] font-black tracking-widest text-slate-400 uppercase transition-colors hover:text-slate-600"
        >
          {backLabel}
        </Link>
      </div>
    </main>
  );
};
