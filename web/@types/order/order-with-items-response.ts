import { OrderItemResponse } from "./order-item/order-item-response";

export interface OrderWithItemsResponse {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItemResponse[];
}
