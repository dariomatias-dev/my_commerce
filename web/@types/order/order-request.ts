import { OrderItemRequest } from "./order-item/order-item-request";

export interface OrderRequest {
  storeId: string;
  addressId: string;
  paymentMethod: string;
  items: OrderItemRequest[];
}
