export interface ProductRequest {
  storeId: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  active: boolean;
}
