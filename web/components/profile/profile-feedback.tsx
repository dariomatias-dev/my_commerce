"use client";

import { CheckCircle2, ShieldAlert } from "lucide-react";

interface ProfileFeedbackProps {
  message: string;
  type: "success" | "error";
}

export const ProfileFeedback = ({ message, type }: ProfileFeedbackProps) => {
  return (
    <div
      className={`flex items-center gap-3 rounded-2xl p-4 animate-in fade-in zoom-in-95 ${
        type === "success"
          ? "bg-emerald-50 text-emerald-600"
          : "bg-red-50 text-red-600"
      }`}
    >
      {type === "success" ? (
        <CheckCircle2 size={20} />
      ) : (
        <ShieldAlert size={20} />
      )}

      <p className="text-xs font-black uppercase tracking-widest">{message}</p>
    </div>
  );
};
