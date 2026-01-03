import { OrderItemResponse } from "./order-item/order-item-response";

export interface OrderWithItemsResponse {
  id: string;
  storeId: string;
  userId: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItemResponse[];
}
