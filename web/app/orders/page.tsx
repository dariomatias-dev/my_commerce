"use client";

import { OrdersDashboard } from "@/components/orders-dashboard";
import { useOrder } from "@/services/hooks/use-order";

const OrdersPage = () => {
  const { getMyOrders } = useOrder();

  return (
    <OrdersDashboard
      fetchFn={getMyOrders}
      backHref="/"
      emptyDescription="Você ainda não realizou nenhuma compra em nossa plataforma."
    />
  );
};

export default OrdersPage;
