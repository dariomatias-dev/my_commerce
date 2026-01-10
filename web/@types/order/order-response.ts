import { Status } from "@/enums/status";

export interface OrderResponse {
  id: string;
  storeId: string;
  userId: string;
  totalAmount: number;
  status: Status;
  itemsCount: number;
  createdAt: string;
  updatedAt: string;
}
