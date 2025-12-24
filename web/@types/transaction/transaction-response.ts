import { PaymentMethod } from "@/enums/payment-method";

export interface TransactionResponse {
  id: string;
  orderId: string;
  paymentMethod: PaymentMethod;
  amount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}
