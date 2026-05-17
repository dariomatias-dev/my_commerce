import { ReactNode } from "react";

import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

interface LoadingIndicatorProps {
  message?: string;
  icon?: ReactNode;
  className?: string;
}

export const LoadingIndicator = ({
  message = "Carregando...",
  icon,
  className,
}: LoadingIndicatorProps) => (
  <div className={cn("flex min-h-screen flex-col items-center justify-center gap-8", className)}>
    {icon || <Loader2 className="h-14 w-14 animate-spin text-indigo-600" />}

    <p className="animate-pulse text-sm font-black tracking-[0.5em] text-slate-400 uppercase">
      {message}
    </p>
  </div>
);
