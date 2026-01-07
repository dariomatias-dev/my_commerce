"use client";

import { useParams } from "next/navigation";
import { useCallback } from "react";

import { OrdersDashboard } from "@/components/orders-dashboard";
import { useOrder } from "@/services/hooks/use-order";

const StoreOrdersPage = () => {
  const { storeId } = useParams() as { storeId: string };

  const { getMyOrdersByStore } = useOrder();

  const fetchOrders = useCallback(
    (page: number, size: number) => getMyOrdersByStore(storeId, page, size),
    [storeId, getMyOrdersByStore]
  );

  return (
    <OrdersDashboard
      fetchFn={fetchOrders}
      backHref="/orders"
      emptyDescription="Você ainda não tem pedidos vinculados a esta loja."
    />
  );
};

export default StoreOrdersPage;
