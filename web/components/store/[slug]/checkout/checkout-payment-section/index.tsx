import { Banknote, CreditCard, FileText, Wallet } from "lucide-react";

import { PaymentMethod } from "@/enums/payment-method";
import { PaymentOption } from "./checkout-payment-option";

interface CheckoutPaymentSectionProps {
  paymentMethod: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
}

export const CheckoutPaymentSection = ({
  paymentMethod,
  onSelect,
}: CheckoutPaymentSectionProps) => {
  return (
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
          onSelect={onSelect}
          icon={<Wallet size={24} />}
          label="Pix"
          description="Aprovação em segundos"
        />

        <PaymentOption
          method={PaymentMethod.CREDIT_CARD}
          currentMethod={paymentMethod}
          onSelect={onSelect}
          icon={<CreditCard size={24} />}
          label="Cartão de Crédito"
          description="Até 12x s/ juros"
        />

        <PaymentOption
          method={PaymentMethod.BOLETO}
          currentMethod={paymentMethod}
          onSelect={onSelect}
          icon={<FileText size={24} />}
          label="Boleto"
          description="Até 3 dias úteis"
        />

        <PaymentOption
          method={PaymentMethod.CASH}
          currentMethod={paymentMethod}
          onSelect={onSelect}
          icon={<Banknote size={24} />}
          label="Dinheiro"
          description="Pague na entrega"
        />
      </div>
    </section>
  );
};
