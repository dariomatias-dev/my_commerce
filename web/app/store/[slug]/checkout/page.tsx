"use client";

import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";

import { ActionButton } from "@/components/buttons/action-button";
import { CheckoutAddressSection } from "@/components/store/[slug]/checkout/checkout-address-section";
import { CheckoutPaymentSection } from "@/components/store/[slug]/checkout/checkout-payment-section";
import { CheckoutSummarySection } from "@/components/store/[slug]/checkout/checkout-summary-section";
import { useCheckout } from "@/hooks/use-checkout";

const CheckoutPage = () => {
  const {
    items,
    isLoading,
    errorMessage,
    isSubmitting,
    paymentMethod,
    setPaymentMethod,
    selectedAddressId,
    setSelectedAddressId,
    total,
    handleQuantity,
    handleRemove,
    handleFinishOrder,
    router,
  } = useCheckout();

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
            <CheckoutAddressSection
              selectedAddressId={selectedAddressId}
              onSelect={setSelectedAddressId}
            />

            <CheckoutPaymentSection
              paymentMethod={paymentMethod}
              onSelect={setPaymentMethod}
            />
          </div>

          <div className="lg:col-span-5">
            <CheckoutSummarySection
              items={items}
              total={total}
              isSubmitting={isSubmitting}
              onIncrease={(id) => handleQuantity(id, 1)}
              onDecrease={(id) => handleQuantity(id, -1)}
              onRemove={handleRemove}
              onFinish={handleFinishOrder}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
