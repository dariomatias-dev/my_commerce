"use client";

import { useParams } from "next/navigation";
import { useCallback } from "react";

import { OrdersDashboard } from "@/components/orders-dashboard";
import { getMyOrdersByStore } from "@/services/orders";

const StoreOrdersPage = () => {
  const { storeId } = useParams() as { storeId: string };

  const fetchOrders = useCallback(
    (page: number, size: number) => getMyOrdersByStore(storeId, page, size),
    [storeId]
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
