export interface SubscriptionResponse {
  id: string;
  userId: string;
  planId: string;
  startDate: string;
  endDate: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
