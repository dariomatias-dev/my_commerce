"use client";

import {
  AlertCircle,
  ArrowLeft,
  Banknote,
  CheckCircle2,
  CreditCard,
  FileText,
  Loader2,
  MapPin,
  Plus,
  Truck,
  Wallet,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/@types/api";
import { CartStorage } from "@/@types/cart-storage";
import { StoreResponse } from "@/@types/store/store-response";
import { ActionButton } from "@/components/buttons/action-button";
import { CheckoutItem } from "@/components/store/[slug]/checkout/checkout-item";
import { Item } from "@/components/store/[slug]/store-header/store-cart/store-cart-item";
import { useProduct } from "@/services/hooks/use-product";
import { useStore } from "@/services/hooks/use-store";
import { CheckoutAddressCard, MOCK_ADDRESSES } from "../../../../components/store/[slug]/checkout/checkout-address-card";
import { PaymentMethod, PaymentOption } from "../../../../components/store/[slug]/checkout/checkout-payment-option";

export default function CheckoutPage() {
  const router = useRouter();
  const params = useParams();
  const { getProductsByIds } = useProduct();
  const { getStoreBySlug } = useStore();

  const [store, setStore] = useState<StoreResponse | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [issubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.PIX
  );
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    MOCK_ADDRESSES[0].id
  );

  const slug = params.slug as string;

  const updateCartStorage = useCallback(
    (storeId: string, updatedItems: Item[]) => {
      const storageKey = `cart-${storeId}`;
      const storageData = updatedItems.map((item) => ({
        id: item.id,
        quantity: item.quantity,
      }));
      localStorage.setItem(storageKey, JSON.stringify(storageData));
      window.dispatchEvent(new Event("cart-updated"));
    },
    []
  );

  const fetchCheckoutData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const storeResponse = await getStoreBySlug(slug);
      setStore(storeResponse);

      const storageKey = `cart-${storeResponse.id}`;
      const stored = localStorage.getItem(storageKey);
      const storageCart = stored ? JSON.parse(stored) : [];

      if (storageCart.length === 0) {
        router.push(`/store/${slug}`);

        return;
      }

      const productIds = storageCart.map((i: CartStorage) => i.id);
      const response = await getProductsByIds(storeResponse.id, productIds);
      const products = response.content || [];

      const mergedItems: Item[] = products.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        image: `${process.env.NEXT_PUBLIC_API_URL}/files/stores/${product.images?.[0]?.url}`,
        quantity:
          storageCart.find((i: CartStorage) => i.id === product.id)?.quantity ||
          1,
      }));

      setItems(mergedItems);
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Erro ao carregar dados do checkout.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [slug, getStoreBySlug, getProductsByIds, router]);

  useEffect(() => {
    fetchCheckoutData();
  }, [fetchCheckoutData]);

  const handleIncrease = (id: string) => {
    if (!store) return;

    const updated = items.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );

    setItems(updated);
    updateCartStorage(store.id, updated);
  };

  const handleDecrease = (id: string) => {
    if (!store) return;

    const updated = items.map((item) =>
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );

    setItems(updated);
    updateCartStorage(store.id, updated);
  };

  const handleRemove = (id: string) => {
    if (!store) return;

    const updated = items.filter((item) => item.id !== id);

    setItems(updated);
    updateCartStorage(store.id, updated);

    if (updated.length === 0) router.push(`/store/${slug}`);
  };

  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleFinishOrder = async () => {
    if (!store) return;

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      localStorage.removeItem(`cart-${store.id}`);

      window.dispatchEvent(new Event("cart-updated"));

      router.push(`/store/${slug}/success`);
    } catch {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          Sincronizando pedido...
        </p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white p-4 text-center">
        <AlertCircle size={48} className="text-red-500 mb-4" />

        <h2 className="text-2xl font-black uppercase italic tracking-tighter text-slate-950 mb-2">
          Ops! Falha no Checkout
        </h2>

        <p className="text-sm font-bold text-slate-500 mb-8 max-w-xs">
          {errorMessage}
        </p>

        <ActionButton
          onClick={() => router.back()}
          variant="dark"
          size="sm"
          className="max-w-xs"
        >
          Voltar
        </ActionButton>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 pt-10">
      <div className="mx-auto max-w-6xl px-4">
        <button
          onClick={() => router.back()}
          className="group mb-8 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 transition-colors hover:text-indigo-600"
        >
          <ArrowLeft
            size={16}
            className="transition-transform group-hover:-translate-x-1"
          />
          Voltar para a loja
        </button>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7 flex flex-col gap-8">
            <section className="rounded-[2.5rem] border-2 border-slate-100 bg-white p-8 md:p-10 transition-all hover:border-indigo-100">
              <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                    <MapPin size={24} />
                  </div>

                  <div>
                    <h2 className="text-xl font-black uppercase italic tracking-tighter text-slate-950">
                      Onde <span className="text-indigo-600">Entregar?</span>
                    </h2>

                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Escolha um endereço salvo
                    </p>
                  </div>
                </div>

                <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-indigo-600 hover:text-white transition-all">
                  <Plus size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {MOCK_ADDRESSES.map((address) => (
                  <CheckoutAddressCard
                    key={address.id}
                    address={address}
                    isSelected={selectedAddressId === address.id}
                    onSelect={setSelectedAddressId}
                  />
                ))}
              </div>
            </section>

            <section className="rounded-[2.5rem] border-2 border-slate-100 bg-white p-8 md:p-10 transition-all hover:border-indigo-100">
              <div className="mb-8 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <CreditCard size={24} />
                </div>

                <div>
                  <h2 className="text-xl font-black uppercase italic tracking-tighter text-slate-950">
                    Forma de <span className="text-indigo-600">Pagamento</span>
                  </h2>

                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Transação segura
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <PaymentOption
                  method={PaymentMethod.PIX}
                  currentMethod={paymentMethod}
                  onSelect={setPaymentMethod}
                  icon={<Wallet size={24} />}
                  label="Pix"
                  description="Aprovação em segundos"
                />

                <PaymentOption
                  method={PaymentMethod.CREDIT_CARD}
                  currentMethod={paymentMethod}
                  onSelect={setPaymentMethod}
                  icon={<CreditCard size={24} />}
                  label="Cartão de Crédito"
                  description="Até 12x s/ juros"
                />

                <PaymentOption
                  method={PaymentMethod.BOLETO}
                  currentMethod={paymentMethod}
                  onSelect={setPaymentMethod}
                  icon={<FileText size={24} />}
                  label="Boleto"
                  description="Até 3 dias úteis"
                />

                <PaymentOption
                  method={PaymentMethod.CASH}
                  currentMethod={paymentMethod}
                  onSelect={setPaymentMethod}
                  icon={<Banknote size={24} />}
                  label="Dinheiro"
                  description="Pague na entrega"
                />
              </div>
            </section>
          </div>

          <div className="lg:col-span-5">
            <div className="sticky top-10 flex flex-col gap-6">
              <div className="rounded-[2.5rem] border-2 border-slate-100 bg-white p-8 shadow-2xl shadow-slate-200/50">
                <div className="mb-8 flex items-center justify-between">
                  <h2 className="text-xl font-black uppercase italic tracking-tighter text-slate-950">
                    Resumo
                  </h2>

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 text-[10px] font-black text-white">
                    {items.reduce((a, b) => a + b.quantity, 0)}
                  </div>
                </div>

                <div className="mb-8 flex flex-col gap-8 max-h-[35vh] overflow-y-auto pr-2 custom-scrollbar">
                  {items.map((item) => (
                    <CheckoutItem
                      key={item.id}
                      item={item}
                      onIncrease={handleIncrease}
                      onDecrease={handleDecrease}
                      onRemove={handleRemove}
                    />
                  ))}
                </div>

                <div className="flex flex-col gap-3 border-t border-slate-50 pt-6">
                  <div className="flex justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Subtotal
                    </span>

                    <span className="text-xs font-black text-slate-950">
                      {total.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                      <Truck size={12} /> Frete
                    </span>

                    <span className="text-xs font-black text-emerald-500 uppercase italic">
                      Grátis
                    </span>
                  </div>

                  <div className="mt-4 flex items-end justify-between border-t border-slate-100 pt-6">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">
                      Total Final
                    </span>

                    <span className="text-3xl font-black tracking-tighter text-slate-950">
                      {total.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </span>
                  </div>
                </div>

                <div className="mt-8">
                  <ActionButton
                    onClick={handleFinishOrder}
                    disabled={issubmitting || items.length === 0}
                    showArrow
                  >
                    {issubmitting ? (
                      <Loader2 className="animate-spin" size={24} />
                    ) : (
                      "Finalizar Pedido"
                    )}
                  </ActionButton>
                </div>

                <div className="mt-6 flex items-center justify-center gap-2 opacity-30">
                  <CheckCircle2 size={14} className="text-emerald-500" />

                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                    Compra 100% Criptografada
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
