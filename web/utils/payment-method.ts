import { PaymentMethod } from "@/enums/payment-method";

const paymentMethodLabels: Record<PaymentMethod, string> = {
  [PaymentMethod.CREDIT_CARD]: "Cartão de Crédito",
  [PaymentMethod.DEBIT_CARD]: "Cartão de Débito",
  [PaymentMethod.PIX]: "Pix",
  [PaymentMethod.BOLETO]: "Boleto",
  [PaymentMethod.CASH]: "Dinheiro",
};

export const getPaymentMethodLabel = (method: PaymentMethod): string => {
  return paymentMethodLabels[method];
};
