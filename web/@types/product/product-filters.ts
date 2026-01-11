export interface ProductFilters {
  storeId: string;
  categoryId?: string;
  name?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: "ACTIVE" | "DELETED" | "ALL";
  lowStockThreshold?: number;
}
