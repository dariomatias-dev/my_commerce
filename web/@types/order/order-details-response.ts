import { FreightType } from "@/enums/freight-type";
import { PaymentMethod } from "@/enums/payment-method";
import { Status } from "@/enums/status";
import { OrderItemResponse } from "./order-item/order-item-response";

export interface OrderDetailsResponse {
  id: string;
  storeId: string;
  userId: string;
  addressId: string | null;
  paymentMethod: PaymentMethod;
  freightType: FreightType;
  freightAmount: number;
  totalAmount: number;
  status: Status;
  itemsCount: number;
  createdAt: string;
  updatedAt: string;
  items: OrderItemResponse[];
}
