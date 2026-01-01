export interface ProductFilters {
  storeId: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  active?: boolean;
  lowStockThreshold?: number;
}
