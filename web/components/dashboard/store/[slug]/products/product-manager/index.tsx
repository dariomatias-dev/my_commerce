"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { ApiError } from "@/@types/api";
import { ProductResponse } from "@/@types/product/product-response";
import { useProduct } from "@/services/hooks/use-product";
import { ProductManagerError } from "./product-manager-error";
import { ProductManagerFilter } from "./product-manager-filter";
import { ProductManagerLoading } from "./product-manager-loading";
import { ProductManagerPagination } from "./product-manager-pagination";
import { ProductManagerTable } from "./product-manager-table";

interface ProductManagerProps {
  storeId: string;
}

export const ProductManager = ({ storeId }: ProductManagerProps) => {
  const { getProductsByStoreId, deleteProduct } = useProduct();
  const listTopRef = useRef<HTMLDivElement>(null);

  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await getProductsByStoreId(storeId, currentPage, pageSize);

      setProducts(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError("Erro ao carregar produtos.");
    } finally {
      setIsLoading(false);
    }
  }, [storeId, currentPage, getProductsByStoreId]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    listTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const onDelete = async (productId: string) => {
    await deleteProduct(productId);

    fetchProducts();
  };

  if (isLoading) return <ProductManagerLoading />;

  if (error) {
    return <ProductManagerError message={error} onRetry={fetchProducts} />;
  }

  return (
    <div
      ref={listTopRef}
      className="animate-in fade-in duration-500 scroll-mt-32"
    >
      <ProductManagerFilter />

      <ProductManagerTable products={products} onDelete={onDelete} />

      <ProductManagerPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};
