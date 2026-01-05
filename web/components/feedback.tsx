import { AlertCircle, CheckCircle2 } from "lucide-react";
import React from "react";

import { cn } from "@/lib/utils";

interface FeedbackProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

export const Feedback: React.FC<FeedbackProps> = ({
  message,
  type,
  onClose,
}) => {
  const isSuccess = type === "success";

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl border p-4 transition-all animate-in fade-in slide-in-from-top-2",
        isSuccess
          ? "border-emerald-100 bg-emerald-50 text-emerald-600"
          : "border-red-100 bg-red-50 text-red-600"
      )}
    >
      {isSuccess ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
      <p className="text-[10px] font-black uppercase tracking-widest">
        {message}
      </p>
      <button
        onClick={onClose}
        className="ml-auto text-[10px] font-black uppercase opacity-50 hover:opacity-100"
      >
        Fechar
      </button>
    </div>
  );
};
