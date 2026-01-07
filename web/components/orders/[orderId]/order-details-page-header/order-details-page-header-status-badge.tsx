import { Status } from "@/enums/status";

interface OrderDetailsPageHeaderStatusBadgeProps {
  status: Status;
}

export const OrderDetailsPageHeaderStatusBadge = ({
  status,
}: OrderDetailsPageHeaderStatusBadgeProps) => {
  const configs: Record<string, { label: string; color: string; bg: string }> =
    {
      PENDING: {
        label: "Aguardando Pagamento",
        color: "text-amber-600",
        bg: "bg-amber-50",
      },
      PAID: {
        label: "Pagamento Confirmado",
        color: "text-emerald-600",
        bg: "bg-emerald-50",
      },
      SHIPPED: {
        label: "Em Trânsito",
        color: "text-blue-600",
        bg: "bg-blue-50",
      },
      DELIVERED: {
        label: "Entregue",
        color: "text-indigo-600",
        bg: "bg-indigo-50",
      },
      CANCELED: { label: "Cancelado", color: "text-red-600", bg: "bg-red-50" },
    };

  const config = configs[status] || {
    label: status,
    color: "text-slate-600",
    bg: "bg-slate-50",
  };

  return (
    <div
      className={`flex items-center gap-2 rounded-2xl ${config.bg} px-4 py-2 text-[10px] font-black uppercase tracking-widest ${config.color}`}
    >
      <div
        className={`h-2 w-2 rounded-full ${config.color.replace("text", "bg")}`}
      />
      {config.label}
    </div>
  );
};
