export interface ProductFilters {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  active?: boolean;
  lowStock?: boolean;
  stockThreshold?: number;
}
