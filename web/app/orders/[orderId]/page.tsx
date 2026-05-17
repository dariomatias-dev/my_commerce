"use client";

import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import { OrderDetailsResponse } from "@/@types/order/order-details-response";
import { ProductResponse } from "@/@types/product/product-response";
import { ErrorFeedback } from "@/components/error-feedback";
import { LoadingIndicator } from "@/components/loading-indicator";
import { OrderDetailsFinancialSummary } from "@/components/orders/[orderId]/order-details-financial-summary";
import { OrderDetailsLogisticsInfo } from "@/components/orders/[orderId]/order-details-logistics-info";
import { OrderDetailsPageHeader } from "@/components/orders/[orderId]/order-details-page-header";
import { OrderDetailsPaymentInfo } from "@/components/orders/[orderId]/order-details-payment-info";
import { OrderDetailsProducts } from "@/components/orders/[orderId]/order-details-products";
import { OrderDetailsStoreInfo } from "@/components/orders/[orderId]/order-details-store-info";
import { FreightType } from "@/enums/freight-type";
import { getOrderById } from "@/services/orders";
import { getProductsByIds } from "@/services/products";

const OrderDetailsPage = () => {
  const router = useRouter();
  const { orderId } = useParams() as { orderId: string };

  const [order, setOrder] = useState<OrderDetailsResponse | null>(null);
  const [products, setProducts] = useState<Record<string, ProductResponse>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function fetchOrderDetail() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const orderResponse = await getOrderById(orderId);

        if (ignore) return;

        setOrder(orderResponse);

        if (orderResponse.items && orderResponse.items.length > 0) {
          const productIds = orderResponse.items.map((item) => item.productId);
          const productsResponse = await getProductsByIds(orderResponse.store.id, productIds);
          const productsMap = (productsResponse.content || []).reduce(
            (acc, product) => {
              acc[product.id] = product;
              return acc;
            },
            {} as Record<string, ProductResponse>,
          );

          if (!ignore) setProducts(productsMap);
        }
      } catch {
        if (!ignore) setErrorMessage("Não foi possível carregar os detalhes do pedido.");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    fetchOrderDetail();

    return () => {
      ignore = true;
    };
  }, [orderId, refreshKey]);

  if (isLoading) {
    return <LoadingIndicator message="Sincronizando detalhes do pedido..." />;
  }

  if (errorMessage || !order) {
    return (
      <ErrorFeedback
        title="Pedido"
        highlightedTitle="Indisponível"
        errorMessage={errorMessage}
        onRetry={() => setRefreshKey((k) => k + 1)}
        backPath="/dashboard/orders"
        backLabel="VOLTAR PARA PEDIDOS"
      />
    );
  }

  const subtotal = order.totalAmount - order.freightAmount;
  const freightLabel = order.freightType === FreightType.ECONOMICAL ? "Econômico" : "Expresso";

  return (
    <>
      <div className="mx-auto max-w-400 px-6">
        <OrderDetailsPageHeader order={order} onBack={() => router.back()} />

        <div className="animate-in fade-in slide-in-from-bottom-6 grid grid-cols-1 gap-10 duration-1000 lg:grid-cols-12">
          <div className="space-y-10 lg:col-span-8">
            <OrderDetailsProducts items={order.items} products={products} />

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <OrderDetailsLogisticsInfo type={order.freightType} address={order.orderAddress} />

              <OrderDetailsPaymentInfo method={order.paymentMethod} />
            </div>
          </div>

          <aside className="space-y-8 lg:col-span-4">
            <div className="sticky top-40 space-y-8">
              <OrderDetailsStoreInfo store={order.store} />

              <OrderDetailsFinancialSummary
                subtotal={subtotal}
                freight={order.freightAmount}
                total={order.totalAmount}
                freightType={freightLabel}
              />

              <div className="rounded-[2rem] bg-indigo-50/50 p-6 text-center">
                <p className="text-[10px] leading-relaxed font-bold text-indigo-600/70 uppercase">
                  Acompanhe o status do pedido para <br /> atualizações de logística.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
};

export default OrderDetailsPage;
