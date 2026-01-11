"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { ApiError } from "@/@types/api";
import { ProductFilters } from "@/@types/product/product-filters";
import { ProductResponse } from "@/@types/product/product-response";
import { LoadingIndicator } from "@/components/loading-indicator";
import { Pagination } from "@/components/pagination";
import { useProduct } from "@/services/hooks/use-product";
import { ProductsDashboardError } from "./products-dashboard-error";
import { ProductsDashboardFilter } from "./products-dashboard-filter";
import { ProductsDashboardTable } from "./products-dashboard-table";

interface ProductsDashboardProps {
  storeId: string;
}

export const ProductsDashboard = ({ storeId }: ProductsDashboardProps) => {
  const { getAllProducts, deleteProduct } = useProduct();
  const listTopRef = useRef<HTMLDivElement>(null);

  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [appliedFilters, setAppliedFilters] = useState<
    Omit<ProductFilters, "storeId">
  >({
    status: "ACTIVE",
    minPrice: undefined,
    maxPrice: undefined,
    lowStockThreshold: undefined,
    categoryId: undefined,
    name: undefined,
  });

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await getAllProducts(
        { storeId, ...appliedFilters },
        currentPage,
        10
      );

      setProducts(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError("Erro ao carregar produtos.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [storeId, currentPage, getAllProducts, appliedFilters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    listTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleApplyFilters = (newFilters: Omit<ProductFilters, "storeId">) => {
    setAppliedFilters(newFilters);
    setCurrentPage(0);
  };

  const onDelete = async (productId: string) => {
    await deleteProduct(productId);
    fetchProducts();
  };

  if (error) {
    return <ProductsDashboardError message={error} onRetry={fetchProducts} />;
  }

  return (
    <div
      ref={listTopRef}
      className="animate-in fade-in duration-500 scroll-mt-32"
    >
      <ProductsDashboardFilter
        onApply={handleApplyFilters}
        currentFilters={appliedFilters}
      />

      {isLoading ? (
        <LoadingIndicator
          message="Sincronizando inventário..."
          className="min-h-64"
        />
      ) : (
        <>
          <ProductsDashboardTable products={products} onDelete={onDelete} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};
