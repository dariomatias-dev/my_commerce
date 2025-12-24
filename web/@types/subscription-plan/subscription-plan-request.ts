export interface SubscriptionPlanRequest {
  name: string;
  maxStores: number;
  maxProducts: number;
  features?: string;
  price: number;
}
