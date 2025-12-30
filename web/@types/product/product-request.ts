export interface ProductRequest {
  storeId: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  active: boolean;
  images?: {
    file: File;
    position: number;
  }[];
  removedImageNames?: string[];
}
