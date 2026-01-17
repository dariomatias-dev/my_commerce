"use client";

import { AlertOctagon, AlertTriangle, Info, Loader2, X } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  variant?: "danger" | "warning" | "info";
}

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  isLoading = false,
  variant = "danger",
}: ConfirmDialogProps) => {
  if (!isOpen) return null;

  const config = {
    danger: {
      icon: AlertOctagon,
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-100",
      button: "bg-red-600 hover:bg-red-700 shadow-red-200",
    },
    warning: {
      icon: AlertTriangle,
      color: "text-orange-600",
      bg: "bg-orange-50",
      border: "border-orange-100",
      button: "bg-slate-950 hover:bg-indigo-600 shadow-slate-200",
    },
    info: {
      icon: Info,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      border: "border-indigo-100",
      button: "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200",
    },
  }[variant];

  const Icon = config.icon;

  return (
    <div className="fixed inset-0 z-300 flex items-center justify-center p-6">
      <div
        className="animate-in fade-in absolute inset-0 bg-slate-950/40 backdrop-blur-md transition-all"
        onClick={isLoading ? undefined : onClose}
      />

      <div className="animate-in zoom-in-95 fade-in slide-in-from-bottom-4 relative w-full max-w-lg overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-8 py-6">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${config.bg} ${config.color}`}
            >
              <Icon size={20} />
            </div>

            <h2 className="text-xl font-black tracking-tighter text-slate-950 uppercase italic">
              {title}
            </h2>
          </div>

          {!isLoading && (
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 hover:bg-slate-50 hover:text-slate-950 transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <div className="p-8 md:p-12">
          <p className="mb-10 text-center text-lg leading-relaxed font-medium text-slate-500 italic">
            {description}
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex w-full items-center justify-center gap-3 rounded-2xl py-4 text-xs font-black tracking-[0.2em] text-white uppercase transition-all shadow-lg active:scale-95 disabled:opacity-50 ${config.button}`}
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> PROCESSANDO...
                </>
              ) : (
                confirmText
              )}
            </button>

            {!isLoading && (
              <button
                onClick={onClose}
                className="w-full rounded-2xl border-2 border-slate-100 bg-transparent py-4 text-xs font-black tracking-[0.2em] text-slate-400 uppercase transition-all hover:bg-slate-50 hover:text-slate-600"
              >
                {cancelText}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
