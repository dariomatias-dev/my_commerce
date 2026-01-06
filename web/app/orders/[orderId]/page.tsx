"use client";

import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Clock,
  CreditCard,
  MapPin,
  Package,
  Receipt,
  RefreshCcw,
  ShieldCheck,
  ShoppingBag,
  Truck
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/@types/api";
import { OrderDetailsResponse } from "@/@types/order/order-details-response";
import { ProductResponse } from "@/@types/product/product-response";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { ProductImage } from "@/components/product-image";
import { FreightType } from "@/enums/freight-type";
import { PaymentMethod } from "@/enums/payment-method";
import { Status } from "@/enums/status";
import { useOrder } from "@/services/hooks/use-order";
import { useProduct } from "@/services/hooks/use-product";

const OrderDetailPage = () => {
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
      const orderResponse = (await getOrderById(orderId)) as OrderDetailsResponse;
      setOrder(orderResponse);

      if (orderResponse.items && orderResponse.items.length > 0) {
        const productIds = orderResponse.items.map((item) => item.productId);
        const productsResponse = await getProductsByIds(orderResponse.storeId, productIds);
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

  const getStatusConfig = (status: Status) => {
    const configs: Record<string, { label: string; color: string; bg: string }> = {
      PENDING: { label: "Aguardando Pagamento", color: "text-amber-600", bg: "bg-amber-50" },
      PAID: { label: "Pagamento Confirmado", color: "text-emerald-600", bg: "bg-emerald-50" },
      SHIPPED: { label: "Em Trânsito", color: "text-blue-600", bg: "bg-blue-50" },
      DELIVERED: { label: "Entregue com Sucesso", color: "text-indigo-600", bg: "bg-indigo-50" },
      CANCELED: { label: "Cancelado", color: "text-red-600", bg: "bg-red-50" },
    };
    return configs[status] || { label: status, color: "text-slate-600", bg: "bg-slate-50" };
  };

  const getPaymentLabel = (method: PaymentMethod) => {
    const labels: Record<string, string> = {
      CREDIT_CARD: "Cartão de Crédito",
      PIX: "Pagamento via Pix",
      BOLETO: "Boleto Bancário",
    };
    return labels[method] || method;
  };

  const getFreightLabel = (type: FreightType) => {
    if (type === FreightType.ECONOMICAL) return "Frete Econômico";
    if (type === FreightType.EXPRESS) return "Frete Expresso";
    return type;
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="flex min-h-[70vh] flex-col items-center justify-center bg-white">
          <div className="relative">
            <div className="h-24 w-24 animate-spin rounded-full border-b-2 border-t-2 border-indigo-600" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Package className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
          <p className="mt-8 text-xs font-bold uppercase tracking-widest text-slate-400">
            Carregando sua experiência...
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
        <main className="flex min-h-[70vh] flex-col items-center justify-center bg-white px-6">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-50 text-red-500">
            <AlertCircle size={48} />
          </div>
          <h2 className="mt-8 text-4xl font-black uppercase italic tracking-tighter text-slate-950">
            Ops! <span className="text-red-500">Pedido não encontrado</span>
          </h2>
          <button
            onClick={fetchOrderDetail}
            className="mt-8 flex items-center gap-3 rounded-full bg-slate-950 px-8 py-4 text-[11px] font-black uppercase tracking-widest text-white transition-all hover:scale-105"
          >
            <RefreshCcw size={18} />
            Tentar carregar novamente
          </button>
        </main>
        <Footer />
      </>
    );
  }

  const statusInfo = getStatusConfig(order.status);
  const subtotal = order.totalAmount - order.freightAmount;

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#F8F9FC] pb-40 pt-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-10 flex flex-wrap items-center justify-between gap-6">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors"
            >
              <ArrowLeft size={16} />
              Minhas Compras
            </button>

            <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-2">
              <Clock size={14} className="text-slate-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Atualizado em {new Date(order.updatedAt).toLocaleDateString("pt-BR")} às {new Date(order.updatedAt).toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          <section className="mb-12 overflow-hidden rounded-[3rem] bg-white border border-slate-100 shadow-2xl shadow-slate-200/50">
            <div className="flex flex-col lg:flex-row">
              <div className="flex flex-1 flex-col justify-center border-b border-slate-50 p-10 lg:border-b-0 lg:border-r">
                <div className="mb-6 flex items-center gap-4">
                  <div className={`rounded-2xl ${statusInfo.bg} px-4 py-2 text-[10px] font-black uppercase tracking-widest ${statusInfo.color} flex items-center gap-2`}>
                    <div className={`h-2 w-2 rounded-full ${statusInfo.color.replace('text', 'bg')}`} />
                    {statusInfo.label}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                    ID: {order.id}
                  </span>
                </div>

                <h1 className="text-5xl font-black uppercase italic tracking-tighter text-slate-950 lg:text-6xl">
                  Pedido <span className="text-indigo-600">#{order.id.split("-")[0]}</span>
                </h1>
                
                <div className="mt-8 flex flex-wrap gap-8">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Data da Compra</span>
                    <span className="text-sm font-bold text-slate-900">
                      {new Date(order.createdAt).toLocaleDateString("pt-BR", { day: '2-digit', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Quantidade</span>
                    <span className="text-sm font-bold text-slate-900">{order.itemsCount} {order.itemsCount === 1 ? 'Volume' : 'Volumes'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 p-10 text-white lg:w-80">
                <div className="flex h-full flex-col justify-between">
                  <div>
                    <Receipt className="mb-4 text-indigo-400" size={32} />
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Total Consolidado</p>
                  </div>
                  <div>
                    <p className="text-4xl font-black tracking-tighter">
                      {order.totalAmount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-indigo-400">
                      <ShieldCheck size={16} />
                      <span className="text-[9px] font-black uppercase tracking-widest">Compra Protegida</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8 flex flex-col gap-10">
              
              <div className="rounded-[2.5rem] bg-white border border-slate-100 p-10 shadow-sm">
                <div className="mb-10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                      <ShoppingBag size={24} />
                    </div>
                    <h2 className="text-2xl font-black uppercase italic tracking-tighter text-slate-950">
                      Itens <span className="text-indigo-600">Enviados</span>
                    </h2>
                  </div>
                </div>

                <div className="space-y-8">
                  {order.items.map((item) => {
                    const product = products[item.productId];
                    return (
                      <div key={item.id} className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-6 rounded-3xl border border-transparent p-4 transition-all hover:border-slate-100 hover:bg-slate-50/50">
                        <div className="flex items-center gap-6">
                          <ProductImage
                            imagePath={product?.images?.[0]?.url}
                            alt={product?.name || "Produto"}
                            size={100}
                            className="shrink-0 rounded-2xl border-2 border-slate-50 bg-white object-cover shadow-sm"
                          />
                          <div>
                            <span className="mb-1 block text-[9px] font-black uppercase tracking-widest text-indigo-600">SKU: {item.productId.split("-")[0]}</span>
                            <h3 className="text-lg font-black uppercase italic tracking-tighter text-slate-950">
                              {product?.name || "Carregando detalhes..."}
                            </h3>
                            <div className="mt-2 flex items-center gap-4 text-xs font-bold text-slate-400">
                              <span className="flex items-center gap-1">
                                <Package size={14} /> Qtd: {item.quantity}
                              </span>
                              <span className="h-1 w-1 rounded-full bg-slate-200" />
                              <span>{item.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} /un</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-300">Subtotal Item</p>
                          <p className="text-2xl font-black text-slate-950">
                            {(item.quantity * item.price).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="rounded-[2.5rem] bg-white border border-slate-100 p-8 shadow-sm">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                    <Truck size={28} />
                  </div>
                  <h3 className="mb-2 text-sm font-black uppercase tracking-widest text-slate-950">Envio e Entrega</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Método de Envio</p>
                      <p className="text-sm font-bold text-slate-900">{getFreightLabel(order.freightType)}</p>
                    </div>
                    {order.addressId && (
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Código do Endereço</p>
                        <div className="mt-1 flex items-center gap-2 text-xs font-medium text-slate-500">
                          <MapPin size={14} />
                          <span className="truncate">{order.addressId}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-[2.5rem] bg-white border border-slate-100 p-8 shadow-sm">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                    <CreditCard size={28} />
                  </div>
                  <h3 className="mb-2 text-sm font-black uppercase tracking-widest text-slate-950">Pagamento</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Meio Escolhido</p>
                      <p className="text-sm font-bold text-slate-900">{getPaymentLabel(order.paymentMethod)}</p>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3">
                      <ShieldCheck className="text-emerald-500" size={16} />
                      <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-600">Transação Criptografada</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <aside className="lg:col-span-4">
              <div className="sticky top-40 space-y-6">
                <div className="rounded-[2.5rem] bg-white border border-slate-100 p-8 shadow-sm">
                  <h2 className="mb-8 text-xl font-black uppercase italic tracking-tighter text-slate-950">Resumo Financeiro</h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Valor Bruto</span>
                      <span className="text-sm font-bold text-slate-950">
                        {subtotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Frete ({getFreightLabel(order.freightType)})</span>
                      <span className="text-sm font-bold text-emerald-500">
                        {order.freightAmount === 0 ? "GRÁTIS" : order.freightAmount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </span>
                    </div>
                    
                    <div className="my-6 border-t border-dashed border-slate-200" />
                    
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Valor Total</span>
                      <span className="text-5xl font-black tracking-tighter text-indigo-600">
                        {order.totalAmount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </span>
                    </div>
                  </div>

                  <button className="mt-10 flex w-full items-center justify-center gap-3 rounded-2xl bg-indigo-600 p-5 text-[11px] font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-slate-950 hover:shadow-xl active:scale-95">
                    Precisa de Ajuda?
                    <ArrowRight size={16} />
                  </button>
                </div>

                <div className="rounded-[2rem] bg-slate-50 p-6 text-center">
                  <p className="text-[10px] font-bold uppercase leading-relaxed text-slate-400">
                    Obrigado por comprar conosco. <br />
                    Acompanhe seu e-mail para novas atualizações.
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

export default OrderDetailPage;