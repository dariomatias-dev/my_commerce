"use client";

import { ArrowLeft } from "lucide-react";

import { ErrorFeedback } from "@/components/error-feedback";
import { LoadingIndicator } from "@/components/loading-indicator";
import { CheckoutAddressSection } from "@/components/store/[slug]/checkout/checkout-address-section";
import { CheckoutPaymentSection } from "@/components/store/[slug]/checkout/checkout-payment-section";
import { CheckoutSummarySection } from "@/components/store/[slug]/checkout/checkout-summary-section";
import { CheckoutFreightSection } from "@/components/store/[slug]/checkout/checkout-summary-section/checkout-freight-section";
import { useCheckout } from "@/hooks/use-checkout";
import { useParams } from "next/navigation";

const CheckoutPage = () => {
  const { slug } = useParams() as {
    slug: string;
  };

  const {
    items,
    addresses,
    isLoading,
    errorMessage,
    isSubmitting,
    paymentMethod,
    setPaymentMethod,
    selectedAddressId,
    setSelectedAddressId,
    freightOptions,
    selectedFreight,
    setSelectedFreight,
    isFreightLoading,
    subtotal,
    freightValue,
    total,
    fetchCheckoutData,
    handleQuantity,
    handleRemove,
    handleCreateAddress,
    handleFinishOrder,
    router,
  } = useCheckout();

  if (isLoading) {
    return <LoadingIndicator message="Carregando pedido..." />;
  }

  if (errorMessage) {
    return (
      <ErrorFeedback
        title="Erro de"
        highlightedTitle="Processamento"
        errorMessage={errorMessage}
        onRetry={fetchCheckoutData}
        backPath={`/store/${slug}`}
        backLabel="VOLTAR PARA A LOJA"
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7FA] pb-20 pt-32">
      <div className="mx-auto max-w-400 px-6">
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

        <div className="mb-12 border-b border-slate-200 pb-8">
          <div className="mb-2 flex items-center gap-2">
            <div className="rounded bg-indigo-600 px-2 py-0.5 text-[9px] font-black tracking-widest text-white uppercase">
              SECURE_CHECKOUT
            </div>

            <span className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase italic">
              Finalize sua compra com segurança criptografada
            </span>
          </div>

          <h1 className="text-5xl font-black tracking-tighter text-slate-950 uppercase italic">
            CHECKOUT DE <span className="text-indigo-600">PAGAMENTO.</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8 flex flex-col gap-8">
            <CheckoutAddressSection
              addresses={addresses}
              selectedAddressId={selectedAddressId}
              onSelect={setSelectedAddressId}
              onAddAddress={handleCreateAddress}
            />

            <CheckoutFreightSection
              options={freightOptions}
              selectedOption={selectedFreight}
              onSelect={setSelectedFreight}
              isLoading={isFreightLoading}
            />

            <CheckoutPaymentSection
              paymentMethod={paymentMethod}
              onSelect={setPaymentMethod}
            />
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-32">
              <CheckoutSummarySection
                items={items}
                subtotal={subtotal}
                freightValue={freightValue}
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
    </div>
  );
};

export default CheckoutPage;
