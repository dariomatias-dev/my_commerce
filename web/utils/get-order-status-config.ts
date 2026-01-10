import { Status } from "@/enums/status";

const configs: Record<
  Status,
  { label: string; color: string; bg: string; dot: string }
> = {
  [Status.PENDING]: {
    label: "Pendente",
    color: "text-amber-600",
    bg: "bg-amber-50",
    dot: "bg-amber-600",
  },
  [Status.CONFIRMED]: {
    label: "Confirmado",
    color: "text-blue-600",
    bg: "bg-blue-50",
    dot: "bg-blue-600",
  },
  [Status.PROCESSING]: {
    label: "Processando",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    dot: "bg-indigo-600",
  },
  [Status.COMPLETED]: {
    label: "Concluído",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    dot: "bg-emerald-600",
  },
  [Status.CANCELED]: {
    label: "Cancelado",
    color: "text-red-500",
    bg: "bg-red-50",
    dot: "bg-red-500",
  },
  [Status.FAILED]: {
    label: "Falhou",
    color: "text-rose-600",
    bg: "bg-rose-50",
    dot: "bg-rose-600",
  },
};

export const getOrderStatusConfig = (status: Status) => {
  return (
    configs[status] || {
      label: "Desconhecido",
      color: "text-slate-600",
      bg: "bg-slate-50",
      dot: "bg-slate-600",
    }
  );
};
