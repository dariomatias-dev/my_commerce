import { FreightType } from "@/enums/freight-type";
import { PaymentMethod } from "@/enums/payment-method";
import { Status } from "@/enums/status";
import { OrderAddressResponse } from "./order-address-response";
import { OrderItemResponse } from "./order-item/order-item-response";

export interface OrderDetailsResponse {
  id: string;
  storeId: string;
  userId: string;
  paymentMethod: PaymentMethod;
  freightType: FreightType;
  freightAmount: number;
  totalAmount: number;
  status: Status;
  orderAddress: OrderAddressResponse;
  items: OrderItemResponse[];
  createdAt: string;
  updatedAt: string;
}
