export interface ProductResponse {
  id: string;
  storeId: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
