export interface ProductFilters {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  active?: boolean;
  lowStockThreshold?: number;
}
