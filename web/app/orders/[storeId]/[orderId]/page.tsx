"use client";

import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  CreditCard,
  Hash,
  Loader2,
  Package,
  Receipt,
  RefreshCcw,
  ShoppingBag,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/@types/api";
import { OrderWithItemsResponse } from "@/@types/order/order-with-items-response";
import { ProductResponse } from "@/@types/product/product-response";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { useOrder } from "@/services/hooks/use-order";
import { useProduct } from "@/services/hooks/use-product";

const OrderDetailPage = () => {
  const router = useRouter();

  const { storeId } = useParams() as { storeId: string };
  const { orderId } = useParams() as { orderId: string };

  const { getOrderById } = useOrder();
  const { getProductsByIds } = useProduct();

  const [order, setOrder] = useState<OrderWithItemsResponse | null>(null);
  const [products, setProducts] = useState<Record<string, ProductResponse>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchOrderDetail = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const orderResponse = (await getOrderById(
        orderId,
        "items"
      )) as OrderWithItemsResponse;
      setOrder(orderResponse);

      if (orderResponse.items && orderResponse.items.length > 0) {
        const productIds = orderResponse.items.map((item) => item.productId);

        const productsResponse = await getProductsByIds(storeId, productIds);
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
  }, [orderId, storeId, getOrderById, getProductsByIds]);

  useEffect(() => {
    fetchOrderDetail();
  }, [fetchOrderDetail]);

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="flex min-h-[70vh] flex-col items-center justify-center bg-white">
          <div className="relative flex items-center justify-center">
            <div className="absolute h-20 w-20 animate-ping rounded-full bg-indigo-50" />
            <Loader2 className="relative h-10 w-10 animate-spin text-indigo-600" />
          </div>
          <p className="mt-8 text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">
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
        <main className="flex min-h-[70vh] flex-col items-center justify-center bg-white p-6 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-red-50 text-red-500 shadow-xl shadow-red-100">
            <AlertCircle size={40} />
          </div>
          <h2 className="text-3xl font-black uppercase italic tracking-tighter text-slate-950">
            Erro ao <span className="text-red-500">Localizar Pedido</span>
          </h2>
          <button
            onClick={fetchOrderDetail}
            className="mt-8 flex items-center gap-2 rounded-2xl bg-slate-950 px-10 py-5 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-indigo-600"
          >
            <RefreshCcw size={16} />
            Tentar Novamente
          </button>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="grow bg-[#FBFBFC] pb-40 pt-35">
        <div className="mx-auto max-w-5xl px-6">
          <button
            onClick={() => router.back()}
            className="group mb-12 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 transition-colors hover:text-indigo-600"
          >
            <ArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-1"
            />
            Voltar ao Histórico
          </button>

          <div className="mb-12 flex flex-col items-start justify-between gap-8 border-b border-slate-100 pb-12 lg:flex-row lg:items-end">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-100">
                  <Package size={24} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">
                    Resumo do Pedido
                  </span>
                  <div className="flex items-center gap-2">
                    <Hash size={18} className="text-slate-300" />
                    <h1 className="text-4xl font-black uppercase italic tracking-tighter text-slate-950">
                      Pedido{" "}
                      <span className="text-indigo-600">
                        #{order.id.split("-")[0]}
                      </span>
                    </h1>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2 rounded-full bg-white border border-slate-100 px-4 py-2 shadow-sm">
                  <Calendar size={14} className="text-indigo-600" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                    {new Date(order.createdAt).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
                    Status: {order.status || "Concluído"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-3xl bg-slate-950 p-6 text-white shadow-2xl shadow-slate-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white">
                <Receipt size={24} />
              </div>
              <div className="pr-4">
                <p className="text-[9px] font-black uppercase tracking-widest text-white/50">
                  Total da Compra
                </p>
                <p className="text-3xl font-black tracking-tighter">
                  {order.totalAmount.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 md:p-10 shadow-sm">
                <div className="mb-10 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-950">
                    <ShoppingBag size={20} />
                  </div>
                  <h2 className="text-xl font-black uppercase italic tracking-tighter text-slate-950">
                    Produtos <span className="text-indigo-600">Adquiridos</span>
                  </h2>
                </div>

                <div className="flex flex-col gap-8">
                  {order.items.map((item) => {
                    const product = products[item.productId];
                    return (
                      <div
                        key={item.id}
                        className="flex items-center justify-between border-b border-slate-50 pb-8 last:border-0 last:pb-0"
                      >
                        <div className="flex items-center gap-6">
                          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-slate-50 border-2 border-slate-100">
                            {product?.images?.[0]?.url ? (
                              <Image
                                src={`${process.env.NEXT_PUBLIC_API_URL}/files/stores/${product.images[0].url}`}
                                alt={product.name}
                                unoptimized
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-slate-300">
                                <Package size={32} />
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[9px] font-black uppercase tracking-widest text-indigo-600 mb-1">
                              ID: {item.productId.split("-")[0]}
                            </span>
                            <h3 className="text-base font-black uppercase italic tracking-tighter text-slate-950 leading-tight">
                              {product?.name || "Carregando..."}
                            </h3>
                            <span className="mt-2 text-xs font-bold text-slate-400">
                              Qtd: {item.quantity} x{" "}
                              {item.price.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              })}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-300 mb-1">
                            Subtotal
                          </p>
                          <span className="text-xl font-black text-slate-950">
                            {(item.quantity * item.price).toLocaleString(
                              "pt-BR",
                              {
                                style: "currency",
                                currency: "BRL",
                              }
                            )}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="sticky top-40 rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm">
                <div className="mb-8 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-950">
                    <CreditCard size={20} />
                  </div>
                  <h2 className="text-xl font-black uppercase italic tracking-tighter text-slate-950">
                    Checkout Info
                  </h2>
                </div>

                <div className="flex flex-col gap-5">
                  <div className="flex justify-between border-b border-slate-50 pb-5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Subtotal
                    </span>
                    <span className="text-xs font-black text-slate-950">
                      {order.totalAmount.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-slate-50 pb-5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Entrega
                    </span>
                    <span className="text-xs font-black text-emerald-500 italic uppercase">
                      Livre
                    </span>
                  </div>

                  <div className="mt-4 flex flex-col gap-2 rounded-3xl bg-slate-50 p-6">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                      Total Consolidado
                    </span>
                    <span className="text-4xl font-black tracking-tighter text-indigo-600">
                      {order.totalAmount.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </span>
                  </div>
                </div>

                <div className="mt-8 rounded-2xl bg-indigo-50/30 p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle size={14} className="text-indigo-600" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600">
                      Importante
                    </p>
                  </div>
                  <p className="text-[11px] font-bold text-slate-500 leading-relaxed uppercase">
                    Os valores exibidos refletem o custo unitário dos produtos
                    na data da transação.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default OrderDetailPage;
