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
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface ProductImage {
  id: string;
  url: string;
  position: number;
}
