import { Status } from "@/enums/status";
import { getOrderStatusConfig } from "@/utils/get-order-status-config";

interface OrderDetailsPageHeaderStatusBadgeProps {
  status: Status;
}

export const OrderDetailsPageHeaderStatusBadge = ({
  status,
}: OrderDetailsPageHeaderStatusBadgeProps) => {
  const config = getOrderStatusConfig(status);

  return (
    <div
      className={`flex items-center gap-2 rounded-2xl ${config.bg} px-4 py-2 text-[10px] font-black uppercase tracking-widest ${config.color}`}
    >
      <div className={`h-2 w-2 rounded-full ${config.dot}`} />
      {config.label}
    </div>
  );
};
