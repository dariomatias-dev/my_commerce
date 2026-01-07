"use client";

import { AlertCircle, Loader2, RefreshCcw } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/@types/api";
import { OrderDetailsResponse } from "@/@types/order/order-details-response";
import { ProductResponse } from "@/@types/product/product-response";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { OrderDetailsFinancialSummary } from "@/components/orders/[orderId]/order-details-financial-summary";
import { OrderDetailsLogisticsInfo } from "@/components/orders/[orderId]/order-details-logistics-info";
import { OrderDetailsPageHeader } from "@/components/orders/[orderId]/order-details-page-header";
import { OrderDetailsPaymentInfo } from "@/components/orders/[orderId]/order-details-payment-info";
import { OrderDetailsProducts } from "@/components/orders/[orderId]/order-details-products";
import { FreightType } from "@/enums/freight-type";
import { useOrder } from "@/services/hooks/use-order";
import { useProduct } from "@/services/hooks/use-product";

const OrderDetailsPage = () => {
  const router = useRouter();

  const { orderId } = useParams() as { orderId: string };

  const { getOrderById } = useOrder();
  const { getProductsByIds } = useProduct();

  const [order, setOrder] = useState<OrderDetailsResponse | null>(null);
  const [products, setProducts] = useState<Record<string, ProductResponse>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchOrderDetail = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const orderResponse = await getOrderById(orderId);

      setOrder(orderResponse);

      if (orderResponse.items && orderResponse.items.length > 0) {
        const productIds = orderResponse.items.map((item) => item.productId);
        const productsResponse = await getProductsByIds(
          orderResponse.storeId,
          productIds
        );
        const productsMap = (productsResponse.content || []).reduce(
          (acc, product) => {
            acc[product.id] = product;
            return acc;
          },
          {} as Record<string, ProductResponse>
        );

        setProducts(productsMap);
      }
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Não foi possível carregar os detalhes do pedido.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [orderId, getOrderById, getProductsByIds]);

  useEffect(() => {
    fetchOrderDetail();
  }, [fetchOrderDetail]);

  if (isLoading) {
    return (
      <>
        <Header />

        <main className="flex min-h-[70vh] flex-col items-center justify-center bg-white">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />

          <p className="mt-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
            Sincronizando Dados
          </p>
        </main>

        <Footer />
      </>
    );
  }

  if (errorMessage || !order) {
    return (
      <>
        <Header />

        <main className="flex min-h-[70vh] flex-col items-center justify-center bg-white px-6 text-center">
          <AlertCircle size={40} className="text-red-500 mb-6" />

          <h2 className="text-3xl font-black uppercase italic tracking-tighter text-slate-950">
            Erro ao Carregar Pedido
          </h2>

          <button
            onClick={fetchOrderDetail}
            className="mt-8 flex items-center gap-3 rounded-2xl bg-slate-950 px-10 py-5 text-[10px] font-black uppercase tracking-widest text-white hover:bg-indigo-600 transition-all"
          >
            <RefreshCcw size={16} /> Tentar Novamente
          </button>
        </main>

        <Footer />
      </>
    );
  }

  const subtotal = order.totalAmount - order.freightAmount;
  const freightLabel =
    order.freightType === FreightType.ECONOMICAL ? "Econômico" : "Expresso";

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#F4F7FA] pb-40 pt-32">
        <div className="mx-auto max-w-400 px-6">
          <OrderDetailsPageHeader order={order} onBack={() => router.back()} />

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <div className="lg:col-span-8 space-y-10">
              <OrderDetailsProducts items={order.items} products={products} />

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <OrderDetailsLogisticsInfo
                  type={order.freightType}
                  address={order.orderAddress}
                />

                <OrderDetailsPaymentInfo method={order.paymentMethod} />
              </div>
            </div>

            <aside className="lg:col-span-4">
              <div className="sticky top-40 space-y-6">
                <OrderDetailsFinancialSummary
                  subtotal={subtotal}
                  freight={order.freightAmount}
                  total={order.totalAmount}
                  freightType={freightLabel}
                />

                <div className="rounded-[2rem] bg-indigo-50/50 p-6 text-center">
                  <p className="text-[10px] font-bold uppercase leading-relaxed text-indigo-600/70">
                    Acompanhe seu e-mail para <br /> atualizações de rastreio.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default OrderDetailsPage;
