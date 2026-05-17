"use client";

import { useEffect, useState } from "react";

import { AlertTriangle, X } from "lucide-react";

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  description: string;
  confirmationName: string;
  isLoading?: boolean;
}

export const DeleteConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmationName,
  isLoading,
}: DeleteConfirmationDialogProps) => {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const clearInput = () => {
      setInputValue("");
    };

    if (!isOpen) {
      clearInput();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isMatch = inputValue === confirmationName;

  const handleConfirm = async () => {
    if (isMatch && !isLoading) {
      await onConfirm();
      onClose();
    }
  };

  return (
    <div className="animate-in fade-in fixed inset-0 z-100 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm duration-200">
      <div className="animate-in zoom-in-95 w-full max-w-md rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-2xl duration-200">
        <div className="mb-6 flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <AlertTriangle size={24} />
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-8 space-y-2">
          <h3 className="text-xl font-black tracking-tight text-slate-950 uppercase italic">
            {title}
          </h3>
          <p className="text-sm leading-relaxed font-medium text-slate-500">{description}</p>
        </div>

        <div className="mb-8 space-y-4">
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <p className="mb-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Digite o nome para confirmar:
            </p>

            <p className="text-xs font-bold text-slate-900 select-none">{confirmationName}</p>
          </div>

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Escreva o nome exatamente como acima"
            className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-bold text-slate-950 transition-all outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/5"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="rounded-2xl px-6 py-4 text-[10px] font-black tracking-widest text-slate-400 uppercase transition-colors hover:bg-slate-50 disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            onClick={handleConfirm}
            disabled={!isMatch || isLoading}
            className="rounded-2xl bg-red-600 px-6 py-4 text-[10px] font-black tracking-widest text-white uppercase shadow-lg shadow-red-600/20 transition-all hover:bg-red-700 active:scale-95 disabled:opacity-50 disabled:grayscale disabled:active:scale-100"
          >
            {isLoading ? "REMOVENDO..." : "REMOVER AGORA"}
          </button>
        </div>
      </div>
    </div>
  );
};
