import { OrderItemRequest } from "./order-item/order-item-request";

export interface OrderRequest {
  storeId: string;
  items: OrderItemRequest[];
}
