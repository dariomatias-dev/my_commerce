import { CreditCard, ShieldCheck } from "lucide-react";

import { PaymentMethod } from "@/enums/payment-method";

interface OrderDetailsPaymentInfoProps {
  method: PaymentMethod;
}

export const OrderDetailsPaymentInfo = ({ method }: OrderDetailsPaymentInfoProps) => {
  const labels: Record<string, string> = {
    CREDIT_CARD: "Cartão de Crédito",
    PIX: "Pagamento via Pix",
    BOLETO: "Boleto Bancário",
  };

  return (
    <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm">
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
        <CreditCard size={28} />
      </div>

      <h3 className="mb-6 text-sm font-black tracking-widest text-slate-950 uppercase">
        Informações de Pagamento
      </h3>

      <div className="space-y-6">
        <div>
          <p className="text-[9px] font-black tracking-widest text-slate-400 uppercase">
            Método Utilizado
          </p>

          <p className="text-sm font-bold text-slate-900">{labels[method] || method}</p>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
          <ShieldCheck className="text-emerald-600" size={20} />

          <span className="text-[10px] font-black tracking-widest text-emerald-700 uppercase">
            Transação Segura
          </span>
        </div>
      </div>
    </div>
  );
};
